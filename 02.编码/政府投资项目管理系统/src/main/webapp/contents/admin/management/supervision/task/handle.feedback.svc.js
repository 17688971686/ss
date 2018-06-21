(function() {
	'use strict';

	angular.module('appSupervision').factory('handleFeedbackSvc', handleFeedback);

	handleFeedback.$inject = [ '$http' ,'$location'];

	function handleFeedback($http,$location) {
		var url_taskFeedback = "/management/supervision/task";
		var url_back = "#/task/todo_feedback";
		var url_project = "/shenbaoAdmin/project";
		
		var service = {
			feedback : feedback,
			getApprovalAtts:getApprovalAtts,
			getCurrentTaskKey:getCurrentTaskKey
		};
		
		return service;
		
		function feedback(vm){
			common.initJqValidation();
 			var isValid = $('form').valid();
 			if (isValid) {
 				var httpOptions = {
					method : 'post',
					url : url_taskFeedback+"/feedback",
					data:{"shenbaoInfoId":vm.shenbaoInfoId,"msg":vm.processFeekBack,"att":vm.attachmentDtos}
				};
 				
 				var httpSuccess = function success(response) {
 	 				debugger;
 					common.requestSuccess({
 						vm : vm,
 						response : response,
 						fn : function() {
 							common.alert({
 								vm : vm,
 								msg : "提交成功",
 								fn : function() {
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
		}
		
		/**
		 * 查询审批附件
		 * @param id 项目id
		 */
		function getApprovalAtts(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				vm.projectInfo = response.data.value[0]||{};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		function getCurrentTaskKey(vm,processInstanceId){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskFeedback + "/getCurrentTaskKey?processInstanceId={0}",processInstanceId),
				};
			
			var httpSuccess = function success(response) {
				vm.currentTaskKey = response.data;
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