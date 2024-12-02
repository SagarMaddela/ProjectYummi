const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require('./routes/adminRoutes');
const restaurantRoutes = require('./routes/resRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

connectDB();



app.use(cors({
   origin: 'http://localhost:3000', // Replace with your frontend URL
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// app.get('/test', (req, res) => {
//     res.send('API is working');
// });

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart',cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
