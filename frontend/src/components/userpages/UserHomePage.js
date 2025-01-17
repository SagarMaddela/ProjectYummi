import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/user.css';
import Footer from "../footer";

const UserHomePage = ({ restaurants }) => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const restaurantCards = document.querySelectorAll(".user-restaurant-card");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 10% of the card is visible
        );

        restaurantCards.forEach((card) => observer.observe(card));

        // Cleanup observer on component unmount
        return () => observer.disconnect();
    }, []);

    const handleSearchInput = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchClick = () => {
        navigate(`/restaurants?search=${encodeURIComponent(search)}`);
    };

    const getAverageRating = (reviews) => {
        if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            return (totalRating / reviews.length).toFixed(1);
        }
        return 0;
    };

    const baseURL = 'http://localhost:5000';

    return (
        <div>
        <div className="user-homepage">
            <footer/>
            <header className="user-header">
                <h1>Discover the best food around you</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for restaurants, dishes..."
                        value={search}
                        onChange={handleSearchInput}
                        className="search-bar"
                    />
                    <button onClick={handleSearchClick} className="search-button">
                        Search
                    </button>
                </div>
            </header>

            <section className="items">
                <h2>Featured Items</h2>
                <div className="item-container">
                    {restaurants && restaurants.length > 0 ? (
                        restaurants.map((restaurant) =>
                            restaurant.menuItems && restaurant.menuItems.length > 0 ? (
                                restaurant.menuItems.map((item) => (
                                    <Link
                                        to={`/restaurants/${restaurant._id}/menu`}
                                        key={item._id}
                                        className="item-link"
                                    >
                                        <div className="circular-item">
                                            <img
                                                src={`${baseURL}/uploads/${item.image}`}
                                                alt={item.name}
                                                className="item-image"
                                            />
                                        </div>
                                        <p className="item-name">{item.name}</p>
                                    </Link>
                                ))
                            ) : null
                        )
                    ) : (
                        <p>No featured items available</p>
                    )}
                </div>
            </section>

            <section className="user-restaurant-grid">
                {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                        <div key={restaurant._id} className="user-restaurant-card">
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

        <div>
            <Footer/>
        </div>
</div>
        
    );
};

export default UserHomePage;
