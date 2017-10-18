(function() {
	'use strict';

	angular.module('app').factory('taskPlanSvc', taskPlan);

	taskPlan.$inject = [ '$http' ,'$location'];

	function taskPlan($http,$location) {
		var url_task = "/management/task";
		var url_taskPlan = "/management/task/plan";
		var url_shenbao = "/management/shenbao";
		var url_dept="/org";
		var url_back = "#/task/todo_plan";
		var url_replyFile = "/management/replyFile";
		var url_role="/role";
		var url_opin="/opin";
		var url_users = "/user";
		var url_draft ="/management/draft";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		var url_taskRecord_plan = "/management/taskRecord/plan";
		
		var service = {
			grid_plan : grid_plan,//待办任务列表
			getTaskInfoById:getTaskInfoById,//查询任务信息
			getShenBaoInfoById:getShenBaoInfoById,//查询申报信息
			getDepts:getDepts,//查询部门
			handle:handle,//送出
			replyFileGird:replyFileGird,//批复文件库列表
			saveShenBaoInfo:saveShenBaoInfo,//保存申报信息
			getRoles:getRoles,//查询角色信息
			saveOpinion:saveOpinion,//保存意见
			getOpinion:getOpinion,//获取意见
			opinionGird:opinionGird,//意见列表
			deleteOpin:deleteOpin,//删除意见
			editOpin:editOpin,//编辑意见
			saveDraft:saveDraft,
			getDraftIssued:getDraftIssued,
			complete_PlanGird:complete_PlanGird,
			getTaskById:getTaskById
		};
		
		return service;
		
		//拟稿意见
		function saveDraft(vm){
			vm.draft.projectName = vm.model.shenBaoInfo.projectName;
			vm.draft.unitName = vm.model.shenBaoInfo.constructionUnit;
			vm.draft.capitalTotal = vm.capitalTotal;
			vm.draft.userNameAndUnit = vm.userNameAndUnit;
			
			common.initJqValidation();
 			var isValid = $('#formDraft').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_draft + "/" +vm.taskPlan.id),
						data : vm.draft
					};
				
				var httpSuccess = function success(response) {
					$('#draft_issued').modal('hide');
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
	   		}
		}
		
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "/" +vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data || {};
						vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
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
		//编辑意见
		function editOpin(vm){
			var httpOptions = {
	                method: 'put',
	                url:url_opin,
	                data:vm.model.opinion          
	            };
	            
	            var httpSuccess = function success(response) {    
	            	vm.opinionGrid.dataSource.read();
	            	$('.opinionEdit').modal('hide');
	            };
	            
	            common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		//删除意见
		function deleteOpin(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'delete',
                url:url_opin,
                data:id              
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.opinionGrid.dataSource.read();
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun deleteorg	

		/**
		 * 查询意见
		 */
		function getOpinion(vm){
			var httpOptions = {
					method : 'get',
					url : url_opin
			};
			
			var httpSuccess = function success(response){
				vm.model.opinionDtos = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 保存意见
		 */
		function saveOpinion(vm){
			
			vm.opinion = {"opinion":vm.processSuggestion};
			var httpOptions = {
					method : 'post',
					url : url_opin,
					data : vm.opinion
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
		}
		
		/**
		 * 查询角色信息
		 */
		function getRoles(vm){
			var httpOptions = {
					method : 'get',
					url : url_role
				};
			
			var httpSuccess = function success(response) {
				vm.model.roles = response.data.value||{};
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		
		/**
		 * 保存申报信息
		 */
		function saveShenBaoInfo(vm){
			var httpOptions = {
					method : 'put',
					url : url_shenbao,
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
		}
		
		/**
		 * 查询任务信息
		 */
		function getTaskById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_task + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.task = response.data.value[0] || {};
						if(vm.task){
							vm.task.taskTypeDesc=common.getBasicDataDesc(vm.task.taskType);
							if(vm.task.isComplete){//如果任务为已完成
								vm.isComplete=true;
							}
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
		}
		
		/**
		 * 查询任务信息
		 */
		function getTaskInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskPlan + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.taskPlan = response.data.value[0] || {};
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
		 * 查询申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.relId)
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
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
		    	       		.toArray();
							//基础数据--行业归口
							 vm.basicData.projectIndustry=$linq(common.getBasicData())
			    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			    	       		.toArray();
							 vm.projectIndustryChange=function(){    		
				    	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
				    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
				    	       		.toArray();
			     			   };
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
		    	       		.toArray();
							//基础数据--行业归口
		        		   vm.basicData.projectIndustry=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
		    	       		.toArray();
						}
						//判断申报阶段
						if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_xuJianPlan){//申报阶段为:续建计划
							vm.isXuJian=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_junGong){//申报阶段为:竣工决算
							vm.isJunGong=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_junGong;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_prePlanFee){//申报阶段为:规划设计前期费
							vm.isPrePlanFee=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_prePlanFee;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_newStratPlan){//申报阶段为:新开工计划
							vm.isNewStart=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart;
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
		 * 查询部门
		 */
		function getDepts(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.depts = response.data.value||{};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 送出处理
		 */
		function handle(vm){
			vm.taskPlan.processSuggestion = vm.processSuggestion;
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
	   				
			var httpOptions = {
					method : 'put',
					url : url_task+"/"+vm.taskId,
					data : vm.taskPlan
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
		}
		
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
		 * 个人已办--计划类
		 */
		function complete_PlanGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord_plan),
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
							return common.format("<a href='#/task/plan_details/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 400,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 200,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: $linq(common.getBasicData())
			             	       					.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			             	       					.toArray(),
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
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
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

			vm.gridOptions_complete_plan = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		/**
		 * 个人待办列表--计划类
		 */
		function grid_plan(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskPlan),
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
				filter:{
					field:'isComplete',
					operator:'eq',
					value:false
				},
				requestEnd:function(e){						
					$('#todoNumber_plan').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_planOption = grid.getOptions();
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
							return common.format("<a href='#/task/handle_plan/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 400,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 200,
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
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
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
			
			if(window.todo_planOption && window.todo_planOption !=''){
				vm.gridOptions_plan = window.todo_planOption;
			}else{
				vm.gridOptions_plan = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true
					};
			}
		}// end fun grid
	}	
})();