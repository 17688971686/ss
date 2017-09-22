(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskCtrl', task);

    task.$inject = ['$location','taskSvc','$state','$scope','$sce']; 

    function task($location, taskSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;     
        vm.search={};
        vm.basicData={};
    	vm.page="todoList";
    	function init(){ 		
    		if($state.current.name=='task_todo'){//待办列表
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){//任务处理
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){//已办列表--下一年度计划
    			vm.page='complete';
    		}
    		if($state.current.name=='task_shenPi'){//已办列表--审批类
    			vm.page='complete_shenPi';
    		}
    		if($state.current.name=='task_shenPiDetails'){//审批类详细信息展示
    			vm.page='task_shenPiDetails';
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
           	taskSvc.getDepts(vm);
           	taskSvc.getShenBaoInfoById(vm);//查询申报信息
           	taskSvc.getTaskById(vm);
           	
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
    	
    	vm.callBack=function(){
       		window.history.back(-1);
       	};
    	   	
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
        	if(vm.page=='complete_shenPi'){
        		init_complete_shenPiList();
        	}
        	if(vm.page=='task_shenPiDetails'){
        		init_task_shenPiDetails();
        	}
        }
        
        function init_task_shenPiDetails(){
        	
        	
        	vm.getUser =function(id){
        		for (var i = 0; i < vm.model.depts.length; i++) {
    				for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
    					if(vm.model.depts[i].userDtos[j].id == id){//获得部门人员
    						return vm.model.depts[i].userDtos[j].displayName;
    					}
    				}
    			};
        	}
        	
        	//相关附件文件上传文件种类
	   		vm.relatedType=common.uploadFileTypeConfig().reviewResult;
        	 
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
      	   
	      	//打开评审结果模态框
	       	vm.showReviewResult=function(){
	       		
	       		taskSvc.getComission(vm);
	       		
	       		taskSvc.getReviewResult(vm);
	       		
	       		$('.reviewResult').modal({
	                   backdrop: 'static',
	                   keyboard:false
	               });
	       	};
      	   
	      	//查询委托书
	       	vm.proxyOpen=function(){
	       		
	       		taskSvc.getApproval(vm);
	       		
	       		taskSvc.getComission(vm);
	       		
	       		$('.proxy').modal({
	                   backdrop: 'static',
	                   keyboard:false
	            });
	       	};
      	   
	      	//拟稿纸模态框
	       	vm.draftOpen=function(){
	       		//查询发文拟稿
	       		taskSvc.getDraftIssued(vm);
	       		
	       		$('.draft_issued').modal({
	                   backdrop: 'static',
	                   keyboard:false
	               });
	       		
	       		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
		   			.toArray();//获取秘密等级信息
	       		vm.basicData.fileSet=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
		   			.toArray();//获取文件缓急信息
	       		vm.basicData.documentType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
		   			.toArray();//获取文件种类信息
	       		vm.basicData.openType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
		   			.toArray();//获取公开种类信息
	       		vm.basicData.postingCategory=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
		   			.toArray();//获取发文种类信息
	       		
	       	};
      	   
      	   //评审报批模态框
      	  vm.editApproval=function(){
	    	   taskSvc.getApproval(vm);
	    	   
	    	   $('.approval').modal({
                 backdrop: 'static',
                 keyboard:false
             });
	       };
	       
	       
        };
        
        function init_todoList(){
        	
        	taskSvc.gridForShenpi(vm);
        	taskSvc.grid(vm);
        }//end init_todoList
        
        function init_completeList(){
        	taskSvc.completeGird(vm);
        }//end init_completeList
        
        function init_complete_shenPiList(){
        	
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
     		  vm.gridOptions_complete_shenPi.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        	
        	
        	taskSvc.complete_shenPiGird(vm);
        };
    	function init_handle(){
    	   vm.processState_qianShou=common.basicDataConfig().processState_qianShou;
    	   vm.processState_tuiWen=common.basicDataConfig().processState_tuiWen;

    	   taskSvc.getTaskById(vm);//查询任务信息
    	   //taskSvc.getDept(vm);
    	  
    	   if(vm.taskType == common.basicDataConfig().taskType_monthReport){//如果为月报
    		   vm.isMonthReport = true;
    		   taskSvc.getMonthReportById(vm);//查询月报信息
    	   }else{
    		   if(vm.taskType == common.basicDataConfig().taskType_yearPlan){//如果为下一年度计划申报
    			   vm.isYearPlan = true; 
    		   }else if(vm.taskType == common.basicDataConfig().taskType_JYS){//项目建议书
    			   vm.isProjectProposal = true;
    		   }else if(vm.taskType == common.basicDataConfig().taskType_KXXYJBG){//可行性研究报告
    			   vm.isKXXYJBG = true;
    		   }else if(vm.taskType == common.basicDataConfig().taskType_CBSJYGS){//初步概算与概算
    			   vm.isCBSJYGS = true;
    		   }
    		   taskSvc.getShenBaoInfoById(vm);//查询申报信息
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
