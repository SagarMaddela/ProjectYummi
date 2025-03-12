const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, 
    message: {
        status: 429,
        error: 'Too many requests. Please try again later.'
    },
    headers: true, 
    standardHeaders: true, 
    legacyHeaders: false
});

module.exports = authLimiter;
