'use strict';
 
const user = require('../../user.js'), 
		auth = require('../../../config/auth.js'), 
		jwt = require('jwt-simple'),
	  moment = require('moment'),
		AuthController = () => {};

AuthController.signIn = (req, res, next) => {
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
			
	    res.status(201).send({
	    	success: true,
				error: null,
				is_logged: true,
        token: createToken(result[0])
      });
		});
  } catch (e) {
    res.status(500).send({success: false, error: 'Something failed!' });
  }	
}



AuthController.signUp = (req, res, next) => {
	try {
		
	} catch (e) {
    res.status(400).send('Invalid JSON string');
  }	
}

function createToken(user) {
	const payload = {
		id: user.id,
		iat: moment().unix(),
		exp: moment().add(1, 'days').unix()
	};

	// encode using HS512 
	return jwt.encode(payload, auth.SECRET_TOKEN, 'HS512')
}

module.exports = AuthController;