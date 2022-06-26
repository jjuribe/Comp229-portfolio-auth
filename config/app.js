/* 
Jose Uribe
Centennial College
juribeco@my.centennialcollege.ca
301236090
COMP229
June 2022
*/

//3rd party modules
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');


//routes
let indexRouter = require('../routes/index');
let projectsRouter = require('../routes/projects');
let aboutmeRouter = require('../routes/aboutme');
let servicesRouter= require('../routes/services')


const { Console } = require('console');


let app = express();


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));
app.use('/', indexRouter);
app.use('/projects',projectsRouter);
app.use('/aboutme',aboutmeRouter);
app.use('/services',servicesRouter);

app.use('*/images',express.static('public/Assets/images'));



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
  res.render('error',{ title: 'Error' });
});

module.exports = app;
