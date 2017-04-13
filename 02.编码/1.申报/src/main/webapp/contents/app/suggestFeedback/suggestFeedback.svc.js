(function() {
	'use strict';

	angular.module('app').factory('suggestFeedbackSvc', suggestFeedback);

	suggestFeedback.$inject = [ '$http','$compile' ];	
	function suggestFeedback($http,$compile) {	
		var url_suggestFeedback = "/contents/app/suggestFeedback/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_suggestFeedback),
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
						filterable : false
					},{
						field : "suggestTitle",
						title : "标题",
						template:function(data){
							return "<a href='#' onclick='vm.suggestDetais('"+data.suggestId+"')'>"+data.suggestTitle+"</a>";
						},
						filterable : true
					} ,
					{
						field : "suggestFrom",
						title : "来源",
						width : 156,
						filterable : true
					},{
						field : "suggestState",
						title : "状态",
						width : 156,
						filterable : true
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 334,
						template:function(data){
							return "<a href='#' onclick='vm.projectDetais('"+data.projectId+"')'>"+data.projectName+"</a>";
						},
						filterable : true
					},
					{
						field : "industry",
						title : "所属行业",
						width : 165,
						filterable : true
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
							return common.format($('#columnBtns').html(),"vm.fill('" + data.projectId + "')", data.projectId);		
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