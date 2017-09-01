(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskAuditCtrl', taskAudit);

    taskAudit.$inject = ['$location','taskAuditSvc','$state','$scope','$sce','$rootScope']; 

    function taskAudit($location, taskAuditSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};       
    	vm.page="todoAuditList";

    	function init(){  		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		}; 		
    		
    		vm.getBasicDataDesc=function(str){//流转信息显示
    			return common.getBasicDataDesc(str);
    		};
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};

           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoAuditList'){
        		init_todoAuditList();
        	}
        }
        
        function init_todoAuditList(){
        	taskAuditSvc.grid(vm);
        }//end init_todoList
    }
})();
