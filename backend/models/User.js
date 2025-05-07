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
    phone: Number,
    role: { type: String, enum: ['user', 'admin', 'restaurant'], default: 'user' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
