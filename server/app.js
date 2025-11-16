var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auctionsRouter = require('./routes/auctions');

var app = express();

// Enable CORS for all routes
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests only from this origin
  methods: 'GET,POST,PATCH,DELETE',             // Allow only GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
};
// Use CORS middleware with specified options
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize MongoDB connection (uses server/db/connection.js)
const dbConnection = require('./db/connection');
const { title } = require('process');
dbConnection.connect()
  .then(db => {
    // Attach db to app.locals so routes can access it via req.app.locals.db
    app.locals.db = db;
    console.log('MongoDB connected and available at app.locals.db');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    // don't crash the app here; the app can still respond but DB operations will fail until connected
  });

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auctions', auctionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;