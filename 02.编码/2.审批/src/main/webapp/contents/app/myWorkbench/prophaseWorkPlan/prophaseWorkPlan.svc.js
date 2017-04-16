(function() {
	'use strict';

	angular.module('app').factory('prophaseWorkPlanSvc', prophaseWorkPlan);

	prophaseWorkPlan.$inject = [ '$http' ];

	function prophaseWorkPlan($http) {
		var url_prophaseWorkPlan = "/contents/app/myWorkbench/prophaseWorkPlan/data/prophaseWorkPlan.list.json";
		var url_back = '#/prophaseWorkPlan';
		var url_role = "/role";
		var service = {
			grid : grid
		};

		return service;

		 
		// begin#grid
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_prophaseWorkPlan),
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
				serverFiltering : false,
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
						field : "projectName",
						title : "项目名称",
						width : 200,
						filterable : true,
						template:function(data){
							return "<a href='#/detais/"+data.id+"'>"+data.projectName+"</a>";
						}
					},
					{
						field : "declareType",
						title : "申报类型",
						width : 200,
						filterable : true
					},
					{
						field : "theIndustry",
						title : "所属行业",
						width : 200,
						filterable : false,
					},
					{
						field : "totalInvestment",
						title : "总投资/申报经费（万元）",
						width : 200,
						filterable : false,
					},
					{
						field : "year",
						title : "年度",
						width : 180,
						format : "{0:yyyy/MM/dd HH:mm:ss}",
						filterable : false
					},
					{
						field : "state",
						title : "状态",
						width : 180,
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.projectInfoDel('" + item.id + "')",
									"vm.projectInfoEdit('" + item.id + "')");
									

						}

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