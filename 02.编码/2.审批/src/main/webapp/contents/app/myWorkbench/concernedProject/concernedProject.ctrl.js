(function () {
    'use strict';

    angular
        .module('app')
        .controller('concernedProjectCtrl', concernedProject);

    concernedProject.$inject = ['$location','concernedProjectSvc']; 

    function concernedProject($location, concernedProjectSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '关注的项目列表';
        
        vm.unitDetais = function(unitId){
        	common.console.log(unitId);
        }

       
        activate();
        function activate() {
        	concernedProjectSvc.grid(vm);
        }
    }
})();