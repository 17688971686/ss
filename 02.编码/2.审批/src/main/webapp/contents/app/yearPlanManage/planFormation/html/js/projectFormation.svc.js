(function() {
	'use strict';

	angular.module('app').factory('projectFormationSvc', projectFormation);

	projectFormation.$inject = [ '$http' ];

	function projectFormation($http) {
		var url_projectFormation = "/contents/app/yearPlanManage/planFormation/html/js/projectFormation.list.json";
		var url_back = '#/projectFormation';
		var url_role = "/role";
		var service = {
			grid : grid,
			 
		};

		return service;

		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectFormation),
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
						
					},
					{
						field : "",
						title : "序号",
						width : 50,
						filterable : false
					},
					{
						field : "projectName",
						title : "名称",
						width:200,
						filterable : true,
						template:function(data){
							return "<a href='#/checkPlanProject/"+data.id+"'>"+data.projectName+"</a>";
						}
					},
					{
						field : "totalInvest",
						title : "总投资(万)",
						width : 150,
						filterable : false

					},
					{
						field : "applicantFund",
						title : "申请资金(万)",
						width : 150,
						filterable : false
						
					},
					{
						field : "planFund",
						title : "安排资金",
						width : 150,
						filterable : false
						
					},
					{
						field : "projectSort",
						title : "项目类别",
						width : 150,
						filterable : false
						
					},
					{
						field : "buildNature",
						title : "建设性质",
						width : 150,
						filterable : false
						
					},
					{
						field : "industry",
						title : "归口行业",
						width : 150,
						filterable : false
						
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