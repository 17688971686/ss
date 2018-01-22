(function () { 
	'use strict';

    angular
        .module('app')
        .controller('taskPlanCtrl', taskPlan);

    taskPlan.$inject = ['$location','taskPlanSvc','$state','$scope','$sce','$rootScope']; 

    function taskPlan($location, taskPlanSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.search={};
    	vm.basicData={};
    	vm.taskRecord={};
    	vm.page="todoPlanList";
    	vm.task ="";
    	//任务处理--请求参数
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;
        
 
    	function init(){
    		if($state.current.name=='task_handle_plan'){//处理页面
    			vm.page="handlePlan";
    		}
    		if($state.current.name=='task_plan'){//处理页面
    			vm.page="task_plan";
    		}
    		if($state.current.name=='task_planDetails'){//展示页面
    			vm.page="task_planDetails";
    		}
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		}; 		
    		vm.getProcessUser = function(id){
    			return common.getUserById(id);
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
           	
           	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	
           	//初始化审批流程
            vm.processStage_qianshou=common.basicDataConfig().processStage_qianshou;
            vm.processStage_kzshenhe=common.basicDataConfig().processStage_kzshenhe;
            vm.processStage_jbrbanli=common.basicDataConfig().processStage_jbrbanli;
            vm.processStage_zbqitaren=common.basicDataConfig().processStage_zbqitaren;
            vm.processState_niwendengji=common.basicDataConfig().processState_niwendengji;
           	
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   				.toArray(); //行政区划街道
    	};
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoPlanList'){//待办列表
        		init_todoPlanList();
        	}
        	if(vm.page=='handlePlan'){//处理页面
        		init_handlePlan();
        	}
        	if(vm.page=='task_plan'){//已办列表
        		init_task_plan();
        	}
        	if(vm.page=='task_planDetails'){//办理详情
        		init_task_planDetails();
        	}
        	//弹出申报详情模态框
        	vm.dialog_shenbaoInfo=function(){
        		$("#shenbaoInfo").modal({
                    backdrop: 'static',
                    keyboard:true
                });
        	};
        	 //填写/查看下达计划模态框
   	   		vm.editPlanReach=function(str){
        		if(str=='edit'){
        			vm.isEditPlanReach=true;
        		}else if(str=='look'){
        			vm.isLookPlanReach=true;
        		}
        		taskPlanSvc.getShenBaoInfoById(vm);
  	       };
        }
        
        function init_task_planDetails(){
        	taskPlanSvc.getTaskInfoById(vm);//查询任务信息
        	taskPlanSvc.getShenBaoInfoById(vm);//查询申报信息
        }//end fun init_task_planDetails
        
        function init_todoPlanList(){
        	taskPlanSvc.grid_plan(vm);
        	
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
     		  vm.gridOptions_plan.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_task_plan(){
	       	taskPlanSvc.complete_PlanGird(vm);
	       	
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
     		  vm.gridOptions_complete_plan.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end fun init_task_plan
        
        function init_handlePlan(){
        	
        	//查询申报信息
        	taskPlanSvc.getShenBaoInfoById(vm);
        	//查询任务信息
        	taskPlanSvc.getTaskInfoById(vm);
        	//查询批复文件
        	taskPlanSvc.replyFileGird(vm);
        	//常用意见列表
        	taskPlanSvc.opinionGird(vm);
        	//获取意见
        	taskPlanSvc.getOpinion(vm);
       
    	/********申报信息相关 begin ****************/
        	//弹出申报信息复核模态款
        	vm.dialog_shenbaoInfoEdit=function(){
        		$("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.projectTypes.indexOf(id);
	        	if(index == -1){
	        		vm.projectTypes.push(id);
		       	}else{
		       		vm.projectTypes.splice(index,1);
		       	}	        	
	        };
	      //文件上传成功
	    	   vm.uploadSuccess=function(e){
	   			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
		           	 if(e.XMLHttpRequest.status==200){
		           		 var fileName=e.XMLHttpRequest.response;
		           		 $scope.$apply(function(){
		           			 if(vm.model.shenBaoInfo.attachmentDtos){
		           				 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
		           			 }else{
		           				 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
		           			 }                			           			
		           		 });
		           	 }
	    	   };
		  		
		   		//批复文件上传配置
		   		vm.uploadOptions_pifu={
		   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
		   				error:vm.uploadSuccess,	   				
		   				localization:{select:'上传文件'},
		   				showFileList:false,
		   				multiple:false,
		   				validation: {
		   	                maxFileSize: common.basicDataConfig().uploadSize
		   	            },
		   	            select:vm.onSelect
		   		};
		   		//相关附件上传配置
		   		vm.uploadOptions={
		   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
		   				error:vm.uploadSuccess,	   				
		   				localization:{select:'上传文件'},
		   				showFileList:false,
		   				multiple:true,
		   				validation: {
		   	                maxFileSize: common.basicDataConfig().uploadSize
		   	            },
		   	            select:vm.onSelect
		   		};
				//删除上传文件
				vm.delFile=function(idx){
					var file = vm.model.shenBaoInfo.attachmentDtos[idx];
					if(file){//删除上传文件的同时删除批复文号
						var pifuType = file.type;
						vm.model.shenBaoInfo['pifu'+pifuType+'_wenhao'] = "";
						vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
					 }
				 };
				//展示批复文件选择模态框
		   		vm.choseDocument = function(e){
		   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
	        	   $("#documentRecords").modal({
				        backdrop: 'static',
				        keyboard:false  			  
	        	   });
	        	   vm.replyFileGridOptions.dataSource.read();//批复文件列表数据刷新
		   		};
			   		
		   		//批复文件选择模态框确认
		   		vm.pifuChoseConfirm = function(){
		   			//关闭模态框
		   			$("#documentRecords").modal('hide');
		   			//获取选择框中的信息
		   			var select = common.getKendoCheckId('.grid');
	            	var fileName = select[0].value;
	            	if(fileName){
	            		var file = common.stringToArray(fileName,",");
	            		var number = file[0];
	            		var name = file[1];
	            		var url =file[2];
	            		vm.model.shenBaoInfo['pifu'+vm.pifuType+'_wenhao'] = number;
	            		if(vm.model.shenBaoInfo.attachmentDtos){
	         				  vm.model.shenBaoInfo.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
	         			 }else{
	         				  vm.model.shenBaoInfo.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
	         			 }
	            	}
		        };
		       //批复文件列表模态框关闭
		        vm.dismissReplyFile=function(){
		        	$("#documentRecords").modal('hide');
		        };
		      //复核申报信息保存
		        vm.saveShenBaoInfo=function(){
		        	taskPlanSvc.saveShenBaoInfo(vm);
		        };
       /********申报信息相关 end ****************/
        	
        	   
		/********常用意见相关 begin ****************/
        	//切换常用意见
        	vm.changeOpin=function(){
        		vm.taskRecord.processSuggestion = vm.model.opinion;
        	};
        	
        	//常用意见管理模态框
        	vm.showOpinion = function(){
        		$('.opinion').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        		vm.opinionGrid.dataSource.read();
        	};
        	//保存常用意见
        	vm.saveOpinion=function(){
        		if(vm.taskRecord.processSuggestion != "" && vm.taskRecord.processSuggestion != undefined){
        			taskPlanSvc.saveOpinion(vm);
        		}
        	};
        	//编辑模态框
        	vm.edit=function(id,opin){
        		$('.opinionEdit').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		vm.model.opinion = {"opinion":opin,"id":id};
        	};
        	
        	//编辑意见
        	vm.editOpin=function(){
        		taskPlanSvc.editOpin(vm);
        	};
        	
        	//删除意见
        	vm.remove=function(id){
        		taskPlanSvc.deleteOpin(vm,id);
        	};
        	
        	vm.del = function (id) {       	 
              	$('.confirmDialog').modal('hide');             	
              	taskPlanSvc.deleteOpin(vm,id);
            };
        	
        	//批量删除意见
        	vm.dels = function () {     
             	var selectIds = common.getKendoCheckId('.grid');
                 if (selectIds.length == 0) {
                 	common.alert({
                     	vm:vm,
                     	msg:'请选择数据！'               	
                     });
                 } else {
                 	var ids=[];
                     for (var i = 0; i < selectIds.length; i++) {
                     	ids.push(selectIds[i].value);
     				}  
                     var idStr=ids.join(',');
                     vm.del(idStr);
                 } 
            };
	   /********常用意见相关 end ****************/
        	
       /********审批上传附件相关 begin ****************/
        	//选择上传文件验证文件大小
			vm.onSelect=function(e){
				$.each(e.files, function (index, value) {
			        if(value.size > common.basicDataConfig().uploadSize){
			        	$scope.$apply(function(){
			   				common.alert({
				        		vm : vm,
								msg : "上传文件过大！"
				            });               			           			
			      		 });
			        }
			        
			    });
			};
			//相关附件文件上传文件种类
	   		vm.uploadSuccess_jhxd=function(e){
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.taskRecord.attachmentDtos){
	           				vm.taskRecord.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				vm.taskRecord.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
	   		};
	   		
	   		//相关附件上传配置
	   		vm.uploadOptions_jhxd={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess_jhxd,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		
	   		//删除上传文件
	   		 vm.delFile_jhxd=function(idx){
	   			 var file = vm.taskRecord.attachmentDtos[idx];
	   			 if(file){
	   				vm.taskRecord.attachmentDtos.splice(idx,1);
	   			 }
	         };
       /********审批上传附件相关 end ****************/
	         
	   /********审批操作相关 end ****************/
	       //下一处理环节选择
	        	vm.selectNextProcess=function(){
	    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processStage_jbrbanli){//经办人办理
	    				vm.isShowDeptUsers=true;//显示投资科人员
	    			}
	    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processStage_qianshou){//退回重办
	    				vm.isShowDeptUsers=false;//隐藏投资科人员
	    			}
	    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processStage_zbqitaren){//转办其他人
	    				vm.isShowDeptUsers=true;//显示投资科人员
	    				vm.isShowXiaDaJiHuaBtn=false;
	    			}
	    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processState_niwendengji){//下达计划拟文
	    				vm.isShowXiaDaJiHuaBtn=true;//显示下达计划拟文按钮
	    				vm.isShowDeptUsers=false;
	    			}
	        	};
	        //保存计划下达
	        	vm.savePlanReach=function(){
	        		taskPlanSvc.savePlanReach(vm);
	        	};
	       //处理
	        	vm.handle=function(str){
	        		vm.taskRecord.thisProcess=vm.taskPlan.thisProcess;
	    			vm.taskRecord.thisUser=vm.taskPlan.thisUser;
	    			vm.taskRecord.thisRole=vm.taskPlan.thisRole;
	        		if(str == 'next'){
	        			vm.taskRecord.thisProcessState=common.basicDataConfig().processState_pass;
	        			var thisProcess = vm.taskPlan.thisProcess;
	        			if(thisProcess == common.basicDataConfig().processStage_qianshou){//投资科审核收件办理
	        				vm.taskRecord.nextProcess=common.basicDataConfig().processStage_kzshenhe;
	        			}
	        			if(thisProcess == common.basicDataConfig().processStage_kzshenhe){//投资科科长审核
	        				if(vm.taskRecord.nextProcess == common.basicDataConfig().processStage_qianshou){//如果选择的是退回重办
	        					vm.taskRecord.thisProcessState=common.basicDataConfig().processState_notpass;
	        					vm.taskRecord.nextUser=vm.taskPlan.lastUser;
	            				vm.taskRecord.nextRole=vm.taskPlan.lastRole;
	        				}
	        			}
	        			if(thisProcess == common.basicDataConfig().processStage_weituopishen){//委托评审科长审核
	        				//TODO 下一步的流程应该对接OA给评审中心
	        				vm.taskRecord.nextProcess=common.basicDataConfig().processState_pszxsp;
	        			}
	        			if(thisProcess == common.basicDataConfig().processState_niwendengji){//发文拟稿科长审核
	        				//TODO 下一步的流程应该对接OA给秘书科
	        				vm.taskRecord.nextProcess=common.basicDataConfig().processState_mskfawen;
	        			}
	    				
	        		}
	        		if(str == 'reback'){
	        			vm.taskRecord.thisProcessState=common.basicDataConfig().processState_notpass;
	        			vm.taskRecord.nextProcess=vm.taskPlan.lastProcess;
	    				vm.taskRecord.nextUser=vm.taskPlan.lastUser;
	    				vm.taskRecord.nextRole=vm.taskPlan.lastRole;
	        		}
	        		taskPlanSvc.handle(vm);
	        	};
	   /********审批操作相关 end ****************/
        }//end init_handleAudit
    }
})();
