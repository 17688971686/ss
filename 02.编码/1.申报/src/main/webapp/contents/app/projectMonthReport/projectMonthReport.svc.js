(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {	
		var url_projectMonthReport = "/contents/app/projectMonthReport/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectMonthReport),
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
						title : "序号",
						width : 36,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 334,
						template:function(data){
							return "<a href='#/projectDetais/"+data.projectId+"'>"+data.projectName+"</a>";
						},
						filterable : true
					},
					{
						field : "projectPhase",
						title : "申报阶段",
						width : 165,
						filterable : true
					},
					{
						field : "annualYear",
						title : "申报年度",
						width : 165,
						filterable : true
					},
					{
						field : "industry",
						title : "所属行业",
						width : 165,
						filterable : false
					},
					{
						field : "totalInvestment",
						title : "总投资（万）",
						width : 100,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.fill('" + data.projectId + "')");		
						},
						width : 180,
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