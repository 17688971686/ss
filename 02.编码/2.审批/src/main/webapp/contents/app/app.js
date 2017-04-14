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
	        //begin#prophaseWorkPlan(前期工作计划)
	        .state('prophaseWorkPlan', {
	        	url: '/prophaseWorkPlan',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/list.html',
	        	controller: 'prophaseWorkPlanCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#prophaseWorkPlan
	        //begin#prophaseWorkPlan(前期工作计划-编辑页面)
	        .state('projectInfoEdit', {
	        	url: '/projectInfoEdit/:id',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/detais.html',
	        	controller: 'projectInfoEditCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#prophaseWorkPlan
	        
	        
	        //begin#projectBasicMessage(前期工作计划-项目基本信息)
	        .state('projectBasicMessage', {
	        	url: '/projectBasicMessage',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/projectBasicMessage.html',
	        	controller: 'projectBasicMessageCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#prophaseWorkPlan
	        //begin#projectUnitMessage(前期工作计划-项目单位信息)
	        .state('projectUnitMessage', {
	        	url: '/projectUnitMessage',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/projectUnitMessage.html',
	        	controller: 'projectUnitMessageCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectUnitMessage
	        
	        //begin#declareMaterialInventory(前期工作计划-申报材料清单)
	        .state('declareMaterialInventory', {
	        	url: '/declareMaterialInventory',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/declareMaterialInventory.html',
	        	controller: 'declareMaterialInventoryCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMaterialInventory
	        //begin#declareMessageAffirm(前期工作计划-申报信息确认)
	        .state('declareMessageAffirm', {
	        	url: '/declareMessageAffirm',
	        	templateUrl: '/contents/app/myWorkbench/prophaseWorkPlan/html/declareMessageAffirm.html',
	        	controller: 'declareMessageAffirmCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMessageAffirm
	        //begin#projectProposal(项目建议书)
	        .state('projectProposal', {
	        	url: '/projectProposal',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/list2.html',
	        	controller: 'projectProposalCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectProposal
	        //begin#projectBasicMessage2(项目建议书-项目基本信息)
	        .state('projectBasicMessage2', {
	        	url: '/projectBasicMessage2',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/projectBasicMessage2.html',
	        	controller: 'projectBasicMessage2Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectBasicMessage2
	        //begin#projectUnitMessage2(项目建议书-项目单位信息)
	        .state('projectUnitMessage2', {
	        	url: '/projectUnitMessage2',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/projectUnitMessage2.html',
	        	controller: 'projectUnitMessage2Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectUnitMessage2
	        //begin#declareMaterialInventory2(项目建议书-申报材料清单)
	        .state('declareMaterialInventory2', {
	        	url: '/declareMaterialInventory2',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/declareMaterialInventory2.html',
	        	controller: 'declareMaterialInventory2Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMaterialInventory2
	        //begin#declareMessageAffirm2(项目建议书-申报信息确认)
	        .state('declareMessageAffirm2', {
	        	url: '/declareMessageAffirm2',
	        	templateUrl: '/contents/app/myWorkbench/projectProposal/html/declareMessageAffirm2.html',
	        	controller: 'declareMessageAffirm2Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMessageAffirm2
	        
	        
	        //begin#feasibilityStudyReport(可行性研究报告)
	        .state('feasibilityStudyReport', {
	        	url: '/feasibilityStudyReport',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/list2.html',
	        	controller: 'feasibilityStudyReportCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#feasibilityStudyReport
	        //begin#projectBasicMessage3(可行性研究报告-项目基本信息)
	        .state('projectBasicMessage3', {
	        	url: '/projectBasicMessage3',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/projectBasicMessage3.html',
	        	controller: 'projectBasicMessage3Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectBasicMessage3
	        //begin#projectUnitMessage3(可行性研究报告-项目单位信息)
	        .state('projectUnitMessage3', {
	        	url: '/projectUnitMessage3',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/projectUnitMessage3.html',
	        	controller: 'projectUnitMessage3Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectUnitMessage3
	        //begin#declareMaterialInventory3(可行性研究报告-申报材料清单)
	        .state('declareMaterialInventory3', {
	        	url: '/declareMaterialInventory3',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/declareMaterialInventory3.html',
	        	controller: 'declareMaterialInventory3Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMaterialInventory3
	        //begin#declareMessageAffirm3(可行性研究报告-申报信息确认)
	        .state('declareMessageAffirm3', {
	        	url: '/declareMessageAffirm3',
	        	templateUrl: '/contents/app/myWorkbench/feasibilityStudyReport/html/declareMessageAffirm3.html',
	        	controller: 'declareMessageAffirm3Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMessageAffirm3
	        
	        
	        //begin#initialDeviseScheme(初步设计方案)
	        .state('initialDeviseScheme', {
	        	url: '/initialDeviseScheme',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/list2.html',
	        	controller: 'initialDeviseSchemeCtrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#initialDeviseScheme
	        //begin#projectBasicMessage4(初步设计方案-项目基本信息)
	        .state('projectBasicMessage4', {
	        	url: '/projectBasicMessage4',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/projectBasicMessage4.html',
	        	controller: 'projectBasicMessage4Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectBasicMessage4
	        //begin#projectUnitMessage4(初步设计方案-项目单位信息)
	        .state('projectUnitMessage4', {
	        	url: '/projectUnitMessage4',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/projectUnitMessage4.html',
	        	controller: 'projectUnitMessage4Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#projectUnitMessage4
	        //begin#declareMaterialInventory4(初步设计方案-申报材料清单)
	        .state('declareMaterialInventory4', {
	        	url: '/declareMaterialInventory4',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/declareMaterialInventory4.html',
	        	controller: 'declareMaterialInventory4Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMaterialInventory4
	        //begin#declareMessageAffirm4(初步设计方案-申报信息确认)
	        .state('declareMessageAffirm4', {
	        	url: '/declareMessageAffirm4',
	        	templateUrl: '/contents/app/myWorkbench/initialDeviseScheme/html/declareMessageAffirm4.html',
	        	controller: 'declareMessageAffirm4Ctrl',
	        	controllerAs: 'vm'
	        }) 
	        //end#declareMessageAffirm4
	        
	        
	        
	        
	        
	        
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
	        
//end#cx
	        
	        
	        
    }]);
    
})();