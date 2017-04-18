(function() {
	'use strict';

	angular.module('app').factory('projectGeographicalDistributionSvc', projectGeographicalDistribution);

	projectGeographicalDistribution.$inject = [ '$http','$compile' ];	
	function projectGeographicalDistribution($http,$compile) {	
		var url_projectGeographicalDistribution = "/contents/app/decisionAidSystem/projectGeographicalDistribution/data/list.json";
		var url_back = '#/projectGeographicalDistribution';
			
		
		
		

	}
	
	
	
})();