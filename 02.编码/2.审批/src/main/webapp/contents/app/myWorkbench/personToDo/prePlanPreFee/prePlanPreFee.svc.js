(function() {
	'use strict';

	angular.module('app').factory('prePlanPreFeeSvc', prePlanPreFee);

	prePlanPreFee.$inject = [ '$http','$compile' ];	
	function prePlanPreFee($http,$compile) {	
		var url_prePlanPreFee = "/contents/app/myWorkbench/personToDo/prePlanPreFee/data/list.json";
		var url_back = '#/prePlanPreFee';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_prePlanPreFee),
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
					field : "projectName",
					title : "项目名称",
					template:function(data){
						return "<a href='#/projectDetais/"+data.projectId+"'>"+data.projectName+"</a>";
					},
					filterable : true
				} ,{
					field : "applicantType",
					title : "申报类型",
					filterable : true
				},
				{
					field : "industry",
					title : "所属行业",
					filterable : false
				},
				{
					field : "totalInvestment",
					title : "总投资/申报经费（万）",
					filterable : false
				},
				{
					field : "year",
					title : "年度",
					filterable : true
				},
				{
					field : "state",
					title : "状态",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					template:function(data){
						return  common.format($('#columnBtns').html(),"vm.del('" + data.projectId + "')",data.projectId);	
					},
					filterable : false
				},
				{
					field : "",
					title : "导出",
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