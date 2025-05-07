const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        data: Buffer,
        contentType: String,
    },
    foodType: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
