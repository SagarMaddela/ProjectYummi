const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true }, // 🔍 index + unique
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
}, { timestamps: true });



const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
