import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantMenuItems, addToItemCart, getCartItems, deleteCartItem } from '../../services/api';
import PropTypes from 'prop-types';
import '../../styles/restaurantMenu.css';
import UserNavBar from '../UserNavBar';
import Footer from '../footer';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [menu, setMenu] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [foodType, setFoodType] = useState('all');
    const [imageUrls, setImageUrls] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getRestaurantMenuItems(id);
                if (response.status === 200) {
                    setMenu(response.data);
                    setFilteredMenu(response.data);
                } else {
                    setError('Failed to load menu');
                }
            } catch (error) {
                setError('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };

        const fetchCartItems = async () => {
            try {
                const response = await getCartItems(token);
                if (response.data && Array.isArray(response.data.items)) {
                    const items = response.data.items.reduce((acc, item) => {
                        acc[item.itemId._id] = item;
                        return acc;
                    }, {});
                    setCartItems(items);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchMenu();
        fetchCartItems();
    }, [id, token]);

    useEffect(() => {
        // Fetch images for menu items
        const fetchImages = async () => {
            const urls = {};
            for (const item of menu) {
                console.log(item.image)
                if (item.image) {
                    try {
                        if (item.image && item.image.data && item.image.contentType){
                            const base64 = btoa(
                                item.image.data.data.reduce(
                                    (data, byte) => data + String.fromCharCode(byte),
                                    ''
                                )
                            );
                            urls[item._id] = `data:${item.image.contentType};base64,${base64}`;

                        }
                    } catch (error) {
                        console.error(`Failed to fetch image for menu item ${item._id}:`, error);
                    }
                }
            }
            setImageUrls(urls);
        };

        if (menu.length > 0) {
            fetchImages();
        }
    }, [menu]);

    useEffect(() => {
        let filtered = [...menu];
        if (selectedCategory) {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }
        if (foodType !== 'all') {
            filtered = filtered.filter(item => item.foodType === foodType);
        }
        
        setFilteredMenu(filtered);
    }, [selectedCategory, foodType, menu]);

    const addItemToCart = async (item, quantity) => {
        try {
            const itemData = {
                itemId: item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                restaurantId: id,
                quantity: item.quantity
            };
            const response = await addToItemCart(token, itemData);
            if (response.status === 201) {
                setCartItems(prev => ({
                    ...prev,
                    [item._id]: { ...item, quantity }
                }));
            } else {
                alert('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('An error occurred while adding the item to the cart.');
        }
    };

    const removeItemFromCart = async (itemId) => {
        try {
            const response = await deleteCartItem(itemId, token);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const incrementQuantity = (item) => {
        setCartItems(prev => {
            const newQuantity = (prev[item._id]?.quantity || 0) + 1;
            addItemToCart(item, newQuantity);
            return { ...prev, [item._id]: { ...prev[item._id], quantity: newQuantity } };
        });
    };

    const decrementQuantity = (item) => {
        setCartItems(prev => {
            const currentQuantity = prev[item._id]?.quantity || 0;
            const newQuantity = currentQuantity - 1;
            removeItemFromCart(item._id);
            if (newQuantity <= 0) {
                const { [item._id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [item._id]: { ...prev[item._id], quantity: newQuantity } };
        });
    };

    if (loading) {
        return <div className="menu-loader">Loading menu...</div>;
    }

    if (error) {
        return <div className="menu-error">{error}</div>;
    }

    return (
        <div className='restaurant-menu-layout'>
            <UserNavBar/>
            <div className="restaurant-menu-container">
                <h1 className="menu-header">Menu</h1>

                {/* Dropdown for categories */}
                <div className="food-type-toggle">
                    <section>
                        <label htmlFor="category">
                            <i className="fas fa-list"></i> Select Category:
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="biryani">Biryani</option>
                            <option value="pizza">Pizza</option>
                            <option value="burgers">Burgers</option>
                            <option value="chinese">Chinese</option>
                            <option value="south-indian">South Indian</option>
                            <option value="north-indian">North Indian</option>
                            <option value="italian">Italian</option>
                            <option value="mexican">Mexican</option>
                            <option value="thai">Thai</option>
                            <option value="japanese">Japanese</option>
                            <option value="seafood">Seafood</option>
                            <option value="bbq-grills">BBQ & Grills</option>
                            <option value="street-food">Street Food</option>
                            <option value="healthy-food">Healthy Food</option>
                            <option value="desserts-sweets">Desserts & Sweets</option>
                            <option value="beverages">Beverages</option>
                            <option value="salads">Salads</option>
                            <option value="wraps-rolls">Wraps & Rolls</option>
                            <option value="sandwiches">Sandwiches</option>
                            <option value="fast-food">Fast Food</option>
                            <option value="vegan-options">Vegan Options</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="non-vegetarian">Non-Vegetarian</option>
                            <option value="gluten-free">Gluten-Free</option>
                            <option value="keto-friendly">Keto-Friendly</option>
                            <option value="family-meals">Family Meals</option>
                            <option value="combo-meals">Combo Meals</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="brunch">Brunch</option>
                        </select>
                    </section>

                    <button
                        className={`toggle-btn ${foodType === 'Veg' ? 'active' : ''}`}
                        onClick={() => setFoodType('Veg')}
                    >
                        <i className="fas fa-leaf"></i> Veg
                    </button>
                    <button
                        className={`toggle-btn ${foodType === 'Non-Veg' ? 'active' : ''}`}
                        onClick={() => setFoodType('Non-Veg')}
                    >
                        <i className="fas fa-drumstick-bite"></i> Non-Veg
                    </button>
                    <button
                        className={`toggle-btn ${foodType === 'all' ? 'active' : ''}`}
                        onClick={() => setFoodType('all')}
                    >
                        <i className="fas fa-utensils"></i> All
                    </button>
                    <Link to={`/cart/restaurantId=${id}`} className="view-cart-link">
                        <i className="fas fa-shopping-cart"></i> View Cart
                    </Link>
                </div>

                {/* No items message */}
                {filteredMenu.length === 0 ? (
                    <div className="no-items-message">No items are available for the selected filter.</div>
                ) : (
                    <div className="menu-list">
                        {filteredMenu.map(item => (
                            <div key={item._id} className="menu-item-row">
                                <div className="menu-item-image-wrapper">
                                    {imageUrls[item._id] ? (
                                        <img
                                            src={imageUrls[item._id]}
                                            className="menu-item-image"
                                            alt={item.name}
                                        />
                                    ) : (
                                        <div className="image-placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="menu-item-name">{item.name}</div>
                                <div className="menu-item-description">{item.description}</div>
                                <div className="menu-item-price">Rs : {(item.price || 0).toFixed(2)}</div>
                                <div className="menu-item-rating">
                                    <i className="fas fa-star"></i> {item.averageRating} ({item.totalRatings})
                                </div>
                                <div className="cart-controls">
                                    {cartItems[item._id] ? (
                                        <div className="quantity-control">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => decrementQuantity(item)}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span className="quantity-count">{cartItems[item._id].quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => incrementQuantity(item)}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => addItemToCart(item, 1)}
                                        >
                                            <i className="fas fa-cart-plus"></i> Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    );
};

RestaurantMenu.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }),
};

export default RestaurantMenu;