(function() {
	'use strict';

	angular.module('app').factory('planReachSvc', planReach);

	planReach.$inject = ['$http','$compile','$location'];	
	function planReach($http,$compile,$location) {
		var url="/shenbaoAdmin/planReach";
		var url_shenbao="/shenbaoAdmin/shenbao";
		
		var service={
				getHasIncludYearPlan:getHasIncludYearPlan,
				getNotIncludYearPlan:getNotIncludYearPlan,
				planReachRecords:planReachRecords,
				comfirmPlanReach:comfirmPlanReach,
				deletePlanReach:deletePlanReach
		}
		
		return service;
		
		/**
		 * 删除计划下达申请
		 */
		function deletePlanReach(vm,id){
			vm.isSubmit=true;
			var httpOptions = {
					method : 'delete',
					url :url_shenbao,
					data:id
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit=false;
						$('.alertDialog').modal('hide');
						$(".modal-backdrop").remove();
						vm.gridOptions_shenBaoRecords.dataSource.read();
					}
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun deletePlanReach
		
		/**
		 * 确认计划下达资金
		 */
		function comfirmPlanReach(vm,id){
			var httpOptions = {
				method : 'post',
				url : url+"/comfirmPlanReach",
				data : {"id":id,"sqPlanReach_ggys":vm.model.sqPlanReach_ggys,"sqPlanReach_gtzj":vm.model.sqPlanReach_gtzj}
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.hasIncludGridOptions.dataSource.read();
					}
				});
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun comfirmPlanReach
		
		/**
		 * 获取已纳入年度计划的项目数据
		 */
		function getHasIncludYearPlan(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url+"/hasInclud")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						planYear : {
							type : "number"
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
				},
				filter:[
					{
						field:'isIncludYearPlan',
						operator:'eq',
						value:true
					},
					{
						field:'projectShenBaoStage',
						operator:'eq',
						value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
					},
				],
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
			});
			
			var columns = [	
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : true,
					template:function(item){
						var css = "text-primary";
						return common.format('<a class="{2}" href="#/project/projectInfo/{0}">{1}</a>',item.projectId,item.projectName,css);
					},
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "projectConstrChar",
					title : "建设性质",
					template:function(item){
						return common.getBasicDataDesc(item.projectConstrChar);
					},
					width : 100,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectConstrChar,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field:"planYear",
					title:"计划年度",
					width : 80,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "申请资金(万元)",
					columns: [
						{
							field : "capitalSCZ_ggys_TheYear",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "capitalSCZ_gtzj_TheYear",
							title : "国土基金",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "安排资金(万元)",
					columns: [
						{
							field : "capitalAP_ggys_TheYear",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "capitalAP_gtzj_TheYear",
							title : "国土基金",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "计划下达申请(万元)",
					columns: [
						{
							field : "sqPlanReach_ggys",
							title : "公共预算",
							width:100,
							filterable : false,
							template:function(item){
								return common.format($('#input_ggys').html(),item.id,item.sqPlanReach_ggys,item.capitalAP_ggys_TheYear);
							},
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "sqPlanReach_gtzj",
							title : "国土基金",
							width:100,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    },
						    template:function(item){
								return common.format($('#input_gtzj').html(),item.id,item.sqPlanReach_gtzj,item.capitalAP_gtzj_TheYear);
							},
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title : "操作",
					width : 50,
					template : function(item) {
						var isHide = item.isIncludLibrary;
						return common.format($('#columnBtns_hasInclud').html(),item.id);
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				}
			];
			
			vm.hasIncludGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}//end fun getHasIncludYearPlan
		
		/**
		 * 获取未纳入年度计划的项目数据
		 */
		function getNotIncludYearPlan(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url+"/notInclud")),
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
					field:'isIncludYearPlan',
					operator:'eq',
					value:false
				},
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
			});
			
			var columns = [	
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : true,
					template:function(item){
						var css = "text-primary";
						return common.format('<a class="{2}" href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName,css);
					}
				},
				
				{
					field : "projectStage",
					title : "项目阶段",
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectStage,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectInvestmentType",
					title : "项目投资类型",
					width : 120,
					template:function(item){
						return common.getBasicDataDesc(item.projectInvestmentType);
					},
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.investmentType,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						var isHide = item.isIncludLibrary;
						return common.format($('#columnBtns_notInclud').html(),
								item.id,item.projectInvestmentType,common.basicDataConfig().projectShenBaoStage_jihuaxiada,item.projectNumber);
					}
				}

			];
			
			vm.notIncludGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}//end fun getNotIncludYearPlan
		
		function planReachRecords(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),						
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
				filter:[
					{	
						field:'projectNumber',
						operator:'eq',
						value:vm.projectNumber
					},
					{
						field:'projectShenBaoStage',
						operator:'eq',
						value:common.basicDataConfig().projectShenBaoStage_jihuaxiada
					}
				]
				
			});
			var columns = [	
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll_planReachRecords' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : false						
				},
				{
					field : "processState",
					title : "审批状态",
					width : 150,
					filterable : false,
					template:function(item){
						var processStateDesc=common.getBasicDataDesc(item.processState);
						var css='text-danger';
						return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
					}
				},
				
				{
					field : "planYear",
					title : "计划年度",	
					width : 100,
					filterable : false
				},
				{
					field : "",
					title : "操作",
					width : 200,
					template : function(item) {					
						var isShow=item.processState==common.basicDataConfig().processState_waitQianShou
						   ||item.processState==common.basicDataConfig().processState_tuiWen;
						return common.format($('#columnBtns_records').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none',"vm.deleteShenBaoInfo('"+item.id+"')");
					}
				}
			];
			vm.gridOptions_shenBaoRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}
	}	
})();