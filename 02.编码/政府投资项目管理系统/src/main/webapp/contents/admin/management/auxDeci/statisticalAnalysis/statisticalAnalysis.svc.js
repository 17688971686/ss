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
			exportExcelForPlanByCustom:exportExcelForPlanByCustom
		};		
		return service;
		
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
		
			var httpOptions = {
	                method: 'post',
	                url : url+"/exportExcelForApprovalByCustom",
			        data : vm.model,
			        headers : { 'Content-Type': 'application/json;charset=UTF-8' }
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    
	                }
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
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
			
			var httpOptions = {
	                method: 'post',
	                url : url+"/exportExcelForPlanByCustom",
			        data : vm.model,
			        headers : { 'Content-Type': 'application/json;charset=UTF-8' }
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    
	                }
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun exportExcelForPlanByCustom
		
		/**
		 * 项目总库自定义条件报表导出
		 */
		function exportExcelForProjectByCustom(vm){
			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
			
			var httpOptions = {
	                method: 'post',
	                url : url+"/exportExcelForProjectByCustom",
			        data : vm.model,
			        headers : { 'Content-Type': 'application/json;charset=UTF-8' }
	            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    
	                }
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
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
	}	
})();