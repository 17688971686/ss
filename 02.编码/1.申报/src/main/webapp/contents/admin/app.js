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
             .state('index', {
                 url: '/',
                 templateUrl:  '/contents/admin/index/html/tmpl.html',
                 controller: 'indexCtrl',
                 controllerAs: 'vm'
             })
              .state('projectDetais', {
                 url: '/projectDetais/:id',
                 templateUrl:  '/contents/projectDetais/html/projectDetailInfo.html',
                 controller: 'projectDetaisCtrl',
                 controllerAs: 'vm'
             })
             //begin#projectMonthReport（项目月报）
	        .state('projectMonthReport', {
	            url: '/projectMonthReport',
	            templateUrl: '/contents/app/projectMonthReport/html/list.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReport
	        
	        //begin#projectMonthReportFill（项目月报填报月份选择）
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:id',
	            templateUrl: '/contents/app/projectMonthReport/html/fill.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReportFill
	        
	        //begin#projectMonthReportInfoFill（项目月报填报月份选择）
	        .state('projectMonthReportInfoFill', {
	            url: '/projectMonthReportInfoFill/:type',
	            templateUrl: '/contents/app/projectMonthReport/html/fillInfo.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReportInfoFill
	        
	        
	        
	        
	         //begin#problemCoordinition（问题协调）
	        .state('problemCoordinition', {
	            url: '/problemCoordinition',
	            templateUrl: '/contents/app/problemCoordinition/html/list.html',
	            controller: 'problemCoordinitionCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#problemCoordinition
	        
	        //begin#problemCoordinition（问题编辑）
	        .state('problemInfoEdit', {
	            url: '/problemInfoEdit/:id',
	            templateUrl: '/contents/app/problemCoordinition/html/edit.html',
	            controller: 'problemEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#problemCoordinition
	        
	       
	        
	        
	        
	        //begin#suggestFeedback（建议反馈）
	        .state('suggestFeedback', {
	            url: '/suggestFeedback',
	            templateUrl: '/contents/app/suggestFeedback/html/list.html',
	            controller: 'suggestFeedbackCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestFeedback
	        
	         //begin#suggestInfoEdit（建议反馈编辑）
	        .state('suggestInfoEdit', {
	            url: '/suggestInfoEdit/:id',
	            templateUrl: '/contents/app/suggestFeedback/html/edit.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoEdit
	        
	         //begin#suggestInfoLook（建议反馈详情）
	        .state('suggestInfoLook', {
	            url: '/suggestInfoLook/:id',
	            templateUrl: '/contents/app/suggestFeedback/html/details.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoLook
	        
	        
	        
	         
	        
	        //begin#deptInfoMaintain（单位信息维护）
	        .state('deptInfoMaintain', {
	            url: '/deptInfoMaintain',
	            templateUrl: '/contents/app/deptInfoMaintain/html/deptInfoManager.html',
	            controller: 'deptInfoMaintainCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptInfoMaintain
             
    }]);
    
})();