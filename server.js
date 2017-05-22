'use strict';

/*requiring node modules starts */
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

// all environments
app.set('port', process.env.PORT || 3000);
// Telling express where it can find the templates
app.set('views', path.join(__dirname, 'resource/views'));
// Setting .html as the default template extension
app.set('view engine', 'ejs'); 
app.use(logger('dev'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));            
// set the static files location /public/img will be /img for users
app.use('/lib', express.static(__dirname+'/node_modules')); 
app.use('/src', express.static(__dirname+'/public/src/app'));
app.use('/static', express.static(__dirname+'/public/src/assets'));
app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1) // trust first proxy

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

/* requiring config file starts*/
// var config =require('./middleware/config.js')(app);
/* requiring config file ends*/

/* requiring config db.js file starts*/
var db = require("./middleware/db.js");
var connection_object = new db();
var connection = connection_object.connection; // getting conncetion object here 
/* requiring config db.js file ends*/


/* 
	1. Requiring auth-routes.js file, which takes care of all Login & Registration page operation.
	2. Passing object of express, Database connection, expressSession and cookieParser.
	3. auth-routes.js contains the methods and routes for Login and registration page. 
*/
require('./middleware/auth-routes.js')(app,connection,Session,cookieParser,sessionInfo);
/* 
	1. Requiring routes.js file, which takes handles the Home page operation.
	2. Passing object of express, Database connection and object of socket.io as 'io'.
	3. routes.js contains the methods and routes for Home page  
*/
require('./middleware/routes.js')(app,connection,io,Session,cookieParser,sessionInfo);

/*
	Running our application  
*/
server.listen(app.get('port'), () => {
  console.log("Listening on http://127.0.0.1:"+app.get('port'));
});