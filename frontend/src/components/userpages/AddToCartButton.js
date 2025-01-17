import React from 'react';
import addItemToCart  from './UserCartPage';

const AddToCartButton = ({ item, restaurantId }) => {

    const handleAddToCart = () => {
        addItemToCart(item, restaurantId); // Call the function with item and restaurantId
    };

    return (
        <button onClick={handleAddToCart}>
            Add to Cart
        </button>
    );
};

export default AddToCartButton;
