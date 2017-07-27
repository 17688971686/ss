(function (){
	'use strict';
	
	angular.module('app').factory('detailsSvc',details);
	
	details.$inject = ['$http'];
	function details($http){
		var url_article = "/article";
		var service  = {
			getById:getById	
		};
		return service;
		
		function getById(vm,id){
			var httpOptions = {
				method:'get',
				url:url_article+common.format("?$filter=id eq '{0}'",id),
				data:vm.model
			};
			var httpSuccess = function success(response){
				vm.model=response.data.value[0] || {};
			};
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
	}
})();