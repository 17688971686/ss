(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectDetaisCtrl', projectDetais);

    projectDetais.$inject = ['$location','projectDetaisSvc']; 

    function projectDetais($location, projectDetaisSvc) {
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