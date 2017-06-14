(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http' ];

	function yearPlan($http) {
		var url_yearPlan = "/management/shenbao";//获取申报数据
		var url_back_yearPlanList = "#/yearPlanList";
		var service = {
			grid : grid	
		};

		return service;
		
		
		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_yearPlan),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
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
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					}
					,
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					},{
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						format : "{0:yyyy/MM/dd HH:mm:ss}"
					}

			];
			// End:column

			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
	}
})();