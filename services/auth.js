const {promisify} = require("util");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_err');
const bcrypt = require("bcrypt");
const email = require("../utils/mailer");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_TTL || '30m'
    });
}

const createSendToken = (user) => {
    const token = signToken(user._id);

    user.password = undefined;

    return token;
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const token = createSendToken(newUser);

    res.status(201).json({
        status: 'success',
        token,
        user: newUser
    });
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new AppError('Please provide email and password!', 401));

    const user = await User.findOne({ email }).select('+password');

    if (!user || !await bcrypt.compare(password, user.password)) return next(new AppError('Incorrect email or password', 401));

    const token = createSendToken(user);
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        user,
    });
});

exports.loginViaReservePassword = catchAsync(async (req, res, next) => {
    const { email, reservePassword } = req.body;
    console.log(email, reservePassword)

    if (!email || !reservePassword) return next(new AppError('Please provide email and password!', 401));

    const user = await User.findOne({ email : email }).select('+password +reservePassword');

    if (!user.reservePassword) return next(new AppError('There is no reserve password for this user', 401));
    if (!user || !await bcrypt.compare(reservePassword, user.reservePassword)) return next(new AppError('Incorrect email or password', 401));


    user.reservePassword = undefined;
    user.markModified("reservePassword");
    await user.save()

    const token = createSendToken(user);

    res.status(201).json({
        status: 'success',
        token,
        user,
    });
});


exports.createReservePassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) return next(new AppError("This email doesn't exist" , 401));

    const reservePassword = crypto.randomBytes(10).toString("hex");
    user.reservePassword = reservePassword

    user.markModified("reservePassword");
    await user.save()

    await email.sendReservePasswordEmail({
        email: user.email,
        subject: "Your reserve password",
        message: `Your reserve password ${reservePassword}`
    });

    res.status(201).json({
        status: 'success',
    });
});