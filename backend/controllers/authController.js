require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const Admin = require('../models/Admin');
const Order = require('../models/Order');


exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const role = 'user'; // Assign user role

        // Validate username uniqueness
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long, contain letters, numbers, and special characters.'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role // Assign the role
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Error registering user' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in User, Admin, or Restaurant collections
        const user = await User.findOne({ email }) || 
                     await Admin.findOne({ email }) ||    
                     await Restaurant.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.constructor.modelName }, 
            process.env.JWT_SECRET,  // Directly pass the secret here
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};

exports.AdminRestaurant = async (req, res) => {
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

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};


exports.status = async (req, res) => {
  const { restaurantId } = req.params;
  const { status } = req.body; // Expecting status in the request body

  try {
    // Validate status
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the restaurant by ID and update its status
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', restaurant });
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();

    console.log(totalOrders,totalRestaurants,totalUsers);

    return res.status(200).json({
        totalUsers,
        totalRestaurants,
        totalOrders
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
}
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



