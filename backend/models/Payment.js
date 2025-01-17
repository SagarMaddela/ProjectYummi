const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['completed', 'failed'], required: true },
    deliveryAddress : {type: String}
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
