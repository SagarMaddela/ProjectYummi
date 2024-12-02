// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

// Define the route for adding items to the cart
router.post('/add', authenticateToken,cartController.addItemToCart); // POST route to add item to cart
router.get('/menu', authenticateToken, cartController.getCartItems); // GET route to retrieve cart items
router.delete('/delete/:itemId',authenticateToken,cartController.deleteCartItem);
router.post('/orders', authenticateToken, cartController.order);
router.post('/payments', authenticateToken, cartController.payments);

module.exports = router;
