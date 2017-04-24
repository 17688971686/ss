(function() {
	'use strict';

	angular.module('app').factory('reviewPlanSvc', reviewPlan);

	reviewPlan.$inject = [ '$http' ];

	function reviewPlan($http) {
		var url_reviewPlan = "/contents/app/projectReviewManage/reviewPlan/data/reviewPlan.list.json";
		var url_back = '#/reviewPlan';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
		};

		return service;

		 
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_reviewPlan),
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
						field : "projectName",
						title : "项目名称",
						width : 200,
						filterable : true,
						template:function(data){
							return "<a href='#reviewDetails/"+data.id+"'>"+data.projectName+"</a>"
						}
					},
					{
						field : "reviewExpert",
						title : "评审专家",
						width : 200,
						filterable : true
					},
					{
						field : "reviewTime",
						title : "评审时间",
						filterable : true,
						width : 200,
						reviewPlanat : "{0:yyyy/MM/dd HH:mm:ss}"
					},
					{
						field : "reviewState",
						title : "评审状态",
						width : 180,
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