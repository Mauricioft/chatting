'use strict';

// requiring node modules starts 
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path= require('path'); 
var Session = require('express-session');
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser');
var io = require("socket.io").listen(server);
var helmet = require('helmet');
var logger = require('morgan');
var env = require('./config/app.js');
var router = require('./app/http/routes.js');
const view = path.join(__dirname, 'resource/views');
const node_modules = express.static(__dirname+'/node_modules');
const src = express.static(__dirname+'/public/src/app');
const assets = express.static(__dirname+'/public/src/assets');

env.setEnvironment(app, node_modules, src, assets, view);
router(app); 
/*
var Session= Session({
	secret:'s3Cur3',
	saveUninitialized: true,
	resave: true
});

io.use((socket, next) => {
	Session(socket.request, socket.request.res, next);
});

app.use(Session);

var sessionInfo;

// requiring config file starts
var config =require('./middleware/config.js')(app);

// requiring config db.js file starts
var db = require("./middleware/db.js");
var connection_object = new db();
var connection = connection_object.connection; // getting conncetion object here 



1. Requiring auth-routes.js file, which takes care of all Login & Registration page operation.
2. Passing object of express, Database connection, expressSession and cookieParser.
3. auth-routes.js contains the methods and routes for Login and registration page. 
require('./middleware/auth-routes.js')(app, connection, Session, cookieParser, sessionInfo);

1. Requiring routes.js file, which takes handles the Home page operation.
2. Passing object of express, Database connection and object of socket.io as 'io'.
3. routes.js contains the methods and routes for Home page  
require('./middleware/routes.js')(app, connection, io, Session, cookieParser, sessionInfo);
*/
/*
	Running our application  
*/
server.listen(app.get('port'), function() {
  console.log("Listening on http://localhost:"+app.get('port'));
});