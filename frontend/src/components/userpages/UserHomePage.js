import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/user.css';
import Footer from "../footer";

const UserHomePage = ({ restaurants }) => {
    const [search, setSearch] = useState('');
    const [imageUrls, setImageUrls] = useState({ logos: {}, menuItems: {} });
    const navigate = useNavigate();

    useEffect(() => {
        // Process images for restaurants and menu items
        const processImages = () => {
            const logos = {};
            const menuItems = {};

            for (const restaurant of restaurants) {
                // Handle restaurant logo
                if (restaurant.logo && restaurant.logo.data && restaurant.logo.contentType) {
                    try {
                        const base64 = btoa(
                            restaurant.logo.data.data.reduce(
                                (data, byte) => data + String.fromCharCode(byte),
                                ''
                            )
                        );
                        logos[restaurant._id] = `data:${restaurant.logo.contentType};base64,${base64}`;
                    } catch (error) {
                        console.error(`Failed to process logo for restaurant ${restaurant._id}:`, error);
                    }
                }

                // Handle menu item images
                if (restaurant.menuItems && restaurant.menuItems.length > 0) {
                    for (const item of restaurant.menuItems) {
                        if (item.image && item.image.data && item.image.contentType) {
                            try {
                                const base64 = btoa(
                                    item.image.data.data.reduce(
                                        (data, byte) => data + String.fromCharCode(byte),
                                        ''
                                    )
                                );
                                menuItems[item._id] = `data:${item.image.contentType};base64,${base64}`;
                            } catch (error) {
                                console.error(`Failed to process image for menu item ${item._id}:`, error);
                            }
                        }
                    }
                }
            }

            setImageUrls({ logos, menuItems });
        };

        processImages();
    }, [restaurants]);

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
            { threshold: 0.5 }
        );

        restaurantCards.forEach((card) => observer.observe(card));

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

    return (
        <div>
            <div className="user-homepage">
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
                                                {imageUrls.menuItems[item._id] ? (
                                                    <img
                                                        src={imageUrls.menuItems[item._id]}
                                                        alt={item.name}
                                                        className="item-image"
                                                    />
                                                ) : (
                                                    <div className="image-placeholder">No Image</div>
                                                )}
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
                                {imageUrls.logos[restaurant._id] ? (
                                    <img
                                        src={imageUrls.logos[restaurant._id]}
                                        alt={`${restaurant.restaurantName} logo`}
                                        className="restaurant-logo"
                                    />
                                ) : (
                                    <div className="image-placeholder">No Logo</div>
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
                <Footer />
            </div>
        </div>
    );
};

export default UserHomePage;