(function () {
    'use strict';

    angular
        .module('app')
        .controller('newStartPlanCtrl', newStartPlan);

    newStartPlan.$inject = ['$location','newStartPlanSvc']; 

    function newStartPlan($location, newStartPlanSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	newStartPlanSvc.grid(vm);
        }
    }
})();