"use strict";

var bodyParser = require('body-parser');
// Requiere que el archivo Helper funcione funciones auxiliares
var helper = require('./helper');
exports.helper = helper;

var method = routes.prototype;

function routes(app,connection,io,sessionInfo){
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	// Creando una matriz de usuarios.
	var users=[];
	var uid=""; 


	/*
		Socket evento comienza
	*/
	io.on('connection', (socket) => {

		var uIdSocket=socket.request.session.uid;

			// Almacenamiento de usuarios en matriz como objeto
	    socket.on('userInfo', (userinfo) => {

	    	// Adición de usuario de socket único en la matriz de 'usuarios'
				var should_add=true;

	    	if(users.length == 0){
	    		userinfo.socketId=socket.id;
	    		users.push(userinfo);
	    	}else{
	    		users.forEach( (element, index, array) => {
	    			if(element.id == userinfo.id){
			    		should_add=	false;	    		
			    	}
				});
				if (should_add) {
					userinfo.socketId=socket.id;
	    			users.push(userinfo);
			    };
	    	}

	    	var data={
					query:"update user set online='Y' where id='"+userinfo.id+"'",
					connection:connection
				}

				helper.queryRunner(data, (result) => {
					// Envío de lista de usuarios a todos los usuarios
					users.forEach(function(element, index, array){
		    		helper.getUserChatList(element.id,connection, (dbUsers) => {
		    			if(dbUsers === null){
		    				io.to(element.socketId).emit('userEntrance',users);
		    			}else{
		    				helper.mergeUsers(users,dbUsers,'no', (mergedUsers) => {
		    					io.to(element.socketId).emit('userEntrance',mergedUsers);
		    				});
		    			}	    			
		    		});
					});
				}); 

	    	should_add=true;
	    });    

	   	// 'SendMsg' guardará los mensajes en DB.
	   	socket.on('sendMsg', (data_server) => {

	    	// Llamando a saveMsgs para guardar mensajes en DB.
	    	helper.saveMsgs(data_server,connection, (result) => {

	    		// Verificando usuario está desconectado o no
	    		if(data_server.socket_id==null){
	    			
	    			// Si está fuera de línea, actualice la lista de Chat del remitente.
	    			var singleUser=users.find( (element) => { return element.id == data_server.from_id; });	

	    			// Llamar 'getUserChatList' para obtener la lista de chat de usuario
						helper.getUserChatList(singleUser.id,connection, (dbUsers) => {
			    		if(dbUsers === null){
			    			io.to(singleUser.socketId).emit('userEntrance',users);
			    		}else{
			    			// Llamar a 'mergeUsers' para combinar usuarios en línea y fuera de línea
			    			helper.mergeUsers(users,dbUsers,'no', (mergedUsers) => {
			    				io.to(singleUser.socketId).emit('userEntrance',mergedUsers);
			    			});
			    		}	    			
			    	});
				}else{
					// Si Online envía mensaje al receptor.
	    		io.to(data_server.socket_id).emit('getMsg',result);
	    	}
	    });	    	  	    
	  });

    // Enviar notificación de escritura al usuario.
    socket.on('setTypingNotification', (data_server) => {	    			
    	io.to(data_server.data_socket_fromid).emit('getTypingNotification',data_server);
    });

    // Quitar usuario cuando el usuario se desconecta
    socket.on('disconnect', () => {
    	var spliceId="";
    	for(var i=0;i<users.length;i++){
				if(users[i].id==uIdSocket){
					if(users[i].socketId==socket.id){					
					  var data={
							query:"update user set online='N' where id='"+users[i].id+"'",
							connection:connection
						}
						spliceId=i;
						helper.queryRunner(data, (result) => {
							users.splice(spliceId,1); // Eliminación de un solo usuario
							io.emit('exit',users[spliceId]);
						});
					}
				}				
			} 
		});
	});
	// Evento de socket termina

	// Llegar a hacer Página de inicio
	app.get('/home', (req, res) => {
		sessionInfo=req.session;
		if(!sessionInfo.uid){
			res.redirect("/");	
			res.end();	
		}else{
			/*res.redirect('/home#?id='+sessionInfo.uid);*/
			res.render('home');
			res.end();
		}
	});

	// Publicar para manejar la solicitud get_userinfo
	app.post('/get_userinfo', (req, res) => {
		var data={
			query:"select id,name,p_photo,online from user where id='"+req.body.uid+"'",
			connection:connection
		}
		helper.queryRunner(data, (result) => {
			if(result.length>0) {
				var user_info="";			
				result.forEach( (element, index, array) => {
					user_info=element;
				});
	    	result_send={
	    		is_logged:true,
	    		data:user_info,
	    		msg:"OK"
	    	};
		  } else {
	    	result_send={
	    		is_logged:false,
	    		data:null,
	    		msg:"BAD"
	    	};
	    }   
		  res.write(JSON.stringify(result_send));
			res.end();
		});
	});

	// Publicar para manejar la solicitud get_msgs
	app.post('/get_msgs', (req, res) => {
		// Llamar a 'getMsgs' para obtener mensajes
		helper.getMsgs(req.body,connection, (result) => {
			res.write(JSON.stringify(result));
			res.end();
		});		
	});

	// Publicar para manejar la solicitud get_recent_chats
	app.post('/get_recent_chats', (req, res) => {
		// Llamar 'getUserChatList' para obtener la lista de chat de usuario
		helper.getUserChatList(req.body.uid,connection, (dbUsers) => {
			res.write(JSON.stringify(dbUsers));
			res.end();
		});	
	});

	// Publicar para manejar la solicitud de get_users_to_chats
	app.post('/get_users_to_chats', (req, res) => {
		// Llamar 'getUsersToChat' para obtener la lista de chat de usuario
		helper.getUsersToChat(req.body.uid,connection, (dbUsers) => {
			// Llamar a 'mergeUsers' para combinar usuarios en línea y fuera de línea
			helper.mergeUsers(users,dbUsers,'yes', (mergedUsers) => {
	    		res.write(JSON.stringify(mergedUsers));
	    		res.end();
	    	});			
		});	
	});
	
	app.get('/logout', (req, res) => {
		sessionInfo=req.session;
		var uid=sessionInfo.uid;
		
		var data={
			query:"update user set online='N' where id='"+uid+"'",
			connection:connection
		}
		helper.queryRunner(data, (result) => {

			req.session.destroy((err) => {
				if(err) {
			    	console.log(err);
			  	} else {
			  		io.emit('exit',1);
					res.redirect('/');
			  	}

			});
		});
	});
	
}

method.getroutes = () => {
	return this;
}

module.exports = routes;
