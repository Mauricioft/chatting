(function() {
  'use strict';
   angular
   	.module('app')
   	.directive('fileModel', fileModel);

  fileModel.$inject = ['$parse'];
  
  function fileModel($parse){
    var directive = {
      restrict: 'EA',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      
      element.bind('change', function(event){
         scope.$apply(function(){
            // Writing the selected file name below the Upload image
            var files = event.target.files; 
            angular.element( document.querySelector( '#selectedFile' )).html(files[0].name);
            modelSetter(scope, element[0].files[0]);
         });
      });
    }
  };
})();