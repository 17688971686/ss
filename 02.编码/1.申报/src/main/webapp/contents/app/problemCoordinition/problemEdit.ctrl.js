(function () {
    'use strict';

    angular
        .module('app')
        .controller('problemEditCtrl', problemCoordinition);

    problemCoordinition.$inject = ['$location','problemCoordinitionSvc']; 

    function problemCoordinition($location, problemCoordinitionSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '问题协调数据编辑';
        
      
        
       
    }
})();