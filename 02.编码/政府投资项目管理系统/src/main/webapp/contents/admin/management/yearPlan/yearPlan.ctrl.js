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
    	vm.page="shenbaoInfoList";
    	function init(){    		
    		if($state.current.name=='yearPlan_planList'){
    			vm.page='planList'
    		}
    		if($state.current.name=='yearPlan_planEdit'){
    			vm.page='plan_create';
    		}
    		if($state.current.name=='yearPlan_planEdit'&&vm.id){
    			vm.page='plan_update';
    		}
    	}
    	init();    	
    	activate();
        function activate() {
        	
        	
        	if(vm.page=='shenbaoInfoList'){
        		init_shenbaoInfoList();
        	}
        	if(vm.page=='planList'){
        		init_planList();
        	}
        	if(vm.page=='plan_create'){
        		init_planCreate();
        	}
        }
    	
    	function init_shenbaoInfoList(){
    		yearPlanSvc.grid_shenbaoInfoList(vm);
    		
    	}//init_planList
    	function init_planList(){
    		yearPlanSvc.grid_planList(vm);
    	}//init_planBZList    
    	
    	function init_planCreate(){
    		vm.create=function(){    		
    			yearPlanSvc.plan_create(vm)
    		};
    	}//init_planBZList 
    }
})();
