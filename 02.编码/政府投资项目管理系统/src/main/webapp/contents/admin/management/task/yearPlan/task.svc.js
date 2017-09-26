(function() {
	'use strict';

	angular.module('app').factory('taskSvc', task);

	task.$inject = [ '$http' ];

	function task($http) {
		var url_task = "/management/task";
		var url_taskRecord = "/management/taskRecord";
		var url_taskRecord_shenPi = "/management/taskRecord/shenPi";
		var url_shenbao = "/management/shenbao";
		var url_monthReport = "/management/monthReport";
		var url_project = "/management/project";
		var url_back = "#/task/todo";
		var url_dept = "/org";
		var url_taskAudit = "/management/task/audit";
		var url_taskPlan = "/management/task/plan";
		var url_users="/org/{0}/users";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		var url_draft ="/management/draft";
		
		var service = {
			grid : grid,//待办任务列表
			completeGird:completeGird,//已办任务列表
			getTaskById:getTaskById,//根据任务id获取任务信息
			getShenBaoInfoById:getShenBaoInfoById,//根据id获取申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			handle:handle,
			gridForShenpi:gridForShenpi,
			complete_shenPiGird:complete_shenPiGird,
			getApproval:getApproval,
			getDraftIssued:getDraftIssued,
			getComission:getComission,
			getReviewResult:getReviewResult,
			getDepts:getDepts,
			gridForPlan:gridForPlan
		};
		
		return service;
		
		//查询评审结果
		function getReviewResult(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_review + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.review = response.data || {};
						if(vm.review == ""){
							vm.projectInvestSum = vm.model.shenBaoInfo.projectInvestSum;
						}else{
							vm.nuclear = vm.review.nuclear;
							vm.cut = vm.review.cut;
							vm.projectInvestSum = vm.review.projectInvestSum;
						}
						vm.review.approvalDate = common.formatDate(vm.review.approvalDate);
						vm.review.receiptDate = common.formatDate(vm.review.receiptDate);
						vm.review.approvalEndDate= common.formatDate(vm.review.approvalEndDate);
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
		
		//查询审批委托书
		function getComission(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_proxy + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.proxy = response.data || {};
						vm.proxy.beginDate = common.formatDate(vm.proxy.beginDate);
						vm.proxy.approvalType=$linq(common.getBasicData())
	   	   				.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.id==vm.proxy.approvalType;}).toArray()[0].description;
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
		
		//发文拟稿
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "/" +vm.task.id)
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
		
		//查询审批单
		function getApproval(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_approval + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.approval = response.data || {};
						vm.approval.beginDate = common.formatDate(vm.approval.beginDate);
						vm.approval.approvalType=$linq(common.getBasicData())
	   	   				.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.id==vm.approval.approvalType;}).toArray()[0].description;
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
		 * 根据id获取项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.model.monthReport.projectId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.project= response.data.value[0]||{};
				//项目类型的显示
				if(vm.model.project.projectType != "" && vm.model.project.projectType != undefined){
					vm.model.project.projectType = vm.model.project.projectType.split(",");
				}else{
					vm.model.project.projectType =[];
				}				
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 根据id获取月报信息
		 */
		function getMonthReportById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_monthReport + "?$filter=id eq '{0}'", vm.relId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.monthReport= response.data.value[0]||{};
				getProjectById(vm);//根据关联的项目id获取项目信息
				//处理数据
				vm.model.monthReport.beginDate = common.formatDate(vm.model.monthReport.beginDate);
				vm.model.monthReport.endDate = common.formatDate(vm.model.monthReport.endDate);
				//上传文件类型
				vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 根据id获取申报信息
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
						vm.model.shenBaoInfo= response.data.value[0]||{};
						//项目类型的显示
						vm.projectTypes=common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
						//判断项目的投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
						}
						//日期展示
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
						vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
				  		 
				  		if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){
							vm.isZFInvestment = true; 
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){
							vm.isSHInvestment = true; 
						}
						if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
							vm.isProjectProposal=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
							vm.isKXXYJBG=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
							vm.isCBSJYGS=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_prePlanFee){//申报阶段为:规划设计前期费
							vm.isPrePlanFee=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_prePlanFee;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_newStratPlan){//申报阶段为:新开工计划
							vm.isNewStart=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_xuJianPlan){//申报阶段为:续建计划
							vm.isXuJian=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
							vm.isYearPlan = true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_junGong){//申报阶段为:竣工决算
							vm.isJunGong=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_junGong;
						}
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalZYYS)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalOther)||0) ;
				  		 };
				  		 
				  		//申请资金计算
				  		vm.lastTwoYearCapitalTotal = function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear)||0);
				  		};
				  		vm.lastYearCapitalTotal= function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear)||0);
				  		};
				  		vm.theYearCapitalTotal= function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear)||0);
				  		};
					}
				});
				
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end getShenBaoInfoById
		
		function handle(vm){
			var httpOptions = {
				method : 'put',
				url : url_task+"/"+vm.taskId,
				data : vm.model.taskRecord
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
	}//handle

		/**
		 * 根据任务id查询任务信息
		 */
		function getTaskById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_task + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				vm.task = response.data.value[0] || {};
				if(vm.task){
					vm.task.taskTypeDesc=common.getBasicDataDesc(vm.task.taskType);
					if(vm.task.isComplete){//如果任务为已完成
						vm.isComplete=true;
					}
				}	
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//getTaskById
		
		/**
		 * 个人待办列表(计划)
		 */
		function gridForPlan(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskPlan
				};
			
			var httpSuccess = function success(response) {				
				$('#todoNumber_plan').html(response.data.value.length);
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//getTaskById
		
		/**
		 * 个人待办列表(审批)
		 */
		function gridForShenpi(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskAudit
				};
			
			var httpSuccess = function success(response) {				
				$('#todoNumber_audit').html(response.data.value.length);
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//getTaskById
		
		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_task),
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
				filter:[{
					field:'isComplete',
					operator:'eq',
					value:false
				},{
					field:'taskType',
					operator:'eq',
					value:"taskType_2"
				}],
				requestEnd:function(e){						
					$('#todoNumber').html(e.response.value.length);					

				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.userOptions = grid.getOptions();
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
						width:500,
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						filterable : true
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
						width : 120,						
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
			if(window.userOptions && window.userOptions !=''){
				vm.gridOptions = window.userOptions;
        	}else{
        		vm.gridOptions = {
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

		}// end fun grid
				
		function completeGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord),
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
					field:'taskType',
					operator:'eq',
					value:"taskType_2"
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
						width:350,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 200,						
						filterable : true
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
						width : 120,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 150,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
						}

					}
					
			];
			// End:column

			vm.gridOptions_complete = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};

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
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/shenPi_details/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
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

		}// end fun grid
	}	
})();