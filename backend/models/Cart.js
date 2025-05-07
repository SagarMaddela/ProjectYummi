const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
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
}, { timestamps: true });

cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
