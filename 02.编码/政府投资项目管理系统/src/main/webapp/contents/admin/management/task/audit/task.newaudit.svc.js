(function() {
	'use strict';

	angular.module('app').factory('taskNewAuditSvc', taskNewAudit);

	taskNewAudit.$inject = [ '$http' ,'$location'];

	function taskNewAudit($http,$location) {
		var url_taskAudit = "/management/task/audit";
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
			getHistoryInfo:getHistoryInfo//查询流转信息
		};
		
		return service;
		
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
					url : common.format(url_approval + "?$filter=relId eq '{0}'",vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.approval = response.data.value[0] || {};
						if(vm.approval.id){
							vm.approval.beginDate= common.formatDate(vm.approval.beginDate);
						}else{
							//初始化相关数据
			        		vm.approval.approvalType = vm.model.shenBaoInfo.projectShenBaoStage;
			        		vm.approval.beginDate = common.formatDate(new Date());
			        		vm.approval.projectName=vm.model.shenBaoInfo.projectName;
			        		vm.approval.projectNumber=vm.model.shenBaoInfo.projectNumber;
			        		vm.approval.constructionUnit=vm.model.shenBaoInfo.constructionUnit;
			        		vm.approval.unitName=vm.model.shenBaoInfo.bianZhiUnitInfoDto.unitName;
			        		vm.approval.relId=vm.taskAudit.id;
			        		vm.approval.processRole=vm.taskAudit.thisUser;//初始化填写评审报批单的经办人为任务当前处理人
						}
						vm.processRoleName=vm.getUserName(vm.approval.processRole);
						$('.approval').modal({
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
									$('.approval').modal('hide');
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
					url : common.format(url_draft + "?$filter=relId eq '{0}'",vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data.value[0] || {};
						if(vm.draft.id){
							vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
						}else{
							//初始化相关数据
			        		vm.draft.draftDate = common.formatDate(new Date());
			        		vm.draft.fileType=vm.model.shenBaoInfo.projectShenBaoStage;
			        		vm.draft.projectName=vm.model.shenBaoInfo.projectName;
			        		vm.draft.projectNumber=vm.model.shenBaoInfo.projectNumber;
			        		vm.draft.unitName=vm.model.shenBaoInfo.constructionUnit;
			        		vm.draft.capitalTotal=vm.model.shenBaoInfo.projectInvestSum;
			        		vm.draft.userNameAndUnit=vm.taskAudit.thisUser;//初始化拟稿人为任务当前处理人
			        		vm.draft.relId=vm.taskAudit.id;
						}
						vm.userNameAndUnitName=vm.getUserName(vm.draft.userNameAndUnit);
						$('.draft_issued').modal({
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
									$('.draft_issued').modal('hide');
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
            			$('.opinionEdit').modal('hide');
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
					data : {"opinion":vm.taskRecord.processSuggestion}
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
					url : url_shenbao+'/updateShenbao',
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
						
						if(vm.model.shenBaoInfo.thisTaskName == 'usertask1' || vm.model.shenBaoInfo.thisTaskName == 'usertask5' || vm.model.shenBaoInfo.thisTaskName == 'usertask2'){
			        		getDeptByName(vm,"投资科");
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
					data:{"str":str,"id":vm.id,"msg":vm.processSuggestion,"att":vm.attachmentDtos,"nextUsers":vm.nextUsers.toString()}
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
				transport : common.kendoGridConfig().transport(url_taskAudit),
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
		
		function complete_shenPiGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord_shenPi),
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
						width : 500,		
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/shenPi_details/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 350,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 180,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
		                        element.kendoDropDownList({
		                            valuePrimitive: true,
		                            dataSource: vm.basicData.projectIndustry_ZF,
		                            dataTextField: "description",
		                            dataValueField: "id"
		                        });
		                    }
						}
					},
					 {
						field : "taskType",
						title : "任务类型",
						width : 180,						
						filterable : {
							ui: function(element){
		                        element.kendoDropDownList({
		                            valuePrimitive: true,
		                            dataSource: $linq(vm.basicData.taskType)
		                            				.where(function(x){return vm.basicData.taskTypeForShenPi.indexOf(x.id)>-1})
		                            				.toArray(),
		                            dataTextField: "description",
		                            dataValueField: "id",
		                            filter: "startswith"
		                        });
		                    }
						},
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
						}
					},
					{
						field : "thisProcess",
						title : "审批阶段",
						width : 180,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.thisProcess);
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
	}	
})();