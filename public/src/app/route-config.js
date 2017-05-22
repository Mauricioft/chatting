(function() {
  'use strict';
  angular
    .module('app')
    .config(config);
    
  config.$inject = ['$qProvider', '$stateProvider', '$urlRouterProvider', '$interpolateProvider', '$httpProvider', '$locationProvider'];
  function config($qProvider, $stateProvider, $urlRouterProvider, $interpolateProvider, $httpProvider, $locationProvider){
    // Angular Tags
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}');
    //
    $qProvider.errorOnUnhandledRejections(false);   
    //
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
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