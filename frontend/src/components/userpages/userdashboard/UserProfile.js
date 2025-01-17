import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../../services/api"; // Your API calls
import "../../../styles/UserProfile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile(token);

        // Ensure address is always defined
        const data = {
          ...response.data,
          address: response.data.address || {
            street: "",
            city: "",
            state: "",
            pincode: "",
          },
        };

        setUserData(data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle changes for general fields
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes for address fields
  const handleAddressChange = (e) => {
    setUserData({
      ...userData,
      address: {
        ...userData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
  
    try {
      const response = await updateUserProfile(userData, token);
      console.log(response); // Await the function
      if (response) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error in handleSave:", err.message);
    }
  };
  

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>Profile Information</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="profile-info">
        {!isEditing ? (
          <>
            <p>
              <strong>Name:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {userData.address?.street}, {userData.address?.city}, {userData.address?.state},{" "}
              {userData.address?.pincode}
            </p>
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <label>
              Name:
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                name="street"
                value={userData.address?.street}
                onChange={handleAddressChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={userData.address?.city}
                onChange={handleAddressChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={userData.address?.state}
                onChange={handleAddressChange}
              />
            </label>
            <label>
              Pincode:
              <input
                type="text"
                name="pincode"
                value={userData.address?.pincode}
                onChange={handleAddressChange}
              />
            </label>
            <div className="profile-buttons">
              <button type="submit">Save Changes</button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
