const express = require('express');
const router = express.Router();
const restaurantControllers = require('../controllers/resController');
const multer = require('multer');
const authenticateToken = require('../middleware/authenticateToken');

// Define the storage strategy
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


// Initialize upload
const upload = multer({ storage: storage });

router.post('/registerForm',upload.fields([
    { name: 'logo' },
    { name: 'menuImages' },
    { name: 'foodLicense' },
    { name: 'healthCertification' },
    { name: 'menuItems[0][image]', maxCount: 1 },
    { name: 'menuItems[1][image]', maxCount: 1 },
    { name: 'menuItems[2][image]', maxCount: 1 },
    { name: 'menuItems[3][image]', maxCount: 1 },
    { name: 'menuItems[4][image]', maxCount: 1 },
    { name: 'menuItems[5][image]', maxCount: 1 }


  ]), restaurantControllers.createRestaurant);

  const restaurantOnly = (req, res, next) => {
    if (req.user.role !== 'Restaurant') {
        return res.status(403).json({ message: 'Access forbidden: Restaurant only.' });
    }
    next();
};

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management APIs
 */


/**
 * @swagger
 * /restaurant/restaurantDash:
 *   get:
 *     summary: Get restaurant dashboard
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant dashboard data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /restaurant/menu:
 *   get:
 *     summary: Get restaurant menu
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of menu items
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /restaurant/menu/delete/{id}:
 *   post:
 *     summary: Delete a menu item
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /restaurant/orders:
 *   get:
 *     summary: Get restaurant orders
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /restaurant/analytics:
 *   get:
 *     summary: Get restaurant analytics
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /restaurant/reviews:
 *   get:
 *     summary: Get restaurant reviews
 *     tags: [Restaurants]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: No reviews found
 *       500:
 *         description: Internal Server Error
 */


router.get('/restaurantDash', authenticateToken, restaurantOnly, restaurantControllers.renderDashboard);
router.get('/menu', authenticateToken, restaurantControllers.renderMenuManagement);
router.post('/menu/add', upload.single('image'), authenticateToken, restaurantControllers.addMenuItem);
router.post('/menu/update/:id', upload.single('image') ,authenticateToken,restaurantControllers.updateMenuItem);
router.post('/menu/delete/:id', authenticateToken ,restaurantControllers.deleteMenuItem);
router.get('/orders',authenticateToken,restaurantControllers.getRestaurantOrders);
router.put('/orders/:orderId/status', restaurantControllers.updateOrderStatus);
router.get('/analytics', authenticateToken, restaurantControllers.analytics);
router.get('/reviews', authenticateToken, restaurantControllers.reviews);


module.exports = router;