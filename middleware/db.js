// Requiring mysql node modules 
var mysql = require("mysql");

var method = db.prototype;

function db() {
	// Creating MySql database connection 
	var con = mysql.createPool({
		connectionLimit : 10,
		host : 'localhost',
  	user : 'root',
  	password : '',
  	database : 'chat'
	});

	this.connection = con;
}

method.getcon = function() {
	return this;
};

module.exports = db;
