import React, { createContext, useState, useEffect } from 'react';
import { getCartItems, addToItemCart, deleteCartItem} from '../../services/api';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    console.log('Token:', token);
    useEffect(() => {
        // Fetch the cart for the user
        const fetchCart = async () => {
            try {
                const response = await getCartItems(token);

                console.log(response.data)
                setCart(response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token]);
    

    const addItemToCart = async (item ,restaurantId ) => {

        try {
            const itemData = {
                itemId: item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                restaurantId: restaurantId,  // Include restaurantId in the request data
            };

            console.log(itemData,token);
            const response = await addToItemCart(token ,itemData);
            setCart(response.data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const removeItemFromCart = async (itemId) => {
        try {
            const response = await deleteCartItem(itemId, token);
            setCart(response.data);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
