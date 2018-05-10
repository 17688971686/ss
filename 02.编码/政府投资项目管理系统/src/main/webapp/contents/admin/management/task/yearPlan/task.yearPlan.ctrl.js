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
        vm.id=$state.params.id;     
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
    		if($state.current.name=='task_complate_yearPlan'){//个人已办--下一年度计划
    			vm.isComplete = true;
    			vm.page='handle';
    			
    		}
    		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    		vm.formatDateTime=function(time){
    			return common.formatDateTime(time);
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
          	vm.getUserName = function(userId){
           		var user=common.getUserById(userId).value[0];
           		return user.displayName!=null&&user.displayName!=''&&user.displayName!=undefined?user.displayName:user.loginName;
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
   	   		//国民经济行业分类
	   		vm.basicData.nationalIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
	   		vm.nationalIndustryChange=function(){    		
	       		vm.basicData.nationalIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectGoverEconClassify&&x.pId==vm.model.nationalIndustryParent;})
	       		.toArray();
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
        	if(vm.page=='complete'){
        		init_completeList();
        	}
        }
        
        function init_todoList(){
        	taskYearPlanSvc.gridForPlan(vm);//为了获取计划类申报信息的数量
        	taskYearPlanSvc.gridForShenpi(vm);//为了获取审批类申报信息的数量
        	taskYearPlanSvc.grid(vm);//获取下一年度计划待办列表数据
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'complate',operator:'eq',value:false});//默认条件--没有完成的任务 
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--查询的任务为下一年度计划类 
				
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
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
    		taskYearPlanSvc.getHistoryInfo(vm);
    	    
    	   vm.dialog_shenbaoInfo=function(){
    		   $('#shenbaoInfo').modal({
                   backdrop: 'static',
                   keyboard:true
               });
    	   };
    	   //处理操作
    	   vm.handle=function(str){
    		   common.initJqValidation();
   			   var isValid = $('form').valid();
	   			if (isValid) {
	   				vm.isSubmit = true;
	   				taskYearPlanSvc.handle(vm,str);
	   			}
    	   };    		
    	}//init_handle
    }
})();
