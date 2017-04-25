(function() {
	'use strict';

	angular.module('app').factory('projectDeclarationSvc', projectDeclaration);

	projectDeclaration.$inject = [ '$http','$compile' ];	
	function projectDeclaration($http,$compile) {	
		var url_projectDeclaration = "/contents/app/projectDeclaration/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid	,
			queryById:queryById,
			
		};		
		return service;	
		
		function queryById(vm,id){
			var httpOptions = {
					method : 'get',
					url : url_projectDeclaration,
					data : id
				}
				var httpSuccess = function success(response) {
					var data=response.data.value;
					var model=$linq(data).where(function(x) {
						return x.projectId == id;
					}).select(function(x) {
						return x;
					}).toArray();				
					if(model[0].declarationStage == "前期计划（前期费）"){
						vm.model = model[0];
						vm.projectName = vm.model.projectName;
						vm.declarationStage = vm.model.declarationStage;
		        		location.href = "#/projectDeclarationInfoEdit_prePlan";
		        	}else if(model[0].declarationStage == "规划设计前期费"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_planDesign";
		        	}else if(model[0].declarationStage == "新开工计划"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_newStratPlan";
		        	}else if(model[0].declarationStage == "续建计划"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_constructionPlan";
		        	}else if(model[0].declarationStage == "下一年度计划"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_nextYearPlan";
		        	}else if(model[0].declarationStage == "年度调整计划"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_yearPlanAdjust";
		        	}else if(model[0].declarationStage == "委托审计"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_entrustAudit";
		        	}else if(model[0].declarationStage == "审计决算资金"){
		        		vm.model = model[0];
		        		location.href = "#/projectDeclarationInfoEdit_auditAccountFunds";
		        	}
					
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			
		}
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectDeclaration),
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
						template:function(data){
							if(data.declarationStage=="前期计划（前期费）"){
								//vm.declarationStage = data.declarationStage;
								//vm.projectName = data.projectName;
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
						width : 120,
						filterable : true
					},
					{
						field : "industry",
						title : "所属行业",
						width : 80,
						filterable : true
					},
					{
						field : "totalInvestment",
						title : "总投资/申报经费（万）",
						width : 100,
						filterable : false
					},
					{
						field : "declarationYear",
						title : "申报年度",
						width : 80,
						filterable : true
					},
					{
						field : "state",
						title : "状态",
						width : 100,
						filterable : true
					},
					{
						field : "",
						title : "操作",
						width:180,
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.del('" + data.projectId + "')","vm.edit('"+data.projectId+"')","vm.export('"+data.projectId+"')");		
						},
						filterable : false
					},

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