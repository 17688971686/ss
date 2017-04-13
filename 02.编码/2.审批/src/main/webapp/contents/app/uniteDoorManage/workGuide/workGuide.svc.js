(function() {
	'use strict';

	angular.module('app').factory('workGuideSvc', workGuide);

	workGuide.$inject = [ '$http' ];

	function workGuide($http) {
		var url_workGuide =  "/contents/app/uniteDoorManage/workGuide/data/workGuide.list.json";
		var url_back = '#/workGuide';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
		};

		return service;

		// begin#grid
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_workGuide),
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
						field : "classify",
						title : "分类",
						width : 200,
						filterable : true
					},
					{
						field : "releaseTime",
						title : "发布时间",
						filterable : true,
						format : "{0:yyyy/MM/dd HH:mm:ss}"
					},
					{
						field : "source",
						title : "来源",
						width : 180,
						filterable : false

					},
					{
						field : "content",
						title : "内容",
						width : 180,
						filterable : true
					},
					{
						field : "accessory",
						title : "附件",
						width : 180,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.del('" + item.id + "')", item.id);

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