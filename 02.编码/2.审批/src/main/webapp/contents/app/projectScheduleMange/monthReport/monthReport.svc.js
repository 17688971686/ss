(function() {
	'use strict';

	angular.module('app').factory('monthReportSvc', monthReport);

	monthReport.$inject = [ '$http' ];	
	function monthReport($http) {	
		var url_monthReport = "/contents/app/projectScheduleMange/monthReport/data/list.json";
		var url_back = '#/monthReport';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_monthReport),
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
											item.id)
						},
						field : "",
						width : 40,
						title : "<input id='checkboxAll' type='checkbox' class='checkbox'>",
						filterable : false
					},
					  {
						field : "id",
						title : "ID",
						width : 80,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						filterable : true
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						filterable : false
					},
					{
						field : "receiptNumber",
						title : "收文编号",
						filterable : false
					},
					{
						field : "receiptDate",
						title : "收文日期",
						filterable : false
					},
					{
						field : "industry",
						title : "所属行业",
						filterable : false
					},
					{
						field : "totalInvestment",
						title : "总投资（万）",
						filterable : false
					},
					{
						field : "isMonthReport",
						title : "是否月报",
						template:function(data){
							if(data.isMonthReport){
								return "是"
							}else{
								return "否"
							}
						},
						filterable : false
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							return common.format($('#columnBtns').html(),data.id);
						},
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