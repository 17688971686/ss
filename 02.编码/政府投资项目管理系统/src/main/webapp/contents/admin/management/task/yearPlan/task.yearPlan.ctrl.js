(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskYearPlanCtrl', task);

    task.$inject = ['$location','taskYearPlanSvc','$state','$scope','$sce']; 

    function task($location, taskYearPlanSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;     
        vm.search={};
        vm.basicData={};
        vm.model.taskRecord = {};
    	vm.page="todoList";
	
    	function init(){
    		if($state.current.name=='task_todo'){//待办列表--下一年度计划
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){//任务处理--下一年度计划
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){//已办列表--下一年度计划
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
           	
           	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	
        	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			.toArray();//政府投资行业
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   				.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位

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
        	//taskYearPlanSvc.gridForPlan(vm);//为了获取计划类申报信息的数量
        	//taskYearPlanSvc.gridForShenpi(vm);//为了获取审批类申报信息的数量
        	taskYearPlanSvc.grid(vm);//获取下一年度计划待办列表数据
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				filters.push({field:'taskType',operator:'eq',value:common.basicDataConfig().taskType_yearPlan});//默认条件--查询的任务为下一年度计划类 
				
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
        
        function init_completeList(){
        	taskYearPlanSvc.completeGird(vm);
        }//end init_completeList
        
    	function init_handle(){
    		taskYearPlanSvc.getShenBaoInfoById(vm);//查询申报信息
    		taskYearPlanSvc.getTaskById(vm);//查询任务信息
    	    vm.processState_qianShou=common.basicDataConfig().processState_pass;//定义签收
    	    vm.processState_tuiWen=common.basicDataConfig().processState_notpass;//定义退文
    	    
    	    //TODO 月报签收功能此处暂时没有利用上
	    	   if(vm.taskType == common.basicDataConfig().taskType_monthReport){//如果为月报
	    		   vm.isMonthReport = true;
	    		   taskYearPlanSvc.getMonthReportById(vm);//查询月报信息
	    	   }else if(vm.taskType == common.basicDataConfig().taskType_yearPlan){//如果为下一年度计划
	    			   vm.isYearPlan = true;
	    			   vm.model.taskRecord.processSuggestion = "符合申报";//设置默认为符合申报
	    	   }
    		   
    	   vm.dialog_shenbaoInfo=function(){
    		   $('#shenbaoInfo').modal({
                   backdrop: 'static',
                   keyboard:true
               });
    	   };
    	   //处理操作
    	   vm.handle=function(processState){
    		   common.initJqValidation();
   			   var isValid = $('form').valid();
	   			if (isValid) {
	   				vm.isSubmit = true;
	   				vm.model.taskRecord.thisProcess=vm.task.thisProcess;
	   				vm.model.taskRecord.thisProcessState=processState;
	   				if(processState == common.basicDataConfig().processState_notpass){//不通过
	   					vm.model.taskRecord.nextProcess=vm.task.lastProcess;
	   					vm.model.taskRecord.nextUser=vm.task.lastUser;
	   					vm.model.taskRecord.nextRole=vm.task.lastRole;
	   				}
	     		   taskYearPlanSvc.handle(vm);
	   			}
    	   };    		
    	}//init_handle
    }
})();
