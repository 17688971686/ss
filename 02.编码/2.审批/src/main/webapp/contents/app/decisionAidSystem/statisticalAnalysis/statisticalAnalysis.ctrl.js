(function () {
    'use strict';

    angular
        .module('app')
        .controller('statisticalAnalysisCtrl', statisticalAnalysis);

    statisticalAnalysis.$inject = ['$location','statisticalAnalysisSvc']; 

    function statisticalAnalysis($location, statisticalAnalysisSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '统计分析';
        

       
       /* activate();
        function activate() {
        	statisticalAnalysisSvc.grid(vm);
        }*/
    }
})();