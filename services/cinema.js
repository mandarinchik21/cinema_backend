const Cinema = require('../models/cinema');
const catchAsync = require('../utils/catch_async');
const Session = require("../models/session");
const Movie = require("../models/movie");


exports.getAllCinemas = catchAsync(async (req, res, next) => {
    const cinemas = await Cinema.find();
    res.status(200).json({
        status: 'success',
        data: {
            cinemas
        }
    });
});

exports.createCinema = catchAsync(async (req, res, next) => {
    const newCinema = await Cinema.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newCinema
        }
    });
});

exports.updateCinema = catchAsync(async (req, res, next) => {
    const cinema = await Cinema.findById(req.params.id);
    cinema.name = req.body.name || cinema.name;
    cinema.location = req.body.location || cinema.location;
    cinema.quantityRows = req.body.quantityRows || cinema.quantityRows;
    cinema.quantityPlacesInRow = req.body.quantityPlacesInRow || cinema.quantityPlacesInRow;

    await cinema.save();

    res.status(201)
        .json({
            success: "success",
            cinema
        });
});

exports.getCinema = catchAsync(async (req, res, next) => {
    const cinema = await Cinema.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            cinema
        }
    });
});

exports.deleteCinema = catchAsync(async (req, res, next) => {
    const deletedCinema = await Cinema.deleteOne({id: req.body.id});
    res.status(201).json({
        status: 'success',
        data: {
            deletedCinema
        }
    });
});