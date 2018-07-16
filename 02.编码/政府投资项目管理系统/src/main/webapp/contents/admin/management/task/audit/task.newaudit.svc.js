(function() {
	'use strict';

	var app = angular.module('app').factory('taskNewAuditSvc', taskNewAudit);
	app.filter('unique', function() {
		   return function(collection, keyname) {
		      var output = [], 
		          keys = [];

		      angular.forEach(collection, function(item) {
		          var key = item[keyname];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              output.push(item);
		          }
		      });

		      return output;
		   };
		});
	taskNewAudit.$inject = [ '$http' ,'$location'];

	function taskNewAudit($http,$location) {
		var url_taskAudit = "/management/task/audit";
		var url_taskAudit_other = "/management/task/auditOther";
		var url_taskAudit_yuepi = "/management/task/yuepi";
		var url_taskAudit_new = "/management/task";
		var url_taskRecord_shenPi = "/management/taskRecord/shenPi";
		var url_shenbao = "/management/shenbao";
		var url_dept="/org";
		var url_back = "#/task/todo_audit";
		var url_replyFile = "/management/replyFile";
		var url_role="/role";
		var url_opin="/opin";
		var url_users = "/user";
		var url_draft ="/management/draft";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		var url_pic = "/pic/task";
		var url_document="/shenbaoAdmin/replyFile";
		var url_getSysConfigs = "/sys/getSysConfigs";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		
		var service = {
			grid : grid,//待办任务列表
			complete_shenPiGird:complete_shenPiGird,//已办列表
			getShenBaoInfoById:getShenBaoInfoById,//查询申报信息
			getDeptByName:getDeptByName,//查询投资科
			handle:handle,//送出
			replyFileGird:replyFileGird,//批复文件库列表
			saveShenBaoInfo:saveShenBaoInfo,//保存申报信息
			saveOpinion:saveOpinion,//保存意见
			getOpinion:getOpinion,//获取意见
			opinionGird:opinionGird,//意见列表
			deleteOpin:deleteOpin,//删除意见
			editOpin:editOpin,//编辑意见
			getDraftIssued:getDraftIssued,//查询发文拟稿
			saveDraft:saveDraft,//保存发文信息
			saveApproval:saveApproval,//评审报批
			getApproval:getApproval,//查询评审报批
			getHistoryInfo:getHistoryInfo,//查询流转信息
			getAssigneeByUserId:getAssigneeByUserId,//登录人员是否是指定办理人员
			pinglun:pinglun,//评论
			getUnfinished:getUnfinished,//获取未进行的活动
			showActiviti:showActiviti,
			documentRecordsGird:documentRecordsGird,
			otherGrid:otherGrid,//科室办件列表
			yuepiGrid:yuepiGrid,//阅批列表
			yuepi:yuepi,//阅批按钮
			getSysConfigs:getSysConfigs,//系统配置
			getUserUnit:getUserUnit
		};
		
		return service;
		
		function yuepi(vm,id) {
			var httpOptions = {
				method : 'post',
				url : common.format(url_taskAudit_new + "/yuepi/"+id)
			}
			var httpSuccess = function success(response) {
				if(vm.page == 'handleYuepi'){
					location.href="javascript:window.history.back(-1)";
				}
				vm.gridOptions_yuepi.dataSource.read();
			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		function showActiviti(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_pic + "/picture/"+vm.model.shenBaoInfo.zong_processId)
			}
			var httpSuccess = function success(response) {
//				vm.unfinished = response.data;
			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		function getUnfinished(vm,processId) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_taskAudit_new + "/unfinished/"+processId)
			}
			var httpSuccess = function success(response) {

				vm.unfinished = response.data;
			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		function getAssigneeByUserId(vm,processId) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_taskAudit_new + "/isAssignee/"+processId)
			}
			var httpSuccess = function success(response) {

				vm.isShow = response.data.success;
			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		/*
		 * 流转信息
		 */
		function getHistoryInfo(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_taskAudit_new + "/his/" + vm.id)
			}
			var httpSuccess = function success(response) {

				vm.taskRecord = response.data;
			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 获取评审报批单的信息
		 */
		function getApproval(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_approval + "?$filter=relId eq '{0}'",vm.model.shenBaoInfo.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.approval = response.data.value[0] || {};
						if(vm.approval.id){
							vm.approval.beginDate= common.formatDate(vm.approval.beginDate);
							vm.processRoleName=vm.getUserName(vm.approval.processRole);
						}else{
							//初始化相关数据
			        		vm.approval.approvalType = vm.model.shenBaoInfo.projectShenBaoStage;
			        		vm.approval.beginDate = common.formatDate(new Date());
			        		vm.approval.projectName=vm.model.shenBaoInfo.projectName;
			        		vm.approval.projectNumber=vm.model.shenBaoInfo.projectNumber;
			        		vm.approval.constructionUnit=vm.model.shenBaoInfo.constructionUnit;
			        		vm.approval.unitName=vm.model.shenBaoInfo.bianZhiUnitInfoDto.unitName;
			        		vm.approval.relId=vm.model.shenBaoInfo.id;
			        		vm.approval.processRole=window.profile_userId;//初始化填写评审报批单的经办人为任务当前处理人
			        		if(vm.isLookDraft == true){
			        			vm.processRoleName="";
			        		}else{
			        			vm.processRoleName=window.profile_userName;
			        		}
			        		
						}
					
						$('#approval').modal({
		                    backdrop: 'static',
		                    keyboard:false
		                });
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 * 保存评审报批单的信息
		 */
		function saveApproval(vm){
			common.initJqValidation();
 			var isValid = $('#formApproval').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : url_approval,
						data : vm.approval
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
									$('#approval').modal('hide');
								}
							});
						}
					});
				};
					
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
	   		}
		}//end fun saveApproval
		
		/**
		 * 获取发文拟稿信息
		 */
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "?$filter=relId eq '{0}'",vm.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data.value[0] || {};
						if(vm.draft.id){
							vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
							vm.userNameAndUnitName=vm.getUserName(vm.draft.userNameAndUnit);
						}else{
							//初始化相关数据
			        		vm.draft.draftDate = common.formatDate(new Date());
			        		vm.draft.fileType=vm.model.shenBaoInfo.projectShenBaoStage;
			        		vm.draft.projectName=vm.model.shenBaoInfo.projectName;
			        		vm.draft.projectNumber=vm.model.shenBaoInfo.projectNumber;
			        		vm.draft.unitName=vm.model.shenBaoInfo.constructionUnit;
			        		vm.draft.capitalTotal=vm.model.shenBaoInfo.projectInvestSum;
//			        		vm.draft.userNameAndUnit=vm.taskAudit.thisUser;//初始化拟稿人为任务当前处理人
			        		vm.draft.relId=vm.model.shenBaoInfo.id;
			        		vm.draft.userNameAndUnit=window.profile_userId;//初始化填写评审报批单的经办人为任务当前处理人
			        		vm.userNameAndUnitName = window.profile_userName;
			        		if(vm.isLookApproval== true){
			        			vm.userNameAndUnitName = "";
			        		}else{
			        			vm.userNameAndUnitName = window.profile_userName;
			        		}
						}
					
						$('#draft_issued').modal({
						   backdrop: 'static',
						   keyboard:false
						});
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getDraftIssued
		
		/**
		 * 保存发文拟稿信息
		 */
		function saveDraft(vm){
			common.initJqValidation();
 			var isValid = $('#formDraft').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : url_draft,
						data : vm.draft
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
									$('#draft_issued').modal('hide');
								}
							});
						}
					});
				};
					
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
	   		}
		}//end fun saveDraft
		
		/**
		 * 查询意见
		 */
		function getOpinion(vm){
			var httpOptions = {
					method : 'get',
					url : url_opin
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.opinionDtos = response.data.value||{};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getOpinion
		
		
		//编辑意见
		function editOpin(vm){
			var httpOptions = {
                method: 'post',
                url:url_opin+'/editOpin',
                data:vm.model.opinion          
            };
	            
            var httpSuccess = function success(response) {
            	common.requestSuccess({
            		vm:vm,
            		response:response,
            		fn:function(){
            			$('#opinionEdit').modal('hide');
            			vm.opinionGrid.dataSource.read();
            			getOpinion(vm);
            		}
            	});
            };
	            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun editOpin
		
		//删除意见
		function deleteOpin(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'post',
                url:url_opin+'/deleteOpin',
                data:id 
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.opinionGrid.dataSource.read();
	                    getOpinion(vm);
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun deleteOpin	

		
		/**
		 * 保存意见
		 */
		function saveOpinion(vm){
			var httpOptions = {
					method : 'post',
					url : url_opin,
					data : {"opinion":vm.processSuggestion}
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
								getOpinion(vm);
							}
						});
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun saveOpinion
		
		
		/**
		 * 保存申报信息
		 */
		function saveShenBaoInfo(vm){
			var httpOptions = {
					method : 'post',
					url : url_shenbao+'/update',
					data:vm.model.shenBaoInfo
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
								$('#shenbaoInfoEdit').modal('hide');
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun saveShenBaoInfo
		
		/**
		 * 根据id查询申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.isSHInvestment = false;
						vm.isZFInvestment = false;
						vm.model.shenBaoInfo = response.data.value[0] || {};
						//数据的展示处理
						//项目类型
						vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						vm.attachmentDtos = vm.model.shenBaoInfo.attachmentDtos;
						//判断投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
							vm.basicData.projectClassify=vm.basicData.projectClassify_SH;//基础数据--项目分类
							vm.basicData.projectIndustry=vm.basicData.projectIndustry_SH;//基础数据--行业归口
							vm.basicData.projectConstrChar=vm.basicData.projectConstrChar;//基础数据--项目建设性质
							vm.projectIndustryChange=function(){    		
			    	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
				    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
				    	       		.toArray();
		     			   };
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
							vm.basicData.projectClassify=vm.basicData.projectClassify_ZF;//基础数据--项目分类
							vm.basicData.projectIndustry=vm.basicData.projectIndustry_ZF;//基础数据--行业归口
						}
						//判断申报阶段
						if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
							vm.isProjectProposal=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
							vm.isKXXYJBG=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
							vm.isCBSJYGS=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_capitalApplyReport){//申报阶段为:资金申请报告
							vm.isCapitalApplyReport=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_capitalApplyReport;
						}
						//时间的显示
						vm.model.shenBaoInfo.createdDate=common.formatDate(vm.model.shenBaoInfo.createdDate);//开工日期
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期	
						vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
						//资金计算显示
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys||0,vm.model.shenBaoInfo.capitalSCZ_gtzj||0,vm.model.shenBaoInfo.capitalSCZ_zxzj||0,
  			 						vm.model.shenBaoInfo.capitalQCZ_ggys||0,vm.model.shenBaoInfo.capitalQCZ_gtzj||0,
  			 						vm.model.shenBaoInfo.capitalSHTZ||0,vm.model.shenBaoInfo.capitalZYYS||0,vm.model.shenBaoInfo.capitalOther||0]);
				  		 };
				  		// 国民经济行业分类
						var child2 = $linq(common.getBasicData()).where(function(x) {
							return x.id == vm.model.shenBaoInfo.nationalIndustry
						}).toArray()[0];
						if (child2) {
							vm.model.shenBaoInfo.nationalIndustryParent = child2.pId;
							vm.nationalIndustryChange();
						}
						
						if(vm.model.shenBaoInfo.thisTaskName == 'usertask1'|| vm.model.shenBaoInfo.thisTaskName == 'usertask3'||
								vm.model.shenBaoInfo.thisTaskName == 'usertask10' || vm.model.shenBaoInfo.thisTaskName == 'usertask5' || 
								vm.model.shenBaoInfo.thisTaskName == 'usertask2' || vm.model.shenBaoInfo.thisTaskName == 'usertask14' ||
								vm.model.shenBaoInfo.thisTaskName == 'usertask20' ||vm.model.shenBaoInfo.thisTaskName == 'usertask22'){
			        		getDeptByName(vm,"投资科");
			        	}
						if(vm.model.shenBaoInfo.thisTaskName == 'usertask3'){
			        		getDeptByName(vm,"投资科");
			        	}
						if(vm.model.shenBaoInfo.thisTaskName == 'usertask13' || vm.model.shenBaoInfo.thisTaskName == 'usertask21' ||
								vm.model.shenBaoInfo.thisTaskName == 'usertask6' || vm.model.shenBaoInfo.thisTaskName == 'usertask7'){
			        		getDeptByName(vm,"办公室");
			        	}
						if(vm.model.shenBaoInfo.thisTaskName == 'usertask12' || vm.model.shenBaoInfo.thisTaskName == 'usertask18'){
			        		getDeptByName(vm,"局领导");
			        	}
						
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getShenBaoInfoById
		
		/**
		 * 查询部门信息
		 */
		function getDeptByName(vm,name){
			var httpOptions = {
					method : 'get',
					async:false,
					url : common.format(url_dept+ "?$filter=name eq '{0}'", name)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.dept = response.data.value[0]||{};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getDeptByName
		
		function pinglun(vm){
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
				var httpOptions = {
					method : 'post',
					url : url_taskAudit_new+"/pinglun",
					data:{"id":vm.id,"msg":vm.processSuggestion,"shenbaoinfo":vm.model.shenBaoInfo}
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									
									if(vm.page=='handleYuepi'){
										location.href = "#/task/todo_yuepi";
									}else{
										location.href = url_back;
									}
								}
							});
						}
					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});		
	   		}
		}//end fun handle
		/**
		 * 送出处理
		 */
		function handle(vm,str){
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
				var httpOptions = {
					method : 'post',
					url : url_taskAudit_new+"/process",
					data:{"str":str,"msg":vm.processSuggestion,"nextUsers":vm.nextUsers.toString(),"isPass":vm.isPass,"isPass2":vm.isPass2,"shenbaoinfo":vm.model.shenBaoInfo}
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back;
								}
							});
						}
					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});		
	   		}
		}//end fun handle
		
		// begin#grid
		/**
		 * 意见列表
		 */
		function opinionGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_opin),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "opinion",
					title : "意见",
					width : 450,
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.opinion);

					}

				}
			];
			// End:column

			vm.opinionGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		// begin#grid
		/**
		 * 批复文件列表
		 */
		function replyFileGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_replyFile),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
					},
					filterable : false,
					width : 40,
					title : ""
				},
				{
					field : "number",
					title : "文号",
					width:180,
					
					filterable : true
				},
				{
					field : "name",
					title : "文件名",
					width : 450,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
					filterable : true
				}
			];
			// End:column

			vm.replyFileGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		
		/**
		 * 个人待办列表
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_taskAudit+"?leixin={0}","geren")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				requestEnd:function(e){						
					$('#todoNumber_audit').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_auditOption = grid.getOptions();
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "title",
						title : "标题",						
						filterable : true,
						width:500,
						template:function(item){
							return common.format("<a class='text-primary' href='#/task/handle_audit/{1}'>{0}</a>",item.projectName,item.id);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						template:function(item){
							return common.getUnitName(item.unitName);
						}
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: vm.basicData.projectIndustry_ZF,
			                            dataTextField: "description",
			                            dataValueField: "id",
			                            filter: "startswith"
			                        });
			                    }
						}
					},
					 {
						field : "projectShenBaoStage",
						title : "申报阶段",
						width : 120,						
						template:function(item){						
							return common.getBasicDataDesc(item.projectShenBaoStage);
						}
					},
					{
						field : "processStage",
						title : "审批阶段",
						width : 150,
						filterable : false,
						template:function(item){
							return common.format("<span class='text-danger'>{0}</span>",item.processStage);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 180,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
						}

					}

			];
			// End:column
			if(window.todo_auditOption && window.todo_auditOption !=''){
				vm.gridOptions = window.todo_auditOption;
			}else{
				vm.gridOptions = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true,
						scrollable:true
					};
			}
		}// end fun grid
		
		
		/**
		 * 个人待办列表
		 */
		function otherGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_taskAudit_other+"?leixin={0}","other")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
