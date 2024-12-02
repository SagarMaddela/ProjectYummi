const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// router.get('/adminrestaurants', adminController.renderAdminRestaurant);
 router.post('/registerAdmin', adminController.registerAdmin);
// router.get('/adminDashboard', adminController.renderAdminDashboard);
// router.get('/adminorderpage', adminController.renderAdminOrder);
// router.get('/adminuser',adminController.renderAdminUser);
// router.delete('/restaurants/:id',adminController.deleteRestaurant);
router.get('/adminuser', adminController.getAllUsers);

// Route to delete a user by ID
router.delete('/users/:id', adminController.deleteUser);

router.get('/orders',adminController.getOrders);
router.get('/total-revenue',adminController.getTotalRevenue);
router.get('/most-ordered-items',adminController.getMostOrderedItems);
router.get('/orders-by-status',adminController.getOrdersByStatus);
router.get('/order-over-time',adminController.getOrdersOverTime);
module.exports = router;
