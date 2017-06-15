(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskCtrl', task);

    task.$inject = ['$location','taskSvc','$state','$scope']; 

    function task($location, taskSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
        vm.id=$state.params.id;        
    	vm.page="todoList";
    	function init(){    		
    		if($state.current.name=='task_todo'){
    			vm.page='todoList'
    		}
    		if($state.current.name=='task_handle'){
    			vm.page='handle'
    		}
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoList'){
        		init_todoList();
        	}
        	if(vm.page=='handle'){
        		init_handle();
        	}
        }
        function init_todoList(){
        	taskSvc.grid(vm);
        }//init_todoList
    	function init_handle(){
    		 //初始化tab
     	   vm.tabStripOptions={
     			//TODO
     	   };
    	}//init_handle
    }
})();
