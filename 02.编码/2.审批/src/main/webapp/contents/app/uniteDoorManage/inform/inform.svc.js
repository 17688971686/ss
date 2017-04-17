(function() {
	'use strict';

	angular.module('app').factory('informSvc', inform);

	inform.$inject = [ '$http' ];

	function inform($http) {
		var url_inform = "/contents/app/uniteDoorManage/inform/data/inform.list.json";
		var url_back = '#/inform';
		var url_role = "/role";
		var service = {
			grid : grid,
		};

		return service;

		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_inform),
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
				pageSize : 10,
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
						width : 100,
					},
					{
						field : "titleName",
						title : "标题",
						width : 200,
						filterable : true
					},
					{
						field : "releaseTime",
						title : "发布时间",
						width : 200,
						filterable : true,
						format : "{0:yyyy/MM/dd HH:mm:ss}"
					},
					{
						field : "source",
						title : "来源",
						filterable : false
					},
					{
						field : "content",
						title : "内容",
						width : 180,
						filterable : true
						

					},
					{
						field : "relatedAccessory",
						title : "相关附件",
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.projectInfoDel('"+item.id+"')",
									"vm.projectInfoEdit('"+item.id+"')");

						}

					}

			];
			// End:column
			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
	}
})();