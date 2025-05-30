const catchAsync = require("../utils/catch_async");
const User = require("../models/user");
const AppError = require("../utils/app_err");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const Ticket = require("../models/ticket");



exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    });
});



exports.getUserByToken = catchAsync(async (req, res, next) => {
    const token = req.params.token;

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id).select("+password");

    if (!currentUser) return next(new AppError("User don't exist", 401));

    const role = currentUser.role;
    const id = currentUser._id;


    res.status(201).json({
        status: 'success',
        user: currentUser,
        id,
        role
    });
});



exports.getUserTickets = catchAsync(async (req, res, next) => {
    const token = req.params.token;

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) return next(new AppError("User don't exist", 401));

    const tickets = await Ticket.find({userId: currentUser._id});

    return res.status(201).json({
        status: 'success',
        tickets
    });
});


exports.updateUser = catchAsync(async (req, res, next) => {
    const token = req.params.token;

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id);
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;

    user.markModified("name");
    await user.save();

    user.password = undefined;
    res.status(201)
        .json({
            success: "success",
            user
        });
});


exports.deleteUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let user = await User.findByIdAndDelete(id);
    res.status(201).json({
        status: 'success',
        user
    });
});



exports.getTokenAsParameter = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return next(new AppError('Token not found', 403));

    req.params.token = token;
    next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});