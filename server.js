const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
// const v1 = require('./route/v1');

const app = express();

// const models = require('./models');

const CONFIG = require('./config/config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Passport
app.use(passport.initialize());

// Setup routes and handle errors

// app.use('/v1', v1);


app.use('/', (req, res) => {
  // Send status code
  res.statusCode = 200;
  res.json({ 
    status: 'success', 
    message: 'Parcel Pending API', 
    data: {}
  });
});

// Catch 404 and forward to errors handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Setup promise handler
process.on('unhandledRejection', err => {
  console.log('Uncaught Error', pe(err));
});

