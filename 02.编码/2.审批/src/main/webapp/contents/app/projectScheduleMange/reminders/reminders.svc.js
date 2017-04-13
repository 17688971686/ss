(function() {
	'use strict';

	angular.module('app').factory('remindersSvc', reminders);

	reminders.$inject = [ '$http','$compile' ];	
	function reminders($http,$compile) {	
		var url_reminders = "/contents/app/projectScheduleMange/reminders/data/list.json";
		var url_back = '#/reminders';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_reminders),
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
						field : "projectName",
						title : "项目名称",
						template:function(data){
							return "<a href='#/getProjectDetais?projectId="+data.id+"'>"+data.projectName+"</a>";
						},
						width:220,
						filterable : true
					} ,{
						field : "constructionUnit",
						title : "建设单位",
						width:220,
						filterable : true
					},
					{
						field : "projectPhase",
						title : "项目阶段",
						filterable : true
					},
					{
						field : "receiptDate",
						title : "收文日期",
						filterable : false
					},
					{
						field : "receiptNumber",
						title : "收文编号",
						filterable : false
					},
					{
						field : "industry",
						title : "所属行业",
						filterable : true
					},
					{
						field : "totalInvestment",
						title : "总投资",
						filterable : false
					},
					{
						field : "ismonthReport",
						title : "是否月报",
						template:function(data){
							if(data.isMonthReport){
								return "是";
							}else{
								return "否"
							}
						},
						filterable : false
					},
					{
						field : "projectNowNode",
						title : "项目现节点",
						filterable : true
					},{
						field : "projectNextNode",
						title : "项目下节点",
						filterable : true
					},
					{
						field : "distance",
						title : "本节点距离下节点期限(天)",
						filterable : true
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							return common.format($('#columnBtns').html(),data.id);
						},
						width:150,
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