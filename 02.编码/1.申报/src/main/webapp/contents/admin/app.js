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
             
             //begin#projectDetais（项目--详情查看(暂时没有分别申报阶段的不同)）
             //TODO 怎么来判断传递的参数 来确认申报项目的阶段来返回不同的页面
              .state('projectDetais', {
                 url: '/projectDetais/:id',
                 templateUrl:  '/contents/projectDetais/html/project.look/constructionPlan/declareMessageConfirm.html',
                 controller: 'projectDetaisCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDetais

             
             //begin#projectDeclaration（项目申报--项目列表）
              .state('projectDeclaration', {
                 url: '/projectDeclaration',
                 templateUrl:  '/contents/app/projectDeclaration/html/project.list.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclaration
/***************************项目申报编辑项目信息- Strat**************************************************/                                      
             //begin#projectDeclarationInfoEdit_prePlan（项目申報--前期计划（前期费）--信息編輯）
	        .state('projectDeclarationInfoEdit_prePlan', {
	            url: '/projectDeclarationInfoEdit_prePlan/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/prePlan/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_prePlan
	        
	        //begin#projectDeclarationInfoEdit_planDesign（项目申報--规划设计前期费--信息編輯）
	        .state('projectDeclarationInfoEdit_planDesign', {
	            url: '/projectDeclarationInfoEdit_planDesign/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/planDesign/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_planDesign
	        
	        //begin#projectDeclarationInfoEdit_newStratPlan（项目申報--新开工计划--信息編輯）
	        .state('projectDeclarationInfoEdit_newStratPlan', {
	            url: '/projectDeclarationInfoEdit_newStratPlan/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/newStratPlan/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_newStratPlan
	        
	        //begin#projectDeclarationInfoEdit_constructionPlan（项目申報--续建计划--信息編輯）
	        .state('projectDeclarationInfoEdit_constructionPlan', {
	            url: '/projectDeclarationInfoEdit_constructionPlan/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/constructionPlan/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_constructionPlan
	        
	        //begin#projectDeclarationInfoEdit_prePlan（项目申報--下一年度计划--信息編輯）
	        .state('projectDeclarationInfoEdit_nextYearPlan', {
	            url: '/projectDeclarationInfoEdit_nextYearPlan/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/nextYearPlan/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_prePlan
	        
	        //begin#projectDeclarationInfoEdit_yearPlanAdjust（项目申報--年度计划调整--信息編輯）
	        .state('projectDeclarationInfoEdit_yearPlanAdjust', {
	            url: '/projectDeclarationInfoEdit_yearPlanAdjust/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/yearPlanAdjust/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_yearPlanAdjust
	        
	        //begin#projectDeclarationInfoEdit_entrustAudit（项目申報--委托审计--信息編輯）
	        .state('projectDeclarationInfoEdit_entrustAudit', {
	            url: '/projectDeclarationInfoEdit_entrustAudit/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/entrustAudit/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_entrustAudit
	        
	        //begin#projectDeclarationInfoEdit_auditAccountFunds（项目申報--审计决算资金--信息編輯）
	        .state('projectDeclarationInfoEdit_auditAccountFunds', {
	            url: '/projectDeclarationInfoEdit_auditAccountFunds/:id',
	            templateUrl: '/contents/projectDetais/html/project.edit/auditAccountFunds/projectInfo.edit.html',
	            controller: 'projectDeclarationCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectDeclarationInfoEdit_auditAccountFunds
/***************************项目申报编辑项目信息- End**************************************************/	        
	        
	        
	        
/***************************项目申报新增项目信息的填写- Strat**************************************************/             
             //begin#projectDeclarationInfoFill_prePlan（项目申报--项目新增--前期计划（前期费）信息填寫）
              .state('projectDeclarationInfoFill_prePlan', {
                 url: '/projectDeclarationInfoFill_prePlan',
                 templateUrl:  '/contents/projectDetais/html/project.add/prePlan/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_prePlan
             
             //begin#projectDeclarationInfoFill_planDesign（项目申报--项目新增--规划设计前期费 信息填寫）
              .state('projectDeclarationInfoFill_planDesign', {
                 url: '/projectDeclarationInfoFill_planDesign',
                 templateUrl:  '/contents/projectDetais/html/project.add/planDesign/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_planDesign
             
             //begin#projectDeclarationInfoFill_newStratPlan（项目申报--项目新增--新开工计划 信息填寫）
              .state('projectDeclarationInfoFill_newStratPlan', {
                 url: '/projectDeclarationInfoFill_newStratPlan',
                 templateUrl:  '/contents/projectDetais/html/project.add/newStratPlan/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_newStratPlan
             
             //begin#projectDeclarationInfoFill_constructionPlan（项目申报--项目新增--续建计划 信息填寫）
              .state('projectDeclarationInfoFill_constructionPlan', {
                 url: '/projectDeclarationInfoFill_constructionPlan',
                 templateUrl:  '/contents/projectDetais/html/project.add/constructionPlan/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_constructionPlan
             
            //begin#projectDeclarationInfoFill_nextYearPlan（项目申报--项目新增--下一年度计划 信息填寫）
              .state('projectDeclarationInfoFill_nextYearPlan', {
                 url: '/projectDeclarationInfoFill_nextYearPlan',
                 templateUrl:  '/contents/projectDetais/html/project.add/nextYearPlan/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_nextYearPlan
             
             //begin#projectDeclarationInfoFill_yearPlanAdjust（项目申报--项目新增--年度计划调整 信息填寫）
              .state('projectDeclarationInfoFill_yearPlanAdjust', {
                 url: '/projectDeclarationInfoFill_yearPlanAdjust',
                 templateUrl:  '/contents/projectDetais/html/project.add/yearPlanAdjust/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_yearPlanAdjust
             
              //begin#projectDeclarationInfoFill_entrustAudit（项目申报--项目新增--委托审计 信息填寫）
              .state('projectDeclarationInfoFill_entrustAudit', {
                 url: '/projectDeclarationInfoFill_entrustAudit',
                 templateUrl:  '/contents/projectDetais/html/project.add/entrustAudit/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_entrustAudit
             
              //begin#projectDeclarationInfoFill_auditAccountFunds（项目申报--项目新增--审计决算资金 信息填寫）
              .state('projectDeclarationInfoFill_auditAccountFunds', {
                 url: '/projectDeclarationInfoFill_auditAccountFunds',
                 templateUrl:  '/contents/projectDetais/html/project.add/auditAccountFunds/projectInfo.add.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             //end#projectDeclarationInfoFill_auditAccountFunds
/***************************项目申报新增项目信息的填写- End**************************************************/              
             
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