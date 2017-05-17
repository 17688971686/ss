(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.page='list';
        vm.init=function(){   
        	
        }//end init
        
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		monthReportSvc.grid(vm);
        	}
            
        }
    }
})();