//				requestEnd:function(e){						
//					$('#todoNumber_audit').html(e.response.count);
//				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_auditOption_other = grid.getOptions();
				},
				filter:[
					{
						field:"thisTaskName",
						operator:"eq",
						value:"usertask2"
					}
				]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "title",
						title : "标题",						
						filterable : true,
						width:500,
						template:function(item){
							return common.format("<a class='text-primary' href='#/task/handle_keshi/{1}'>{0}</a>",item.projectName,item.id);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						template:function(item){
							return common.getUnitName(item.unitName);
						}
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: vm.basicData.projectIndustry_ZF,
			                            dataTextField: "description",
			                            dataValueField: "id",
			                            filter: "startswith"
			                        });
			                    }
						}
					},
					 {
						field : "projectShenBaoStage",
						title : "申报阶段",
						width : 120,						
						template:function(item){						
							return common.getBasicDataDesc(item.projectShenBaoStage);
						}
					},
					{
						field : "processStage",
						title : "审批阶段",
						width : 150,
						filterable : false,
						template:function(item){
							return common.format("<span class='text-danger'>{0}</span>",item.processStage);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 180,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
						}

					}

			];
			// End:column
			if(window.todo_auditOption_other && window.todo_auditOption_other !=''){
				vm.gridOptions_other = window.todo_auditOption_other;
			}else{
				vm.gridOptions_other = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true,
						scrollable:true
					};
			}
		}// end fun grid
		/**
		 * 个人待办列表
		 */
		function yuepiGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_taskAudit_yuepi+"?leixin={0}","yuepi")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
