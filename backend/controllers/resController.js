const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const redisClient = require('../config/redisClient'); // Ensure this is correctly configured

// Helper function to invalidate cache
const invalidateCache = async (restaurantId) => {
  try {
    await redisClient.del(`restaurant:${restaurantId}:dashboard`);
    await redisClient.del(`restaurant:${restaurantId}:analytics`);
  } catch (err) {
    console.error('Error invalidating cache:', err);
  }
};

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'restaurant';

    const logo = req.files['logo'] ? req.files['logo'][0].path : null;
    const menuImages = req.files['menuImages'] ? req.files['menuImages'].map(file => file.path) : [];
    const foodLicense = req.files['foodLicense'] ? req.files['foodLicense'][0].path : null;
    const healthCertification = req.files['healthCertification'] ? req.files['healthCertification'][0].path : null;

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

    const savedRestaurant = await newRestaurant.save();

    const processedMenuItems = menuItems.map((item, index) => ({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      image: req.files[`menuItems[${index}][image]`] ? req.files[`menuItems[${index}][image]`][0].filename : null,
      foodType: item.foodType,
      restaurant: savedRestaurant._id,
    }));

    const createdMenuItems = await MenuItem.insertMany(processedMenuItems);

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
    const restaurantId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).send('Invalid restaurant ID');
    }

    const cacheKey = `restaurant:${restaurantId}:dashboard`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }

    if (!Array.isArray(restaurant.menuItems)) {
      restaurant.menuItems = [];
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(restaurant)); // Cache for 5 minutes

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading dashboard');
  }
};

exports.renderMenuManagement = async (req, res) => {
  try {
    const restaurantId = req.user.userId;
    const restaurant = await Restaurant.findById(restaurantId).populate('menuItems');

    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }

    res.json(restaurant.menuItems);
  } catch (error) {
    console.error('Error loading menu management:', error);
    res.status(500).send('Error loading menu management');
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { name, price, description, category, foodType } = req.body;
    const image = req.file ? req.file.filename : null;

    const newMenuItem = new MenuItem({
      name,
      price,
      description,
      category,
      image,
      foodType,
      restaurant: req.user.userId
    });

    const savedMenuItem = await newMenuItem.save();

    await Restaurant.findByIdAndUpdate(
      req.user.userId,
      { $push: { menuItems: savedMenuItem._id } },
      { new: true }
    );

    await invalidateCache(req.user.userId);

    res.status(201).json({ message: 'Menu item added successfully', menuItem: savedMenuItem });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Error adding menu item' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, price, category, description, foodType } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateFields = { name, price, category, description, foodType };
    if (image) {
      updateFields.image = image;
    }

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.restaurant.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to update this menu item' });
    }

    Object.assign(menuItem, updateFields);
    await menuItem.save();

    await invalidateCache(req.user.userId);

    res.json({ message: 'Menu item updated successfully', menuItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item.' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const menuItem = await MenuItem.findById(itemId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.restaurant.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this menu item' });
    }

    await MenuItem.findByIdAndDelete(itemId);

    await Restaurant.updateOne(
      { _id: req.user.userId },
      { $pull: { menuItems: itemId } }
    );

    await invalidateCache(req.user.userId);

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  const restaurantId = req.user.userId;

  try {
    const orders = await Order.find({ restaurant: restaurantId })
      .populate('user', 'username email')
      .populate({
        path: 'items.menuItem',
        model: 'MenuItem',
        select: 'name price',
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.analytics = async (req, res) => {
  const restaurantId = req.user.userId;
  const cacheKey = `restaurant:${restaurantId}:analytics`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const restaurant = await Restaurant.findById(restaurantId)
      .populate('reviews')
      .populate('menuItems');

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

    const analyticsData = {
      totalReviews,
      averageRating,
      popularItems,
    };

    await redisClient.setEx(cacheKey, 600, JSON.stringify(analyticsData)); // Cache for 10 minutes

    res.json(analyticsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics data.' });
  }
};

exports.reviews = async (req, res) => {
  const restaurantId = req.user.userId;

  try {
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
