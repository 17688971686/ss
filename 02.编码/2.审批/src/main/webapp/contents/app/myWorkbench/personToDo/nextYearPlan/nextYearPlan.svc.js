(function() {
	'use strict';

	angular.module('app').factory('nextYearPlanSvc', nextYearPlan);

	nextYearPlan.$inject = [ '$http','$compile' ];	
	function nextYearPlan($http,$compile) {	
		var url_nextYearPlan = "/contents/app/myWorkbench/personToDo/nextYearPlan/data/list.json";
		var url_back = '#/nextYearPlan';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_nextYearPlan),
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
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});

			// End:dataSource

			// Begin:column
			var columns = [
					  {
						field : "id",
						title : "ID",
						width:50,
						filterable : false
					},{
						field : "projectName",
						title : "项目名称",
						filterable : true
					} ,{
						field : "constructionUnit",
						title : "建设单位",
						filterable : false
					},
					{
						field : "declareYear",
						title : "申报年度",
						filterable : false
					},
					{
						field : "constructionCharacter",
						title : "建设性质",
						filterable : false
					},
					{
						field : "itemCategory",
						title : "项目类别",
						filterable : false
					},
					{
						field : "industryCategory",
						title : "行业类别",
						filterable : false
					},
					{
						field : "totalInvestment",
						title : "总投资（万）",
						filterable : false
					},
					{
						field : "arrangeFunds",
						title : "安排资金",
						filterable : false
					}


			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
			
		}// end fun grid

		
		
		

	}
	
	
	
})();