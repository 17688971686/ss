(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = [ '$http' ];	
	function index($http) {	
		var data_url="/indexData";
		var service = {
				getArticle:getArticle
		};		
		return service;	
		
		//begin#getArticle
		function getArticle(vm,type){
			var httpOptions = {
					method : 'get',
					url : data_url,
					data : vm.model
				}

				var httpSuccess = function success(response) {
					vm.model=response.data;
					vm.articles=vm.model.article_tzgg;
					console.log(vm.model);
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