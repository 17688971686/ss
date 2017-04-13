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
                 templateUrl:  '/admin/welcome.html',
                 controller: 'roleCtrl',
                 controllerAs: 'vm'
             })
             //begin#role
            .state('role', {
                url: '/role',
                templateUrl: '/role/html/list.html',
                controller: 'roleCtrl',
                controllerAs: 'vm'
            })
            .state('roleEdit', {
                url: '/roleEdit/:id',
                templateUrl: '/role/html/edit.html',
                controller: 'roleEditCtrl',
                controllerAs: 'vm'
            })
        	//end#role
        	
        	//begin#user
	        .state('user', {
	            url: '/user',
	            templateUrl: '/user/html/list.html',
	            controller: 'userCtrl',
	            controllerAs: 'vm'
	        }) .state('userEdit', {
	            url: '/userEdit/:id',
	            templateUrl: '/user/html/edit.html',
	            controller: 'userEditCtrl',
	            controllerAs: 'vm'
	        })
        	//end#user
	        
	        //begin#org
	        .state('org', {
	            url: '/org',
	            templateUrl: '/org/html/list.html',
	            controller: 'orgCtrl',
	            controllerAs: 'vm'
	        }) .state('orgEdit', {
	            url: '/orgEdit/:id',
	            templateUrl: '/org/html/edit.html',
	            controller: 'orgEditCtrl',
	            controllerAs: 'vm'
	        }).state('orgUser', {
	            url: '/orgUser/:id',
	            templateUrl: '/org/html/orgUser.html',
	            controller: 'orgUserCtrl',
	            controllerAs: 'vm'
	        })
	        //end#org
	        
	        //begin#log
	        .state('log', {
	            url: '/log',
	            templateUrl: '/log/html/list.html',
	            controller: 'logCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#log
	        
            //begin#home
	        .state('accountPwd', {
	            url: '/accountPwd',
	            templateUrl: '/account/html/changePwd.html',
	            controller: 'homeCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#home
	         //begin#home
	        .state('demo', {
	            url: '/demo',
	            templateUrl: '/demo/html/list.html',
	            controller: 'demoCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#home

	        //begin#inform
	        .state('inform', {
	        	url: '/inform', 
	        	templateUrl: '/contents/app/inform/html/list.html',
	        	controller: 'informCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#inform
	        //begin#policy
	        .state('policy', {
	        	url: '/policy', 
	        	templateUrl: '/contents/app/policy/html/list.html',
	        	controller: 'policyCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#policy
	        //begin#workGuide
	        .state('workGuide', {
	        	url: '/workGuide', 
	        	templateUrl: '/contents/app/workGuide/html/list.html',
	        	controller: 'workGuideCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#policy
	        //begin#form
	        .state('form', {
	        	url: '/form', 
	        	templateUrl: '/contents/app/form/html/list.html',
	        	controller: 'formCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#form

	        
	        //begin#projectMonthReport（项目月报）
	        .state('projectMonthReport', {
	            url: '/projectMonthReport',
	            templateUrl: '/contents/app/projectMonthReport/html/list.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReport
	        
	         //begin#problemCoordinition（问题协调）
	        .state('problemCoordinition', {
	            url: '/problemCoordinition',
	            templateUrl: '/contents/app/problemCoordinition/html/list.html',
	            controller: 'problemCoordinitionCtrl',
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
	        
	        //begin#deptInfoMaintain（单位信息维护）
	        .state('deptInfoMaintain', {
	            url: '/deptInfoMaintain',
	            templateUrl: '/contents/app/deptInfoMaintain/html/list.html',
	            controller: 'deptInfoMaintainCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptInfoMaintain
	        
	        //begin#operationRecord（操作记录）
	        .state('operationRecord', {
	            url: '/operationRecord',
	            templateUrl: '/contents/app/managementHomePage/operationRecord/html/list.html',
	            controller: 'operationRecordCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#operationRecord
	        
	        //begin#tips（温馨提示）
	        .state('tips', {
	            url: '/tips',
	            templateUrl: '/contents/app/managementHomePage/tips/html/list.html',
	            controller: 'tipsCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#tips
	          
	      //begin#projectDetais（项目详情）
	        .state('projectDetais', {
	            url: '/projectDetais/:id',
	            templateUrl: '/contents/app/projectMonthReport/html/projectDetais.html',
	            controller: 'projectDetaisCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDetais
    }]);
    
})();