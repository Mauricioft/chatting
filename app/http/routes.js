'use strict';

var auth = require('./controllers/authController.js');

module.exports = function(app){
	// Definimos la ruta principal
	app.get('/', (req, res, next) => res.render('index'));

	app.post('/singin', (req, res, next) => auth.signIn(req, res, next));
}