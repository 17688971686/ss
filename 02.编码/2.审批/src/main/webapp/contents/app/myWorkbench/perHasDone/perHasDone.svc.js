(function() {
	'use strict';

	angular.module('app').factory('perHasDoneSvc', perHasDone);

	perHasDone.$inject = [ '$http','$compile' ];	
	function perHasDone($http,$compile) {	
		var url_perHasDone = "/contents/app/myWorkbench/perHasDone/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_perHasDone),
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
						width : 36,						
						filterable : false
					},{
						field : "handleState",
						title : "办理状态",
						width : 100,
						filterable : true
					} ,{
						field : "projectPhase",
						title : "项目阶段",
						width : 156,
						filterable : true
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 334,
						template:function(data){
							return "<a href='#' onclick='vm.projectDetais('"+data.id+"')'>"+data.projectName+"</a>";
						},
						filterable : false
					},
					{
						field : "applicantUnitName",
						title : "申报单位名称",
						width : 200,
						filterable : false
					},
					{
						field : "receiptDate",
						title : "收文日期",
						width : 165,
						filterable : false
					},
					{
						field : "receiptNumber",
						title : "收文编号",
						width : 165,
						filterable : false
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
						field : "dispatchNumber",
						title : "发文编号",
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