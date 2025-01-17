import { useState, useEffect } from "react";
import { getUsers, deleteUserById } from "../../services/api";
import "../../styles/adminUser.css"; 

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await deleteUserById(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page-container">
      <div className="users-page-header">
        <h1 className="users-page-title">Manage Users</h1>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="users-page-search"
        />
      </div>

      <div className="users-page-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user._id} className="user-card">
              <h3 className="user-card-title">{user.username}</h3>
              <p className="user-card-email">Email: {user.email}</p>
              <p className="user-card-role">Role: {user.role}</p>
              {user.address && (
                <div className="user-card-address">
                  <h4 className="user-card-address-title">Address:</h4>
                  <p className="user-card-address-details">
                    {`${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.pincode}`}
                  </p>
                </div>
              )}
              <button
                onClick={() => deleteUser(user._id)}
                className="user-card-delete-button"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="users-page-no-users">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
