(function() {
  'use strict';
   angular
   	.module('app')
   	.directive('sendTypingNotification', sendTypingNotification);

  sendTypingNotification.$inject = ['$parse'];
  // Hacer la directiva para enviar es la notificación de mecanografía  
  function sendTypingNotification($parse){
    var directive = {
      restrict: 'EA',
      require: 'ngModel',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs,ctrl) {
      element.bind("keydown keypress", function (event) {
        scope.self.sendTypingNotification(event.type);
        scope.send_text=element.val();
      });
      scope.$watch(attrs.updateModel, function(value) {
        ctrl.$setViewValue(value);
        ctrl.$render();
      });
    }
  };
})();