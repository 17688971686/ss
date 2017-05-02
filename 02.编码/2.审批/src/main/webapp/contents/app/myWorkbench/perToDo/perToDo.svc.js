(function() {
	'use strict';

	angular.module('app').factory('perToDoSvc', perToDo);

	perToDo.$inject = [ '$http','$compile' ];	
	function perToDo($http,$compile) {	
		var url_perToDo = "/contents/app/myWorkbench/perToDo/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_perToDo),
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
							template : function(item) {
								return kendo
										.format(
												"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
												item.projectId)
							},
							filterable : false,
							width : 30,
							title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
		
						},
					  {
						field : "id",
						title : "序号",
						width : 45,						
						filterable : false
					},{
						field : "projectPhase",
						title : "项目阶段",
						width : 150,
						filterable : true
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 200,
						template:function(data){
							return "<a href='#/projectHandForm/"+data.projectId+"&"+data.projectPhase+"&"+data.auditType+"'>"+data.projectName+"</a>";
						},
						filterable : true
					},
					{
						field : "applicantUnitName",
						title : "申报单位名称",
						width : 200,
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