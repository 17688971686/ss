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
			getyearPlanInvestSourceData:getyearPlanInvestSourceData
		};		
		return service;
		
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