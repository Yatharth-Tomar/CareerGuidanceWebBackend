const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleWare = require('./middleware/error.middleware');
//TO see who tried to accces the server
const morgan = require('morgan');
const userRoute = require('./routes/userRoute');
const courseRoute = require('./routes/courseRoute');
const paymentRoute = require('./routes/paymentRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

//to log the access of resources in the web app, its a middleware
app.use(morgan('dev'));

//for crossinf data between front end and backend

console.log(process.env.FRONTEND_URL);

app.use(cookieParser());

//all user related work
app.use('/api/v1/user', userRoute);

//all courses related work
app.use('/api/v1/courses', courseRoute);

app.use('/api/v1/payments', paymentRoute);

//check if the server is alive
app.use('/ping', (req, res) => {
  res.send('Pong');
});

//this should be at last
app.all('*', (req, res) => {
  res.status(404).send('OOPS! 404 page not found :(');
});

app.use(errorMiddleWare);

module.exports = app;
