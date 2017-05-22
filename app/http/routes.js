'use strict';

module.exports = function(app){
	// Definimos la ruta principal
	app.get('/', function(req, res){
		res.render('index');
	});
}