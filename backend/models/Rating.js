// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    score: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
