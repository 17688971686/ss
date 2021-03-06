(function () { 
	'use strict';

    //设置一个全局查询条件,解决本功能页面跳转查询条件不被重置的问题
    var search_All = {};
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
    	vm.page="todoAuditList";
    	vm.nextUsers = [];
    	//任务处理--请求参数
        vm.id=$state.params.id;
        vm.isPass ="";
        //初始化参数
       vm.nextProcessRadio = "";
       vm.processStage_qianshou=common.basicDataConfig().processStage_qianshou;
       vm.processStage_kzshenhe=common.basicDataConfig().processStage_kzshenhe;
       vm.processStage_jbrbanli=common.basicDataConfig().processStage_jbrbanli;
       vm.processStage_weituopishen=common.basicDataConfig().processStage_weituopishen;
       vm.processState_niwendengji=common.basicDataConfig().processState_niwendengji;
       
    	function init(){
    		if($state.current.name=='task_todo_plan'){//待办列表--审批类
    			vm.page='todoPlanList';
    		}
    		if($state.current.name=='task_handle_plan'){//处理页面--审批类
    			vm.page="handlePlan";
    		}
    		if($state.current.name=='task_plan'){//已办列表--审批类
    			vm.page="task_plan";
    		}
    		if($state.current.name=='task_planDetails'){//审批类详细信息展示
    			vm.page='task_planDetails';
    		}
    		if($state.current.name=='task_todo_plan_other'){//科室列表--计划类
    			vm.page='task_todo_plan_other';
    		}
    		  if ($state.current.name == 'task_plan_keshi') {//处理页面--阅批
                  vm.page = "handleKeshi";
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
        	if(vm.page=='todoPlanList'){
        		init_todoAuditList();
        	}
        	if(vm.page=='handlePlan' || vm.page=='handleKeshi'){
        		init_handleAudit();
        	}
        	if(vm.page=='task_plan'){
        		init_complete_shenPiList();
        	}
        	if(vm.page=='task_planDetails'){
        		init_task_shenPiDetails();
        	}
        	if(vm.page=='task_todo_plan_other'){
        		init_todoAuditList_other();
        	}
        	vm.formatDateTime=function(time){
    			return common.formatDateTime(time);
    		};
        	//填写/查看评审报批单模态框
        	vm.editApproval=function(str){
        		if(str=='edit'){
        			vm.isEditApproval=true;
        		}else if(str=='look'){
        			vm.isLookApproval=true;
        		}
        		taskPlanSvc.getApproval(vm);//查询评审报批单
  	       };
  	       //填写/查看发文拟稿模态框
	  	   vm.draftOpen=function(str){
	  		   if(str=='edit'){
	  			   vm.isEditDraft=true;
	     		}else if(str=='look'){
	     			vm.isLookDraft=true;
	     		}
				taskPlanSvc.getDraftIssued(vm);//查询发文拟稿
			};
			//弹出申报详情模态框
	    	vm.dialog_shenbaoInfo=function(){
	    		$("#shenbaoInfo").modal({
	                backdrop: 'static',
	                keyboard:true
	            });
	    	};
        }
        
        function init_todoAuditList_other(){
        	taskPlanSvc.otherGrid(vm);
        	
        	vm.basicData.userUnit=common.getUserUnits();//获取所有单位
		   	 var keys = [];
	    	 vm.output = [];
	    	 angular.forEach(vm.basicData.userUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	//查询
        	vm.doSearch=function(){
        		var filters = [];
				//filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务
				
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions_plan_other.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
                vm.search = {};
                vm.doSearch();
        		//location.reload();
        	};
        };
        
        function init_todoAuditList(){
            //将全局变量查询条件的值赋给vm.search
            vm.search = search_All;

        	taskPlanSvc.grid(vm);
        	
        	vm.batchWriting = function(){
        		var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}  
                    var idStr=ids.join(',');
                    common.confirm({
        				vm:vm,
        				msg:"确认要将"+ids.length+"条数据发文吗？",
        				fn:function(){
        					$('.confirmDialog').modal('hide');
//        					projectSvc.deleteProject(vm,ids);
        				}
        			});
                }   
    		};
        	//查询
        	vm.doSearch=function(){
        		var filters = [];
//				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		    vm.gridOptions_plan.dataSource.filter(filters);
				//给全局查询条件赋值
                search_All = vm.search;
        	};
        	
        	vm.basicData.userUnit=common.getUserUnits();//获取所有单位
		   	 var keys = [];
	    	 vm.output = [];
	    	 angular.forEach(vm.basicData.userUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	//清空筛选条件
        	vm.filterClear=function(){
                vm.search = {};
                vm.doSearch();
                //清空全局查询条件
                search_All = {};
        		//location.reload();
        	};
            //页面加载的时候重新调用一次查询方法
            vm.doSearch.call();
        }//end init_todoAuditList
        
        function init_handleAudit(){
        	//查询流转信息
        	taskPlanSvc.getHistoryInfo(vm);
        	//查询申报信息
        	taskPlanSvc.getShenBaoInfoById(vm);
        	//查询批复文件
        	taskPlanSvc.replyFileGird(vm);
        	//常用意见列表
        	taskPlanSvc.opinionGird(vm);
        	//查询意见
        	taskPlanSvc.getOpinion(vm);
        	
        	vm.selectionUser = function(id){
        		
        		if(vm.nextUsers.length == 0){
        			vm.nextUsers.push(id);
        		}else{
        			var index = vm.nextUsers.indexOf(id);
    	        	if(index == -1){
    	        		vm.nextUsers.push(id);
    		       	}else{
    		       		vm.nextUsers.splice(index,1);
    		       	}	 
        		}
	        	       	
	        };
	        
/****************申报信息相关 begin**********************/ 
	        
	        vm.showActiviti=function(){
	        	taskPlanSvc.showActiviti(vm);
	        }
        	//弹出申报信息复核模态款
        	vm.dialog_shenbaoInfoEdit=function(){
        		$("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};

            //弹出资金安排信息模态款
            vm.dialog_applicationInfo=function(){
                $("#dialog_applicationInfo").modal({
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
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.shenBaoInfo.attachmentDtos){
                                 vm.model.shenBaoInfo.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.shenBaoInfo.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.shenBaoInfo.attachmentDtos){
	           			// 	 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
    	   };

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

	   		//批复文件上传配置
	   		vm.uploadOptions_pifu={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
					error:vm.uploadError,
					success:vm.uploadSuccess,
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
					error:vm.uploadError,
					success:vm.uploadSuccess,
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
                common.initJqValidation();
                var isValid = $('#formReply').valid();
                if (isValid) {
                    vm.model.shenBaoInfo.isUpdateOrSubmit = 1;
                    taskPlanSvc.saveShenBaoInfo(vm);
                }
	        };	
/****************申报信息相关 end**********************/ 
        	
        	
/****************审批附件相关 begin**********************/
        	//相关附件文件上传文件种类
	   		vm.uploadSuccess_shenpi=function(e){
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.shenBaoInfo.attachmentDtos){
                                 vm.model.shenBaoInfo.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.shenBaoInfo.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.shenBaoInfo.attachmentDtos){
	           			// 	vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
	   		};
	   		
	   		//相关附件上传配置
	   		vm.uploadOptions_shenpi={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
					error:vm.uploadError,
					success:vm.uploadSuccess_shenpi,
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
	   			 var file = vm.model.shenBaoInfo.attachmentDtos[idx];
	   			 if(file){
	   				vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
	   			 }
	         };  	
/****************审批附件相关 end**********************/
	         
/****************评审报批附件相关 begin**********************/
	       //相关附件文件上传文件种类
		   		vm.uploadSuccess_approval=function(e){
	    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
		           	 if(e.XMLHttpRequest.status==200){
                         angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                             $scope.$apply(function() {
                                 if(vm.approval.attachmentDtos){
                                     vm.approval.attachmentDtos.push({
                                         name: fileObj.originalFilename,
                                         url: fileObj.randomName,
                                         type: type
                                     });
                                 } else {
                                     vm.approval.attachmentDtos = [{
                                         name: fileObj.originalFilename,
                                         url: fileObj.randomName,
                                         type: type
                                     }];
                                 }
                             });
                         })
		           		 // var fileName=e.XMLHttpRequest.response;
		           		 // $scope.$apply(function(){
		           			//  if(vm.approval.attachmentDtos){
		           			// 	vm.approval.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
		           			//  }else{
		           			// 	vm.approval.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
		           			//  }
		           		 // });
		           	 }
		   		};
		   		
		   		//相关附件上传配置
		   		vm.uploadOptions_approval={
		   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
						error:vm.uploadError,
						success:vm.uploadSuccess_approval,
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
        		vm.processSuggestion = vm.model.opinion;
        	};
        	
        	//保存常用意见
        	vm.saveOpinion=function(){
        		if(vm.processSuggestion != "" && vm.processSuggestion != undefined){
        			taskPlanSvc.saveOpinion(vm);
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
/****************常用意见相关 end**********************/        	
        	
	  	   	//保存审批单
	       	vm.saveApproval=function(){
	       		taskPlanSvc.saveApproval(vm);
	       	};
	       	//保存发文拟稿
        	vm.saveDraft=function(){
        		taskPlanSvc.saveDraft(vm);
        	};
		   //处理
        	vm.handle=function(str){
        		if(vm.isPass == false){
        			vm.isPass = "";
        		}
        		if(vm.isPass2 == 6){
        			vm.nextUsers = "";
        		}
        		if(vm.nextUsers == "" && str == "next" && vm.model.shenBaoInfo.thisTaskName == 'usertask4'){
        			common.alert({
						vm : vm,
						msg : "请选择经办人后提交！",
						fn : function() {
							$('.alertDialog').modal('hide');
						}
					});
        		}
//        		else if(vm.model.shenBaoInfo.thisTaskName == 'usertask5' && str == "next" && (vm.model.shenBaoInfo.xdPlanReach_ggys == 0 || vm.model.shenBaoInfo.xdPlanReach_gtzj == 0)) {
//        			common.alert({
//						vm : vm,
//						msg : "请填写安排资金后提交！",
//						fn : function() {
//							$('.alertDialog').modal('hide');
//						}
//					});
//        		}
        		else{
        			taskPlanSvc.handle(vm,str);
        		}
        		
        	};
        	vm.pinglun=function(){
        		taskPlanSvc.pinglun(vm);
        	}
/****************审批处理相关 end**********************/       	
        }//end init_handleAudit
        
        function init_complete_shenPiList(){
        	taskPlanSvc.complete_shenPiGird(vm);
        	
        	vm.basicData.userUnit=common.getUserUnits();//获取所有单位
		   	 var keys = [];
	    	 vm.output = [];
	    	 angular.forEach(vm.basicData.userUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	//查询
        	vm.doSearch=function(){
        		var filters = [];
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.title});
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
        	vm.filterClear = function(){
                vm.search = {};
                vm.doSearch();
        		//location.reload();
        	};
        }//end#init_complete_shenPiList
        
        function init_task_shenPiDetails(){
        	//查询流转信息
        	taskPlanSvc.getHistoryInfo(vm);
        	//查询申报信息
        	taskPlanSvc.getShenBaoInfoById(vm);
        	//查询批复文件
        	taskPlanSvc.replyFileGird(vm);
        	
            vm.showActiviti=function(){
	        	taskPlanSvc.showActiviti(vm);
	        }
        	//弹出申报信息复核模态款
        	vm.dialog_shenbaoInfoEdit=function(){
        		$("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	
        	 //复核申报信息保存
	        vm.saveShenBaoInfo=function(){
                common.initJqValidation();
                var isValid = $('#formReply').valid();
                if (isValid) {
                    taskPlanSvc.saveShenBaoInfo(vm);
                }
	        };
        }//end#init_task_shenPiDetails
    
    }
})();
