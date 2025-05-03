// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const authRoutes = require("./routes/authRoutes")
// const adminRoutes = require('./routes/adminRoutes');
// const restaurantRoutes = require('./routes/resRoutes');
// const userRoutes = require('./routes/userRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const requestLogger = require('./middleware/Logger');
// const { errorHandler, routenotFoundHandler } = require('./middleware/errorHandler'); 
// const morgan = require('morgan');
// const swaggerDocs = require('./config/swagger');
// require('dotenv').config();


// const app = express();
// swaggerDocs(app);

// // connectDB();

// // Connect to DB (Skip in test environment)
// if (process.env.NODE_ENV !== 'test') {
//     connectDB();
// }

// app.use(cors({
//    origin: 'http://localhost:3000',
//    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
// }));

// app.use(requestLogger);
// app.use(morgan('dev'));

// app.use(express.urlencoded({ extended: false }));


// app.use(express.json());
// app.use('/uploads', express.static('uploads'));



// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/restaurant', restaurantRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/cart',cartRoutes);


// // Health check
// app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// app.get("/test-error", (req, res, next) => {
//     const err = new Error("This is a test error!");
//     err.status = 500;
//     next(err); // Passes error to the middleware
// });



// app.use(routenotFoundHandler); 
// app.use(errorHandler);  


// if (process.env.NODE_ENV !== 'test') {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }


// server.js
const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
