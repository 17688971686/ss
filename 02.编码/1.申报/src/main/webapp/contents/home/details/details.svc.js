(function (){
	'use strict';
	
	angular.module('app').factory('detailsSvc',details);
	
	details.$inject = ['$http'];
	function details($http){
		var use_article = "/contents/home/details/data/article.js";
		var service  = {
			getArticle:getArticle	
		};
		return service;
		
		function getArticle(vm,id){
			var httpOptions = {
				method:'get',
				url:user_article,
				data:vm.model
			}
			var httpSuccess = function success(response){
				vm.model=response.data;
				
			}
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			})
		}
	}
})();