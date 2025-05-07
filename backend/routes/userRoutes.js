const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-related API routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - restaurant
 *         - items
 *         - totalAmount
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user who placed the order
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               menuItem:
 *                 type: string
 *                 description: ID of the menu item
 *               quantity:
 *                 type: number
 *                 description: Quantity of the item
 *               review:
 *                 type: string
 *                 description: Review for the item
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for the item
 *         totalAmount:
 *           type: number
 *           description: Total amount of the order
 *         status:
 *           type: string
 *           default: "Pending"
 *           description: Status of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Order update timestamp
 *     Restaurant:
 *       type: object
 *       required:
 *         - restaurantName
 *         - owner
 *         - email
 *         - phone
 *         - password
 *         - address
 *         - deliveryRadius
 *         - businessHours
 *       properties:
 *         restaurantName:
 *           type: string
 *           description: Name of the restaurant
 *         owner:
 *           type: string
 *           description: Name of the restaurant owner
 *         email:
 *           type: string
 *           description: Restaurant email
 *         phone:
 *           type: string
 *           description: Restaurant phone number
 *         password:
 *           type: string
 *           description: Restaurant password
 *         address:
 *           type: string
 *           description: Restaurant address
 *         deliveryRadius:
 *           type: number
 *           description: Delivery radius in kilometers
 *         businessHours:
 *           type: string
 *           description: Business hours of the restaurant
 *         restaurantDescription:
 *           type: string
 *           description: Description of the restaurant
 *         menuItems:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs of menu items
 *         ratings:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs of ratings
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs of reviews
 *         role:
 *           type: string
 *           default: 'restaurant'
 *           description: Role of the entity
 *         status:
 *           type: string
 *           default: 'pending'
 *           description: Status of the restaurant
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Restaurant creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Restaurant update timestamp
 *     MenuItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *         - description
 *         - foodType
 *         - restaurant
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the menu item
 *         price:
 *           type: number
 *           description: Price of the menu item
 *         category:
 *           type: string
 *           description: Category of the menu item
 *         description:
 *           type: string
 *           description: Description of the menu item
 *         foodType:
 *           type: string
 *           description: Type of food (e.g., veg, non-veg)
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant
 *         averageRating:
 *           type: number
 *           default: 0
 *           description: Average rating of the menu item
 *         totalRatings:
 *           type: number
 *           default: 0
 *           description: Total number of ratings
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Menu item creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Menu item update timestamp
 */

/**
 * @swagger
 * /user/userrestaurants:
 *   get:
 *     summary: Get a list of restaurants
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurant list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/{id}/menu:
 *   get:
 *     summary: Get menu items for a restaurant
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/orderhistory:
 *   get:
 *     summary: Get order history of the user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved order history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/activeorders:
 *   get:
 *     summary: Get active orders of the user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved active orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/cancelorder/{orderId}:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully canceled order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /user/getprofile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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