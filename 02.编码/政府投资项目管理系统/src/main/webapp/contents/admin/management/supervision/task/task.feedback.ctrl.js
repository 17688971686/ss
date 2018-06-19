(function () {
    'use strict';

    angular
        .module('appSupervision')
        .controller('taskFeedbackCtrl', taskFeedback);

    taskFeedback.$inject = ['$location','taskFeedbackSvc','$state']; 

    function taskFeedback($location,taskFeedbackSvc,$state) {
    	var vm = this;
    	vm.basicData={};
    	vm.id=$state.params.id;
    	vm.model = {};
    	vm.model.shenBaoInfo = {};
    	
    	function init(){
    		if($state.current.name=='task_todo_feedback'){//待办列表--审批类
    			vm.page='todoFeedbackList';
    		}
    		if($state.current.name=='task_complete_feedback'){//已办列表--审批类
    			vm.page="completeFeedbackList";
    		}
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
        	
    		vm.getBasicDataDesc=function(str){//流转信息显示
    			return common.getBasicDataDesc(str);
    		};
    	}
    	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoFeedbackList'){
        		init_todoFeedbackList();
        	}
        	if(vm.page=='completeFeedbackList'){
        		init_completeFeedbackList();
        	}
        }
        
        function init_todoFeedbackList(){
        	taskFeedbackSvc.grid(vm);
        	
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'complate',operator:'eq',value:false});//默认条件--没有完成的任务 
				
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
        }//end
        
        function init_completeFeedbackList(){
        	taskFeedbackSvc.complete_gird(vm);
        	//查询
        	vm.search=function(){
        		var filters = [];
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions_complete_shenPi.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end
        
    }
})();
