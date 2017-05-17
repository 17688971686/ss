(function() {
	'use strict';

	angular.module('app').factory('monthReportSvc', monthReport);

	monthReport.$inject = [ '$http','$compile' ];	
	function monthReport($http,$compile) {	
		var url_projectInfo = "/projectInfo";
		var url_back = '#/monthReport/';
			
		var service = {
			grid : grid
				
		};		
		return service;	
		
		
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectInfo), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
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
						field : "projectName",
						title : "项目名称",
						width : 200,
						template:function(data){
							//根据不同的申报阶段点击项目链接跳转到不同的详情页面
							return "<a href='#/projectDetails/"+data.id+"'>"+data.projectName+"</a>";							
						},
						filterable : true
					},
					
					{
						field : "projectStageValue",
						title : "申报阶段",
						width : 165,
						filterable : false
					},
					{
						field : "shenBaoYear",
						title : "申报年度",
						width : 80,
						filterable : false
					},
					{
						field : "",
						title : "填报月份",
						template:function(data){
							//不同的投资类型返回不同的填报页面；政府投资类型还要分为两种情况然后返回不同的页面
							return common.format($('#columnBtns').html(),data.id,data.projectName,data.projectBuildStage);		
						},
						width:400,
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