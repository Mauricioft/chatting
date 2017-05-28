'use strict';

var bodyParser = require('body-parser');
var logger = require('morgan');
var helmet = require('helmet');

function setEnvironment(app, node_modules, src, assets, view){
	// all environments
	app.set('port', process.env.PORT || 8080);
	// Telling express where it can find the templates
	app.set('views', view);
	// Setting .html as the default template extension
	app.set('view engine', 'ejs'); 
	app.use(logger('dev'))
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({'extended':'true'}));            
	// set the static files location /public/img will be /img for users
	app.use('/lib', node_modules); 
	app.use('/src', src);
	app.use('/static', assets);
	app.use(helmet());
	app.disable('x-powered-by');
	app.set('trust proxy', 1) // trust first proxy	
}

module.exports = {
	setEnvironment
};