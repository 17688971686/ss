(function() {
	'use strict';

	angular.module('app').factory('sysConfigSvc', sysConfig);

	sysConfig.$inject = [ '$http' ];

	function sysConfig($http) {

		var url_user = "/user";//获取所有的user
		var url_task = "/management/task";//获取需要设置的task
		var url_taskUser = "/sys/create";//设置task签收人
		var url_getSysConfigs = "/sys/getSysConfigs";
		
		
		var service = {
			getAllUser : getAllUser,
			getAllTask : getAllTask,
			createTaskUser : createTaskUser,
			getSysConfigs : getSysConfigs
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
				vm.userTaskList = response.data;//所有的配置
				for (var j = 0; j < vm.userTaskList.length; j++) {//循环所有的配置
					for (var i = 0; i < vm.model.taskList.length; i++) {//循环所有的任务
						if(vm.userTaskList[j].configName == vm.model.taskList[i].id && vm.userTaskList[j].configType ==common.basicDataConfig().taskType){
							if(vm.userTaskList[j].configName == common.basicDataConfig().taskType_monthReport 
									|| vm.userTaskList[j].configName == common.basicDataConfig().taskType_yearPlan){//如果为月报、下一年度计划系统配置
								vm.model.taskList[i].taskUser = vm.userTaskList[j].configValue;
							}else if(vm.userTaskList[j].configName == common.basicDataConfig().taskType_sendMesg 
									|| vm.userTaskList[j].configName == common.basicDataConfig().taskType_shenBao){//如果为发送短信系统配置或申报端口配置
								vm.model.taskList[i].taskEnable = vm.userTaskList[j].enable;
							}
						}
					}
				}	
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		
		/**
		 * 系统配置：查询所有username
		 * @return usernameList
		 */
		function createTaskUser(vm){
			var data=[];
		    for(var i in vm.model.taskList){		    
		    	data.push({configName:vm.model.taskList[i].id,configValue:vm.model.taskList[i].taskUser,enable:vm.model.config[i].enable});
		    }
		   
			var httpOptions = {
					method : 'post',
					url : url_taskUser,
					data : data
				};
			
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
								location.reload();
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
		 * 系统配置：设置task签收人
		 * 
		 */
		function getAllUser(vm) {
			
			var httpOptions = {
				method : 'get',
				url : url_user,
				data : vm.model
			};
			
			var httpSuccess = function success(response) {
				vm.userList = response.data.value;
				vm.user=[];
				for (var i = 0; i < vm.userList.length; i++) {
					var roles = vm.userList[i].roles;
					for (var j = 0; j < roles.length; j++) {
						if(roles[j].roleName == common.basicDataConfig().management){
							vm.user.push(vm.userList[i]);
						}
					}
				}
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
		
		function updateTaskUser(){
			
			var httpOptions = {
					method : 'put',
					url : url_user
				};
			
			var httpSuccess = function success(response) {
				vm.userList = response.data.value;
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
	}
})();