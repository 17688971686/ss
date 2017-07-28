(function (){
	'use strict';
	
	angular.module('app').factory('listSvc',list);
	
	list.$inject = ['$http'];
	function list($http){
		var url_article = "/article";
		var service  = {
			getData:getData	
		};
		return service;
		

		function getData(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_article),
				schema : common.kendoGridConfig().schema({
					id : "id"
//					fields : {
//						createdDate : {
//							type : "date"
//						}
//					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'type',
					operator:'eq',
					value:vm.type
				}
			});

			// End:dataSource

			// Begin:column
			var columns = [
					 {
						field : "title",
						title : "标题",											
						filterable : false,
						template:function(item){
							return common.format("<a href='#/details/{0}/{1}'>{2}</a>",vm.type,item.id,item.title);
						}
					}, {
						field : "createdDate",
						title : "时间",
						width : 180,
						filterable : false,
						template:function(item){
							return common.formatDateTime(item.createdDate);
						}
//						format : "{0:yyyy/MM/dd HH:mm:ss}"
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