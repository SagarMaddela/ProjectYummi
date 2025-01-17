import React, { useState, useEffect } from "react";
import {
  getRestaurants,
  deleteRestaurantById,
  updateRestaurantStatus,
} from "../../services/api"; // Import the API functions
import "../../styles/adminres.css";

const RestaurantsPages = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const deleteRestaurant = async (restaurantId) => {
    try {
      await deleteRestaurantById(restaurantId);
      setRestaurants(restaurants.filter((restaurant) => restaurant._id !== restaurantId));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const updateStatus = async (restaurantId, newStatus) => {
    try {
      const response = await updateRestaurantStatus(restaurantId, newStatus);
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, status: response.restaurant.status }
            : restaurant
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const baseURL = "http://localhost:5000";

  return (
    <div className="restaurants-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Restaurant Cards */}
      <div className="restaurant-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="restaurant-card"
            >
              {/* Restaurant Details */}
              {restaurant.logo && (
                <img
                  src={`${baseURL}/${restaurant.logo}`}
                  alt={`${restaurant.restaurantName} logo`}
                  className="restaurant-logo"
                />
              )}
              <h3 className="restaurant-name">{restaurant.restaurantName}</h3>
              <p className="restaurant-detail"><strong>Owner:</strong> {restaurant.owner}</p>
              <p className="restaurant-detail"><strong>Email:</strong> {restaurant.email}</p>
              <p className="restaurant-detail"><strong>Phone:</strong> {restaurant.phone}</p>
              <p className="restaurant-detail"><strong>Address:</strong> {restaurant.address}</p>
              <p className="restaurant-detail"><strong>Delivery Radius:</strong> {restaurant.deliveryRadius} km</p>
              <p className="restaurant-detail"><strong>Status:</strong> {restaurant.status || "Pending"}</p>

              {/* Actions */}
              <div className="action-buttons">
                <button
                  onClick={() => updateStatus(restaurant._id, "Accepted")}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(restaurant._id, "Rejected")}
                  className="reject-button"
                >
                  Reject
                </button>
                <button
                  onClick={() => deleteRestaurant(restaurant._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-restaurants">No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPages;
