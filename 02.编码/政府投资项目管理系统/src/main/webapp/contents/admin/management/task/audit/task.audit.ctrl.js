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
    	vm.taskRecord={};
    	vm.page="todoAuditList";
    	
    	//任务处理--请求参数
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;
        
        //初始化参数
       vm.nextProcessRadio = "";
       vm.processStage_qianshou=common.basicDataConfig().processStage_qianshou;
       vm.processStage_kzshenhe=common.basicDataConfig().processStage_kzshenhe;
       vm.processStage_jbrbanli=common.basicDataConfig().processStage_jbrbanli;
       vm.processStage_weituopishen=common.basicDataConfig().processStage_weituopishen;
       vm.processState_niwendengji=common.basicDataConfig().processState_niwendengji;

    	function init(){
    		if($state.current.name=='task_todo_audit'){//待办列表--审批类
    			vm.page='todoAuditList';
    		}
    		if($state.current.name=='task_handle_audit'){//处理页面--审批类
    			vm.page="handleAudit";
    		}
    		if($state.current.name=='task_shenPi'){//已办列表--审批类
    			vm.page="complete_shenPi";
    		}
    		if($state.current.name=='task_shenPiDetails'){//审批类详细信息展示
    			vm.page='task_shenPiDetails';
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
        	vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
				.toArray();//社会投资行业
        	vm.basicData.projectClassify_ZF=$linq(common.getBasicData())
       			.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
       			.toArray();//政府项目分类
        	vm.basicData.projectClassify_SH=$linq(common.getBasicData())
   				.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
   				.toArray();//社会项目分类
        	vm.basicData.area_Street=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
				.toArray(); //行政区划街道
        	vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.taskType=common.getBacicDataByIndectity(common.basicDataConfig().taskType);//任务类型
   	   		vm.basicData.hecretHierarchy=common.getBacicDataByIndectity(common.basicDataConfig().hecretHierarchy)//获取秘密等级信息
   	   		vm.basicData.fileSet=common.getBacicDataByIndectity(common.basicDataConfig().fileSet);//获取文件缓急信息
   	   		vm.basicData.documentType=common.getBacicDataByIndectity(common.basicDataConfig().documentType);//获取文件种类信息
   	   		vm.basicData.openType=common.getBacicDataByIndectity(common.basicDataConfig().openType);//获取公开种类信息
			vm.basicData.postingCategory=common.getBacicDataByIndectity(common.basicDataConfig().postingCategory);//获取发文种类信息
			vm.basicData.taskTypeForShenPi=[common.basicDataConfig().taskType_JYS,common.basicDataConfig().taskType_KXXYJBG,
											common.basicDataConfig().taskType_CBSJYGS,common.basicDataConfig().taskType_ZJSQBG];
			//国民经济行业分类
	   		vm.basicData.nationalIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
	   		vm.nationalIndustryChange=function(){    		
	       		vm.basicData.nationalIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectGoverEconClassify&&x.pId==vm.model.shenBaoInfo.nationalIndustryParent;})
	       		.toArray();
	   		}
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
        	if(vm.page=='complete_shenPi'){
        		init_complete_shenPiList();
        	}
        	if(vm.page=='task_shenPiDetails'){
        		init_task_shenPiDetails();
        	}
        	
        	//填写/查看评审报批单模态框
        	vm.editApproval=function(str){
        		if(str=='edit'){
        			vm.isEditApproval=true;
        		}else if(str=='look'){
        			vm.isLookApproval=true;
        		}
        		taskAuditSvc.getApproval(vm);//查询评审报批单
  	       };
  	       //填写/查看发文拟稿模态框
	  	   vm.draftOpen=function(str){
	  		   if(str=='edit'){
	  			   vm.isEditDraft=true;
	     		}else if(str=='look'){
	     			vm.isLookDraft=true;
	     		}
				taskAuditSvc.getDraftIssued(vm);//查询发文拟稿
			};
			//弹出申报详情模态框
	    	vm.dialog_shenbaoInfo=function(){
	    		$("#shenbaoInfo").modal({
	                backdrop: 'static',
	                keyboard:true
	            });
	    	};
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
        }//end init_todoAuditList
        
        function init_handleAudit(){
        	//查询任务信息
        	taskAuditSvc.getTaskInfoById(vm);
        	//查询申报信息
        	taskAuditSvc.getShenBaoInfoById(vm);
        	//查询批复文件
        	taskAuditSvc.replyFileGird(vm);
        	//常用意见列表
        	taskAuditSvc.opinionGird(vm);
        	//查询意见
        	taskAuditSvc.getOpinion(vm);
	
        	
/****************申报信息相关 begin**********************/ 
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
	        	taskAuditSvc.saveShenBaoInfo(vm);
	        };	
