(function() {

  'use strict';

  angular
    .module('app.chat', [])
    .controller('chatCtrl', chatCtrl);

  /* @ngInject */
  chatCtrl.$inject = ['$scope', '$location', '$window', '$sce', '$timeout', 'toaster', 'chatSrvc'];
  function chatCtrl($scope, $location, $window, $sce, $timeout, toaster, chatSrvc) {
  	var vm = this;  

  	vm.show_userinfo=""; //To contain user information.
  	vm.userlist=""; //To contain list of users.
  	vm.RecentUserList=""; //To contain list of users.
  	vm.uid="";
		vm.hightlight_id="";
  	vm.hightlight_socket_id="";
  	vm.send_to_userinfo="";
  	vm.send_to_user_name="";
  	vm.send_text;
  	vm.msgs=[];

  	vm.self = {
			getUserInfo: function(callback){
				var uid = $location.search()['id'];
				vm.uid = uid;
				var data = {
					url: '/get_userinfo',
					data_server: {
						uid: uid
					}
				};
				chatSrvc.runAjax(data, function(userdata){        
					vm.show_userinfo = userdata;        
					callback(userdata);
				});
			},
			getRecentChats: function(callback){
				var uid = $location.search()['id'];
				vm.uid = uid;
				var data = {
					url: '/get_recent_chats',
					data_server: {
						uid: uid
					}
				};
				chatSrvc.runAjax(data, function(userdata){
					callback(userdata);
				});
			},
			getUsersToChats: function(callback){
			  var uid = $location.search()['id'];
			  vm.uid = uid;
			  var data={
					url: '/get_users_to_chats',
					data_server: {
					  uid: uid
					}
			  };
			  chatSrvc.runAjax(data, function(userdata){
					callback(userdata);
			  });
			},
			getMsg: function(msgs_userinfo, callback){
			  var data = {
					url: '/get_msgs',
					data_server: {
					  uid: $scope.uid,
					  from_id: msgs_userinfo.id
					}
			  }
			  chatSrvc.runAjax(data, function(userdata){        
					callback(userdata);
			  });
			},
			scrollDiv: function(){
			  var scrollDiv = angular.element( document.querySelector( '.msg-container' ) );
			  $(scrollDiv).animate({scrollTop: scrollDiv[0].scrollHeight}, 900);
			},
			sendTypingNotification:function(eventName){
			  var TypeTimer;                
			  var TypingInterval = 2000;
			  var data_server={
				  data_uid: vm.uid,
				  data_fromid: vm.hightlight_id,
				  data_socket_fromid: vm.hightlight_socket_id
				}; 

			  if (eventName=="keypress") {
					$timeout.cancel(TypeTimer);
					data_server.event_name = 'keypress';
					socket.emit('setTypingNotification', data_server);
			  }else {
					TypeTimer = $timeout(function(){
					  data_server.event_name = 'keydown';
					  socket.emit('setTypingNotification', data_server);
					}, TypingInterval);
			  }
			}
		};

		// Función Para obtener 'la información del usuario, así como invoca para obtener la lista de chat'
		vm.self.getUserInfo(function(userinfo){
			console.log('getUserInfo', userinfo);
			socket.emit('userInfo', userinfo.data); // Enviar información de usuario al servidor  
		});

		// Función Para mostrar al usuario seleccionado de la lista de chat
		vm.hightlight_user=function(send_to_userinfo){
			vm.send_to_userinfo = send_to_userinfo;
			vm.hightlight_id = send_to_userinfo.id;
			vm.send_to_user_name = send_to_userinfo.name; 
			vm.hightlight_socket_id = send_to_userinfo.socketId; 
			vm.self.getMsg(send_to_userinfo, function(result){
			  vm.msgs = '';
			  if(result != 'null'){
					vm.msgs = result;
			  }
			});
		};

		// Función Para obtener 'lista de chat'
		vm.get_recent_chats = function(){
			vm.self.getRecentChats(function(offlineUsers){
				vm.RecentUserList = offlineUsers;
			});
		};

		// Función Para obtener 'iniciar nueva lista de chat'
		vm.get_users_to_chats = function(){
			vm.self.getUsersToChats(function(newUsers){
			  vm.RecentUserList = newUsers;
			});
		};

		// Función Para enviar mensajes 
		vm.send_msg = function(fromModal, socketId, toid){
			if(typeof fromModal == ''){
				if(typeof vm.send_to_userinfo != ''){
					if(typeof vm.send_text == ''){
						alert("Message can't be empty.");
					} else{
						var data = {
							socket_id: vm.send_to_userinfo.socketId,
							to_id: vm.send_to_userinfo.id,
							from_id: vm.uid,
							msg: vm.send_text
						};

						// Se inicia el envío de información de usuario al servidor
						socket.emit('sendMsg', data);

						$scope.msgs.push({
							msg: vm.send_text,
							from_id: vm.uid,
							to_id: vm.send_to_userinfo.id,
							timestamp: Math.floor(new Date() / 1000)
						});

						vm.send_text="";
						vm.self.scrollDiv();
					}           
				}else{
				  alert('Select a user to send Message.');
				}  
			}else{
				var getMsgText = angular.element(document.querySelector('#msg_modal'+'_'+toid)).val();
				if(typeof getMsgText == ''){
					alert("Message can't be empty.");
				}else{
					var data = {
						socket_id: null,
						to_id: toid,
						from_id: vm.uid,
						msg: getMsgText
					};
					socket.emit('sendMsg', data);
				}
			}
		};

		/*
			To hide and show the Message box inside Modal
		*/
		vm.hideShowMsgBox=function(id, action, $event){

			var hideShowEle = angular.element(document.querySelector('.collapseMsgBox'+'_'+id )); 
			var hidEle= angular.element(document.querySelector('.hideMSgBox'+'_'+id ));
			var showEle = angular.element(document.querySelector('.showMSgBox'+'_'+id ));

			if(typeof action == "hide"){
				hideShowEle.addClass('send-msg-hidden');
				hideShowEle.removeClass('send-msg-show');
				showEle.removeClass('send-msg-hidden');
				showEle.addClass('send-msg-show');
				hidEle.addClass('send-msg-hidden');
				hidEle.removeClass('send-msg-show');
			}else{
				hideShowEle.addClass('send-msg-show');
				hideShowEle.removeClass('send-msg-hidden');
				showEle.addClass('send-msg-hidden');
				showEle.removeClass('send-msg-show');
				hidEle.removeClass('send-msg-hidden');
				hidEle.addClass('send-msg-show');
			}
		}

		/*
			---------------------------------------------------------------------------------
			Socket on event starts
	  	---------------------------------------------------------------------------------
	  */

  	// Función para mostrar mensajes.
		socket.on('getMsg', function(data){
			if(vm.send_to_userinfo != ""){
	  		vm.self.getMsg(vm.send_to_userinfo, function(result){
					vm.msgs="";
					vm.msgs=result;
					vm.self.scrollDiv();
	  		});    
			}

			// Utilización del tostador para mostrar las notificaciones
			toaster.pop('success', data.name+" sent you a message", data.msg,5000);
	  });

		// Función para actualizar la lista de usuarios cuando un usuario se desconecta.
  	socket.on('getTypingNotification',function(data){
			if(typeof data.event_name == "keypress"){
		  	angular.element('#isTyping_'+data.data_uid).css('display','block');
			}else{
		  	angular.element('#isTyping_'+data.data_uid).css('display','none');      
			}
  	});

  	socket.on('exit',function(data){
  		vm.self.getUserInfo(function(userinfo){
				socket.emit('userInfo',userinfo.data); // envío de información de usuario al servidor
			});
  	});

  	// Función para mostrar la lista de chat.
		socket.on('userEntrance',function(data){
			vm.userlist=data;
  	});

  	/*
  	---------------------------------------------------------------------------------
		Socket on event Ends
  	---------------------------------------------------------------------------------
  	*/
  }
})();