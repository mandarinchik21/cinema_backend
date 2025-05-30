const catchAsync = require("../utils/catch_async");
const Session = require("../models/session");
const Movie = require("../models/movie");
const AppError = require("../utils/app_err");


exports.getSession = catchAsync(async (req, res, next) => {
    const session = await Session.findById(req.params.id);
    // const tickets = await Ticket.find({sessionId: session._id});
    // const boughtPlaces = tickets.map(ticket => ticket.place);
    res.status(200).json({
        status: 'success',
        data: {
            session,
            // boughtPlaces
        }
    });
});

exports.getAllSessions = catchAsync(async (req, res, next) => {
    const sessions = await Session.find();
    res.status(200).json({
        status: 'success',
        data: {
            sessions
        }
    });
});

exports.createSession = catchAsync(async (req, res, next) => {
    const createdSession = await Session.find({movieId: req.body.movieId});
    if(createdSession) return new AppError('Session for this movie already exists', 400);
    const newSession = await Session.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newSession
        }
    });
});
exports.deleteSession = catchAsync(async (req, res, next) => {
    const deletedSession = await Session.deleteOne({id: req.body.id});
    res.status(201).json({
        status: 'success',
        data: {
            deletedSession
        }
    });
});

exports.updateSession = catchAsync(async (req, res, next) => {
    const session = await Session.findById(req.params.id);
    session.movieId = req.body.movieId || session.movieId;
    session.cinemaId = req.body.cinemaId || session.cinemaId;
    session.date = req.body.date || session.date;
    
    session.discount = req.body.discount || session.discount;
    session.price = req.body.price || session.price;
    session.time = req.body.time || session.time;
    session.quantityAvailablePlaces = req.body.quantityAvailablePlaces || session.quantityAvailablePlaces;

    await session.save();

    res.status(201)
        .json({
            success: "success",
            session
        });
});