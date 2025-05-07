const express = require('express');
const { signup, login, AdminRestaurant, getOrders,deleteRestaurant, getAllUsers, deleteUser ,status,getAdminDashboardStats} = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const authLimiter = require('../middleware/rateLimitMiddleware');

router.use(authLimiter); 

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: string
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error (username exists, invalid email, weak password)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd!
 *     responses:
 *       200:
 *         description: Successfully authenticated, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

router.post('/signup', signup);  
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

