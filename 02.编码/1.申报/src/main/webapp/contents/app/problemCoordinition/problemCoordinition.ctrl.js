(function () {
    'use strict';

    angular
        .module('app')
        .controller('problemCoordinitionCtrl', problemCoordinition);

    problemCoordinition.$inject = ['$location','problemCoordinitionSvc']; 

    function problemCoordinition($location, problemCoordinitionSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '问题协调列表';
        
        activate();
        function activate() {
        	problemCoordinitionSvc.grid(vm);
        }
    }
})();