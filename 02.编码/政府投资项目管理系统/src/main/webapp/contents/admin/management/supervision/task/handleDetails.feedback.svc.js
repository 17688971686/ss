(function() {
	'use strict';

	angular.module('appSupervision').factory('handleDetailsFeedbackSvc', handleDetailsFeedback);

	handleDetailsFeedback.$inject = [ '$http' ,'$location'];

	function handleDetailsFeedback($http,$location) {
		var url_taskFeedback = "/management/supervision/task";
		var url_back = "#/task/todo_feedback";
		var url_project = "/shenbaoAdmin/project";
		
		var service = {
			getApprovalAtts:getApprovalAtts,
			getFeedbackComments : getFeedbackComments,
			getShenBaoAtts : getShenBaoAtts
		};
		
		return service;
		
		/**
		 * 查询项目附件
		 * @param id 项目id
		 */
		function getApprovalAtts(vm,projectId){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", projectId)
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
		
		/**
		 * 查询申报附件
		 * @param id 项目id
		 */
		function getShenBaoAtts(vm,shenbaoInfoId){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskFeedback + "/getShenBaoAtts?shenbaoInfoId={0}", shenbaoInfoId)
				};
			
			var httpSuccess = function success(response) {
				vm.shenbaoInfo = response.data;
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		function getFeedbackComments(vm,processInstanceId){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskFeedback + "/getFeedbackComments?processInstanceId={0}", processInstanceId)
				};
			
			var httpSuccess = function success(response) {
				debugger
				vm.feedbackComments = response.data;
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