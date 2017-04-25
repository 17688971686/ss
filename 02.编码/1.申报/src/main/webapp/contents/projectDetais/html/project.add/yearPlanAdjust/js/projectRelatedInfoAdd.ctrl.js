(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectRelatedInfoAddCtrl', projectRelatedInfoAdd);

    projectRelatedInfoAdd.$inject = ['$location','projectRelatedInfoAddSvc']; 

    function projectRelatedInfoAdd($location, projectRelatedInfoAddSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '項目詳情';
        vm.titleDeclarationLook = '项目申报信息查看页面';
        
      vm.tabActive=2;
      
      
      
      vm.tab = function(tabActive){
        vm.tabActive=tabActive;          
      }

    }
})();