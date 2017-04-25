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
						template : function(data) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											data.projectId)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"						
					},
					  {
						field : "id",
						title : "序号",
						width : 45,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width:200,
						template:function(data){
							return "<a href='#/monthReportSelect/"+data.projectId+"'>"+data.projectName+"</a>";
						},
						filterable : true
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
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
						filterable : true
					},
					
					{
						field : "totalInvestment",
						title : "总投资（万）",
						filterable : false
					},
					
					{
						field : "isMonthReport",
						title : "是否填写月报",
						/*template:function(data){
							if(data.isMonthReport){
								return "是"
							}else{
								return "否"
							}
						},*/
						filterable : true
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.remind('"+data.projectId+"')");
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