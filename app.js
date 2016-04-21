var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var config = require('./config');
ios = require('socket.io-express-session');
session = require("express-session")(config.session);



// imports for routes
var routes = require('./routes/index');
var user = require('./routes/user');
var chatroom = require('./routes/chatroom');
var create_room = require('./routes/create_room');
var connection = require('./connection');

// session

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// port
app.set('port', config.server_port);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);

var server = http.createServer(app)
io = require("socket.io").listen(server);
Rooms = []


// app.set("rooms",["one","two"]);

app.get('/', routes);
app.use('/chatroom', chatroom);
app.use('/create_room', create_room);

server.listen(config.server_port, config.server_ip_address, function () {
  console.log( "Listening on " + config.server_ip_address + ", server_port " + config.server_port );
});
io.use(ios(session));

io.on('connection',connection.userConnection);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
