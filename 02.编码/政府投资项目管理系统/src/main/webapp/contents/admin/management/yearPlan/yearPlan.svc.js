(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http' ];

	function yearPlan($http) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_planList="/management/yearPlan";
		var url_back_planList="#/yearPlan/planList";

		
		var service = {
			grid_shenbaoInfoList : grid_shenbaoInfoList,
			grid_planList:grid_planList,
			plan_create:plan_create,
			getPlanById:getPlanById,
			grid_yearPlan_shenbaoInfoList:grid_yearPlan_shenbaoInfoList,
			grid_yearPlan_addShenbaoInfoList:grid_yearPlan_addShenbaoInfoList
			
		};
		
		function getPlanById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList + "?$filter=id eq '{0}'", vm.id)					
				}
				var httpSuccess = function success(response) {	
					if(vm.page=='planBZ'){
						vm.model.plan=response.data.value[0]
					}
					
				}
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}//getPlanById
		
		function grid_yearPlan_shenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList+"/"+vm.id+"/projectList"),
				schema : common.kendoGridConfig().schema({
					id : "id"
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
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					}
					,
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					},{
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.planGridOptions = {	
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,				
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//grid_shenbaoInfoList
		
		function grid_yearPlan_addShenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'projectShenBaoStage',
					operator:'eq',
					value:'projectShenBaoStage_7'
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					}
					,
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					},{
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.addPlanGridOptions = {	
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//grid_addShenbaoInfoList
		
		function plan_create(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;	               
				var httpOptions = {
					method : 'post',
					url : url_planList,
					data : vm.model
				}
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							})
						}
						
					});

				}

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//plan_create

		return service;
		
		// begin#grid_planList
		function grid_planList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList),
				schema : common.kendoGridConfig().schema({
					id : "id"					
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
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "name",
						title : "编制名称",						
						filterable : true
					},
					{
						field : "year",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					},{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(), item.id);

						}

					}

			];
			// End:column

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid_planList
		
		
		// begin#grid_shenbaoInfoList
		function grid_shenbaoInfoList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'projectShenBaoStage',
					operator:'eq',
					value:'projectShenBaoStage_7'
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					}
					,
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					},{
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid_shenbaoInfoList
	}
})();