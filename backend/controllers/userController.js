const Restaurant = require('../models/Restaurant');
const Cart = require('../models/Cart');
const User = require("../models/User");
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');

exports.renderUserRestaurants = async (req, res) => {
  try {
      // Fetch restaurants with accepted status and populate reviews
      const restaurants = await Restaurant.find({ status: "Accepted" }).populate('menuItems')
          .populate({
              path: 'reviews',
              populate: [
                  { path: 'user' },    // Populate user details in the review
                  { path: 'order' },   // Populate order details in the review (optional)
              ]
          });

    //   console.log('Fetched restaurants:', restaurants);

      res.status(200).json(restaurants);
  } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};



 exports.getRestaurantMenuItems = async (req, res) => {
    try {
        const restaurantId = req.params.id; // Get the restaurant ID from the URL parameters
        // console.log(`Fetching menu for restaurant ID: ${restaurantId}`);
        
        // Find the restaurant by ID and populate its menu items
        const restaurant = await Restaurant.findById(restaurantId).populate('menuItems');

        // Check if the restaurant exists
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        console.log(restaurant.menuItems);

        // Respond with the menu items
        res.json(restaurant.menuItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getCartItems = async (req, res) => {
  try {
      const cart = await Cart.findOne({ userId: req.user.userId })
          .populate('items.itemId')
          .populate('items.restaurantId');
      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }
      res.json(cart);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
//   console.log(1234);
  const { itemId, name, description, price, quantity, restaurantId  } = req.body;
  try {
      let cart = await Cart.findOne({ userId: req.user.userId });
      if (!cart) {
          cart = new Cart({ userId: req.user.userId, items: [] });
      }
      console.log(req.user.userId, itemId, name, description, price, quantity, restaurantId, specialInstructions, imageUrl  );

      cart.items.push({
          itemId,
          name,
          description,
          price,
          quantity,
          restaurantId,
          specialInstructions,
          imageUrl,
      });

      cart.totalAmount += price * quantity;

      await cart.save();
      res.status(201).json(cart);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

// Delete item from cart
exports.deleteCartItem = async (req, res) => {
  try {
      let cart = await Cart.findOne({ userId: req.user.userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const itemToRemove = cart.items.find(item => item.itemId.toString() === req.params.itemId);
      if (!itemToRemove) {
          return res.status(404).json({ message: 'Item not found in cart' });
      }

      // Update total amount before removing the item
      cart.totalAmount -= itemToRemove.price * itemToRemove.quantity;

      // Filter out the item
      cart.items = cart.items.filter(item => item.itemId.toString() !== req.params.itemId);

      await cart.save();
      res.json(cart);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};


exports.payments = async (req, res) => {
    const { orderId, userId, amount, paymentMethod, transactionId, paymentStatus, deliveryAddress } = req.body;

    try {
        // Create a new payment record (optional)
        const newPayment = new Payment({
            orderId,
            userId,
            amount,
            paymentMethod,
            transactionId,
            paymentStatus,
            deliveryAddress
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


exports.getUserInformation = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.userId });
    //   console.log(user); // Use findOne with async/await
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user); // Send the user information as a JSON response
    } catch (error) {
      console.error("Error fetching user information:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.getOrderHistory = async (req, res) => {
    try {

      // Fetch orders for the logged-in user and populate necessary fields
    //   console.log(req.user.userId);
      const orders = await Order.find({ user: req.user.userId })
        .populate('items.menuItem')  // Populate menu items (use the correct reference)
        .populate('restaurant')  // Populate the restaurant info
        .populate('user', 'name email')
        .populate('review'); // Populate user details (only name and email)
  
      console.log(req.user.userId);
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found." });
      }
  
      res.json(orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  exports.getActiveOrders = async (req, res) => {
    try {
        // console.log(req.user.userId);
      const activeOrders = await Order.find({ status: { $in: ['Pending'] } , user: req.user.userId  })
      .populate('items.menuItem')  // Populate menu items (use the correct reference)
      .populate('restaurant')  // Populate the restaurant info
      .populate('user', 'name email');
      res.status(200).json(activeOrders);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      res.status(500).json({ message: 'Error fetching active orders', error: error.message });
    }
  };


  // In your controller
exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params; // Assuming orderId is passed as a parameter
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Order cancelled", order: updatedOrder });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Error cancelling order", error: error.message });
    }
  };

  exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params; // Assuming orderId is passed as a parameter
  
    try {
      const updatedOrder = await Order.findByIdAndDelete(
        orderId,
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Order Deleted", order: updatedOrder });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Error cancelling order", error: error.message });
    }
  };


exports.deleteOrder = async (req,res) =>{
    try{
        const {orderId} = req.params;
        const response = req.user.userId;
        const deleteOrder = await Order.findByIdAndDelete({orderId});
        res.status(200).json(deleteOrder);
    }catch{

    }
}
// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        // Find the user by their ID and exclude the password field
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Log the user details for debugging purposes (optional)
        // console.log(user);
        // Return the user data excluding the password
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { username, email, phone, address } = req.body;
    console.log(phone);
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is already in use by another user
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // If address is provided, ensure it is an object with required fields
        if (address) {
            user.address = {
                street: address.street || user.address.street,
                city: address.city || user.address.city,
                state: address.state || user.address.state,
                pincode: address.pincode || user.address.pincode
            };
        }

        // Update user information
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        console.log(user.phone);
        // Save updated user profile
        const updatedUser = await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.review = async (req, res) => {
    const { orderId, rating, reviewText, images } = req.body;
  
    console.log(orderId, rating);
    if (!orderId || !rating) {
        return res.status(400).json({ error: 'Order ID and rating are required.' });
    }
  
    try {
        // Find the order with populated fields
        const order = await Order.findById(orderId).populate('user').populate('items.menuItem').populate('restaurant');
  
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }
  
        // Ensure the logged-in user owns the order
        if (order.user._id.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only review your own orders.' });
        }
  
        // Check if a review already exists for this order
        if (order.review) {
            return res.status(400).json({ error: 'Review already submitted for this order.' });
        }
  
        // Fetch the restaurant document for reviews
        const restaurant = await Restaurant.findById(order.restaurant._id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }
  
        // Create a new review
        const review = new Review({
            user: req.user.userId,
            restaurant: order.restaurant._id,
            order: order._id,
            reviewText: reviewText || '', // Optional review text
            rating,
            images: images || [], // Optional images
        });
  
        await review.save();
  
        // Add the review to the restaurant's reviews array
        restaurant.reviews.push(review._id);
        await restaurant.save();
  
        // Update each menu item's average rating
        const menuItems = order.items.map((item) => item.menuItem);
        for (let menuItem of menuItems) {
            const menu = await MenuItem.findById(menuItem._id);
  
            if (menu) {
                // Check if the category is missing or invalid
                if (!menu.category) {
                    console.warn(`MenuItem ${menu._id} is missing category. Skipping rating update.`);
                    continue; // Skip updating this menu item if category is missing
                }
  
                const totalRatings = menu.totalRatings || 0;
                const currentRating = menu.averageRating || 0;
  
                menu.averageRating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
                menu.totalRatings = totalRatings + 1;
  
                await menu.save();
            }
        }
  
        // Link the review to the order
        order.review = review._id;
        await order.save();
  
        res.status(201).json({ message: 'Review submitted successfully.', review });
    } catch (err) {
        console.error('Error submitting review:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
  };

  
  
  // Update quantity of an item in the cart
  exports.updateCartItemQuantity = async (req, res) => {
      const { itemId, quantity } = req.body; // Getting itemId and quantity from request body
      const { userId } = req; // Assuming userId is extracted from the token middleware
  
      if (!itemId || quantity <= 0) {
          return res.status(400).json({ message: 'Invalid itemId or quantity' });
      }
  
      try {
          const cart = await Cart.findOne({ userId });
          if (!cart) {
              return res.status(404).json({ message: 'Cart not found' });
          }
  
          // Find the item in the cart and update the quantity
          const cartItem = cart.items.find(item => item.itemId.toString() === itemId);
          if (!cartItem) {
              return res.status(404).json({ message: 'Item not found in cart' });
          }
  
          // Update the item quantity
          cartItem.quantity = quantity;
  
          // Recalculate the totalAmount
          cart.totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  
          // Save the updated cart
          await cart.save();
  
          res.json(cart); // Return the updated cart
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error updating cart item' });
      }
  };
  