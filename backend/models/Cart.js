const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to User model
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'MenuItem', // Reference to MenuItem model
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1, // Default quantity if not specified
            },
            restaurantId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Restaurant', // Reference to Restaurant model
            },
            addedAt: {
                type: Date,
                default: Date.now, // Timestamp when the item was added
            },
            specialInstructions: {
                type: String,
                default: '', // To allow users to add any special instructions for the item
            },
            imageUrl: {
                type: String,
                default: '', // URL for the item image
            },
        },
    ],
    totalAmount: {
        type: Number,
        default: 0, // Total amount of the cart
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the cart was created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the cart was last updated
    },
});

// Middleware to update the `updatedAt` field
cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
