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
 * /user/userrestaurants:
 *   get:
 *     summary: Get a list of restaurants
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurant list
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
 */

/**
 * @swagger
 * /user/cancelorder/{orderId}:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Users]
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
 *       400:
 *         description: Invalid request
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
 */






router.get('/userrestaurants' , userController.renderUserRestaurants);
router.get('/:id/menu',userController.getRestaurantMenuItems);
router.get('/getUser',authenticateToken, userController.getUserInformation);
router.get('/orderhistory', authenticateToken, userController.getOrderHistory);
router.get('/activeorders', authenticateToken, userController.getActiveOrders);
router.patch('/cancelorder/:orderId', userController.cancelOrder);
router.get('/getprofile',authenticateToken,userController.getUserProfile);
router.put('/updateprofile',authenticateToken,userController.updateUserProfile);
router.put('/submitreview',authenticateToken,userController.review);
router.put('/updatequantity',authenticateToken,userController.updateCartItemQuantity);
router.delete('/deleteorder/:orderId',authenticateToken, userController.deleteOrder);


module.exports = router;