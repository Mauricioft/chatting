'use strict';

var express = require("express");
var path= require('path'); 
 
var method = config.prototype;

function config(app){
	// Setting .html as the default template extension
	app.set('view engine', 'ejs'); 
	// Telling express where it can find the templates
	app.set('views', path.join(__dirname, '../resource/views'));
	//Files 
	app.use('/lib', express.static('node_modules')); 
	app.use('/src', express.static('public/src/app')); 	
}

method.get_config=function(){
	return this;
}

module.exports = config;

