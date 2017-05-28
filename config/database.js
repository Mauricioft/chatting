'use strict';

// Requiring mysql node modules 
var mysql = require('mysql'), 
		conf = require('./db_config');

const options = {
  host: conf.mysql.host,
  port: conf.mysql.port,
  user: conf.mysql.user,
  password: conf.mysql.password,
  database: conf.mysql.database
};

var connection = mysql.createConnection(options);

connection.connect((err) => {
  return (err) ? console.error('Error connecting: ' + err.stack) : console.log('Connected as id ' + connection.threadId);
});

module.exports = connection;