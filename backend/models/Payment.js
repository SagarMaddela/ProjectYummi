const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['completed', 'failed'], required: true },
    deliveryAddress: { type: String }
}, { timestamps: true });

// Indexes
PaymentSchema.index({ orderId: 1 }, { unique: true }); // One payment per order
PaymentSchema.index({ userId: 1 }); // User payment history
PaymentSchema.index({ transactionId: 1 }, { unique: true }); // Ensure uniqueness

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
