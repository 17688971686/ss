(function () {
    'use strict';

    angular
        .module('app')
        .controller('policyCtrl', policy);

    policy.$inject = ['$location','policySvc']; 

    function policy($location, policySvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '政策法规列表';
        
        activate();
        function activate() {
            policySvc.grid(vm);
        }
    }
})();
