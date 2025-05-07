const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true // 🔍 Index userId
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'MenuItem'
            },
            restaurantId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Restaurant',
                index: true // 🔍 Index inside embedded array
            },
            name: String,
            description: String,
            price: Number,
            quantity: { type: Number, default: 1 },
            addedAt: { type: Date, default: Date.now },
            specialInstructions: { type: String, default: '' },
            imageUrl: { type: String, default: '' },
        },
    ],
    totalAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field
cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
