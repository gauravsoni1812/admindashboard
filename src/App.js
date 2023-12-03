import React, { useEffect, useState } from "react";

const App = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [editableRow, setEditableRow] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        const titu = await response.json();
        setUserData(titu);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = userData.filter(
    (user) =>
      user.id.toString().includes(searchQuery) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleEdit = (userId) => {
    setEditableRow(userId);
  };

  const handleSave = (userId) => {
    const editedUser = userData.find((user) => user.id === userId);

    if (editedUser) {
      const updatedUserData = userData.map((user) =>
        user.id === userId
          ? { ...user, name: editedUser.name, email: editedUser.email }
          : user
      );

      setUserData(updatedUserData);
      setEditableRow(null);
    } else {
      console.error(`User with id ${userId} not found.`);
    }
  };

  const deleteUser = (userId) => {
    const index = userData.findIndex((user) => user.id === userId);

    if (index !== -1) {
      const updatedUserData = [...userData];
      updatedUserData.splice(index, 1);
      setUserData(updatedUserData);
    } else {
      console.error(`User with id ${userId} not found.`);
    }
  };

  return (
    <div className="App">
      <div className="overflow-x-auto">
        <div className="flex justify-center items-center mb-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="my-2 mx-2 p-2 border border-gray-300 rounded rounded-xl"
          />
          <button
            className="search-icon px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="min-w-screen min-h-screen bg-gray-100 flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
          <div className="w-full lg:w-5/6">
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-center">Role</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <input
                              type="checkbox"
                              checked={selectAll || (editableRow === null && user.selected)}
                              onChange={() => {
                                // Handle individual row selection
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {editableRow === user.id ? (
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) => {
                              const updatedName = e.target.value;
                              setUserData((prevUserData) =>
                                prevUserData.map((prevUser) =>
                                  prevUser.id === user.id ? { ...prevUser, name: updatedName } : prevUser
                                )
                              );
                            }}
                          />
                        ) : (
                          <div className="flex items-center">
                            <div className="mr-2"></div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2"></div>
                          {editableRow === user.id ? (
                            <input
                              type="text"
                              value={user.email}
                              onChange={(e) => {
                                const updatedEmail = e.target.value;
                                setUserData((prevUserData) =>
                                  prevUserData.map((prevUser) =>
                                    prevUser.id === user.id ? { ...prevUser, email: updatedEmail } : prevUser
                                  )
                                );
                              }}
                            />
                          ) : (
                            <span>{user.email}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span
                          className={
                            user.role === "member"
                              ? "bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs"
                              : "bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs"
                          }
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {editableRow === user.id ? (
                          <div
                            className="flex item-center justify-center w-4 mr-2 transform hover:text-purple-500 hover:scale-110 save"
                            onClick={() => handleSave(user.id)}
                          >
                            <svg
                            className="relative right-[-4pc]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="flex item-center justify-center">
                            <div
                              className="edit w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                              onClick={() => handleEdit(user.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </div>

                            <div
                              className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                              onClick={() => deleteUser(user.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button
          className="first-page mx-2 px-3 py-1 rounded bg-gray-300 text-gray-700"
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="previous-page mx-2 px-3 py-1 rounded bg-gray-300 text-gray-700"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-2 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="next-page mx-2 px-3 py-1 rounded bg-gray-300 text-gray-700"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="last-page mx-2 px-3 py-1 rounded bg-gray-300 text-gray-700"
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default App;
