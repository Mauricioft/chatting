(function() {
  'use strict';
  angular
  	.module('app')
  	.factory('chatSrvc', chatSrvc);

  // Haciendo el método de la fábrica para el zócalo
  chatSrvc.$inject = ['$http', '$log', '$q', '$rootScope'];
  function chatSrvc($http, $log, $q, $rootScope) { 
  	var socket = io.connect();
    return {
      on: on,
      emit: emit,
      runAjax: runAjax
    }; 
   
    function on(eventName, callback) {
    	$log.info('eventName', eventName);
      return socket.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
			  	callback.apply(socket, args);
				});
		  });
    }

    function emit(eventName, data, callback){
    	socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
			  		if (callback) {
						callback.apply(socket, args);
			  		}
				});
		  })
    }

    function runAjax(request, callback) {
    	var url = request.url;
    	console.log('runAjax url', url);
    	var data_server = request.data_server;
      return $http.post(url, data_server)
        .then(getRunComplete)
        .catch(getRunFailed);

      function getRunComplete(response) {
        return callback(response.data);
      }

      function getRunFailed(error) {
      	callback("data");
        console.error('XHR Failed for getAvengers.' + error.data);
      }
    }
  }
})();