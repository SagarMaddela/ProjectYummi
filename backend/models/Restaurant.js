const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    deliveryRadius: { type: Number, required: true },
    businessHours: { type: String, required: true },
    restaurantDescription: String,
    logo: {
        data: Buffer,
        contentType: String,
    },
    foodLicense: {
        data: Buffer,
        contentType: String,
    },
    healthCertification: {
        data: Buffer,
        contentType: String,
    },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    role: { type: String, default: 'restaurant' },
    status: { type: String, default: 'pending' },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

restaurantSchema.index({ email: 1 }, { unique: true });
restaurantSchema.index({ restaurantName: 1 });
restaurantSchema.index({ status: 1 });
restaurantSchema.index({ address: 'text', restaurantName: 'text' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
