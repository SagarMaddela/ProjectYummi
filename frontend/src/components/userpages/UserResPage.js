import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { RenderUserRest } from '../../services/api';
import "../../styles/restaurant.css";

const RestaurantPage = () => {
    const location = useLocation();
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await RenderUserRest();
                setRestaurants(response.data);
                 // Set fetched data
                 console.log(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };

        fetchRestaurants();
    }, []); // Fetch data once on component mount

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('search') || '';
        setSearchQuery(query);

        if (query) {
            // Filter based on restaurant name or menu items
            const filtered = restaurants.filter((restaurant) => {
                // Check if the restaurant name matches
                const isNameMatch = restaurant.restaurantName
                    ?.toLowerCase()
                    .includes(query.toLowerCase());

                // Check if any menu item matches
                const isItemMatch = restaurant.menuItems?.some((item) =>
                    item?.name?.toLowerCase().includes(query.toLowerCase())
                );

                return isNameMatch || isItemMatch;
            });

            setFilteredRestaurants(filtered);
        } else {
            setFilteredRestaurants(restaurants);
        }
    }, [location.search, restaurants]); // Run when search or restaurants change

    const getAverageRating = (reviews) => {
        if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            return (totalRating / reviews.length).toFixed(1); // Round to 1 decimal place
        }
        return 0; // Default if no reviews
    };

    const baseURL = 'http://localhost:5000'; // Replace with your backend URL

    return (
        <div className="restaurant-page">
            <header className="restaurant-header">
                <h1>Restaurants</h1>
                {searchQuery && <p>Search Results for "{searchQuery}"</p>}
            </header>

            <section className="restaurant-grid">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                        <div key={restaurant._id} className="restaurant-card">
                            {restaurant.logo && (
                                <img
                                    src={`${baseURL}/${restaurant.logo}`}
                                    alt={`${restaurant.restaurantName} logo`}
                                    className="restaurant-logo"
                                />
                            )}
                            <h2>{restaurant.restaurantName}</h2>
                            <p>{restaurant.address}</p>
                            <p>Rating: {getAverageRating(restaurant.reviews)}</p>
                            <Link to={`/restaurants/${restaurant._id}/menu`} className="view-menu-link">
                                View Menu
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No restaurants found</p>
                )}
            </section>
        </div>
    );
};

export default RestaurantPage;