//				requestEnd:function(e){						
//					$('#todoNumber_audit').html(e.response.count);
//				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_auditOption_yuepi = grid.getOptions();
				},
				filter:[
					{
						field:"isLeaderHasRead",
						operator:"eq",
						value:false
					}
				]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "title",
						title : "标题",						
						filterable : true,
						width:500,
						template:function(item){
							return common.format("<a class='text-primary' href='#/task/handle_yuepi/{1}'>{0}</a>",item.projectName,item.id);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						template:function(item){
							return common.getUnitName(item.unitName);
						}
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: vm.basicData.projectIndustry_ZF,
			                            dataTextField: "description",
			                            dataValueField: "id",
			                            filter: "startswith"
			                        });
			                    }
						}
					},
					 {
						field : "projectShenBaoStage",
						title : "申报阶段",
						width : 120,						
						template:function(item){						
							return common.getBasicDataDesc(item.projectShenBaoStage);
						}
					},
					{
						field : "processStage",
						title : "审批阶段",
						width : 150,
						filterable : false,
						template:function(item){
							return common.format("<span class='text-danger'>{0}</span>",item.processStage);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 180,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
						}

					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.isLeaderHasRead);
						},

					}


			];
			// End:column
			if(window.todo_auditOption_yuepi && window.todo_auditOption_yuepi !=''){
				vm.gridOptions_yuepi = window.todo_auditOption_yuepi;
			}else{
				vm.gridOptions_yuepi = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true,
						scrollable:true
					};
			}
		}
		
		function complete_shenPiGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_taskAudit_new+"/complete")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				change: function(e) {//当数据发生变化时
				    var filters = dataSource.filter();//获取所有的过滤条件
				    vm.filters = filters;
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "title",
					title : "标题",						
					filterable : true,
					width:500,
					template:function(item){
						return common.format("<a class='text-primary' href='#/task/shenPi_details/{1}'>{0}</a>",item.projectName,item.id);			
					}
				},
				 {
					field : "unitName",
					title : "建设单位",
					width : 300,						
					template:function(item){
						return common.getUnitName(item.unitName);
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					width : 120,
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					filterable : {
						 ui: function(element){
		                        element.kendoDropDownList({
		                            valuePrimitive: true,
		                            dataSource: vm.basicData.projectIndustry_ZF,
		                            dataTextField: "description",
		                            dataValueField: "id",
		                            filter: "startswith"
		                        });
		                    }
					}
				},
				 {
					field : "projectShenBaoStage",
					title : "申报阶段",
					width : 120,						
					template:function(item){						
						return common.getBasicDataDesc(item.projectShenBaoStage);
					}
				},
				{
					field : "processStage",
					title : "审批阶段",
					width : 150,
					filterable : false,
					template:function(item){
						return common.format("<span class='text-danger'>{0}</span>",item.processStage);
					}
				},
				{
					field : "",
					title : "创建日期",
					width : 180,
					template : function(item) {
						return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
					}

				}

		];
			// End:column

			vm.gridOptions_complete_shenPi = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}//end#complete_shenPiGird(个人已办列表)
		
		function documentRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_document),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
			});
			// End:dataSource
			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
											item.number,item.name,item.fullName);
						},
						filterable : false,
						width : 40,
						title : ""
					},
					{
						field : "number",
						title : "文号",
						width:180,
						
						filterable : true
					},
					{
						field : "name",
						title : "文件名",
						width : 550,
						template:function(item){
							return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
						},
						filterable : true
						
					}
					
			];
			// End:column

			vm.gridOptions_documentRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}
		
		/**
		 * 获取所有需要的系统配置
		 */
		function getSysConfigs(vm){
			var httpOptions = {
					method : 'get',
					url : url_getSysConfigs
				};
			
			var httpSuccess = function success(response) {
				vm.configs = response.data;//所有的配置
				for (var int = 0; int < vm.configs.length; int++) {
					var array_element = vm.configs[int];
					if(array_element.configName == "taskType_17"){
						vm.banliUsers = array_element.configValue;
					}else if(array_element.configName == "taskType_18"){
						vm.banwenUsers = array_element.configValue;
					}else if(array_element.configName == "taskType_19"){
						vm.yinwenUsers = array_element.configValue;
					}
				}
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getSysConfigs
		
		/**
		 * 获取当前登陆用户单位
		 */
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
			var httpSuccess = function success(response) {
				vm.userUnit = response.data || {};
				vm.model.applicationUnit = vm.userUnit.id;//设置项目的所属单位名称
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getUserUnit
	}	
})();