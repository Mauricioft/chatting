'use strict';

var conn = require('../config/database.js'),
		User = () => {};

User.save = (params, callback) => conn.query('INSERT INTO user SET', params, callback);

User.findOne = (params, callback) => {
	var query = 'SELECT * FROM user WHERE name = ? LIMIT 1';
	conn.query(query, params, callback);
}

module.exports = User;