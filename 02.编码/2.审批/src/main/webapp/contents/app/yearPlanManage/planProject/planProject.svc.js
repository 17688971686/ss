(function() {
	'use strict';

	angular.module('app').factory('planProjectSvc', planProject);

	planProject.$inject = [ '$http' ];

	function planProject($http) {
		var url_planProject = "/contents/app/yearPlanManage/planProject/data/planProject.list.json";
		var url_back = '#/planProject';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
		};

		return service;
 
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planProject),
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
						field : "",
						title : "序号",
						width : 50,
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 200,
						filterable : true,
						remplate:function(data){
							return "<a href='#/"+data.id+"' onclick='fun()'>"+data.projectName+"</a>";
						}
					},
					{
						field : "buildUnit",
						title : "建设单位",
						width : 200,
						filterable : true
					},
					{
						field : "buildNature",
						title : "建设性质",
						width : 180,
						filterable : true
						
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 180,
						filterable : true

					},
					{
						field : "tradeSort",
						title : "行业类别",
						width : 180,
						filterable : true
						
					},
					{
						field : "projectSort",
						title : "项目类别",
						width : 180,
						filterable : true
						
					},
					{
						field : "totalInvest",
						title : "总投资",
						width : 180,
						filterable : false
						
					},
					{
						field : "yearInvest",
						title : "申请年度投资",
						width : 180,
						filterable : false
						
					},
					{
						field : "whetherAddPlanYear",
						title : "是否纳入年度计划",
						width : 180,
						filterable : true
						
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