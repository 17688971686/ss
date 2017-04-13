(function() {
	'use strict';

	angular.module('app').factory('planFormationSvc', planFormation);

	planFormation.$inject = [ '$http' ];

	function planFormation($http) {
		var url_planFormation = "/contents/app/yearPlanManage/planFormation/data/planFormation.list.json";
		var url_back = '#/planFormation';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
		};

		return service;

		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planFormation),
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
						field : "year",
						title : "年度",
						width : 150,
						filterable : true
					},
					{
						field : "projectName",
						title : "名称",
						width:200,
						filterable : true
					},
					{
						field : "projectSum",
						title : "项目总数",
						width : 150,
						filterable : false
						
					},
					{
						field : "projectTotalInvest",
						title : "项目总投资(万)",
						width : 150,
						filterable : false

					},
					{
						field : "applicantTotalFund",
						title : "申请总资金(万)",
						width : 150,
						filterable : false
						
					},
					{
						field : "planTotalFund",
						title : "安排总资金",
						width : 150,
						filterable : false
						
					},
					{
						field : "version",
						title : "版本",
						width : 150,
						filterable : false
						
					},
					{
						field : "planVersionType",
						title : "计划版本类型",
						width : 150,
						filterable : false
						
					},
					{
						field : "foundTime",
						title : "创建时间",
						width : 150,
						filterable : false
						
					},
					{
						field : "",
						title : "操作",
						width : 200,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.del('" + item.id + "')", item.id);
							/*return "<button type='button' class='btn-sm btn-infoo' onclick=\"formation('"+data.id+"')\">编制</button>";*/
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