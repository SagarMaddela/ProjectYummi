// src/controllers/cartController.js
const Cart = require('../models/Cart'); // Ensure you have your Cart model
const User = require('../models/User'); // Assuming you have a User model
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Payment = require('../models/Payment');
exports.getCartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.itemId').populate('items.restaurantId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json({ items: cart.items, totalAmount: cart.totalAmount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add item to cart
// 
exports.addItemToCart = async (req, res) => {
    console.log('Adding item to cart...');
    const { itemId, name, description, price, quantity = 1, restaurantId } = req.body;
    try {
        // Find user's cart
        let cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            cart = new Cart({ userId: req.user.userId, items: [], totalAmount: 0 });
        }

        // Check if there are existing items from a different restaurant
        if (cart.items.length > 0 && cart.items[0].restaurantId.toString() !== restaurantId) {
            return res.status(400).json({ message: 'Items from different restaurants cannot be added to the same cart.' });
        }

        // Check if the item already exists in the cart from the same restaurant
        const existingItemIndex = cart.items.findIndex(
            (item) => item.itemId.toString() === itemId && item.restaurantId.toString() === restaurantId
        );

        if (existingItemIndex !== -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += Number(quantity);
        } else {
            // Add new item to the cart
            cart.items.push({
                itemId,
                name,
                description,
                price: Number(price),
                quantity: Number(quantity),
                restaurantId,
            });
        }

        // Recalculate total amount based on the current items
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        // Save the updated cart
        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Delete item from cart
// exports.deleteCartItem =  async (req, res) => {
//     try {
//         let cart = await Cart.findOne({ userId: req.user.userId });
//         if (!cart) return res.status(404).json({ message: 'Cart not found' });
        
//         console.log(req.params.itemId);
//         cart.items = cart.items.filter((item) => item.itemId != req.params.itemId);

//         cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//         await cart.save();
//         res.json(cart);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.deleteCartItem = async (req, res) => {
    try {
        const itemId = req.params.itemId; // Directly access itemId from req.params
        console.log("Received itemId as:", itemId); // Should log itemId as a string

        // Find the user's cart and populate itemId with data from the MenuItem collection
        let cart = await Cart.findOne({ userId: req.user.userId }).populate('items.itemId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Find the index of the item in cart by comparing itemId strings
        const itemIndex = cart.items.findIndex((item) => item.itemId._id.toString() === itemId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        // Decrease quantity or remove item
        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        // Recalculate the total amount
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error('Error deleting cart item:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.order = async (req, res) => {
    const { orderId, restaurantId, items, totalAmount, status } = req.body;

    if (orderId) {
        // Update existing order status
        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: status || 'pending' },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({ message: 'Order status updated', order: updatedOrder });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Error updating order status', error: error.message });
        }
    } else {
        // Create a new order
        if (!restaurantId || !items || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const newOrder = new Order({
                user: req.user.userId,
                restaurant: restaurantId,
                items: items.map(item => ({
                    menuItem: item.menuItem,
                    quantity: item.quantity,
                })),
                totalAmount,
                status: status || 'pending',
            });

            const savedOrder = await newOrder.save();

            // Option 1: Remove the cart document after placing the order
            // Ignore if cart is not found (no error will be logged or returned)
            try {
                const cartDeletionResult = await Cart.findOneAndDelete({ userId: req.user.userId });
                if (cartDeletionResult) {
                    console.log('Cart deleted successfully');
                }
            } catch (cartError) {
                // Optionally log this if needed, but it won't stop the order creation
                console.log('Cart not found, skipping cart deletion');
            }

            res.status(201).json(savedOrder);
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ message: 'Error placing order', error: error.message });
        }
    }
};


exports.payments = async (req, res) => {
    const { orderId, userId, amount, paymentMethod, transactionId, paymentStatus } = req.body;

    try {
        // Create a new payment record (optional)
        const newPayment = new Payment({
            orderId,
            userId,
            amount,
            paymentMethod,
            transactionId,
            paymentStatus,
        });

        const savedPayment = await newPayment.save();

        // Find the order by orderId and update its status to 'completed'
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'completed' }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Respond with payment success
        res.status(201).json({ message: 'Payment successful and order updated', payment: savedPayment });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Failed to process payment' });
    }
};


exports.updateCartItem = async (req, res) => {
    try {
        const itemId = req.params.itemId; // Directly access itemId from req.params
        console.log("Received itemId as:", itemId); // Should log itemId as a string

        // Find the user's cart and populate itemId with data from the MenuItem collection
        let cart = await Cart.findOne({ userId: req.user.userId }).populate('items.itemId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Find the index of the item in cart by comparing itemId strings
        const itemIndex = cart.items.findIndex((item) => item.itemId._id.toString() === itemId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        // Decrease quantity or remove item
        if (cart.items[itemIndex].quantity >= 1) {
            cart.items[itemIndex].quantity += 1;
        } 

        // Recalculate the total amount
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error('Error deleting cart item:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
