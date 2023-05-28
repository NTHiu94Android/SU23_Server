var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

//Connect db from config/db
const db = require('./config/db');
db.connect();

//Config notification
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAdminSdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', require('./routes/users'));
app.use('/address', require('./routes/address'));
app.use('/brands', require('./routes/brands'));
app.use('/categories', require('./routes/categories'));
app.use('/order-details', require('./routes/order-details'));
app.use('/orders', require('./routes/orders'));
app.use('/pictures', require('./routes/pictures'));
app.use('/products', require('./routes/products'));
app.use('/promotions', require('./routes/promotions'));
app.use('/reviews', require('./routes/reviews'));
app.use('/sub-products', require('./routes/sub-products'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
