const mongoose = require('mongoose');

const sessionModel = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.ObjectId,
        ref: "Movie",
        required: true
    },
    cinemaId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cinema',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    quantityAvailablePlaces: {
        type: Number,
        required: true
    }
});

const Session = mongoose.model('Session', sessionModel);
module.exports = Session;