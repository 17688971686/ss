(function() {
	'use strict';

	angular.module('app').factory('projectDeclarationSvc', projectDeclaration);

	projectDeclaration.$inject = [ '$http','$compile' ];	
	function projectDeclaration($http,$compile) {	
		var url_projectDeclaration = "/contents/app/projectDeclaration/data/list.json";
//		var url_back = '#/projectprocess';
			
		var service = {
			grid : grid	,
			queryById:queryById
		};		
		return service;	
		
		function queryById(vm,id){
			var httpOptions = {
					method : 'queryById',
					url : url_projectDeclaration,
					data : id
				}
				var httpSuccess = function success(response) {

					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							return response;
						}

					});

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
							return "<a href='#/projectDetais/"+data.projectId+"&"+data.declarationStage+"'>"+data.projectName+"</a>";
						},
						filterable : true
					},
					{
						field : "declarationStage",
						title : "申报阶段",
						width : 150,
						filterable : true
					},
					{
						field : "industry",
						title : "所属行业",
						width : 100,
						filterable : true
					},
					{
						field : "totalInvestment",
						title : "总投资/申报经费（万）",
						width : 170,
						filterable : false
					},
					{
						field : "declarationYear",
						title : "申报年度",
						width : 100,
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
						width:150,
						template:function(data){
							return common.format($('#columnBtns').html(),"vm.del('" + data.projectId + "')","vm.edit('"+data.projectId+"')");		
						},
						filterable : false
					},
					{
						field : "",
						title : "导出",
						width:100,
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