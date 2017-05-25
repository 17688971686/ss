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
        		templateUrl: '/managerCenter/html/tmpl.html',
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
              //begin#projectMonthReport（项目月报）
	        //列表页
             .state('projectMonthReport', {
	            url: '/projectMonthReport', //匹配规则
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/list.html',//此处对应列表页面地址-controller里面的请求地址
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReport
	        
	        
	        //begin#projectMonthReportFill（项目月报填报--月份选择）
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:projectId',
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/selectMonth',   	            	 	           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })	        
	        //end#projectMonthReportFill
	        
	        //begin#projectMonthReportInfoFill（项目月报填报--具体信息填写）
	        .state('projectMonthReportInfoFill', {
	            url: '/projectMonthReportInfoFill/:projectId/:month',
	            templateUrl:'/shenbaoAdmin/projectMonthReport/html/fillInfo/',           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })        
/**********************************************end#月报*********************************/
	       
	        
	        
	        
    }]);
    
})();