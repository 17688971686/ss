(function() {
	'use strict';

	angular.module('app').factory('planCollectSvc', planCollect);

	planCollect.$inject = [ '$http' ];

	function planCollect($http) {
		var url_planCollect = "/contents/app/yearPlanManage/planCollect/data/planCollect.list.json";
		var url_back = '#/planCollect';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
		};

		return service;

		// begin#grid
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planCollect),
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
						template:function(data){
							return "<a href='#/collectCheckProject/"+data.id+"'>"+data.projectName+"</a>";
						}
					},
					{
						field : "buildUnit",
						title : "建设单位",
						width : 150,
						filterable : true
					},
					
					{
						field : "beclareYear",
						title : "申报年度",
						width : 150,
						filterable : true
						
					},
					{
						field : "buildNature",
						title : "建设性质",
						width : 150,
						filterable : true

					},
					{
						field : "projectSort",
						title : "项目类别",
						width : 150,
						filterable : true
						
					},
					{
						field : "tradeSort",
						title : "行业类别",
						width : 150,
						filterable : true
						
					},
					{
						field : "totalInvest",
						title : "总投资(万)",
						width : 150,
						filterable : false
						
					},
					{
						field : "planFund",
						title : "安排资金(万)",
						width : 150,
						filterable : false
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