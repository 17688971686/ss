(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskCtrl', task);

    task.$inject = ['$location','taskSvc','$state','$scope','$sce','$rootScope']; 

    function task($location, taskSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;
    	vm.page="todoList";
    	vm.model.taskRecord = {};
    	vm.search={};
    	vm.basicData={};
    	function init(){   		
    		if($state.current.name=='task_todo'){//待办列表
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){//任务处理
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){//已办列表
    			vm.page='complete';
    		}
    		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    		vm.getBasicDataDesc=function(str){
    			return common.getBasicDataDesc(str);
    		};
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};
           	
           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
           	
           	vm.callBack=function(userfilters){
          		window.history.back(-1);
           	};
           	
           	//初始化查询基础数据
           	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();
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
        	
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions.dataSource.filter(filters);
        	};
        	
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_completeList(){
        	taskSvc.completeGird(vm);
        }//end init_completeList
        
        
    	function init_handle(){
    	   vm.processState_qianShou=common.basicDataConfig().processState_qianShou;
    	   vm.processState_tuiWen=common.basicDataConfig().processState_tuiWen;

    	   taskSvc.getTaskById(vm);//查询任务信息
    	   
    	   if(vm.taskType == common.basicDataConfig().taskType_yearPlan){//如果为下一年度计划申报
    		   vm.isYearPlan = true;
    		   taskSvc.getShenBaoInfoById(vm);//查询申报信息
    		   vm.model.taskRecord.processSuggestion = "符合申报";//设置默认为符合申报
    	   }else if(vm.taskType == common.basicDataConfig().taskType_monthReport){//如果为月报
    		   vm.isMonthReport = true;
    		   taskSvc.getMonthReportById(vm);//查询月报信息
    	   }
    	   
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
    		   common.initJqValidation();
   			   var isValid = $('form').valid();
	   			if (isValid) {
	   				vm.isSubmit = true;
	   				vm.model.taskRecord.processState=processState;
	     		   taskSvc.handle(vm);
	   			}
    	   };    		
    	}//init_handle
    }
})();
