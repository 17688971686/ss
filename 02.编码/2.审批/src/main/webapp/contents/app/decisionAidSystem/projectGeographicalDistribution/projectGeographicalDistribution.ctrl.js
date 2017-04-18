(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectGeographicalDistributionCtrl', projectGeographicalDistribution);

    projectGeographicalDistribution.$inject = ['$location','projectGeographicalDistributionSvc']; 

    function projectGeographicalDistribution($location, projectGeographicalDistributionSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目地理分布图';
        

       
        activate();
        function activate() {
        	projectGeographicalDistributionSvc.grid(vm);
        }
    }
})();