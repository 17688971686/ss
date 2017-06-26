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
		 * 初始化任务签收人
		 */
		function getSysConfigs(vm){
			var httpOptions = {
					method : 'get',
					url : url_getSysConfigs,
					data : vm.model
				}
				var httpSuccess = function success(response) {
				vm.userTaskList = response.data;
				for (var int = 0; int < vm.userTaskList.length; int++) {
					for (var i = 0; i < vm.model.taskList.length; i++) {
						if(vm.userTaskList[int].configName == vm.model.taskList[i].id &&vm.userTaskList[int].configType =="taskType"){
							vm.model.taskList[i].taskUser = vm.userTaskList[int].configValue;
						}
					}
				}
			
				}
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
		    for(var i in vm.model.config){		    
		    	data.push({configName:vm.model.config[i].configName,configValue:vm.model.config[i].configValue});
		    }
			var httpOptions = {
					method : 'post',
					url : url_taskUser,
					data : data
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
								location.reload();
							}
						})
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
		
		/**
		 * 系统配置：设置task签收人
		 * 
		 */
		function getAllUser(vm) {
			var httpOptions = {
				method : 'get',
				url : url_user,
				data : vm.model
			}
			var httpSuccess = function success(response) {
				vm.userList = response.data.value;
			}
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
			vm.model.taskList = $linq(common.getBasicData()).where(function(x){return x.identity=="taskType" && x.pId=="taskType"}).toArray();
		}
		
		function updateTaskUser(){
			var httpOptions = {
					method : 'put',
					url : url_user
				}
				var httpSuccess = function success(response) {
					vm.userList = response.data.value;
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
	}
})();