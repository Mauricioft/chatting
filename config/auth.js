'use strict';

const jwt = require('jwt-simple'),
	  moment = require('moment'),
	  config = require('../config/config.json');

function createToken(user) {
	const payload = {
		sub: user.id,
		iat: moment().unix(),
		exp: moment().add(8, 'hours').unix()
	};

	// encode using HS512 
	return jwt.encode(payload, config.SECRET_TOKEN, 'HS512')
}

function decodeToken(token) {
	const decoded = new Promise((resolve, reject) => {
		try{
			const payload = jwt.decode(token, config.SECRET_TOKEN);
			// validar fecha de expedicion
			if(payload.exp <= moment().unix()){
				reject({
					status: 401,
					success: false, 
					error: 'Expired token' 
				});
			}
			resolve(payload.sub);
		} catch(err){
			reject({
				status: 500,
				success: false,
				error: 'Invalid token'
			});
		}
	});

	return decoded;
}

module.exports = {
	createToken,
	decodeToken
};