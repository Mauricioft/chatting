'use strict';

// requiring node modules starts 
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs'); 
var path = require('path');

/*Telling Multer where to upload files*/
var upload = multer({ dest: '../public/src/assets/uploads' });

var method = routes.prototype;

function routes(app, connection, sessionInfo){
	
	var file_path = '';
	app.use(bodyParser.urlencoded({ extended: true })); 
	app.use(bodyParser.json());

	app.get('/', function(req, res){
		sessionInfo = req.session;
		try {
			/*Render Login page If session is not set*/
			if(sessionInfo.uid){
				console.log('SI', sessionInfo.uid);
				res.redirect('/home#?id='+sessionInfo.uid);
			}else{
				console.log('NO', sessionInfo.uid);
				res.render("index");	
			}
    } catch (e) {
      res.status(400).send('Invalid JSON string');
    }
	});

	// post to handle Login request
	app.post('/login', function(req, res){ 
		sessionInfo = req.session; 
		try {
			var set_online = {};
			var result_send = {};
			var username = req.body.username;
			var password = req.body.password;

			// var query_ = "select * from user where password='"+password+"' and name='"+username+"'";
			var query_ = 'select * from user where password = ? and name = ?';
			var params = [password, username];
			
			var data = {
				'query': query_test,
				'params': params,
				'connection': connection
			};

			// Calling query_runner to run  SQL Query
			query_runner(data, function(result){
				var uid = '';	

				console.log('result', result);		

				result.forEach(function(element, index, array){
					uid = element.id;
				});

				if(result.length > 0) {
					//setting session
					sessionInfo.uid = uid;

					set_online = {
						query: "update user set online='Y' where id='"+uid+"'",
						connection: connection
					} 

					query_runner(set_online, function(result_online){});	
					
					result_send = {
		    		is_logged: true,
		    		id: uid,
		    		msg: "OK"
				  };	    	

		    } else {
		    	result_send = {
		    		is_logged: false,
		    		id: null,
		    		msg:"BAD"
		    	};
		    }
			  // Sending response to client
			  res.write(JSON.stringify(result_send));
				res.end();
			});
		} catch (e) {
      res.status(400).send('Invalid JSON string');
    }
	});

	// post to handle username availability request
	app.post('/check_name', function(req, res){
		var username = req.body.username;		
		var query = 'select * from user where name = ?';
		var params = [username];
		var result_send = {};
		var data={
			query: query,
			params: params,
			connection:connection
		}
		query_runner(data, function(result){
			
			if(result.length > 0) {
		    	result_send = {
		    		msg:true
		    	};
		    } else {
		    	result_send={
		    		msg:false
		    	};
		    } 
		    res.write(JSON.stringify(result_send));
			 res.end();
		});
	});

	// post to Register username request
	app.post('/register', upload.single('file'), function(req, res, next){

		sessionInfo = req.session;
		// Multer file upload starts
		console.log('req.file => ', req.file);
		console.log('req.body.username => ', req.body.username);
		var result_send = {
  		is_logged: false,
  		id: null,
  		msg: 'BAD'
  	};
		var file_name = '/uploads/';
		var query = 'INSERT INTO user SET id = ?, name = ?, password = ?, p_photo = ?, timestamp = ?, online = ?';
		
		if(typeof req.file != 'undefined'){
			var file_path = '../public/src/assets/uploads' + Date.now()+req.file.originalname;
			var file_name = file_name + Date.now()+req.file.originalname;
			var temp_path = req.file.path;
			
			var src = fs.createReadStream(temp_path);
			var dest = fs.createWriteStream(file_path);		
			src.pipe(dest); 

			src.on('end', function() {
				// When uploading of file completes, Insert the user.
				var params = ['', req.body.username, req.body.password, file_name, Math.floor(new Date() / 1000), 'Y'];

				var data = {
					query: query,
					params: params,
					connection:connection
				};		

				query_runner(data, function(result){
					// storing session ID
					sessionInfo.uid = result.insertId;

					if(result) {
						result_send = {
			    		is_logged: true,
			    		id: result.insertId,
			    		msg: 'OK'
			    	};
					}

					res.write(JSON.stringify(result_send));
					res.end();		
				});
			});
			src.on('error', function(err) { 
				// Sending Error 
				res.write(JSON.stringify("Error"));
				res.end(); 
			});
		}else{
			// When uploading of file completes, Insert the user.
			var params = ['', req.body.username, req.body.password, file_name, Math.floor(new Date() / 1000), 'Y'];

			var data = {
				query: query,
				params: params,
				connection:connection
			};		

			console.log('runner', data);
			query_runner(data, function(result){		
				// storing session ID
				console.log('result runner', result);
				sessionInfo.uid = result.insertId;
				if(result) {
					result_send = {
		    		is_logged: true,
		    		id: result.insertId,
		    		msg: 'OK'
			    };
				}
				res.write(JSON.stringify(result_send));
				res.end();		
			});
		}
	});
}


method.getroutes = function(){
	return this;
}

module.exports = routes;
 
// Making query_runner function to Run mysl queries
var query_runner = function(data, callback){

	var db_conncetion = data.connection;
	var query = data.query; 
	var params = data.params; 
	var insert_data = data.insert_data;

	db_conncetion.getConnection(function(err, con){
		if (err) {
	    callback({"code" : 100, "status" : "Error in connection database"});
	    return;
	  }

		db_conncetion.query(String(query), params, function(err, rows){
			con.release();
      if(!err) {
        callback(rows);
      }      
	  });

	  db_conncetion.on('error', function(err) {      
	  	callback({"code" : 100, "status" : "Error in connection database"});
	  	return;     
	  });
	});
} 