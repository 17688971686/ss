(function(){
	'use srtict';
	
	angular.module('app',[
		//Angular modules
		"ui.router",
		"kendo.directives"
	]).config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('index',{
				url:'/',
				templateUrl:'/contents/home/index/html/index.html',
				controller:'indexCtrl',
				controllerAs:'vm'
			})
			.state('details',{
				url:'/details/:id',
				templateUrl:'/contents/home/details/html/details.html',
				controller:'detailsCtrl',
				controllerAs:'vm'
			})
			//修改密码页面
			.state('forgetCode',{
				url:'/forgetCode',
				templateUrl:'/contents/home/index/html/forgetCode.html',
				controller:'detailsCtrl',
				controllerAs:'vm'
			})
			
	}]);
})();