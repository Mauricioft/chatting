(function() {
  'use strict';
  angular
  	.module('app')
  	.factory('mainSrvc', mainSrvc);

  mainSrvc.$inject = ['$http', '$log', '$q'];
  function mainSrvc($http, $log, $q) { 
    return {
      auth: auth,
      create: create,
      getUsername: getUsername
    }; 
   
    function auth(params) {
      return $http.post('/login', params)
        .then(getAuthComplete)
        .catch(getAuthFailed);

      function getAuthComplete(response) {
        return response.data;
      }

      function getAuthFailed(error) {
        console.error('XHR Failed for getAvengers.' + error.data);
      }
    }

    function create(fd){
      return $http.post("/register", fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })
        .then(getCreateComplete)
        .catch(getCreateFailed);

      function getCreateComplete(response) {
        return response.data;
      }

      function getCreateFailed(error) {
        console.error('XHR Failed for getAvengers.' + error.data);
      }
    }

    function getUsername(params){
      return $http.post("/check_name", params)
        .then(getUsernameComplete)
        .catch(getUsernameFailed);

      function getUsernameComplete(response) {
        return response.data;
      }

      function getUsernameFailed(error) {
        console.error('XHR Failed for getAvengers.' + error.data);
      }
    }
  }
})();