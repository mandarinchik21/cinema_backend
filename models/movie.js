const mongoose = require('mongoose');

const movieModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genres: [{
        type: String,
        enum: ["Action", "Sci-Fi", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller", "Western", "Science Fiction", "Crime", "Romance", "Animation", "Family", "War", "History", "Music", "Documentary", "Sport", "Biography", "Musical", "Short", "Film-Noir"],
        required: true
    }],
    language: {
        type: String,
        required: true
    },
    trailerLink: {
        type: String,
        required: true
    },
    actors: [{
        type: String,
        required: true
    }],
    director: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieModel);
module.exports = Movie;