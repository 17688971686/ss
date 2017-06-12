(function () {
    'use strict';

    angular
        .module('app')
        .controller('yearPlanCtrl', yearPlan);

    yearPlan.$inject = ['$location','yearPlanSvc','$state','$scope']; 

    function yearPlan($location, yearPlanSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.model={};
        vm.id=$state.params.id;        
    	vm.page="planList";
    	function init(){    		
    		if($state.current.name=='yearPlanBZList'){
    			vm.page='bzList'
    		}
    		if($state.current.name=='yearPlanBZEdit'){
    			vm.page='bzEdit';
    		}
    		
    	}
    	init();    	
    	activate();
        function activate() {
        	
        	
        	if(vm.page=='planList'){
        		init_planList();
        	}
        	if(vm.page=='bzList'){
        	}
        	if(vm.page=='bzEdit'){
        	}
        }
    	
    	function init_planList(){
    		yearPlanSvc.grid(vm);
    		
    	}//init_planList
    	    
    }
})();
