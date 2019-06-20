(function() {
	'use strict';

	angular.module('app').factory('statisticalAnalysisSvc', statisticalAnalysis);

	statisticalAnalysis.$inject = [ '$http','$compile' ];	
	function statisticalAnalysis($http,$compile) {	
		var url="/management/auxDeci/statisticalAnalysis";
		
		var service = {
			getprojectByHYData:getprojectByHYData,
			getprojectInvestSourceData:getprojectInvestSourceData,
			getyearPlanByHYData:getyearPlanByHYData,
			getyearPlanInvestSourceData:getyearPlanInvestSourceData,
			exportExcelForProjectByCustom:exportExcelForProjectByCustom,
			exportExcelForApprovalByCustom:exportExcelForApprovalByCustom,
			exportExcelForPlanByCustom:exportExcelForPlanByCustom,
			//固定模板类获取数据
			getProjectFixedData:getProjectFixedData,
			getPlanFixedData:getPlanFixedData,
			getApprovalFixedData:getApprovalFixedData,

			//自定义条件获取数据
			getApprovalCustomData:getApprovalCustomData,
			getPlanCustomData:getPlanCustomData,
			getProjectCustomData:getProjectCustomData,

			//项目资金统计与导出
            getMoneyFixedData:getMoneyFixedData,
            exportExcelForMoneyByCondition:exportExcelForMoneyByCondition,

			//表格展示数据
			showApprovalAllGrid:showApprovalAllGrid,
			showPlanAllGrid:showPlanAllGrid,
			showProjectAllGrid:showProjectAllGrid,
			showProjectMoneyGrid:showProjectMoneyGrid
		};
		return service;
		
		/**
		 * 获取项目总库自定义条件数据
		 */
		function getProjectCustomData(vm){
			var httpOptions = {
	                method: 'post',
	                url:url+"/getProjectCustomData",
	                data:{
	                	"projectBegin":vm.model.projectBegin,
						"projectEnd":vm.model.projectEnd,
	                	"industry":vm.model.industry,
	                	"unit":vm.model.unit,
	                	"stage":vm.model.stage,
	                	"category":vm.model.category,
	                	"projectName":vm.model.projectName,
	                	"projectInvestSumBegin":vm.model.projectInvestSumBegin,
	                	"projectInvestSumEnd":vm.model.projectInvestSumEnd
	                	}
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.projectCustomData=response.data||[];
					}
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getProjectCustomData
		
		/**
		 * 获取计划类自定义条件数据
		 */
		function getPlanCustomData(vm){
			var httpOptions = {
	                method: 'post',
	                url:url+"/getPlanCustomData",
	                data:{"industry":vm.model.industry,
	                	"unit":vm.model.unit,
	                	"stage":vm.model.stage,
	                	"category":vm.model.category,
	                	"projectName":vm.model.projectName,
	                	"planYearBegin":vm.model.planYearBegin,
	                	"planYearEnd":vm.model.planYearEnd,
	                	"projectInvestSumBegin":vm.model.projectInvestSumBegin,
	                	"projectInvestSumEnd":vm.model.projectInvestSumEnd,
	                	"projectApPlanReachSumBegin":vm.model.projectApPlanReachSumBegin,
	                	"projectApPlanReachSumEnd":vm.model.projectApPlanReachSumEnd
	                	}
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.planCustomData=response.data||[];
	                    //TODO 时间格式的转换
					}
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
			
		}//end fun getPlanCustomData
		
		/**
		 * 获取审批类自定义条件数据
		 */
		function getApprovalCustomData(vm){
			var httpOptions = {
	                method: 'post',
	                url:url+"/getApprovalCustomData",
	                data:{"industry":vm.model.industry,
	                	"unit":vm.model.unit,
	                	"stage":vm.model.stage,
	                	"category":vm.model.category,
	                	"projectName":vm.model.projectName,
	                	"pifuDateBegin":vm.model.pifuDateBegin,
	                	"pifuDateEnd":vm.model.pifuDateEnd,
	                	"projectInvestSumBegin":vm.model.projectInvestSumBegin,
	                	"projectInvestSumEnd":vm.model.projectInvestSumEnd}
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.approvalCustomData=response.data||[];
					}
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getApprovalCustomData
		
		/**
		 * 获取审批类固定模板类数据
		 */
		function getApprovalFixedData(vm){
			var httpOptions = {
	                method: 'get',
	                url:common.format(url+"/getExcelForApprovalData?classDesc={1}&approvalYear={0}",vm.parameter,vm.type)
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.approvalFixedData=response.data||[];
					}
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getApprovalFixedData
		
		/**
		 * 获取计划类固定模板类数据
		 */
		function getPlanFixedData(vm){
			var httpOptions = {
	                method: 'get',
	                url:common.format(url+"/getExcelForPlanData?classDesc={1}&planYear={0}",vm.parameter,vm.type)
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.planFixedData=response.data||[];
					}
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getPlanFixedData
		
		/**
		 * 获取项目总库固定模板类数据
		 */
		function getProjectFixedData(vm){
			var httpOptions = {
	                method: 'get',
	                url:common.format(url+"/getExcelForProjectData?classDesc={1}&isIncludLibrary={0}",vm.parameter,vm.type)
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.projectFixedData=response.data||[];
					}
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getProjectFixedData

        /**
         * 获取项目资金统计数据
         */
        function getMoneyFixedData(vm){
            var httpOptions = {
                method: 'post',
                url:url+"/getExcelForMoneyData",
                data:{
                    "unit":vm.model.unit,
                    "stage":vm.model.stage,
                    "projectStage":vm.model.projectStage,
					"industry":vm.model.industry,
					"category":vm.model.category,
                    "projectName":vm.model.projectName,
					"type":vm.type,
					"isIncludLibrary":vm.model.isIncludLibrary
                }
            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm:vm,
                    response:response,
                    fn:function () {
                        vm.moneyData = response.data||[];
                    }
                });
            };
            common.http({
                vm:vm,
                $http:$http,
                httpOptions:httpOptions,
                success:httpSuccess
            });
        }//end fun getProjectFixedData

        /**
         * 项目资金报表导出
         */
        function exportExcelForMoneyByCondition(vm){
            vm.postDownLoadFile({
                url:url+"/exportExcelForMoney",
                data:{
                    "unit":vm.model.unit,
                    "stage":vm.model.stage,
					"projectStage":vm.model.projectStage,
                    "industry":vm.model.industry,
                    "category":vm.model.category,
                    "projectName":vm.model.projectName,
                    "type":vm.type,
                    "isIncludLibrary":vm.model.isIncludLibrary
                	},
                method:'post'
            });
        }


		/**
		 * 审批类自定义条件报表导出
		 */
		function exportExcelForApprovalByCustom(vm){
			//批复时间(没有填写、填写之后删除、结束时间小于开始时间(有验证))
			vm.model.pifuDateBegin=vm.pifuDateBegin==undefined?"":vm.pifuDateBegin.toString();
			vm.model.pifuDateEnd=vm.pifuDateEnd==undefined?"":vm.pifuDateEnd.toString();
			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
			
			vm.postDownLoadFile({
	            url:url+"/exportExcelForApprovalByCustom",
	            data:vm.model,
	            method:'post'
	          });
		}//end fun exportExcelForApprovalByCustom
		
		function exportExcelForPlanByCustom(vm){
			//计划下达时间(没有填写、填写之后删除、结束时间小于开始时间(有验证))
			vm.model.planYearBegin=vm.planYearBegin==undefined?"":vm.planYearBegin.toString();
			vm.model.planYearEnd=vm.planYearEnd==undefined?"":vm.planYearEnd.toString();
			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
			//下达资金范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
			vm.model.projectApPlanReachSumBegin=vm.projectApPlanReachSumBegin==undefined?"":vm.projectApPlanReachSumBegin.toString();
			vm.model.projectApPlanReachSumEnd=vm.projectApPlanReachSumEnd==undefined?"":vm.projectApPlanReachSumEnd.toString();
			
			vm.postDownLoadFile({
	            url:url+"/exportExcelForPlanByCustom",
	            data:vm.model,
	            method:'post'
	          });
		}//end fun exportExcelForPlanByCustom
		
		/**
		 * 项目总库自定义条件报表导出
		 */
		function exportExcelForProjectByCustom(vm){
			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
			
			vm.postDownLoadFile({
	            url:url+"/exportExcelForProjectByCustom",
	            data:vm.model,
	            method:'post'
	          });
		}//end fun exportExcelForProjectByCustom
		
		/**
		 * @Description 获取项目库项目投资行业分布图
		 */
		function getprojectByHYData(vm){
			var httpOptions = {
	                method: 'get',
	                url:url+"/getprojectByHY",
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    var data = response.data;
	                    var xdata = [data.length];
	                	var projectInvestSumData = [data.length];
	                	var projectInvestAccuSumData = [data.length];
	                	data.forEach(function(value,index,array){
	                		xdata[index]=value.projectIndustry;
	                		projectInvestSumData[index]=value.projectInvestSum;
	                		projectInvestAccuSumData[index]=value.projectInvestAccuSum;
	                	});
	                	vm.projectByHYChart.setOption({
	                		xAxis:{
	                			data:xdata
	                		},
	                		series:[
	                			{
	                				data:projectInvestSumData
	                			},
	                			{
	                				data:projectInvestAccuSumData
	                			}
	                		]
	                	});
	                	vm.projectByHYChart.hideLoading();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getprojectByHYData
		
		/**
		 * @Description 获取项目库项目投资单位分布图
		 */
		function getprojectInvestSourceData(vm){
			var httpOptions = {
	                method: 'get',
	                url:url+"/getprojectInvestSource",
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    var data = response.data[0] || {};
	                	vm.projectInvestSourceChart.setOption({
	                		series:
	                			{
	                				data:[
	                					{value:data.capitalSCZ_ggys, name:'市财政-公共预算'},
	                					{value:data.capitalSCZ_gtzj, name:'市财政-国土资金'},
	                					{value:data.capitalSCZ_zxzj, name:'市财政-专项资金'},
	                					{value:data.capitalQCZ_ggys, name:'区财政-国土资金'},
	                					{value:data.capitalQCZ_gtzj, name:'区财政-专项资金'},
	                					{value:data.capitalZYYS, name:'中央预算'},
	                					{value:data.capitalSHTZ, name:'社会投资'},
	                					{value:data.capitalOther, name:'其他'}
	                				]
	                			},
	                		
	                	});
	                    vm.projectInvestSourceChart.hideLoading();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
          
		}//end fun getprojectByUnitData
		
		/**
		 * @Description 获取年度计划项目投资行业分布图
		 */
		function getyearPlanByHYData(vm){
			var httpOptions = {
	                method: 'get',
	                url:url+"/getyearPlanByHY",
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    var data = response.data;
	                    var xdata = [data.length];
	                	var projectInvestSumData = [data.length];
	                	var projectInvestAccuSumData = [data.length];
	                	var apCapitalData = [data.length];
	                	data.forEach(function(value,index,array){
	                		xdata[index]=value.projectIndustry;
	                		projectInvestSumData[index]=value.projectInvestSum;
	                		projectInvestAccuSumData[index]=value.projectInvestAccuSum;
	                		apCapitalData[index]=value.apCapital;
	                	});
	                	vm.yearPlanByHYChart.setOption({
	                		xAxis:{
	                			data:xdata
	                		},
	                		series:[
	                			{
	                				data:projectInvestSumData
	                			},
	                			{
	                				data:projectInvestAccuSumData
	                			},
	                			{
	                				data:apCapitalData
	                			}
	                		]
	                	});
	                	vm.yearPlanByHYChart.hideLoading();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getyearPlanByHYData
		
		/**
		 * @Description 获取年度计划项目投资单位分布图
		 */
		function getyearPlanInvestSourceData(vm){
			var httpOptions = {
	                method: 'get',
	                url:url+"/getyearPlanInvestSource",
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    var data = response.data[0] || {};
	                    vm.yearPlanInvestSourceChart.setOption({
	                		series:
	                			{
	                				data:[
	                					{value:data.capitalSCZ_ggys, name:'市财政-公共预算'},
	                					{value:data.capitalSCZ_gtzj, name:'市财政-国土资金'},
	                					{value:data.capitalSCZ_zxzj, name:'市财政-专项资金'},
	                					{value:data.capitalQCZ_ggys, name:'区财政-国土资金'},
	                					{value:data.capitalQCZ_gtzj, name:'区财政-专项资金'},
	                					{value:data.capitalZYYS, name:'中央预算'},
	                					{value:data.capitalSHTZ, name:'社会投资'},
	                					{value:data.capitalOther, name:'其他'}
	                				]
	                			},
	                		
	                	});
	                    vm.yearPlanInvestSourceChart.hideLoading();
	                }
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getyearPlanByUnitData
		
		function showApprovalAllGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url+"/getApprovalAllData"), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize: 10,
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					field : "projectName",
					title : "项目名称",
					width : 350,
				},
				{
					field : "unitName",
					title : "申报单位",
					width : 120,
				},
				{
					field : "projectStageDesc",
					title : "审批阶段",
					width : 120,
				},
				{
					field : "projectIndustryDesc",
					title : "行业分类",
					width : 120,
				},
				{
					field : "projectInvestSum",
					title : "总投资(万元)",
					width : 120,
				},
				{
					field : "pifuDate",
					title : "批复时间",
					width : 120,
					template : function (tiem) {
						var date = common.formatDate(tiem.pifuDate);
						if(date==null){
							return "";
						}
						return date;
					}
				},
			];
			// End:column

			vm.gridOptions={
				dataSource : common.gridDataSource(dataSource),
				// filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords:common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable: true,
				// sortable:true,
				// scrollable:true
			};
		}
		
		//计划类
		function showPlanAllGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url+"/getPlanAllData"), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						// createdDate : {
						// 	type : "date"
						// }
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize: 10,
				/*sort : {
					field : "createdDate",
					dir : "desc"
				},*/
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					field : "projectName",
					title : "项目名称",
					width : 350,
				},
				{
					field : "unitName",
					title : "申报单位",
					width : 120,
				},
				{
					field : "projectInvestSum",
					title : "总投资(万元)",
					width : 120,
				},
				{
					field : "projectStageDesc",
					title : "项目阶段",
					width : 120,
				},
				/*{
					field : "projectIndustryDesc",
					title : "行业分类",
					width : 120,
				},*/
				{
					field : "apPlanReachSum",
					title : "下达资金(万元)",
					width : 130,
					template : function (tiem) {
						return tiem.apPlanReach_ggys+tiem.apPlanReach_gtzj;
					}
				},
				{
					field : "pifuDate",
					title : "计划下达时间",
					width : 120,
					template : function (tiem) { 
						var pifuDate = common.formatDate(tiem.pifuDate);
						if(pifuDate == null){
							return "";
						}
						return pifuDate;
					} 
				}
			];
			// End:column

			vm.gridOptions={
				dataSource : common.gridDataSource(dataSource),
				pageable : common.kendoGridConfig().pageable,
				noRecords:common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable: true,
			};
		}
		
		//项目类
		function showProjectAllGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url+"/getProjectAllData"), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						// createdDate : {
						// 	type : "date"
						// }
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize: 10,
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					field : "projectName",
					title : "项目名称",
					width:350,
					// filterable : true
				},
				{
					field : "projectIndustryDesc",
					title : "行业分类",
					width : 120,
				},
				{
					field : "projectStageDesc",
					title : "项目阶段",
					width : 120,
				},
				{
					field : "projectCategory",
					title : "项目类别",
					width : 80,
					template : function (tiem) { 
						var projectCategory="";
						if(tiem.projectCategory!=null){
							switch (tiem.projectCategory) {
								case "projectCategory_1":
									projectCategory = "A类";
									break;
								case "projectCategory_2":
									projectCategory = "B类";
									break;
								case "projectCategory_3":
									projectCategory = "C类";
									break;
								case "projectCategory_4":
									projectCategory = "D类";
									break;
							}
						}
						return projectCategory;
					}
				},
				{
					field : "unitName",
					title : "申报单位",
					width : 150,
				},
				{
					field : "projectInvestSum",
					title : "总投资(万元)",
					width : 120,
				}
			];
			// End:column

			vm.gridOptions={
				dataSource : common.gridDataSource(dataSource),
				pageable : common.kendoGridConfig().pageable,
				noRecords:common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable: true,
			};
		}// end Projectgrid
		
		
		//资金类
		function showProjectMoneyGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url+"/getProjectMoneyData"), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize: 10,
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					field : "projectName",
					title : "项目名称",
					width:350,
				},
				{
					field : "projectIndustryDesc",
					title : "行业分类",
					width : 130,
				},
				{
					field : "projectStageDesc",
					title : "项目阶段",
					width : 120,
				},
				{
					field : "projectCategory",
					title : "项目类别",
					width : 80,
					template : function (tiem) {
						var projectCategory="";
						if(tiem.projectCategory!=null){
							switch (tiem.projectCategory) {
								case "projectCategory_1":
									projectCategory = "A类";
									break;
								case "projectCategory_2":
									projectCategory = "B类";
									break;
								case "projectCategory_3":
									projectCategory = "C类";
									break;
								case "projectCategory_4":
									projectCategory = "D类";
									break;
							}
						}
						return projectCategory;
					}
				},
				{
					field : "unitName",
					title : "申报单位",
					width : 150,
				},
				{
					field : "projectInvestSum",
					title : "总投资(万元)",
					width : 120,
				},
				{
					field : "isIncludLibraryString",
					title : "是否纳入项目库",
					width : 120,
				}
			];
			// End:column

			vm.gridOptions={
				dataSource : common.gridDataSource(dataSource),
				pageable : common.kendoGridConfig().pageable,
				noRecords:common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable: true,
			};
		}// end Projectgrid
		
	}	
})();