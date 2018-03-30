(function() {
	'use strict';

	angular.module('app').factory('basicDataSvc', basicData);

	basicData.$inject = [ '$http','$compile' ];	
	function basicData($http,$compile) {	
		var url_basicData = "/management/basicData";
	
			
		var service = {
			createBasicData:createBasicData,
			deleteBasicData:deleteBasicData,
			updateBasicData:updateBasicData
		};		
		return service;
		
		/**
		 * 更新基础数据
		 */
		function updateBasicData(vm){
			var httpOptions = {
					method : 'post',
					url : url_basicData+'/updateBasicData',
					data : vm.model
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response
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
		 * 删除基础数据
		 */
		function deleteBasicData(vm,id){
			var httpOptions = {
					method : 'post',
					url : url_basicData+'/deleteBasicData',
					data : id
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response
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
		 * 创建基础数据
		 */
		function createBasicData(vm){									
			var httpOptions = {
				method : 'post',
				url : url_basicData,
				data : vm.model
			};

			var httpSuccess = function success(response) {	
				common.requestSuccess({
					vm : vm,
					response : response					
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
})();