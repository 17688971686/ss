(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('shenbaoCtrl', shenbao);

    shenbao.$inject = ['$location','shenbaoSvc','$state','$scope']; 

    function shenbao($location, shenbaoSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;        
        vm.id=$state.params.id;
        vm.model={};        
        vm.page='list';
        vm.init=function(){
        	if($state.current.name=='shenbao_edit'){
    			vm.page='edit';
    		}
        }
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='edit'){
        		//编辑
        		page_edit();        		
        	}
        	
        }
        
       function page_list(){      
    	   shenbaoSvc.grid(vm);
        }//end#page_list
       
       function page_edit(){
    	   //初始化tab
    	   vm.tabStripOptions={
    			
    	   };
       }//end#page_create
       
       
              
    }
})();