/****************申报信息相关 end**********************/ 
        	
        	
/****************审批附件相关 begin**********************/
        	//相关附件文件上传文件种类
	   		vm.uploadSuccess_shenpi=function(e){
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
	   		vm.uploadOptions_shenpi={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess_shenpi,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		
	   		//删除上传文件
	   		 vm.delFile_shenpi=function(idx){
	   			 var file = vm.taskRecord.attachmentDtos[idx];
	   			 if(file){
	   				vm.taskRecord.attachmentDtos.splice(idx,1);
	   			 }
	         };  	
/****************审批附件相关 end**********************/
	         
/****************评审报批附件相关 begin**********************/
	       //相关附件文件上传文件种类
		   		vm.uploadSuccess_approval=function(e){
	    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
		           	 if(e.XMLHttpRequest.status==200){
		           		 var fileName=e.XMLHttpRequest.response;
		           		 $scope.$apply(function(){
		           			 if(vm.approval.attachmentDtos){
		           				vm.approval.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
		           			 }else{
		           				vm.approval.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
		           			 }                			           			
		           		 });
		           	 }
		   		};
		   		
		   		//相关附件上传配置
		   		vm.uploadOptions_approval={
		   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
		   				error:vm.uploadSuccess_approval,	   				
		   				localization:{select:'上传文件'},
		   				showFileList:false,
		   				multiple:true,
		   				validation: {
		   	                maxFileSize: common.basicDataConfig().uploadSize
		   	            },
		   	            select:vm.onSelect
		   		};
		   		
		   		//删除上传文件
		   		 vm.delFile_approval=function(idx){
		   			 var file = vm.approval.attachmentDtos[idx];
		   			 if(file){
		   				vm.approval.attachmentDtos.splice(idx,1);
		   			 }
		         };
/****************评审报批附件相关 end**********************/

/****************常用意见相关 begin**********************/
        	//切换常用意见
        	vm.changeOpin=function(){
        		vm.taskRecord.processSuggestion = vm.model.opinion;
        	};
        	
        	//保存常用意见
        	vm.saveOpinion=function(){
        		if(vm.taskRecord.processSuggestion != "" && vm.taskRecord.processSuggestion != undefined){
        			taskAuditSvc.saveOpinion(vm);
        		}
        	};
        	
        	//常用意见管理模态框
        	vm.showOpinion = function(){
        		$('.opinion').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        		 vm.opinionGrid.dataSource.read();
        	};
        	//删除意见
        	vm.del = function (id) {       	 
              	$('.confirmDialog').modal('hide');             	
              	taskAuditSvc.deleteOpin(vm,id);
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
        		taskAuditSvc.editOpin(vm);
        	};
        	//删除意见
        	vm.remove=function(id){
        		taskAuditSvc.deleteOpin(vm,id);
        	};
/****************常用意见相关 end**********************/        	
        	
/****************审批处理相关 begin**********************/
        	//下一处理环节选择
        	vm.selectNextProcess=function(e){
    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processStage_jbrbanli){//经办人办理
    				vm.isShowDeptUsers=true;//显示投资科人员
    			}
    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processStage_qianshou){//退回重办
    				vm.isShowDeptUsers=false;//隐藏投资科人员
    			}
    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processStage_weituopishen){//委托审批
    				vm.isShowPingShenBaoPiDan=true;//显示评审报批单按钮
    			}
    			if(vm.taskRecord.nextProcess==common.basicDataConfig().processState_niwendengji){//发文拟稿
    				vm.isShowPingShenBaoPiDan=false;//显示发文拟稿按钮
    			}
        	};
	  	   	//保存审批单
	       	vm.saveApproval=function(){
	       		taskAuditSvc.saveApproval(vm);
	       	};
	       	//保存发文拟稿
        	vm.saveDraft=function(){
        		taskAuditSvc.saveDraft(vm);
        	};
		   //处理
        	vm.handle=function(str){
        		vm.taskRecord.thisProcess=vm.taskAudit.thisProcess;
    			vm.taskRecord.thisUser=vm.taskAudit.thisUser;
    			vm.taskRecord.thisRole=vm.taskAudit.thisRole;
        		if(str == 'next'){
        			vm.taskRecord.thisProcessState=common.basicDataConfig().processState_pass;
        			var thisProcess = vm.taskAudit.thisProcess;
        			if(thisProcess == common.basicDataConfig().processStage_qianshou){//投资科审核收件办理
        				vm.taskRecord.nextProcess=common.basicDataConfig().processStage_kzshenhe;
        			}
        			if(thisProcess == common.basicDataConfig().processStage_kzshenhe){//投资科科长审核
        				if(vm.taskRecord.nextProcess == common.basicDataConfig().processStage_qianshou){//如果选择的是退回重办
        					vm.taskRecord.thisProcessState=common.basicDataConfig().processState_notpass;
        					vm.taskRecord.nextUser=vm.taskAudit.lastUser;
            				vm.taskRecord.nextRole=vm.taskAudit.lastRole;
        				}
        			}
        			if(thisProcess == common.basicDataConfig().processStage_weituopishen){//委托评审科长审核
        				//TODO 下一步的流程应该对接OA给评审中心
        				vm.taskRecord.nextProcess=common.basicDataConfig().processState_pszxsp;
        				vm.taskRecord.nextUser=vm.taskAudit.lastUser;
        				vm.taskRecord.nextRole=vm.taskAudit.lastRole;
        			}
        			if(thisProcess == common.basicDataConfig().processState_niwendengji){//发文拟稿科长审核
        				//TODO 下一步的流程应该对接OA给秘书科
        				vm.taskRecord.nextProcess=common.basicDataConfig().processState_mskfawen;
        				vm.taskRecord.nextUser=vm.taskAudit.lastUser;
        				vm.taskRecord.nextRole=vm.taskAudit.lastRole;
        			}
        			if(thisProcess == common.basicDataConfig().processState_pszxsp){//科员线下流程--评审中心--上传评审结果
        				//TODO 
        				vm.taskRecord.nextProcess=common.basicDataConfig().processStage_jbrbanli;
        				vm.taskRecord.nextUser=vm.taskAudit.thisUser;
        				vm.taskRecord.nextRole=vm.taskAudit.thisRole;
        			}
        			if(thisProcess == common.basicDataConfig().processState_mskfawen){//科员线下流程--审批结束--上传OA结果
        				//TODO 
        				vm.taskRecord.thisProcessState=common.basicDataConfig().processState_pass;
        				vm.taskRecord.nextProcess=common.basicDataConfig().processStage_jbrbanli;
        				vm.taskRecord.nextUser=vm.taskAudit.thisUser;
        				vm.taskRecord.nextRole=vm.taskAudit.thisRole;
        			}
    				
        		}
        		if(str == 'reback'){
        			vm.taskRecord.thisProcessState=common.basicDataConfig().processState_notpass;
        			vm.taskRecord.nextProcess=vm.taskAudit.lastProcess;
    				vm.taskRecord.nextUser=vm.taskAudit.lastUser;
    				vm.taskRecord.nextRole=vm.taskAudit.lastRole;
        		}
        		if(str == 'tuiwen'){
        			vm.taskRecord.thisProcessState=common.basicDataConfig().processState_tuiwen;
        		}
        		taskAuditSvc.handle(vm);
        	};
/****************审批处理相关 end**********************/       	
        }//end init_handleAudit
        
        function init_complete_shenPiList(){
        	taskAuditSvc.complete_shenPiGird(vm);
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
        }//end#init_complete_shenPiList
        
        function init_task_shenPiDetails(){
        	taskAuditSvc.getTaskInfoById(vm);//查询任务信息
        	taskAuditSvc.getShenBaoInfoById(vm);//查询申报信息
        }//end#init_task_shenPiDetails
    }
})();
