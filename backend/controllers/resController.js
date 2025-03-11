const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');

exports.createRestaurant = async (req, res) => {
    try {
      const {
        restaurantName,
        owner,
        email,
        phone,
        password,
        address,
        deliveryRadius,
        businessHours,
        menuItems,
        restaurantDescription,
        accountNumber,
        routingNumber
      } = req.body;
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = 'restaurant';
  
      // Extract uploaded files
      const logo = req.files['logo'] ? req.files['logo'][0].path : null;
      const menuImages = req.files['menuImages'] ? req.files['menuImages'].map(file => file.path) : [];
      const foodLicense = req.files['foodLicense'] ? req.files['foodLicense'][0].path : null;
      const healthCertification = req.files['healthCertification'] ? req.files['healthCertification'][0].path : null;
  
      // Create new restaurant document
      const newRestaurant = new Restaurant({
        restaurantName,
        owner,
        email,
        phone,
        password: hashedPassword,
        address,
        deliveryRadius,
        businessHours,
        restaurantDescription,
        logo,
        menuImages,
        foodLicense,
        healthCertification,
        accountNumber,
        routingNumber,
        role
      });
  
      // Save the restaurant to the database first
      const savedRestaurant = await newRestaurant.save();

      
  
      // Process menu items and associate them with the restaurant
      const processedMenuItems = menuItems.map((item, index) => ({
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        image: req.files[`menuItems[${index}][image]`] ? req.files[`menuItems[${index}][image]`][0].filename : null,
        foodType: item.foodType,
        restaurant: savedRestaurant._id, // Associate the restaurant ID
        
        
      }));
  
      // Save all processed menu items in MenuItem collection
      const createdMenuItems = await MenuItem.insertMany(processedMenuItems);
  
      // Update restaurant with the menu item references
      savedRestaurant.menuItems = createdMenuItems.map(item => item._id);
      await savedRestaurant.save();
  
      res.send('Restaurant registered successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering restaurant');
    }
  };


  exports.renderDashboard = async (req, res) => {
    try {
        const restaurantId = req.user.userId; // Use userId from the token

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).send('Invalid restaurant ID');
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).send('Restaurant not found');
        }

        if (!Array.isArray(restaurant.menuItems)) {
            restaurant.menuItems = [];
        }

        res.json(restaurant);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading dashboard');
    }
};


exports.renderMenuManagement = async (req, res) => {
  try {
      const restaurantId = req.user.userId; 
      console.log(restaurantId); // Accessing userId from req.user set by the JWT middleware
      const restaurant = await Restaurant.findById(restaurantId).populate('menuItems');

      if (!restaurant) {
          return res.status(404).send('Restaurant not found');
      }

      // Respond with the populated menu items
      res.json(restaurant.menuItems);
  } catch (error) {
      console.error('Error loading menu management:', error);
      res.status(500).send('Error loading menu management');
  }
};


// Add a Menu Item
exports.addMenuItem = async (req, res) => {
  try {
    console.log(44444);
      const { name, price, description, category, foodType } = req.body;
      const image = req.file ? req.file.filename : null;

      // Create a new MenuItem document
      const newMenuItem = new MenuItem({
          name,
          price,
          description,
          category,
          image,
          foodType,
          restaurant: req.user.userId // Associate the menu item with the restaurant
      });

      // Save the new menu item
      const savedMenuItem = await newMenuItem.save();
      console.log(savedMenuItem);
      // Update the restaurant to include the new menu item ID
      await Restaurant.findByIdAndUpdate(
          req.user.userId, // Get restaurant ID from the JWT
          { $push: { menuItems: savedMenuItem._id } }, // Push the ID of the saved menu item
          { new: true }
      );

      res.status(201).json({ message: 'Menu item added successfully', menuItem: savedMenuItem });
  } catch (error) {
      console.error('Error adding menu item:', error);
      res.status(500).json({ message: 'Error adding menu item' });
  }
};


// Update a Menu Item
exports.updateMenuItem = async (req, res) => {
  try {
      const { name, price, category, description,foodType } = req.body;
      const image = req.file ? req.file.filename : null;

      const updateFields = { name, price, category, description, foodType };
      if (image) {
          updateFields.image = image; // Update image only if a new one was uploaded
      }

      // Find the menu item by ID and update it
      console.log(req.param.id);
      const menuItem = await MenuItem.findById(req.params.id);
      
      console.log(menuItem);

      if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
      }

      // Check if the user owns the restaurant that this menu item belongs to
      if (menuItem.restaurant.toString() !== req.user.userId) {
          return res.status(403).json({ message: 'You do not have permission to update this menu item' });
      }

      // Update the menu item
      Object.assign(menuItem, updateFields);
      await menuItem.save();

      res.json({ message: 'Menu item updated successfully', menuItem });
  } catch (error) {
      console.error('Error updating menu item:', error);
      res.status(500).json({ message: 'Error updating menu item.' });
  }
};


// Delete a Menu Item
exports.deleteMenuItem = async (req, res) => {
  try {
      const itemId = req.params.id;

      // Find the menu item by ID
      const menuItem = await MenuItem.findById(itemId);

      if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
      }

      // Check if the user owns the restaurant that this menu item belongs to
      if (menuItem.restaurant.toString() !== req.user.userId) {
          return res.status(403).json({ message: 'You do not have permission to delete this menu item' });
      }

      // Delete the menu item
      await MenuItem.findByIdAndDelete(itemId);

      // Optionally, you can also update the restaurant's menuItems array
      await Restaurant.updateOne(
          { _id: req.user.userId },
          { $pull: { menuItems: itemId } } // Just to keep the reference clean
      );

      res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ message: 'Error deleting menu item' });
  }
};


exports.getRestaurantOrders = async (req, res) => {
    const restaurantId = req.user.userId; // Use restaurantId from the token
    
    try {
        const orders = await Order.find({ restaurant: restaurantId }) // Query orders by restaurantId
            .populate('user', 'username email') // Populate user details
            .populate({
                path: 'items.menuItem', // Populate menu items
                model: 'MenuItem',
                select: 'name price',
            });

        // console.log(orders);
        
        res.json(orders); // Send the orders back in the response
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// OrderController.js

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Extract orderId from the request params
    const { status } = req.body; // Extract new status from request body

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status }, // Update only the status field
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// In your backend routes
exports.analytics =  async (req, res) => {

    console.log('12345');
    const restaurantId = req.user.userId;

    try {
        const restaurant = await Restaurant.findById(restaurantId)
            .populate('reviews')
            .populate('menuItems'); // Assuming `menuItems` is an array of MenuItem references

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        const totalReviews = restaurant.reviews.length;
        const averageRating =
            restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 0;

        const popularItems = await MenuItem.find({ restaurant: restaurantId })
            .sort({ totalRatings: -1 })
            .limit(5)
            .select('name totalRatings');

        res.json({
            totalReviews,
            averageRating,
            popularItems,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics data.' });
    }
};


exports.reviews = async (req, res) => {
    const restaurantId = req.user.userId; // Ensure this is correctly retrieved
    
    try {
        // Fetch reviews for the given restaurant
        const reviews = await Review.find({ restaurant: restaurantId }).populate('user', 'username email');

        if (reviews.length === 0) {
            return res.status(404).json({ error: 'No reviews found for this restaurant.' });
        }

        res.status(200).json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};