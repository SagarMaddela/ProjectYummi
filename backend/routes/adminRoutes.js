const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admin/registerAdmin:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       500:
 *         description: Error registering admin
 */


/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders for admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/total-revenue:
 *   get:
 *     summary: Get total revenue from all orders
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved total revenue
 *       500:
 *         description: Failed to fetch total revenue
 */

/**
 * @swagger
 * /admin/most-ordered-items:
 *   get:
 *     summary: Get the most ordered items
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved most ordered items
 *       500:
 *         description: Failed to fetch most ordered items
 */

/**
 * @swagger
 * /admin/orders-by-status:
 *   get:
 *     summary: Get orders grouped by status
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved orders by status
 *       500:
 *         description: Failed to fetch orders by status
 */

/**
 * @swagger
 * /admin/order-over-time:
 *   get:
 *     summary: Get orders over time (daily basis)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved orders over time
 *       500:
 *         description: Failed to fetch orders over time
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the user to be deleted
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Failed to delete user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to delete user
 */



router.post('/registerAdmin', adminController.registerAdmin);
router.get('/adminuser', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/orders',adminController.getOrders);
router.get('/total-revenue',adminController.getTotalRevenue);
router.get('/most-ordered-items',adminController.getMostOrderedItems);
router.get('/orders-by-status',adminController.getOrdersByStatus);
router.get('/order-over-time',adminController.getOrdersOverTime);

// router.get('/adminrestaurants', adminController.renderAdminRestaurant);
// router.get('/adminDashboard', adminController.renderAdminDashboard);
// router.get('/adminorderpage', adminController.renderAdminOrder);
// router.get('/adminuser',adminController.renderAdminUser);
// router.delete('/restaurants/:id',adminController.deleteRestaurant);

module.exports = router;
