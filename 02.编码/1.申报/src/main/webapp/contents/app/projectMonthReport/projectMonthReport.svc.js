(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {	
		var url_projectMonthReport = "/contents/app/projectMonthReport/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectMonthReport),
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
				serverFiltering : false,			
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
						title : "序号",
						width : 45,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 200,
						/*template:function(data){
							return "<a href='#/projectDetais/"+data.projectId+"'>"+data.projectName+"</a>";
						},*/
						template:function(data){
							if(data.declarationStage=="前期计划（前期费）"){
								vm.declarationStage = data.declarationStage;
								vm.projectName = data.projectName;
								return "<a href='#/projectDetais/prePlan/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="规划设计前期费"){						
								return "<a href='#/projectDetais/planDesign/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="新开工计划"){
								return "<a href='#/projectDetais/newStratPlan/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="续建计划"){
								return "<a href='#/projectDetais/constructionPlan/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="下一年度计划"){
								return "<a href='#/projectDetais/nextYearPlan/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="年度调整计划"){
								return "<a href='#/projectDetais/yearPlanAdjust/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="委托审计"){
								return "<a href='#/projectDetais/entrustAudit/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							if(data.declarationStage=="审计决算资金"){
								return "<a href='#/projectDetais/auditAccountFunds/"+data.projectId+"'>"+data.projectName+"</a>";
							}
							
						},
						filterable : true
					},
					{
						field : "declarationStage",
						title : "申报阶段",
						width : 165,
						filterable : true
					},
					{
						field : "annualYear",
						title : "申报年度",
						width : 165,
						filterable : true
					},
					{
						field : "industry",
						title : "所属行业",
						width : 165,
						filterable : true
					},
					{
						field : "totalInvestment",
						title : "总投资（万）",
						width : 100,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.fill('" + data.projectId + "')");		
						},
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