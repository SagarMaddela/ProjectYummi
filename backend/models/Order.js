// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            quantity: { type: Number, required: true },
            review: { type: String }, // Optional review for the item
            rating: { type: Number, min: 1, max: 5 }, // Optional rating for the item
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }, // General review for the order
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
