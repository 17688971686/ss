(function() {
	'use strict';

	angular.module('app').factory('problemCoordinitionSvc', problemCoordinition);

	problemCoordinition.$inject = [ '$http','$compile' ];	
	function problemCoordinition($http,$compile) {	
		var url_problemCoordinition = "/contents/app/problemCoordinition/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_problemCoordinition),
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
						field : "problemTitle",
						title : "标题",
						width:200,
						filterable : true
					} ,
					{
						field : "projectName",
						title : "项目名称",
						width : 250,
						template:function(data){
							return "<a href='#/projectDetais/"+data.projectId+"'>"+data.projectName+"</a>";
						},
						filterable : false
					},{
						field : "problemType",
						title : "问题类型",

						filterable : true
					},
					
					{
						field : "problemState",
						title : "状态",
						width : 180,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.edit('" + data.problemId + "')", "vm.del('"+data.problemId+"')");
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