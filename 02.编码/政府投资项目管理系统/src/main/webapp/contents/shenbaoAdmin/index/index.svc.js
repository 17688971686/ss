(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = [ '$http' ];	

	function index($http) {	
		var url_taskRecord="/management/taskRecord";
		var url_unitShenBao="/shenbaoAdmin/shenbao";
		var service = {
			getTaskRecords:getTaskRecords, //获取任务消息
			getUnitShenBaoInfos:getUnitShenBaoInfos,//获取单位申报信息
		};		
		return service;
		
		/**
		 * 获取单位申报信息
		 */
		function getUnitShenBaoInfos(vm){
			var httpOptions = {
					method : 'get',
					url : url_unitShenBao+"/unit",
				}

				var httpSuccess = function success(response) {
					vm.model.shenBaoInfo = response.data.value;	
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 获取当前用户申报项目任务流转消息
		 */
		function getTaskRecords(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskRecord
				}

				var httpSuccess = function success(response) {
					vm.model.taskRecord = response.data.value;
					if(vm.model.taskRecord.length>0){
						for(var i=0;i<vm.model.taskRecord.length;i++){
							var model = vm.model.taskRecord[i];
							model.createdDate = common.toDate(model.createdDate);
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