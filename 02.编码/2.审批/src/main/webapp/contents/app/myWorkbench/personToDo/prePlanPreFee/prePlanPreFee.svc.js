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
						width : 80,						
						filterable : false
					},{
						field : "step",
						title : "步骤",
						width : 100,
						filterable : true
					} ,{
						field : "message",
						title : "内容",
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