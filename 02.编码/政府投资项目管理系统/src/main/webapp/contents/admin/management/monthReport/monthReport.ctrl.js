(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.id=$state.params.id;
    	vm.page='list';
        vm.init=function(){   
        	if(vm.id){
        		vm.page='details';
        	}
        }//end init
        
        vm.page_details_init=function(){
        	
        	vm.date=function(dateStr){
        		return new Date(dateStr);
        	}
        	
        }
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		monthReportSvc.grid(vm);
        	}
        	if(vm.page=='details'){
        		monthReportSvc.getMonthReportInfo(vm);
        		vm.page_details_init();
        	}
            
        }
    }
})();
