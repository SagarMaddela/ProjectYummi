const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['completed', 'failed'], required: true },
    deliveryAddress: String,
}, { timestamps: true });

paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
