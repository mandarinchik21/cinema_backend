const mongoose = require('mongoose');

const cinemaModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    quantityRows: {
        type: Number,
        required: true
    },
    quantityPlacesInRow: {
        type: Number,
        required: true
    }
});

const Cinema = mongoose.model('Cinema', cinemaModel);

module.exports = Cinema;