(function () {
    'use strict';

    angular
        .module('app')
        .controller('constructionPlanCtrl', constructionPlan);

    constructionPlan.$inject = ['$location','constructionPlanSvc']; 

    function constructionPlan($location, constructionPlanSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	constructionPlanSvc.grid(vm);
        }
    }
})();