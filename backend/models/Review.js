// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // Link to the Order
    reviewText: { type: String, required: false }, // Review text is optional
    rating: { type: Number, min: 1, max: 5, required: true }, // Rating is required
    images: [{ type: String }], // Array of image URLs (optional)
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
