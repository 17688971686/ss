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
				templateUrl:'/contents/shenbao/index/html/index.html',
				controller:'indexCtrl',
				controllerAs:'vm'
			})
			.state('details',{
				url:'/details/:type/:id',
				templateUrl:'/contents/shenbao/details/html/details.html',
				controller:'detailsCtrl',
				controllerAs:'vm'
			})
			.state('list',{
				url:'/list/:type',
				templateUrl:'/contents/shenbao/list/html/list.html',
				controller:'listCtrl',
				controllerAs:'vm'
			})
			//修改密码页面
			.state('forgetCode',{
				url:'/forgetCode',
				templateUrl:'/contents/shenbao/index/html/forgetCode.html',
				controller:'detailsCtrl',
				controllerAs:'vm'
			})
			
	}]);
})();