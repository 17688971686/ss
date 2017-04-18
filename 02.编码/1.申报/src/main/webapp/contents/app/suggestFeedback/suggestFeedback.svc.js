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
						width:45,
						filterable : false
					},{
						field : "suggestTitle",
						title : "标题",
						width:200,
						filterable : true
					} ,
					{
						field : "projectName",
						title : "项目名称",
						width : 200,
						template:function(data){
							return "<a href='#/projectDetais/"+data.projectId+"'>"+data.projectName+"</a>";
						},
						filterable : true
					},
					{
						field : "suggestFrom",
						title : "来源",
						filterable : true
					},{
						field : "suggestState",
						title : "状态",
						filterable : true
					},	
					{
						field : "",
						title : "操作",
						width:170,
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.edit('" + data.suggestId + "')", "vm.look('" + data.suggestId + "')","vm.del('" + data.suggestId + "')");		
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