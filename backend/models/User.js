// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
    phone:{type: Number},
    role: { type: String, enum: ['user', 'admin', 'restaurant'], default: 'user' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });



const User = mongoose.model('User', userSchema);
module.exports = User;
