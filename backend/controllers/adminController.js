const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.registerAdmin = async (req, res) => {
    try {
        const { adminName, email, password } = req.body;
        const role = 'admin'; // Assign admin role
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newAdmin = new Admin({
            adminName,
            email,
            password: hashedPassword,
            role // Assign the role
        });
        await newAdmin.save();
        res.json({ message: 'Admin registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering admin' });
    }
  };

  exports.renderAdminRestaurant = async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
  };

  exports.deleteRestaurant = async (req, res) => {
    try {
      const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
      res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete restaurant' });
    }
  };


  exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// // Delete a user by ID
// exports.deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to delete user' });
//     }
// };

// Delete a user by ID
// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
      // Ensure the ID is a valid ObjectId
      const userId = new mongoose.Types.ObjectId(req.params.id); // Use 'new' to invoke ObjectId constructor
      
      const user = await User.findByIdAndDelete(userId); // Delete user by ID
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error("Error deleting user:", error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email') // Adjust fields as necessary
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem', // Ensure you have a MenuItem model defined
        select: 'name price' // Adjust fields to return from MenuItem
      }).populate('restaurant', 'restaurantName');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Total Revenue
exports.getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    res.json(totalRevenue[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Revenue by Restaurant
exports.getRevenueByRestaurants = async (req, res) => {
  try {
    const revenueByRestaurant = await Order.aggregate([
      { $group: { _id: "$restaurant", totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    res.json(revenueByRestaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Orders by Status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", totalOrders: { $sum: 1 } } },
    ]);
    res.json(ordersByStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Most Ordered Items
exports.getMostOrderedItems = async (req, res) => {
  try {
    const mostOrderedItems = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.menuItem", totalOrdered: { $sum: "$items.quantity" } } },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 },
    ]);
    res.json(mostOrderedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Orders Over Time (Daily)
exports.getOrdersOverTime = async (req, res) => {
  try {
    const ordersOverTime = await Order.aggregate([
      { $group: { _id: { $dayOfMonth: "$createdAt" }, totalOrders: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);
    res.json(ordersOverTime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


