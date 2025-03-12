const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {

    // console.log(12345);
    const authHeader = req.headers.authorization;
    // console.log(1234567);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];  // Extract token from the 'Bearer <token>' format

    try {
        const secretKey = process.env.JWT_SECRET; // Use environment variable for secret key
        const decoded = jwt.verify(token, secretKey); // Verify and decode the token
        req.user = decoded;  // Attach the decoded token data (userId, role) to req.user
        // console.log(`Authenticated user ID: ${req.user.userId}`); 
        next();
    } catch (error) {
        console.error('Token verification failed:', error); // Log the error for debugging
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticateToken;
