'use strict';

const config = require('../../../config/config.json'),
	  auth = require('../../../config/auth.js');

var Authenticate = {
	isAuth: (req, res, next) => {
		try {
			if(!req.headers.authorization){
				return res.status(403).send({success: false, error: 'You do not have authorization' }); // 403 de no autorizacion
			}
			const token = config.SECRET_TOKEN.split(' ')[1];
			console.log('isAuth token => ', token);
			auth.decodeToken(token)
				.then(response => {
					req.user = response;
					next();
				})	
				.catch(response => {
					res.status(response.status);
				});
		} catch (e) {
	    res.status(500).send({success: false, error: 'Something failed!' });
	  }	
	}
}

module.exports = Authenticate;