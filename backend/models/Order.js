const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            quantity: { type: Number, required: true },
            review: String,
            rating: { type: Number, min: 1, max: 5 },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
}, { timestamps: true });

orderSchema.index({ user: 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
