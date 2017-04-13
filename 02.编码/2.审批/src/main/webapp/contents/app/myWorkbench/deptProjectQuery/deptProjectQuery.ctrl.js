(function () {
    'use strict';

    angular
        .module('app')
        .controller('deptProjectQueryCtrl', deptProjectQuery);

    deptProjectQuery.$inject = ['$location','deptProjectQuerySvc']; 

    function deptProjectQuery($location, deptProjectQuerySvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	deptProjectQuerySvc.getListData(vm,"hasDone");
        	deptProjectQuerySvc.getListData(vm,"toDo");
        }
    }
})();