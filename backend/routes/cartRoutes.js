// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing user cart
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     description: Adds an item to the user's cart. If the item already exists, it updates the quantity.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - name
 *               - description
 *               - price
 *               - quantity
 *               - restaurantId
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the menu item
 *               name:
 *                 type: string
 *                 description: Name of the item
 *               description:
 *                 type: string
 *                 description: Description of the item
 *               price:
 *                 type: number
 *                 description: Price of the item
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item
 *               restaurantId:
 *                 type: string
 *                 description: ID of the restaurant
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Cannot add items from different restaurants
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/menu:
 *   get:
 *     summary: Retrieve cart items
 *     description: Gets the list of items in the user's cart along with total amount.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/delete/{itemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     description: Deletes an item from the user's cart. If the item quantity is greater than 1, it decreases the quantity.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to be removed
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/orders:
 *   post:
 *     summary: Place an order
 *     description: Creates a new order for the user or updates an existing order's status.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of an existing order (for updating status)
 *               restaurantId:
 *                 type: string
 *                 description: ID of the restaurant
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                       description: ID of the menu item
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the item
 *               totalAmount:
 *                 type: number
 *                 description: Total price of the order
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *                 description: Status of the order
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       404:
 *         description: Order not found (if updating)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/payments:
 *   post:
 *     summary: Process payment for an order
 *     description: Processes payment for an order and updates order status to 'completed'.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - userId
 *               - amount
 *               - paymentMethod
 *               - transactionId
 *               - paymentStatus
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order
 *               userId:
 *                 type: string
 *                 description: ID of the user making payment
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, UPI, cash]
 *                 description: Payment method
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID
 *               paymentStatus:
 *                 type: string
 *                 enum: [success, failed, pending]
 *                 description: Payment status
 *     responses:
 *       201:
 *         description: Payment successful and order updated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to process payment
 */

/**
 * @swagger
 * /cart/updatequantity/{itemId}:
 *   put:
 *     summary: Update item quantity in the cart
 *     description: Increases the quantity of an item in the cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item whose quantity is to be updated
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Cart or item not found
 *       500:
 *         description: Internal server error
 */

// Define the route for adding items to the cart
router.post('/add', authenticateToken,cartController.addItemToCart); // POST route to add item to cart
router.get('/menu', authenticateToken, cartController.getCartItems); // GET route to retrieve cart items
router.delete('/delete/:itemId',authenticateToken,cartController.deleteCartItem);
router.post('/orders', authenticateToken, cartController.order);
router.post('/payments', authenticateToken, cartController.payments);
router.put('/updatequantity/:itemId',authenticateToken,cartController.updateCartItem);

module.exports = router;
