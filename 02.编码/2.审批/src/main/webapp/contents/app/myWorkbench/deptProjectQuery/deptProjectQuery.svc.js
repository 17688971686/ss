(function() {
	'use strict';

	angular.module('app').factory('deptProjectQuerySvc', deptProjectQuery);

	deptProjectQuery.$inject = [ '$http','$compile' ];	
	function deptProjectQuery($http,$compile) {	
		var url_deptProjectQuery = "/contents/app/myWorkbench/deptProjectQuery/data/";
		var url_back = '#/deptProjectQuery';
			
		var service = {
				getListData:getListData
//			grid : grid			
		};		
		return service;	
		
		function getListData(vm,type){
			//Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_deptProjectQuery+type+"List.json"),
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
						width : 50,						
						filterable : false
					},{
						field : "projectPhase",
						title : "项目阶段",
						width : 156,
						filterable : true
					} ,{
						field : "projectName",
						title : "项目名称",
						template:function(data){
							return "<a href='#/projectHandForm/"+data.projectId+"'>"+data.projectName+"</a>";
						},
						width : 334,
						filterable : true
					},
					{
						field : "applicantUnitName",
						title : "申报单位名称",
						width : 334,
						filterable : true
					},
					{
						field : "projectState",
						title : "项目状态",
						width : 156,
						filterable : true
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
						field : "manager",
						title : "经办人",
						width : 99,
						filterable : true
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
		}
		//End fun getListData
		
//		function grid(vm) {
//
//			// Begin:dataSource
//			var dataSource = new kendo.data.DataSource({
//				type : 'odata',
//				transport : common.kendoGridConfig().transport(url_deptProjectQuery),
//				schema : common.kendoGridConfig().schema({
//					id : "id",
//					fields : {
//						createdDate : {
//							type : "date"
//						}
//					}
//				}),
//				serverPaging : true,
//				serverSorting : true,
//				serverFiltering : true,			
//				pageSize: 10,
//				sort : {
//					field : "createdDate",
//					dir : "desc"
//				}
//			});
//
//			// End:dataSource
//
//			// Begin:column
//			var columns = [
//					  {
//						field : "id",
//						title : "ID",
//						width : 36,						
//						filterable : false
//					},{
//						field : "projectPhase",
//						title : "项目阶段",
//						width : 156,
//						filterable : true
//					} ,{
//						field : "projectName",
//						title : "项目名称",
//						template:function(data){
//							return "<a href='#' onclick='vm.projectDetais('"+data.id+"')'>"+data.projectName+"</a>";
//						},
//						width : 334,
//						filterable : true
//					},
//					{
//						field : "applicantUnitName",
//						title : "申报单位名称",
//						width : 334,
//						filterable : true
//					},
//					{
//						field : "projectState",
//						title : "项目状态",
//						width : 156,
//						filterable : true
//					},
//					{
//						field : "receiptDate",
//						title : "收文日期",
//						width : 165,
//						filterable : false
//					},
//					{
//						field : "receiptNumber",
//						title : "收文编号",
//						width : 165,
//						filterable : false
//					},
//					{
//						field : "industry",
//						title : "所属行业",
//						width : 165,
//						filterable : false
//					},
//					{
//						field : "manager",
//						title : "经办人",
//						width : 99,
//						filterable : true
//					}
//
//
//
//
//
//			];
//			// End:column
//		
//			vm.gridOptions={
//					dataSource : common.gridDataSource(dataSource),
//					filterable : common.kendoGridConfig().filterable,
//					pageable : common.kendoGridConfig().pageable,
//					noRecords:common.kendoGridConfig().noRecordMessage,
//					columns : columns,
//					resizable: true
//				};
//			
//		}// end fun grid

		
		
		

	}
	
	
	
})();