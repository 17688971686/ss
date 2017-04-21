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
        vm.titleProjectHandle = '项目处理表单';
        
      vm.tabActive=2;
      
      vm.tab = function(tabActive){
        vm.tabActive=tabActive;          
      }

    }
})();