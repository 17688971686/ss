(function() {
	'use strict';

	angular.module('app').factory('policySvc', policy);

	policy.$inject = [ '$http' ];

	function policy($http) {
		var url_policy = "/contents/app/uniteDoorManage/policy/data/policy.list.json";
		var url_back = '#/policy';
		var url_role = "/role";
		var service = {
			grid : grid
		};

		return service;

		 
		// begin#grid
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_policy),
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
					width : 50,
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
						filterable : false
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
						width : 200,
						filterable : false,
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