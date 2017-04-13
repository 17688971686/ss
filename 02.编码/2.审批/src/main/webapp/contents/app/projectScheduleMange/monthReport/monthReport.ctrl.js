(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc']; 

    function monthReport($location,monthReportSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目月报列表';
        
        activate();
        function activate() {
        	monthReportSvc.grid(vm);
        }
    }
})();