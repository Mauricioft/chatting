'use strict';

var auth = require('./controllers/authController.js');
var authenticate = require('./middleware/authenticate.js');

module.exports = function(app){
	// Definimos la ruta principal
	app.get('/', (req, res, next) => res.render('index'));

	app.post('/singin', (req, res, next) => auth.signIn(req, res, next));
	app.post('/singup', (req, res, next) => auth.signUp(req, res, next));
	app.post('/private', authenticate.isAuth, (req, res, next) => {
		res.status(200).send({success: true, error: 'You have access' });
	});
}