const mongoose = require('mongoose');
const MenuItem = require('./MenuItem'); // Import the MenuItem model

const restaurantSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }, // Add password field
    address: { type: String, required: true },
    deliveryRadius: { type: Number, required: true },
    businessHours: { type: String, required: true },
    restaurantDescription: { type: String }, // Optional: If needed
    logo: { type: String },
    menuImages: [{ type: String }],
    foodLicense: { type: String },
    healthCertification: { type: String },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }], // Reference to MenuItem model
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    role: { type: String, default: 'restaurant' },
    status : { type: String, default: 'pending'},
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
