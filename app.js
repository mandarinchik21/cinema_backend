const  express = require('express');
const  cookieParser = require('cookie-parser');
const morgan = require('morgan');
const AppError = require('./utils/app_err');
const errorHandler = require("./services/error");
const cors = require("cors");
const movieRouter = require("./routers/movie");
const cinemaRouter = require("./routers/cinema");
const userRouter = require("./routers/user");
const sessionRouter = require("./routers/session");
const payRouter = require("./routers/payment");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/movie", movieRouter);
app.use("/user", userRouter);
app.use("/cinema", cinemaRouter);
app.use("/pay", payRouter)
app.use("/session", sessionRouter);

app.use(errorHandler);

app.all('*', (req, res, next) => {
    next(new AppError(`Can not find this URL on this server!`, 404));
});


module.exports = app;
