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
    	vm.search={};
    	vm.basicData={};
    	vm.page="todoAuditList";
    	
    	//任务处理--请求参数
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;

    	function init(){
    		
    		if($state.current.name=='task_handle_audit'){//处理页面
    			vm.page="handleAudit";
    		}
    		
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
           	
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoAuditList'){
        		init_todoAuditList();
        	}
        	if(vm.page=='handleAudit'){
        		init_handleAudit();
        	}
        }
        
        function init_todoAuditList(){
        	taskAuditSvc.grid(vm);
        	//查询
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
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_handleAudit(){
        	//查询任务信息
        	taskAuditSvc.getTaskInfoById(vm);
        	//查询申报信息
        	taskAuditSvc.getShenBaoInfoById(vm);
        }//end init_handleAudit
    }
})();
