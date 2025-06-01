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
    const { emailPlace, email, sessionId } = req.body;

    const session = await Session.findById(sessionId)
        .populate({
            path: 'movieId',
            select: 'title _id photoUrl'
        })
        .populate({
            path: 'cinemaId',
            select: 'name _id'
        });

    if (!session) return next(new AppError("Session doesn't exist", 401));

    const discountedPrice = session.price - session.price * session.discount / 100;
    const unitAmount = Math.round(discountedPrice * 100);
    const totalQuantity = Object.keys(emailPlace).length;
    const totalPrice = discountedPrice * totalQuantity;

    const payment = await Payment.create({
        emailCustomer: email,
        tickets: [],
        totalPrice
    });

    for (const email of Object.keys(emailPlace)) {
        await Ticket.create({
            paymentId: payment._id,
            movieId: session.movieId._id,
            sessionId: session._id,
            place: emailPlace[email],
            email
        });
    }

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
        },
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Ticket',
                        images: [session.movieId.photoUrl],
                    },
                    unit_amount: unitAmount,
                },
                quantity: totalQuantity
            },
        ],
    });

    res.status(200).json({
        status: "success",
        stripeSession
    });
});

exports.checkoutSuccess = catchAsync(async (req, res, next) => {
    console.log('Checkout success called');
    const stripeSession = await stripe.checkout.sessions.retrieve(req.params.sessionId)

    const payment = await Payment.findById(stripeSession.metadata.paymentId);
    const movie = await Movie.findById(stripeSession.metadata.movieId);
    const cinema = await Cinema.findById(stripeSession.metadata.cinemaId);
    const tickets = await Ticket.find({ paymentId: payment._id });
    const session = await Session.findById(stripeSession.metadata.sessionId);

    payment.isPaid = true;
    await payment.save();


    for (var ticket of tickets) {
        try {
            await email.sendTicketEmail({ 
                email: ticket.email, 
                subject: 'Ticket', 
                message: `Your place is: place ${ticket.place} for movie <<${movie.title}>> in cinema <<${cinema.name}>> at ${session.date.getDate()}/${session.date.getMonth()}/${session.date.getFullYear()} ${session.time}` 
            });
            console.log(`Email sent to ${ticket.email}`);
        } catch (err) {
            console.error(`Failed to send email to ${ticket.email}:`, err);
        }
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
