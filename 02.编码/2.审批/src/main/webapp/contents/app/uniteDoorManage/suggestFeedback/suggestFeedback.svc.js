(function() {
	'use strict';

	angular.module('app').factory('suggestFeedbackSvc', suggestFeedback);

	suggestFeedback.$inject = [ '$http' ];

	function suggestFeedback($http) {
		var url_suggestFeedback = "/contents/app/uniteDoorManage/suggestFeedback/data/suggestFeedback.list.json";
		var url_back = '#/suggestFeedback';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
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
						filterable : false
					}, 
					{
						field : "titleName",
						title : "标题",
						width : 200,
						filterable : false
					}, 
					{
						field : "issueType",
						title : "问题类型",
						width : 200,
						filterable : false
					}, 
					{
						field : "projectName",
						title : "项目名称",
						width : 200,
						filterable : false,
						template:function(data){
							return "<a href='#/suggestDetails/"+data.id+"'>"+data.projectName+"</a>";
						}
					}, 
					{
						field : "state",
						title : "状态",
						width : 200,
						filterable : false
					}, 
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.projectInfoDel('"+item.id+"')",
									"vm.projectInfoDetails('"+item.id+"')",
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