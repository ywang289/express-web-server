var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/hello');
var classRouter = require('./routes/class');
var articalRouter= require('./routes/artical')
var meRouter= require('./routes/me')
var dataRouter= require('./routes/data')
var bicycleRouter= require('./routes/boat')
var otherRouter= require("./routes/other")
var todoRouter= require("./routes/todos")
var paraRouter= require("./routes/para")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.use(function (req, res, next){
  console.log(req.socket.remoteAddress)
  if (req.socket.remoteAddress ==="111.34.55.211"){
    console.log("here")
    const err= new Error(' Forbidden')
    err.status=403
    next(err)
    return
  }
  next();
})
 

app.use('/', indexRouter);
app.use('/hello', usersRouter);
app.use('/class', classRouter);
app.use('/artical', articalRouter);
app.use('/data', dataRouter);
app.use('/me', meRouter);
app.use('/other', otherRouter);

app.use('/boat', bicycleRouter);
app.use('/todos', todoRouter);
app.use("/para", paraRouter);

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
