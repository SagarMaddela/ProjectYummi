const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    reviewText: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    images: [{ type: String }],
}, { timestamps: true });

// Indexes
reviewSchema.index({ restaurant: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ order: 1 }, { unique: true }); // Prevent multiple reviews per order

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
