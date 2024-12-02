const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/userrestaurants' , userController.renderUserRestaurants);
router.get('/:id/menu',userController.getRestaurantMenuItems);
router.get('/getUser',authenticateToken, userController.getUserInformation);
router.get('/orderhistory', authenticateToken, userController.getOrderHistory);
router.get('/activeorders', userController.getActiveOrders);
router.patch('/cancelorder/:orderId', userController.cancelOrder);
router.get('/getprofile',authenticateToken,userController.getUserProfile);
router.put('/updateprofile',authenticateToken,userController.updateUserProfile);
router.put('/submitreview',authenticateToken,userController.review);

module.exports = router;