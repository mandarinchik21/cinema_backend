const catchAsync = require("../utils/catch_async");
const Movie = require("../models/movie");
const mongoose = require('mongoose');
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");



exports.getMovie = catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    });
});


exports.getMovies = catchAsync(async (req, res, next) => {
    const movies = await Movie.find();
    res.status(200).json({
        status: 'success',
        data: {
            movies
        }
    });
});


exports.createMovie = catchAsync(async (req, res, next) => {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            movie: newMovie
        }
    });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
    const deletedMovie = await Movie.deleteOne({id: req.body.id});
    res.status(201).json({
        status: 'success',
        data: {
            deletedMovie
        }
    });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id);
    movie.title = req.body.title || movie.title;
    movie.year = req.body.year || movie.year;
    movie.genres = req.body.genres || movie.genres;
    movie.language = req.body.language || movie.language;
    movie.trailerLink = req.body.trailerLink || movie.trailerLink;
    movie.actors = req.body.actors || movie.actors;
    movie.director = req.body.director || movie.director;
    movie.duration = req.body.duration || movie.duration;
    movie.rating = req.body.rating || movie.rating;
    movie.description = req.body.description || movie.description;
    movie.photoUrl = req.body.photoUrl || movie.photoUrl;
    
    await movie.save();
    res.status(201)
        .json({
            success: "success",
            movie
        });
});