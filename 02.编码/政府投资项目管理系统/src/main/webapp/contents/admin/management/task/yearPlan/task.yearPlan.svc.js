(function() {
	'use strict';

	angular.module('app').factory('taskYearPlanSvc', task);

	task.$inject = [ '$http' ];

	function task($http) {
		var url_task = "/management/task";
		var url_shenbao = "/management/shenbao";
		var url_monthReport = "/management/monthReport";
		var url_project = "/management/project";
		var url_taskAudit = "/management/task/audit";
		var url_taskPlan = "/management/task/plan";
		var url_back = "#/task/todo";
		var url_dept="/org";
		
		var service = {
			grid : grid,//待办任务列表
			gridForShenpi:gridForShenpi,//获取审批类数量
			gridForPlan:gridForPlan,//获取计划类数量
			completeGird:completeGird,//已办任务列表
			getShenBaoInfoById:getShenBaoInfoById,//根据id获取申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			handle:handle,//流程处理（签收/退文）
			getDeptByName:getDeptByName,
			getHistoryInfo:getHistoryInfo
		};
		
		return service;
		
		/*
		 * 流转信息
		 */
		function getHistoryInfo(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_task + "/his/" + vm.id)
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
		 * 获取审批类数量
		 */
		function gridForShenpi(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskAudit
				};
			
			var httpSuccess = function success(response) {	
				if(response.data.value != null && response.data.value != ""){
					vm.shenpiNumber = response.data.value.length;
				}else{
					vm.shenpiNumber = 0;
				}
				
				
				$('#todoNumber_audit').html(vm.shenpiNumber);
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 * 获取计划类数量
		 */
		function gridForPlan(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskPlan
				};
			
			var httpSuccess = function success(response) {	
				if(response.data.value != null && response.data.value != ""){
					vm.planNumber = response.data.value.length;
				}else{
					vm.planNumber = 0;
				}
				$('#todoNumber_plan').html(vm.planNumber);
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
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
					url : common.format(url_monthReport + "?$filter=id eq '{0}'", vm.id)				
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
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)				
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.isSHInvestment = false;
						vm.isZFInvestment = false;
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
				  		 
						if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
							vm.isYearPlan = true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}

						//计算资金筹措总计
						vm.capitalTotal=function(){
							return common.getSum([
								vm.model.shenBaoInfo.capitalSCZ_ggys || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj || 0,vm.model.shenBaoInfo.capitalSCZ_zxzj || 0,
								vm.model.shenBaoInfo.capitalQCZ_ggys || 0,vm.model.shenBaoInfo.capitalQCZ_gtzj || 0,vm.model.shenBaoInfo.capitalSHTZ || 0,
								vm.model.shenBaoInfo.capitalZYYS || 0,vm.model.shenBaoInfo.capitalOther || 0]);
				  		 };
				  		// 国民经济行业分类
						var child2 = $linq(common.getBasicData()).where(function(x) {
							return x.id == vm.model.shenBaoInfo.nationalIndustry
						}).toArray()[0];
						if (child2) {
							vm.model.shenBaoInfo.nationalIndustryParent = child2.pId;
							vm.nationalIndustryChange();
						}
						
						getDeptByName(vm,"投资科");
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
		
		function handle(vm,str){
			var httpOptions = {
				method : 'post',
				url : url_task+"/yearPaln",
				data:{"str":str,
					"id":vm.id,
					"msg":vm.processSuggestion,
					"att":vm.attachmentDtos,
					"isPass":vm.isPass,
				}
			
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

		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_task+"/"+"yearPlan"),
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
					field:'complate',
					operator:'eq',
					value:false
				},
				requestEnd:function(e){
					if(e.response.value){
						$('#todoNumber').html(e.response.value.length);		
					}
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
						field : "projectName",
						title : "标题",
						width:500,
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}'>{0}</a>",item.projectName,item.id);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						filterable : true,
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
				transport : common.kendoGridConfig().transport(url_task+"/"+"completeYearPlan"),
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
					field:'complate',
					operator:'eq',
					value:true
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
						field : "projectName",
						title : "标题",
						width:500,
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/complate_yearPlan/{1}'>{0}</a>",item.projectName,item.id);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						filterable : true,
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
		
	}	
})();