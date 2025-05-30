const catchAsync = require('../utils/catch_async');
const Session = require('../models/session');
const Payment = require('../models/payment');
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');
const Ticket = require('../models/ticket');
const AppError = require("../utils/app_err");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const email = require('../utils/mailer');

exports.buyTicket = catchAsync(async (req, res, next) => {
    const emailPlace = req.body.emailPlace;

    const session = await Session.findById(req.body.sessionId)
        .populate({
            path: 'movieId',
            select: 'title _id photoUrl'
        })
        .populate({
            path: 'cinemaId',
            select: 'name _id'
        });

    if (!session) return next(new AppError("Session don't exist", 401));

    session.price = 100;
    const payment = await Payment.create({
        emailCustomer: req.body.email,
        tickets: [],
        totalPrice: (session.price - session.price * session.discount / 100) * Object.keys(emailPlace).length
    });

    for (var email of Object.keys(emailPlace)) {
        await Ticket.create({
            paymentId: payment._id,
            movieId: session.movieId._id,
            sessionId: session._id,
            place: emailPlace[email],
            email: email
        });
    }

    console.log(`${process.env.SERVER_URL}:${process.env.PORT}/pay/success`);

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.SERVER_URL}/pay/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SERVER_URL}/pay/cancel/{CHECKOUT_SESSION_ID}`,
        payment_method_types: ['card'],
        mode: 'payment',
        metadata: {
            sessionId: session._id.toString(),
            paymentId: payment._id.toString(),
            movieId: session.movieId._id.toString(),
            cinemaId: session.cinemaId._id.toString(),  
            sessionId: session._id.toString()
        },
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Ticket',
                        images: [session.movieId.photoUrl],
                    },
                    unit_amount: session.price * 100 - session.price * session.discount / 100,
                },
                quantity: Object.keys(emailPlace).length
            },
        ],
    });

    console.log(stripeSession.id);

    res.status(200).json({
        status: "success",
        stripeSession
    });
});


exports.checkoutSuccess = catchAsync(async (req, res, next) => {
    const stripeSession = await stripe.checkout.sessions.retrieve(req.params.sessionId)
    const payment = await Payment.findById(stripeSession.metadata.paymentId);
    const movie = await Movie.findById(stripeSession.metadata.movieId);
    const cinema = await Cinema.findById(stripeSession.metadata.cinemaId);
    const tickets = await Ticket.find({ paymentId: payment._id });
    const session = await Session.findById(stripeSession.metadata.sessionId);

    console.log(movie);
    console.log(cinema);
    console.log(session);

    payment.isPaid = true;
    await payment.save();


    for (var ticket of tickets) {
        await email.sendTicketEmail({ 
            email: ticket.email, 
            subject: 'Ticket', 
            message: `Your place is: place ${ticket.place} for movie <<${movie.title}>> in cinema <<${cinema.name}>> at ${session.date.getDate()}/${session.date.getMonth()}/${session.date.getFullYear()} ${session.time}` 
        });
    }   
    

    res.redirect(`${process.env.CLIENT_URL}`);
});


exports.checkoutCancel = catchAsync(async (req, res, next) => {
    const stripeSession = await stripe.checkout.sessions.retrieve(req.params.sessionId)
    const payment = await Payment.findById(stripeSession.metadata.paymentId);
    await Ticket.deleteMany({paymentId: payment._id});
    await Payment.findByIdAndDelete(payment._id);
    
    res.redirect(`${process.env.CLIENT_URL}`);
});



exports.getTicketsBySessionId = catchAsync(async (req, res, next) => {
    const { sessionId } = req.params;
    const tickets = await Ticket.find({ sessionId });

    res.status(200).json({
        status: 'success',
        data: {
            tickets
        }
    });
});
