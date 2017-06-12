(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 
       "ui.router",
       "kendo.directives"
       
        // Custom modules 

        // 3rd Party Modules

    ]).config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
        	//首页-管理中心
        	.state('index', {
        		url: '/',
        		templateUrl: '/shenbaoAdmin/html/welcome',
        		controller: 'indexCtrl',
        		controllerAs: 'vm'
        	})            
            
             //begin#deptInfoMaintain（单位信息维护）
	        .state('deptInfoMaintain', {
	            url: '/deptInfoMaintain',
	            templateUrl: '/contents/shenbaoAdmin/deptInfoMaintain/html/deptInfoManager.html',
	            controller: 'deptInfoMaintainCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptInfoMaintain
             
 /**********************************************begin#月报*********************************/
             .state('projectMonthReport', {
	            url: '/projectMonthReport', 
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/list.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        
	        
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:projectId',
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/selectMonth',   	            	 	           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })	        
	        
	        .state('projectMonthReportInfoFill', {
	            url: '/projectMonthReportInfoFill/:projectId/:year/:month',
	            templateUrl:'/shenbaoAdmin/projectMonthReport/html/fillInfo/',           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })    
	        .state('projectMonthReport_projectInfo', {
	            url: '/projectMonthReport/projectInfo/:projectId', 
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/projectInfo.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
/**********************************************end#月报*********************************/
	        //begin#项目管理
	        //列表页
	        .state('project', {
	            url: '/project', 
	            templateUrl: '/shenbaoAdmin/project/html/list.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        //编辑页
	        .state('projectEdit', {
	            url: '/projectEdit/:id', 
	            templateUrl: '/shenbaoAdmin/project/html/edit.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        //项目详情页面
	        .state('project_projectInfo', {
	            url: '/project/projectInfo/:id', 
	            templateUrl: '/shenbaoAdmin/project/html/projectInfo.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#项目管理
	        
	        //begin#项目申报
	         .state('shenbao', {
	            url: '/shenbao', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/list.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        })	 
	         .state('shenbao_edit', {
	            url: '/shenbao/:id', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/edit.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        })
    }]);
    
})();