(function() {
	'use strict';

	angular.module('app').factory('workdaySvc', workday);

	workday.$inject = [ '$http' ];

	function workday($http) {
		var url_work="/work";
		
		var service = {
			getworkdays : getworkdays,
			editworkdays:editworkdays
		};

		return service;
		
		
		/**
		 * 获取所有需要的系统配置
		 */
		function getworkdays(vm){
			var httpOptions = {
					method : 'get',
					url : url_getworkdays
				};
			
			var httpSuccess = function success(response) {
				vm.configs = response.data;//所有的配置
				vm.configs.forEach(function(value,index,array){
					if(value.configName == common.basicDataConfig().taskType_monthReportPort){
						var configValue = value.configValue.split("-");
						if(configValue){
							vm.monthReportConfigBegin = parseInt(configValue[0]);
							vm.monthReportConfigEnd = parseInt(configValue[1]);
						}
					}
					if(value.configName == common.basicDataConfig().taskType_jihuaPort){
						var configValue = value.configValue.split("-");
						if(configValue){
							vm.planConfigBegin = new Date(parseInt(configValue[0])).toLocaleDateString();
							vm.planReportConfigEnd = new Date(parseInt(configValue[1])).toLocaleDateString();
						}
					}
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getworkdays
		
		/**
		 * 编辑配置信息
		 */
		function editworkdays(vm){
			//处理数据
			var httpOptions = {
					method : 'post',
					url : url_taskUser,
					data : vm.configs
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
								location.href = url_back;
							}
						});
					}
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun editworkdays
	}
})();