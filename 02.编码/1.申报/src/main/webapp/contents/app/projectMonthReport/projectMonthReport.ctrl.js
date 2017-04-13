(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectMonthReportCtrl', projectMonthReport);

    projectMonthReport.$inject = ['$location','projectMonthReportSvc']; 

    function projectMonthReport($location, projectMonthReportSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目月报列表';
        
        //填报
        vm.fill = function (id) {        	
       	 	//弹出填报月报的页面
         
       }
        activate();
        function activate() {
        	projectMonthReportSvc.grid(vm);
        }
    }
})();