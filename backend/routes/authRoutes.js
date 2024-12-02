const express = require('express');
const { signup, login, AdminRestaurant, getOrders,deleteRestaurant, getAllUsers, deleteUser ,status,getAdminDashboardStats} = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

router.post('/signup', signup);  // Define POST route for signup
router.post('/login', login); 
router.get('/adminrestaurants', AdminRestaurant);
router.delete('/restaurants/:id',deleteRestaurant);
router.get('/adminuser', getAllUsers);

// Route to delete a user by ID
router.delete('/users/:id', deleteUser);
router.put('/status/:restaurantId', status);
router.get('/adminDashboard', getAdminDashboardStats);
router.get('/orders',getOrders);
// Define POST route for login
module.exports = router;
