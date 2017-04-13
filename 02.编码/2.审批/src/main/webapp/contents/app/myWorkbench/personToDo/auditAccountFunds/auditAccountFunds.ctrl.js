(function () {
    'use strict';

    angular
        .module('app')
        .controller('auditAccountFundsCtrl', auditAccountFunds);

    auditAccountFunds.$inject = ['$location','auditAccountFundsSvc']; 

    function auditAccountFunds($location, auditAccountFundsSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '审计决算资金列表';
        

       
        activate();
        function activate() {
        	auditAccountFundsSvc.grid(vm);
        }
    }
})();