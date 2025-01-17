import React from 'react';
import '../../styles/restaurentDetails.css';

const RestaurantDetails = ({ restaurant }) => (
    <section className="restaurant-details">
        <h2>Restaurant Details</h2>
        {/* {restaurant?.logo && (
            <img
                src={`http://localhost:5000/${restaurant.logo}`}
                alt="Restaurant Logo"
            />
        )} */}
        <p><strong>Restaurant Name:</strong> {restaurant?.restaurantName}</p>
        <p><strong>Email:</strong> {restaurant?.email}</p>
        <p><strong>Phone:</strong> {restaurant?.phone}</p>
        <p><strong>Address:</strong> {restaurant?.address}</p>
        <p><strong>Delivery Radius:</strong> {restaurant?.deliveryRadius} km</p>
    </section>
);

export default RestaurantDetails;
