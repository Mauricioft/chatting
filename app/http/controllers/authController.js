'use strict';
 
const user = require('../../user.js'), 
		moment = require('moment'),
		auth = require('../../../config/auth.js');

var AuthController = {
	signIn: (req, res, next) => {
		try {
			if (!req.body.username || !req.body.password) {
		    return res.status(400).send("You must send the username and the password");
		  }

		  var username = req.body.username;
			let params = [ username ];

			user.findOne(params, (err, result) => {
				console.log('findOne result', result[0]);
				console.log('findOne err', err);
				if (typeof err != 'object') {
		      return res.status(401).send({success: false, error: 'Record not found'});
		    }

		    if (!result[0]) {
		      return res.status(401).send({success: false, error: 'The username is not existing'});
		    }

		    if (result[0].password !== req.body.password) {
		      return res.status(401).send({success: false, error: "The username or password don't match"});
		    }
				
		    res.status(200).send({
		    	success: true,
					error: null,
					is_logged: true,
	        token: auth.createToken(result[0])
	      });
			});
	  } catch (e) {
	    res.status(500).send({success: false, error: 'Something failed!' });
	  }	
	},
	signUp: (req, res, next) => {
		try {
			if (!req.body.username || !req.body.password) {
		    return res.status(400).send("You must send the username and the password");
		  }

		  const file_name = '/uploads/';
		  const username = req.body.username;
		  const password = req.body.password;

			var params = {name: username, password: password, p_photo: file_name, timestamp: moment().format('YYYY-MM-DD hh:mm:ss'), online: 'Y'};

			user.findOne(username, (errUser, resultUser) => {
				console.log('findOne resultUser', resultUser[0]);
				console.log('findOne errUser', errUser);
				console.log('params', params);
				if (typeof errUser != 'object') {
		      return res.status(401).send({success: false, error: 'Record not found'});
		    }
		    
				if (typeof resultUser[0] != 'undefined') {
			    if (resultUser[0].name === username) {
			      return res.status(401).send({success: false, error: 'Verify username'});
			    }
				}

				user.save(params, (err, result) => {
					console.log('save result', result);
					console.log('save err', err);
					if (typeof err != 'object') {
			      return res.status(401).send({success: false, error: 'Record not found'});
			    }				
			    res.status(200).send({
			    	success: true,
						error: null,
						is_logged: true,
		        token: auth.createToken(result.insertId)
		      });
				});
			});
		} catch (e) {
	    res.status(500).send({success: false, error: 'Something failed!' });
	  }	
	}
}
 
module.exports = AuthController;