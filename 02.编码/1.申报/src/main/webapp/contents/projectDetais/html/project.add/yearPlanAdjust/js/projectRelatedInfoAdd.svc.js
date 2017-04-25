(function() {
	'use strict';

	angular.module('app').factory('projectRelatedInfoAddSvc', projectRelatedInfoAdd);

	projectRelatedInfoAdd.$inject = [ '$http','$compile' ];	
	function projectRelatedInfoAdd($http,$compile) {	
		var url_projectRelatedInfoAdd = "/contents/projectDetais/html/project.add/yearPlanAdjust/js/projectRelatedInfoAdd.list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectRelatedInfoAdd),
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
						field : "",
						title : "序号",
						width:45,
						filterable : false
					},{
						field : "projectName",
						title : "项目名称",
						width:200,
						filterable : true
					} ,
					{
						field : "projectStage",
						title : "项目阶段",
						width : 200 ,
						filterable : false
					},
					{
						field : "projectCode",
						title : "项目代码",
						filterable : false
					},{
						field : "buildUnit",
						title : "建立单位",
						filterable : true
					},	
					{
						field : "",
						title : "操作",
						width:170,
						template:function(data){
							return common.format($('#columnBtns').html(),
									"vm.projectRelevance('"+data.id+"')");
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