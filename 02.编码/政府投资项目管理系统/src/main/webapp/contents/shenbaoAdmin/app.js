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
                 templateUrl:  '/contents/shenbaoAdmin/index/html/tmpl.html',
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
	        
	        
	        //**********************************************begin#项目申报*********************************//
	        //begin#projectDeclaration（项目申报）
	        //列表页
              .state('projectDeclaration', {
                 url: '/projectDeclaration',
                 templateUrl:  '/contents/shenbaoAdmin/projectDeclaration/html/project.list.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })             
             
             //end#projectDeclaration            
           
             
             
             //begin#projectDeclarationInfoFill_prePlan（项目申报--项目新增--前期计划（前期费）信息填寫）
              .state('projectDeclarationInfoFill_prePlan', {
                 url: '/projectDeclarationInfoFill_prePlan',
                 templateUrl:  '/contents/shenbaoAdmin/projectDetails/html/project.add/prePlan/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             
              //**********************************************end#项目申报*********************************//
             
             //**********************************************begin#月报*********************************//
               //begin#projectMonthReport（项目月报）
	        .state('projectMonthReport', {
	            url: '/projectMonthReport',
	            templateUrl: '/contents/shenbaoAdmin/projectMonthReport/html/list.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReport
	        
	        
	        //begin#projectMonthReportFill（项目月报填报--月份选择）
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:id',
	            templateUrl: '/contents/shenbaoAdmin/projectMonthReport/html/fill.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReportFill
	        
	        //begin#projectMonthReportInfoFill（项目月报填报--具体信息填写）
	        .state('projectMonthReportInfoFill', {
	            url: '/projectMonthReportInfoFill/:type',
	            templateUrl: '/contents/shenbaoAdmin/projectMonthReport/html/fillInfo.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReportInfoFill
	        
	        //**********************************************end#月报*********************************//
	        
	         //**********************************************begin#问题协调和建议反馈*********************************//
	        
	         //begin#problemCoordinition（问题协调）
	        .state('problemCoordinition', {
	            url: '/problemCoordinition',
	            templateUrl: '/contents/shenbaoAdmin/problemCoordinition/html/list.html',
	            controller: 'problemCoordinitionCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#problemCoordinition
	        
	        //begin#problemCoordinition（问题协调--编辑）
	        .state('problemInfoEdit', {
	            url: '/problemInfoEdit/:id',
	            templateUrl: '/contents/shenbaoAdmin/problemCoordinition/html/edit.html',
	            controller: 'problemEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#problemCoordinition   
	        
	        //begin#suggestFeedback（建议反馈）
	        .state('suggestFeedback', {
	            url: '/suggestFeedback',
	            templateUrl: '/contents/shenbaoAdmin/suggestFeedback/html/list.html',
	            controller: 'suggestFeedbackCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestFeedback
	        
	         //begin#suggestInfoEdit（建议反馈--编辑）
	        .state('suggestInfoEdit', {
	            url: '/suggestInfoEdit/:id',
	            templateUrl: '/contents/shenbaoAdmin/suggestFeedback/html/edit.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoEdit
	        
	         //begin#suggestInfoLook（建议反馈--详情）
	        .state('suggestInfoLook', {
	            url: '/suggestInfoLook/:id',
	            templateUrl: '/contents/shenbaoAdmin/suggestFeedback/html/details.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoLook
	        //**********************************************end#问题协调和建议反馈*********************************//
	        
	        
	        
	        
	        
    }]);
    
})();