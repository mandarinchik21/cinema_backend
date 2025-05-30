const mongoose = require('mongoose');

const ticketModel = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.ObjectId,
        ref: "Session",
        required: true
    },
    movieId: {
        type: mongoose.Schema.ObjectId,
        ref: "Movie",
        required: true
    },
    paymentId: {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    place: {
        type: Number,
        required: true
    }
});


const Ticket = mongoose.model('Ticket', ticketModel);
module.exports = Ticket;