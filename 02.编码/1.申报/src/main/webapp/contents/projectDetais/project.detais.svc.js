(function() {
	'use strict';

	angular.module('app').factory('projectDetaisSvc', projectDetais);

	projectDetais.$inject = [ '$http','$compile' ];	
	function projectDetais($http,$compile) {	
		var url_projectDetais = "/contents/app/myWorkbench/personToDo/projectDetais/data/list.json";
		var url_back = '#/projectDetais';
		
		
	}
	
	
	
})();