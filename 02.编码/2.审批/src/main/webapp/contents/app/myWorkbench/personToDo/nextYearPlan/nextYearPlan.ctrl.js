(function () {
    'use strict';

    angular
        .module('app')
        .controller('nextYearPlanCtrl', nextYearPlan);

    nextYearPlan.$inject = ['$location','nextYearPlanSvc']; 

    function nextYearPlan($location, nextYearPlanSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '下一年年度计划列表';
        

       
        activate();
        function activate() {
        	nextYearPlanSvc.grid(vm);
        }
    }
})();