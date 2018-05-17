(function() {
	'use strict';

	angular.module('app').factory('sysConfigSvc', sysConfig);

	sysConfig.$inject = [ '$http' ];

	function sysConfig($http) {
		var url_back = "#/sysConfig";//获取所有的user
		var url_taskUser = "/sys/create";//设置task签收人
		var url_getSysConfigs = "/sys/getSysConfigs";
		var url_org="/org";
		
		var service = {
			getSysConfigs : getSysConfigs,
			editSysConfigs:editSysConfigs,
			getUsersInTouzike:getUsersInTouzike
		};

		return service;
		
		
		/**
		 * 获取投资科人员信息
		 */
		function getUsersInTouzike(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_org+"?$filter=name eq '{0}'", "投资科")
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.userInTouzike = response.data.value[0].userDtos || {}.userDtos;//投资科人员
						vm.getUserName=function(userId){
				        	var user=$linq(vm.model.userInTouzike)
				    			.where(function(x){return x.id==userId;}).firstOrDefault();
				        	return user;
				        };
					}
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getUsersInTouzike
		
		
		/**
		 * 获取所有需要的系统配置
		 */
		function getSysConfigs(vm){
			var httpOptions = {
					method : 'get',
					url : url_getSysConfigs
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
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getSysConfigs
		
		/**
		 * 编辑配置信息
		 */
		function editSysConfigs(vm){
			//处理数据
			vm.configs.forEach(function(value,index,array){
				if(value.configName == common.basicDataConfig().taskType_monthReportPort){
					value.configValue = vm.monthReportConfigBegin+"-"+vm.monthReportConfigEnd;
				}
				if(value.configName == common.basicDataConfig().taskType_shenpiFenBan){
					value.enable = true;
				}
			});

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
		}//end fun editSysConfigs
	}
})();