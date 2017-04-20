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
	        //begin#planProject(年度计划项目库)
	        .state('planProject', {
	        	url: '/planProject',
	        	templateUrl: '/contents/app/yearPlanManage/planProject/html/list.html',
	        	controller: 'planProjectCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#planProject
	        //begin#planProject(年度计划项目库-查看项目)
	        .state('checkProject', {
	        	url: '/checkProject/:id',
	        	templateUrl: '/contents/app/yearPlanManage/planProject/html/checkProject.html',
	        	controller: 'planProjectCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#planProject
	        //begin#planFormation(年度计划编制)
	        .state('planFormation', {
	        	url: '/planFormation',
	        	templateUrl: '/contents/app/yearPlanManage/planFormation/html/list.html',
	        	controller: 'planFormationCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#planFormation
	        //begin#planFormation(年度计划编制-项目编制)
	        .state('projectFormation', {
	        	url: '/projectFormation/:id',
	        	templateUrl: '/contents/app/yearPlanManage/planFormation/html/projectFormation.html',
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
	        //begin#prophaseWorkPlan(前期工作计划)
	        .state('prophaseWorkPlan', {
	        	url: '/prophaseWorkPlan',
	        	templateUrl: '/contents/app/myWorkbench/personToD/prophaseWorkPlan/html/list.html',
	        	controller: 'prophaseWorkPlanCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#prophaseWorkPlan
	        //begin#detais(前期工作计划-编辑页面)
	        .state('detais', {
	        	url: '/detais/:id',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/detais.html',
	        	controller: 'prophaseWorkPlanCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#detais
	        
	        
	         
	        //begin#projectProposal(项目建议书)
	        .state('projectProposal', {
	        	url: '/projectProposal',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/list.html',
	        	controller: 'projectProposalCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectProposal
	        //begin#detais(项目建议书-编辑页面)
	        .state('proposalDetais', {
	        	url: '/proposalDetais/:id',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/proposalDetais.html',
	        	controller: 'projectProposalCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#detais
	         
	        
	        
	        //begin#feasibilityStudyReport(可行性研究报告)
	        .state('feasibilityStudyReport', {
	        	url: '/feasibilityStudyReport',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/list.html',
	        	controller: 'feasibilityStudyReportCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#feasibilityStudyReport
	        //begin#feasibilityStudyReportDetais(可行性研究报告-编辑页面)
	        .state('feasibilityStudyReportDetais', {
	        	url: '/feasibilityStudyReportDetais/:id',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/feasibilityStudyReportDetais.html',
	        	controller: 'feasibilityStudyReportCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#feasibilityStudyReportDetais
	        
	        
	        
	        //begin#initialDeviseScheme(初步设计方案)
	        .state('initialDeviseScheme', {
	        	url: '/initialDeviseScheme',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/list.html',
	        	controller: 'initialDeviseSchemeCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //begin#initialDeviseScheme(初步设计方案-编辑页面)
	        .state('deviseSchemeDetais', {
	        	url: '/deviseSchemeDetais/:id',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/deviseSchemeDetais.html',
	        	controller: 'initialDeviseSchemeCtrl',
	        	controllerAs: 'vm'
	        }) 
	       
	        
	        
	        
	        
	        
	        
	        //begin#cx
	        
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
	        
	        //begin#perToDo（我的工作台--个人待办）
	        .state('perToDo', {
	            url: '/perToDo',
	            templateUrl: '/contents/app/myWorkbench/perToDo/html/list.html',
	            controller: 'perToDoCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#perToDo
	        
	         //begin#perHasDone（我的工作台--个人待办）
	        .state('perHasDone', {
	            url: '/perHasDone',
	            templateUrl: '/contents/app/myWorkbench/perHasDone/html/list.html',
	            controller: 'perHasDoneCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#perHasDone
	        
	         //begin#concernedProject（我的工作台--关注的项目）
	        .state('concernedProject', {
	            url: '/concernedProject',
	            templateUrl: '/contents/app/myWorkbench/concernedProject/html/list.html',
	            controller: 'concernedProjectCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#concernedProject
	        
	          //begin#deptProjectQuery（我的工作台--部门项目查询）
	        .state('deptProjectQuery', {
	            url: '/deptProjectQuery',
	            templateUrl: '/contents/app/myWorkbench/deptProjectQuery/html/list.html',
	            controller: 'deptProjectQueryCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptProjectQuery
	        
	         //begin#monthReport（月报（项目列表））
	        .state('monthReport', {
	            url: '/monthReport',
	            templateUrl: '/contents/app/projectScheduleMange/monthReport/html/list.html',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#monthReport
	        
	        //begin#monthReportSelect（月报（月报月份选择））
	        .state('monthReportSelect', {
	            url: '/monthReportSelect/:id',
	            templateUrl: '/contents/app/projectScheduleMange/monthReport/html/monthReport.select.html',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#monthReportSelect
	        
	         //begin#monthReportDetais（月报（月报详细信息））
	        .state('monthReportDetais', {
	            url: '/monthReportDetais/:id',
	            templateUrl: '/contents/app/projectScheduleMange/monthReport/html/monthReport.detail.html',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#monthReportDetais
	        
	        
	        
	        
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
	        
	       //begin#projectDetais（项目详情頁面查看）
	        .state('projectDetais', {
	            url: '/projectDetais/:id',
	            templateUrl: '/contents/app/projectDetais/html/projectDetais.html',
	            controller: 'projectDetaisCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDetais
	        
	        //begin#projectInfoEdit（项目信息编辑）
	        .state('projectInfoEdit', {
	            url: '/projectInfoEdit/:id',
	            templateUrl: '/contents/app/projectDetais/html/projectDetais.html',
	            controller: 'projectEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectInfoEdit
	        
	        //begin#projectHandForm（项目处理表单）
	        .state('projectHandForm', {
	            url: '/projectHandForm/:id',
	            templateUrl: '/contents/app/projectDetais/html/projectHandle.html',
	            controller: 'projectHandFormCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectHandForm
/***************************个人已办-不同的办理进度对应不同的项目处理表单-Strat******************************/	        
	        //begin#projectHandForm（项目处理表单）
	        .state('projectHandForm', {
	            url: '/projectHandForm/:id',
	            templateUrl: '/contents/app/projectDetais/html/projectHandle.html',
	            controller: 'projectHandFormCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectHandForm
/***************************个人已办-不同的办理进度对应不同的项目处理表单-End******************************/	 	        
	        
	        
	        
//end#cx
	        
	        
	        
    }]);
    
})();