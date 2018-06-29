(function(){
	'use strict';
	
	angular.module('app',[
		//Angular modules
		"ui.router",
		"kendo.directives"
	]).config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise('/');
		$stateProvider
		.state('adminIndex',{
				url:'/',
				templateUrl:'/contents/adminLogin/shenbaoIndex/shenbaoIndex.html',
				controller:'indexCtrl',
				controllerAs:'vm'
			})
	}]);
})();