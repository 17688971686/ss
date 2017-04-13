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
<<<<<<< HEAD
	        //begin#planProject
	        .state('planProject', {
	        	url: '/planProject',
	        	templateUrl: '/contents/app/yearPlanManage/planProject/html/list.html',
	        	controller: 'planProjectCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#planProject
	        //begin#planFormation
	        .state('planFormation', {
	        	url: '/planFormation',
	        	templateUrl: '/contents/app/yearPlanManage/planFormation/html/list.html',
	        	controller: 'planFormationCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#planFormation
	        //begin#planCollect
	        .state('planCollect', {
	        	url: '/planCollect',
	        	templateUrl: '/contents/app/yearPlanManage/planCollect/html/list.html',
	        	controller: 'planCollectCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#planCollect
	        //begin#inform
	        .state('inform', {
	        	url: '/inform',
	        	templateUrl: '/contents/app/uniteDoorManage/inform/html/list.html',
	        	controller: 'informCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#inform
	        //begin#policy
	        .state('policy', {
	        	url: '/policy',
	        	templateUrl: '/contents/app/uniteDoorManage/policy/html/list.html',
	        	controller: 'policyCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#policy
	        //begin#form
	        .state('form', {
	        	url: '/form',
	        	templateUrl: '/contents/app/uniteDoorManage/form/html/list.html',
	        	controller: 'formCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#form
	        //begin#workGuide
	        .state('workGuide', {
	        	url: '/workGuide',
	        	templateUrl: '/contents/app/uniteDoorManage/workGuide/html/list.html',
	        	controller: 'workGuideCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#workGuide
	        //begin#suggestFeedback
	        .state('suggestFeedback', {
	        	url: '/suggestFeedback',
	        	templateUrl: '/contents/app/uniteDoorManage/suggestFeedback/html/list.html',
	        	controller: 'suggestFeedbackCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#suggestFeedback
	        //begin#problemConcert
	        .state('problemConcert', {
	        	url: '/problemConcert',
	        	templateUrl: '/contents/app/uniteDoorManage/problemConcert/html/list.html',
	        	controller: 'problemConcertCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#problemConcert
=======
	        
	         //begin#planPreFee(规划前期费)
	        .state('planPreFee', {
	            url: '/planPreFee',
	            templateUrl: '/contents/app/myWorkbench/personToDo/planPreFee/html/list.html',
	            controller: 'planPreFeeCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#planPreFee
	        
	        //begin#prePlanPreFee（前期计划前期费）
	        .state('prePlanPreFee', {
	            url: '/prePlanPreFee',
	            templateUrl: '/contents/app/myWorkbench/personToDo/prePlanPreFee/html/list.html',
	            controller: 'prePlanPreFeeCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#prePlanPreFee
	        
	        //begin#newStartPlan（新开工计划）
	        .state('newStartPlan', {
	            url: '/newStartPlan',
	            templateUrl: '/contents/app/myWorkbench/personToDo/newStartPlan/html/list.html',
	            controller: 'newStartPlanCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#newStartPlan
	        
	        //begin#constructionPlan（续建计划）
	        .state('constructionPlan', {
	            url: '/constructionPlan',
	            templateUrl: '/contents/app/myWorkbench/personToDo/constructionPlan/html/list.html',
	            controller: 'constructionPlanCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#constructionPlan
	        
	         //begin#entrustAudit（委托审计）
	        .state('entrustAudit', {
	            url: '/entrustAudit',
	            templateUrl: '/contents/app/myWorkbench/personToDo/entrustAudit/html/list.html',
	            controller: 'entrustAuditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#entrustAudit
	        
	        //begin#auditAccountFunds（审计决算资金）
	        .state('auditAccountFunds', {
	            url: '/auditAccountFunds',
	            templateUrl: '/contents/app/myWorkbench/personToDo/auditAccountFunds/html/list.html',
	            controller: 'auditAccountFundsCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#auditAccountFunds
	        
	         //begin#nextYearPlan（下一年度计划）
	        .state('nextYearPlan', {
	            url: '/nextYearPlan',
	            templateUrl: '/contents/app/myWorkbench/personToDo/nextYearPlan/html/list.html',
	            controller: 'nextYearPlanCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#nextYearPlan
	        
	         //begin#perHasDone（个人已办）
	        .state('perHasDone', {
	            url: '/perHasDone',
	            templateUrl: '/contents/app/myWorkbench/perHasDone/html/list.html',
	            controller: 'perHasDoneCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#perHasDone
	        
	         //begin#concernedProject（关注的项目）
	        .state('concernedProject', {
	            url: '/concernedProject',
	            templateUrl: '/contents/app/myWorkbench/concernedProject/html/list.html',
	            controller: 'concernedProjectCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#concernedProject
	        
	          //begin#deptProjectQuery（部门项目查询）
	        .state('deptProjectQuery', {
	            url: '/deptProjectQuery',
	            templateUrl: '/contents/app/myWorkbench/deptProjectQuery/html/list.html',
	            controller: 'deptProjectQueryCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptProjectQuery
	        
	         //begin#monthReport（月报）
	        .state('monthReport', {
	            url: '/monthReport',
	            templateUrl: '/contents/app/projectScheduleMange/monthReport/html/list.html',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#monthReport
	        
	         //begin#reminders（催办）
	        .state('reminders', {
	            url: '/reminders',
	            templateUrl: '/contents/app/projectScheduleMange/reminders/html/list.html',
	            controller: 'remindersCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#reminders
	        
	         //begin#statisticalAnalysis（统计分析）
	        .state('statisticalAnalysis', {
	            url: '/statisticalAnalysis',
	            templateUrl: '/contents/app/decisionAidSystem/statisticalAnalysis/html/list.html',
	            controller: 'statisticalAnalysisCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#statisticalAnalysis
	        
	         //begin#projectGeographicalDistribution（项目地理分布）
	        .state('projectGeographicalDistribution', {
	            url: '/projectGeographicalDistribution',
	            templateUrl: '/contents/app/decisionAidSystem/projectGeographicalDistribution/html/list.html',
	            controller: 'projectGeographicalDistributionCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectGeographicalDistribution
	        
	         //begin#projectprocess（项目全流程）
	        .state('projectProcess', {
	            url: '/projectProcess',
	            templateUrl: '/contents/app/decisionAidSystem/projectProcess/html/list.html',
	            controller: 'projectProcessCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectProcess
	        

	        
	        
	        
>>>>>>> branch 'develop' of http://119.23.22.237/tfs/DefaultCollection/_git/%E5%85%89%E6%98%8E%E6%96%B0%E5%8C%BA%E6%8A%95%E8%B5%84%E9%A1%B9%E7%9B%AE%E5%9C%A8%E7%BA%BF%E5%AE%A1%E6%89%B9%E7%9B%91%E7%AE%A1%E5%B9%B3%E5%8F%B0
    }]);
    
})();