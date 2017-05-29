'use strict';

var conn = require('../config/database.js');

var User = {
	save: (params, callback) => {
		let query = 'INSERT INTO user SET ?';
		conn.query(query, params, callback)
			.on('error', function(err) {
		    // Handle error, an 'end' event will be emitted after this as well 
		    console.error('error => ', err);
		  });
	},
	findOne: (params, callback) => {
		let query = 'SELECT * FROM user WHERE name = ? LIMIT 1';
		conn.query(query, params, callback)
			.on('error', function(err) {
		    // Handle error, an 'end' event will be emitted after this as well 
		    console.error('error => ', err);
		  });
	}
}


module.exports = User;