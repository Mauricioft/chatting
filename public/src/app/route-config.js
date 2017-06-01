(function() {
  'use strict';
  angular
    .module('app')
    .config(config);
    
  config.$inject = ['$authProvider', '$qProvider', '$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$httpProvider', '$locationProvider', 'CONSTANTS'];
  function config($authProvider, $qProvider, $stateProvider, $urlRouterProvider, $interpolateProvider, $httpProvider, $locationProvider, CONSTANTS){
    // Angular Tags
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}');
    //
    $qProvider.errorOnUnhandledRejections(false);   
    //
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Parametros de configuración
    $authProvider.singInUrl = CONSTANTS.BASE_URL + '/singin'; 
    $authProvider.singUpUrl = CONSTANTS.BASE_URL + '/singup'; 
    $authProvider.tokenName = "token";
    $authProvider.tokenPrefix = "auth_token",
 
    // 
    // For any unmatched url, redirect to /state1 
    $urlRouterProvider.otherwise("/");
    // 
    // Now set up the states 
    $stateProvider
      // Main Layout Structure
      .state('auth', {
        url: "/",
        templateUrl: "src/auth/login.html",
        controller: 'mainCtrl as vm'
      })
      .state('chat', {
        url: "/users",
        templateUrl: "src/home/chat.html",
        controller: 'chatCtrl as vm'
      });
      /*  
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
      */
    $locationProvider.hashPrefix('!');
  };
})();