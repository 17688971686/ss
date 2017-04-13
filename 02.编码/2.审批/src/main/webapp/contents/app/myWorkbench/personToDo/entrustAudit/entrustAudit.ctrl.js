(function () {
    'use strict';

    angular
        .module('app')
        .controller('entrustAuditCtrl', entrustAudit);

    entrustAudit.$inject = ['$location','entrustAuditSvc']; 

    function entrustAudit($location, entrustAuditSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	entrustAuditSvc.grid(vm);
        }
    }
})();