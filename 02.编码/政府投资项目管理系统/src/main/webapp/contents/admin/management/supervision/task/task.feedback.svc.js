(function() {
	'use strict';

	angular.module('appSupervision').factory('taskFeedbackSvc', taskFeedback);

	taskFeedback.$inject = [ '$http' ,'$location'];

	function taskFeedback($http,$location) {
		var url_taskFeedback = "/framework/task";
		var url_taskAudit_new = "/management/task";
		
		var service = {
			grid : grid,//待办任务列表
			complete_gird:complete_gird//已办列表
		};
			
		return service;
		
		/**
		 * 个人待办列表
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_taskFeedback + '/todo_feedback')),
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
					$('#todoNumber_feedback').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_feedbackOption = grid.getOptions();
				},
				filter:[{
					field:'projectShenBaoStage',
					operator:'eq',
					value:'projectShenBaoStage_1'
				}]
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
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);		
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

					},
					{
	                    field : "",
	                    title : "操作",
	                    width : 250,
	                    template : function(item) {
	                        return common.format($('#columnBtns').html(),item.monitor_processId,item.id,item.projectId);
	                    } 

	                }

			];
			// End:column
			if(window.todo_feedbackOption && window.todo_feedbackOption !=''){
				vm.gridOptions = window.todo_feedbackOption;
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
		
		
		function complete_gird(vm) {
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_taskFeedback+"/complete_feedback")),
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
					$('#completeNumber_feedback').html(e.response.count);
				},
				change: function(e) {//当数据发生变化时
				    var filters = dataSource.filter();//获取所有的过滤条件
				    vm.filters = filters;
				},
				filter:[{
					field:'projectShenBaoStage',
					operator:'eq',
					value:'projectShenBaoStage_1'
				}]
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
						return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
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
		}//end(个人已办列表)
		
	}	
})();