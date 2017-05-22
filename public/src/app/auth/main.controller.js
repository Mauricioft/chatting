(function() {
  'use strict';
  angular
    .module('app')
    .controller('mainCtrl', mainCtrl);

  /* @ngInject */
  mainCtrl.$inject = ['$scope', '$timeout', '$window', 'mainSrvc'];
  function mainCtrl($scope, $timeout, $window, mainSrvc) {	  
    var vm = this;  
    console.log('mainCtrl');
    // Inicializacion de variables de entorno
    vm.LoginBox=false; 
    vm.LoginAlert=true;
    vm.RegisterAlert=true;
    vm.RegisterBox=true;
    
    
    // Las variables de comprobación de nombre de usuario comienzan
    var TypeTimer;                
    var TypingInterval = 1000;
    
    // Ocultar show Inicio de sesión y registro 
    vm.toggle_register = () => {
      vm.RegisterBox = !vm.RegisterBox;
      vm.LoginBox = !vm.LoginBox;
    };

    vm.toggle_login = () => {
      vm.LoginBox = !vm.LoginBox;
      vm.RegisterBox = !vm.RegisterBox;
    };
    
    // Se inicia la operación de inicio de sesión
    vm.login = () => {
      var params = {
        username: vm.username,
        password: vm.password
      };

      mainSrvc.auth(params).then((response) => {
        if(response.is_logged){
          vm.LoginAlert = true;
          $window.location.href = "/home#?id="+response.id;
        }else{
          vm.LoginAlert = false;
        }
      }); 
    };
    
    // La operación de comprobación del nombre de usuario comienza 
    vm.keyup_uncheck = () => {
      $timeout.cancel(TypeTimer);
      TypeTimer = $timeout(() => {
        var data={
          username: vm.username
        }
        etc_function.check_username(data);            
      }, TypingInterval);
    };

    vm.keydown_uncheck = () => { $timeout.cancel(TypeTimer); }
   
    vm.blur_uncheck = () => {
      var data={
        username: vm.username
      }

      etc_function.check_username(data);
      $timeout.cancel(TypeTimer); 
    };
  
    vm.register = () => {
      var file_ext=["image/png","image/jpg","image/jpeg","image/gif"];
      var file_type_ok=true;
      var file = vm.myFile;
      var fd = new FormData();
      console.log('register', file);

      if(typeof file != 'undefined'){
        var file_size = Math.round(file.size/1024);

        file_ext.forEach((element, index) => {
          if(element === (file.type).toLowerCase()){
            file_type_ok = false;
          }
        });

        if(file_size > 500){
          alert("Upload file below 500 KB.");
        }else if(file_type_ok){
          alert("Upload image file.");
        }else{  
          fd.append('file', file);
        }
      }

      fd.append('username', vm.username);
      fd.append('password', vm.password);
      
      mainSrvc.create(fd).then((response) => {
        if(response.is_logged){
          vm.LoginAlert = true;
          $window.location.href = "/home#?id="+response.id;
        }else{
          vm.LoginAlert = false;
        }
      }); 
    };
    


    var etc_function = {
      check_username: (data) => {
        mainSrvc.getUsername(data).then(function(response){
          if(!response.msg){
            vm.RegisterAlert = true;
          }else{
            vm.RegisterAlert = false;
          }
        });
      }
    }
  }
})();