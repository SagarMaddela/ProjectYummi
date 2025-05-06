import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/cart.css';
import { getCartItems, deleteCartItem } from '../../services/api';
import UserNavBar from "../UserNavBar"
import { updateQuantity } from '../../services/api';
import UserPaymentPage from "./UserPaymentPage";
import Footer from '../footer';
const Cart = () => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);
    let { restaurantId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCartItems(token);
                setCart(response.data);
                console.log("cart:", response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [token]);

    const addQuantity = async (itemId) => {
        try {
            const response = await updateQuantity(itemId, token);
            setCart(response.data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('An error occurred while adding the item to the cart.');
        }
    };

    const handlePlaceOrder = () => {

        if (!cart.items || cart.items.length === 0) {
            alert("Your cart is empty. Please add items before proceeding to payment.");
            return;
        }
    
        if(!restaurantId){
           restaurantId = cart.items[0].restaurantId._id;
           console.log(restaurantId, 'error');
        }

        const restaurantName = cart.items[0].restaurantId.restaurantName;
        const cleanRestaurantId = restaurantId.replace("restaurantId=", "");
    
        if (!cleanRestaurantId) {
            alert('Restaurant information is missing. Please select a restaurant.');
            return;
        }
    
        // Extract userId from token
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
    
        if (!userId) {
            alert('User information is missing. Please log in again.');
            return;
        }

        // Pass order data to the payment page
        navigate('/cart', {
            state: {
                orderData: {
                    restaurantName,
                    restaurantId: cleanRestaurantId,
                    userId,
                    items: cart.items.map(item => ({
                        menuItem: item.itemId,
                        quantity: item.quantity,
                    })),
                    totalAmount: cart.totalAmount,
                }
            }
        });
        
    };

    const removeItemFromCart = async (itemId) => {
        try {
            console.log('Client itemId:', itemId);
            const response = await deleteCartItem(itemId, token);
            console.log('Response from deleteCartItem:', response.data);
            setCart(response.data);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };
    
    if (loading) return <div className="cart-loading">Loading...</div>;


    const baseURL = 'http://localhost:5000/uploads';
    
    return (
        <div><UserNavBar/>
        <div className ="main1">
            
            <div className="cart-container">
                <h2 className="cart-heading">Your Cart</h2>
                {cart.items.length === 0 ? (
                    <div className="cart-empty-message">Your cart is empty. Add some items to your cart!</div>
                ) : (
                    <ul className="cart-items-list">
                        {cart.items.map((item) => (
                            <li key={item.itemId._id} className="cart-item">
                                <div>
                                        {item.itemId.image?.data?.data && item.itemId.image?.contentType ? (
                                            <img
                                                src={`data:${item.itemId.image.contentType};base64,${btoa(
                                                    String.fromCharCode(...item.itemId.image.data.data)
                                                )}`}
                                                className="cart-item-image"
                                                alt={item.itemId.name}
                                            />
                                        ) : (
                                            <div className="image-placeholder">No Image</div>
                                        )}
                                    </div>
                                <div className="cart-item-details">
                                    <p className="cart-item-name">{item.name}</p>
                                    <p className="cart-item-description">{item.description}</p>
                                    <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                    <p className="cart-item-price">Price: ${item.price}</p>
                                </div>
                                <button className="cart-item-add" onClick={() => addQuantity(item.itemId._id)}>
                                    Add
                                </button>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeItemFromCart(item.itemId._id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <h3 className="cart-total">Total: ${cart.totalAmount}</h3>
                <button className="cart-place-order" onClick={handlePlaceOrder}>
                    Proceed to Payment
                </button>
            </div>
            <div className ="main2">
                <UserPaymentPage />
            </div>
        </div>
        
           

        </div>
    );
};

export default Cart;


