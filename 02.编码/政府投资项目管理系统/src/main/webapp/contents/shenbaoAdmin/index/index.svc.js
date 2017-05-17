(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = [ '$http' ];	

	function index($http) {	
		var declareProjects="/projectInfo";
		var oprationRecords="/log";
		var service = {
			getDeclareProjects:getDeclareProjects,
			getOprationRecords:getOprationRecords
		};		
		return service;	
		
		/**
		 * 查询申报的项目信息
		 */
		function getDeclareProjects(vm){
			var httpOptions = {
					method : 'get',
					url : declareProjects
				}

				var httpSuccess = function success(response) {
					vm.modelLists = response.data.value;
					console.log("管理中心页面申报项目查询:");
					console.log(vm.modelLists);
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 查询操作记录的信息
		 */
		function getOprationRecords(vm){
			var httpOptions = {
					method : 'get',
					url : common.format("{0}?filter=userId eq '{1}'",oprationRecords,global_userName)
				}

				var httpSuccess = function success(response) {
					vm.modelOprationLists = response.data.value;
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		//begin#getArticle
		function getArticle(vm,type){
			var httpOptions = {
					method : 'get',
					url : user_article+type+'.js',
					data : vm.model
				}

				var httpSuccess = function success(response) {
					vm["article_"+type]=response.data;
					if(type=="announcement"){
						vm.articles=response.data;
					}
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

		}
		//end#getArticle
		

		
		
		

	}
	
	
	
})();