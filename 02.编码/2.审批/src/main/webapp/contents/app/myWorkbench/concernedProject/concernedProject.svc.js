(function() {
	'use strict';

	angular.module('app').factory('concernedProjectSvc', concernedProject);

	concernedProject.$inject = [ '$http','$compile' ];	
	function concernedProject($http,$compile) {	
		var url_concernedProject = "/contents/app/myWorkbench/concernedProject/data/list.json";
//		var url_back = '#/concernedProject';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_concernedProject),
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
					 /* {
						field : "id",
						title : "序号",
						width : 50,						
						filterable : false
					}*/{
						field : "projectState",
						title : "项目状态",
						width : 80,
						template:function(data){
							if(data.projectState == "1"){
								return "<i class='icon-circle' style='color:blue'></i>";
							}if(data.projectState == "2"){
								return "<i class='icon-circle' style='color:green'></i>";
							}if(data.projectState == "3"){
								return "<i class='icon-circle' style='color:red'></i>";
							}
						},
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
						field : "receiptDate",
						title : "收文日期",
						width : 165,
						filterable : false
					},
					{
						field : "receiptNumber",
						title : "收文编号",
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
						field : "remainWorkDays",
						title : "剩余工作日",
						width : 100,
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