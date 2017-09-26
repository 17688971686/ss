(function() {
	'use strict';

	angular.module('app').factory('sysConfigSvc', sysConfig);

	sysConfig.$inject = [ '$http' ];

	function sysConfig($http) {

		var url_back = "#/sysConfig";//获取所有的user
		var url_taskUser = "/sys/create";//设置task签收人
		var url_getSysConfigs = "/sys/getSysConfigs";
		var url_role="/role";
		
		var service = {
			getSysConfigs : getSysConfigs,
			editSysConfigs:editSysConfigs
		};

		return service;
		
		
		/**
		 * 获取所有需要的系统配置
		 */
		function getSysConfigs(vm){
			var httpOptions = {
					method : 'get',
					url : url_getSysConfigs,
					data : vm.model
				};
			
			var httpSuccess = function success(response) {
				vm.configs = response.data;//所有的配置
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 
		 */
		function editSysConfigs(vm){
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
		}
		
		
		/**
		 * 系统配置：查询所有task
		 * @return taskList
		 */
		function getAllTask(vm){
			vm.model.taskList = common.getBacicDataByIndectity(common.basicDataConfig().taskType);				
		}
		
	}
})();