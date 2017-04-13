(function () {
    'use strict';

    angular
        .module('app')
        .controller('planProjectCtrl', planProject);

    planProject.$inject = ['$location','planProjectSvc']; 

    function planProject($location, planProjectSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '年度计划项目库列表';
        
        activate();
        function activate() {
            planProjectSvc.grid(vm);
        }
    }
})();
