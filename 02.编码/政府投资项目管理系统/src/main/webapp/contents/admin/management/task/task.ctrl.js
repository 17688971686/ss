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
        vm.taskId=$state.params.taskId;        
        vm.relId=$state.params.relId;        
    	vm.page="todoList";
    	function init(){    		
    		if($state.current.name=='task_todo'){
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){
    			vm.page='complete';
    		}
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    		vm.getBasicDataDesc=function(str){
    			return common.getBasicDataDesc(str);
    		};
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
        	if(vm.page=='complete'){
        		init_completeList();
        	}
        }
        
        function init_todoList(){
        	taskSvc.grid(vm);
        }//end init_todoList
        
        function init_completeList(){
        	taskSvc.completeGird(vm);
        }//end init_completeList
        
        
    	function init_handle(){
    	   vm.processState_qianShou=common.basicDataConfig().processState_qianShou;
    	   vm.processState_tuiWen=common.basicDataConfig().processState_tuiWen;

    	   taskSvc.getTaskById(vm);//查询任务信息
    	   taskSvc.getShenBaoInfoById(vm);//查询申报信息
    	   //taskSvc.getUser(vm);//查询下一处理环节的人员

    	   vm.dialog_shenbaoInfo=function(){
    		   $('#shenbaoInfo').modal({
                   backdrop: 'static',
                   keyboard:false
               });
			   //初始化tab
	     	   vm.tabStripOptions={
	     			//TODO
	     	   };
    	   }; 
    	   //处理操作
    	   vm.handle=function(processState){
    		   vm.model.taskRecord.processState=processState;
    		   taskSvc.handle(vm);
    	   };    		
    	}//init_handle
    }
})();
