(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.model={};    
    	vm.page='list';
        vm.init=function(){   
        	if($state.current.name=='monthReport_details'){
        		vm.page='details';
        		vm.projectId=$state.params.projectId;
        		vm.year=$state.params.year;
        		vm.month=$state.params.month;
        	}
        }//end init
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		monthReportSvc.grid(vm);
        	}
        	if(vm.page=='details'){        		
        		page_details();
        	}
            
        }
        
        function page_details(){
        	//todo
        	monthReportSvc.getProjectById(vm);
        }
        
        
    }
})();
