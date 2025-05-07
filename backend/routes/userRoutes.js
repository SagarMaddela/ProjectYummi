const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Endpoints for user operations
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         pincode:
 *           type: string
 *     ReviewInput:
 *       type: object
 *       required:
 *         - orderId
 *         - rating
 *       properties:
 *         orderId:
 *           type: string
 *         rating:
 *           type: number
 *         reviewText:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/Address'
 *     UpdateQuantity:
 *       type: object
 *       required:
 *         - itemId
 *         - quantity
 *       properties:
 *         itemId:
 *           type: string
 *         quantity:
 *           type: number
 */

/**
 * @swagger
 * /api/user/userrestaurants:
 *   get:
 *     tags: [User]
 *     summary: Get all accepted restaurants with menu and reviews
 *     responses:
 *       200:
 *         description: List of restaurants
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/user/{id}/menu:
 *   get:
 *     tags: [User]
 *     summary: Get menu items for a specific restaurant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of menu items
 *       404:
 *         description: Restaurant not found
 */

/**
 * @swagger
 * /api/user/getUser:
 *   get:
 *     tags: [User]
 *     summary: Get logged-in user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/orderhistory:
 *   get:
 *     tags: [User]
 *     summary: Get user's order history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past orders
 */

/**
 * @swagger
 * /api/user/activeorders:
 *   get:
 *     tags: [User]
 *     summary: Get user's active orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active orders
 */

/**
 * @swagger
 * /api/user/cancelorder/{orderId}:
 *   patch:
 *     tags: [User]
 *     summary: Cancel a specific order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/user/getprofile:
 *   get:
 *     tags: [User]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */

/**
 * @swagger
 * /api/user/updateprofile:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Email already in use
 */

/**
 * @swagger
 * /api/user/submitreview:
 *   put:
 *     tags: [User]
 *     summary: Submit a review for a completed order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review submitted
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/updatequantity:
 *   put:
 *     tags: [User]
 *     summary: Update quantity of an item in the cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuantity'
 *     responses:
 *       200:
 *         description: Updated cart
 *       404:
 *         description: Cart or item not found
 */

/**
 * @swagger
 * /api/user/deleteorder/{orderId}:
 *   delete:
 *     tags: [User]
 *     summary: Delete an order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */


router.get('/userrestaurants', userController.renderUserRestaurants);
router.get('/:id/menu', userController.getRestaurantMenuItems);
router.get('/getUser', authenticateToken, userController.getUserInformation);
router.get('/orderhistory', authenticateToken, userController.getOrderHistory);
router.get('/activeorders', authenticateToken, userController.getActiveOrders);
router.patch('/cancelorder/:orderId', userController.cancelOrder);
router.get('/getprofile', authenticateToken, userController.getUserProfile);
router.put('/updateprofile', authenticateToken, userController.updateUserProfile);
router.put('/submitreview', authenticateToken, userController.review);
router.put('/updatequantity', authenticateToken, userController.updateCartItemQuantity);
router.delete('/deleteorder/:orderId', authenticateToken, userController.deleteOrder);

module.exports = router;