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
  const {
      restaurantName,
      address,
      owner,
      email,
      phone,
      password,
      deliveryRadius,
      businessHours,
      restaurantDescription,
      accountNumber,
      routingNumber,
      menuItems
  } = req.body;

  const logo = req.files?.logo?.[0];
  const foodLicense = req.files?.foodLicense?.[0];
  const healthCertification = req.files?.healthCertification?.[0];
  const menuItemImages = req.files;

  // Parse menuItems if it's a string
  let parsedMenuItems;
  try {
      if (typeof menuItems === 'string') {
          parsedMenuItems = JSON.parse(menuItems);
      } else {
          parsedMenuItems = menuItems;
      }
  } catch (error) {
      return res.status(400).json({ msg: 'Invalid menuItems data' });
  }

  // Validate required fields
  if (!restaurantName || !address || !owner || !email || !phone || !password) {
      return res.status(400).json({ msg: 'All required fields must be provided' });
  }

  if (!logo) {
      return res.status(400).json({ msg: 'Restaurant logo is required' });
  }

  try {
      // Check if restaurant already exists
      const existingRestaurant = await Restaurant.findOne({ email });
      if (existingRestaurant) {
          return res.status(400).json({ msg: 'Restaurant with this email already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("hello");
      // Create restaurant
      const restaurant = new Restaurant({
          restaurantName,
          address,
          owner,
          email,
          phone,
          password: hashedPassword,
          deliveryRadius,
          businessHours,
          restaurantDescription,
          accountNumber,
          routingNumber,
          logo: {
              data: logo.buffer,
              contentType: logo.mimetype
          },
          foodLicense: foodLicense ? {
              data: foodLicense.buffer,
              contentType: foodLicense.mimetype
          } : undefined,
          healthCertification: healthCertification ? {
              data: healthCertification.buffer,
              contentType: healthCertification.mimetype
          } : undefined
      });

      // Save restaurant
      await restaurant.save();

      // Create and save menu items
      const savedMenuItems = await Promise.all(
          (parsedMenuItems || []).map(async (item, index) => {
              const menuItemImage = menuItemImages[`menuItems[${index}][image]`]?.[0];
              const menuItem = new MenuItem({
                  restaurant: restaurant._id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                  description: item.description,
                  foodType: item.foodType,
                  image: menuItemImage ? {
                      data: menuItemImage.buffer,
                      contentType: menuItemImage.mimetype
                  } : undefined
              });
              await menuItem.save();
              return menuItem._id;
          })
      );

      // Update restaurant with menu item references
      restaurant.menuItems = savedMenuItems;
      await restaurant.save();

      res.status(201).json({
          msg: 'Restaurant created successfully!',
          restaurantId: restaurant._id
      });
  } catch (error) {
      console.error('Error creating restaurant:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};

exports.renderDashboard = async (req, res) => {
  try {
    const restaurantId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).send('Invalid restaurant ID');
    }

    const cacheKey = `restaurant:${restaurantId}:dashboard`;

    console.time('RedisFetchTime:dashboard');
    const cachedData = await redisClient.get(cacheKey);
    console.timeEnd('RedisFetchTime:dashboard');

    if (cachedData) {
      console.log('Data fetched from Redis cache');
      return res.json(JSON.parse(cachedData));
    }

    console.time('MongoFetchTime:dashboard');
    const restaurant = await Restaurant.findById(restaurantId);
    console.timeEnd('MongoFetchTime:dashboard');

    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }

    if (!Array.isArray(restaurant.menuItems)) {
      restaurant.menuItems = [];
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(restaurant)); // Cache for 5 minutes
    console.log('Data fetched from MongoDB and cached');

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
      const image = req.file; // Multer stores the image file

      // Validate required fields
      if (!name || !price) {
          return res.status(400).json({ msg: 'Name and price are required' });
      }

      // Create a new MenuItem document
      const newMenuItem = new MenuItem({
          name,
          price,
          description,
          category,
          foodType,
          restaurant: req.user.userId, // Associate with restaurant from JWT
          image: image ? {
              data: image.buffer,
              contentType: image.mimetype
          } : undefined
      });

      // Save the new menu item
      const savedMenuItem = await newMenuItem.save();

      // Update the restaurant to include the new menu item ID
      await Restaurant.findByIdAndUpdate(
          req.user.userId,
          { $push: { menuItems: savedMenuItem._id } },
          { new: true }
      );

      res.status(201).json({ message: 'Menu item added successfully', menuItem: savedMenuItem });
  } catch (error) {
      console.error('Error adding menu item:', error);
      res.status(500).json({ message: 'Error adding menu item' });
  }
};


exports.updateMenuItem = async (req, res) => {
  try {
    const { name, price, category, description, foodType } = req.body;
    const image = req.file; // Multer stores the image file

    const updateFields = { name, price, category, description, foodType };
    if (image) {
      updateFields.image = image ? {
        data: image.buffer,
        contentType: image.mimetype
    } : undefined
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
    console.time('RedisFetchTime:analytics');
    const cached = await redisClient.get(cacheKey);
    console.timeEnd('RedisFetchTime:analytics');

    if (cached) {
      console.log('Analytics fetched from Redis cache');
      return res.json(JSON.parse(cached));
    }

    console.time('MongoFetchTime:analytics');
    const restaurant = await Restaurant.findById(restaurantId)
      .populate('menuItems')
      .lean();
    console.timeEnd('MongoFetchTime:analytics');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(restaurant));
    console.log('Analytics fetched from MongoDB and cached');

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server Error' });
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
