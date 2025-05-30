const mongoose = require('mongoose');

const paymentModel = new mongoose.Schema({
    emailCustomer: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const Payment = mongoose.model('Payment', paymentModel);
module.exports = Payment;