(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectDetailsCtrl', projectDetails);

    projectDetails.$inject = ['$location','projectDetailsSvc','$state']; 

    function projectDetails($location, projectDetailsSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '項目詳情';
        vm.titleDeclarationLook = '项目申报信息查看页面';
        vm.projectId = $state.params.id;
        
        if (vm.projectId) {
            vm.isCheckProject = true;           
        }
        
      vm.tabActive=2;
      
      vm.tab = function(tabActive){
        vm.tabActive=tabActive;          
      }
      
      activate();
      function activate() {
    	  if (vm.isCheckProject) {
    		  projectDetailsSvc.checkProject(vm);
          }    
      }

    }
})();