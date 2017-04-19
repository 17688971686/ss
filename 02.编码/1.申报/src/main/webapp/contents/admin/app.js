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
             
             //begin#projectDetais（项目--详情查看）
              .state('projectDetais', {
                 url: '/projectDetais/:id',
                 templateUrl:  '/contents/projectDetais/html/project.look/projectDetailInfo.html',
                 controller: 'projectDetaisCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDetais
             
             //begin#projectInfoEdit（项目申報--编辑--信息編輯）
	        .state('projectInfoEdit', {
	            url: '/projectInfoEdit/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectInfoEdit
             
             //begin#projectDeclaration（项目申报--项目列表）
              .state('projectDeclaration', {
                 url: '/projectDeclaration',
                 templateUrl:  '/contents/app/projectDeclaration/html/project.list.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclaration
             
             //begin#projectDeclarationInfoFill（项目申报--项目新增--信息填寫）
              .state('projectDeclarationInfoFill', {
                 url: '/projectDeclarationInfoFill',
                 templateUrl:  '/contents/projectDetais/html/project.add/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill
             
             
             //begin#projectMonthReport（项目月报）
	        .state('projectMonthReport', {
	            url: '/projectMonthReport',
	            templateUrl: '/contents/app/projectMonthReport/html/list.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReport
	        
	        //begin#projectMonthReportFill（项目月报填报--月份选择）
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:id',
	            templateUrl: '/contents/app/projectMonthReport/html/fill.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReportFill
	        
	        //begin#projectMonthReportInfoFill（项目月报填报--具体信息填写）
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
	        
	        //begin#problemCoordinition（问题协调--编辑）
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
	        
	         //begin#suggestInfoEdit（建议反馈--编辑）
	        .state('suggestInfoEdit', {
	            url: '/suggestInfoEdit/:id',
	            templateUrl: '/contents/app/suggestFeedback/html/edit.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoEdit
	        
	         //begin#suggestInfoLook（建议反馈--详情）
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