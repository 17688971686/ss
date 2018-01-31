(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 
       "ui.router",
       "kendo.directives",
       'textAngular'
       
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
	        
	        //begin#portal
	        .state('portal', {
	            url: '/portal/:type',
	            templateUrl: '/management/portal/html/list',
	            controller: 'portalCtrl',
	            controllerAs: 'vm'
	        }) 
	    
	        .state('portalEdit', {
	            url: '/portal/:type/:id',
	            templateUrl: '/management/portal/html/edit',
	            controller: 'portalCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#portal
/**********************begin#monthReport***************************************/
	        //列表页--政府投资项目
	        .state('monthReport', {
	            url: '/monthReport',
	            templateUrl: '/management/monthReport/html/list',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
	        //列表页--社会投资项目
	        .state('monthReport_SH', {
	            url: '/monthReport_SH',
	            templateUrl: '/management/monthReport/html/list_SH',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
	        //修改页
           .state('monthReportChange', {
        	   url: '/monthReportChange/:projectId/:year/:month',
        	   templateUrl: '/management/monthReport/html/edit',
        	   controller: 'monthReportCtrl',
        	   controllerAs: 'vm'
	        })
	        //详情页
	        .state('monthReport_details', {
	            url: '/monthReport/:projectId/:year/:month',
	            templateUrl: '/management/monthReport/html/details',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
	        //汇总页
	        .state('monthReportSummary', {
	            url: '/monthReportSummary/:projectId',
	            templateUrl: '/management/monthReport/html/summary',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
/**********************end#monthReport***************************************/
/**********************begin#project***************************************/
	        //政府投资项目
	        //列表页
	        .state('project', {
	            url: '/project',
	            templateUrl: '/management/project/html/list.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        //编辑页
	        .state('projectEdit', {
	            url: '/projectEdit/:id/:projectInvestmentType',
	            templateUrl: '/management/project/html/edit.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        }) 
	        //详情页
	        .state('projectDetails', {
	            url: '/projectDetails/:id/:projectInvestmentType',
	            templateUrl: '/management/project/html/details.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        //社会投资项目
	        //列表页
	        .state('project_SH', {
	            url: '/project_SH',
	            templateUrl: '/management/project/html/list_SH.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
/**********************end#project***************************************/
	        
/**********************begin#计划下达管理**********************************/
	        //计划下达--列表页面
	        .state('planReach', {
	            url: '/planReach',
	            templateUrl: '/management/planReachManage/planReach/html/list.html',
	            controller: 'planReachCtrl',
	            controllerAs: 'vm'
	        })
/**********************end#计划下达管理**********************************/
	        
/**********************begin#决策辅助系统**********************************/
	        //统计分析--主页
	        .state('statisticalAnalysis', {
	            url: '/statisticalAnalysis',
	            templateUrl: '/management/auxDeci/statisticalAnalysis/html/index.html',
	            controller: 'statisticalAnalysisCtrl',
	            controllerAs: 'vm'
	        })
	        //统计分析--条件筛选页面
	        .state('statisticalAnalysis_edit', {
	            url: '/statisticalAnalysis_edit/:what',
	            templateUrl: '/management/auxDeci/statisticalAnalysis/html/edit.html',
	            controller: 'statisticalAnalysisCtrl',
	            controllerAs: 'vm'
	        })

	        
/**********************end#决策辅助系统***************************************/
	        
	       //begin#单位管理	       
	      //列表页
	        .state('unitManagement', {
	            url: '/unitManagement',
	            templateUrl: '/unitManagement/html/list.html',
	            controller: 'unitManagementCtrl',
	            controllerAs: 'vm'
	        }) 
	      //编辑页
	        .state('unitManagementEdit', {
	            url: '/unitManagementEdit/:id',
	            templateUrl: '/unitManagement/html/edit.html',
	            controller: 'unitManagementEditCtrl',
	            controllerAs: 'vm'
	        }) 	      
	       //end#单位管理
	        
	        //begin#基础数据管理
	         .state('basicData', {
	            url: '/basicData',
	            templateUrl: '/management/basicData/html/index',
	            controller: 'basicDataCtrl',
	            controllerAs: 'vm'
	        })
	        //end#基础数据管理
	        
	        //begin#系统配置
	        .state('sysConfig', {
	            url: '/sysConfig',
	            templateUrl: '/sys/html/index',
	            controller: 'sysConfigCtrl',
	            controllerAs: 'vm'
	        })
	        //end#系统配置
	        
/**********************begin#年度计划编制***************************************/
	        //政府投资项目年度计划项目库列表（被签收的申报下一年度计划信息）
	         .state('yearPlan_shenbaoInfoList', {
	            url: '/yearPlan/shenbaoInfoList',
	            templateUrl: '/management/yearPlan/html/shenbaoInfoList',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //社会投资项目年度计划项目库列表（被签收的申报下一年度计划信息）
	         .state('yearPlan_shenbaoInfoListSH', {
	            url: '/yearPlan/shenbaoInfoListSH',
	            templateUrl: '/management/yearPlan/html/shenbaoInfoListSH',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //申报信息编辑页面
	         .state('yearPlan_shenbaoInfoEdit', {
	            url: '/yearPlan/shenbaoInfoEdit/:id/:projectInvestmentType/:stage',
	            templateUrl: '/management/yearPlan/html/shenbaoInfoEdit',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //政投年度计划编制列表
	        .state('yearPlan_planList', {
	            url: '/yearPlan/planList',
	            templateUrl: '/management/yearPlan/html/planList',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //编辑年度计划页面
	        .state('yearPlan_planEdit', {
	            url: '/yearPlan/planEdit/:id',
	            templateUrl: '/management/yearPlan/html/planEdit',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //编制计划页面
	        .state('yearPlan_planBZ', {
	            url: '/yearPlan/planBZ/:id',
	            templateUrl: '/management/yearPlan/html/planBZ',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })	   
	        
/**********************end#年度计划编制***************************************/
	        
/**********************begin#目录管理***************************************/
	        //投资项目目录列表(默认显示项目行业分类列表)
	        .state('catalog_investment', {
	            url: '/catalog/investment',
	            templateUrl: '/management/catalog/html/investmentList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //投资项目次级列表页面
	        .state('catalog_investment_projectIndustry', {
	            url: '/catalog/investment/projectIndustry/:id/',
	            templateUrl: '/management/catalog/html/investmentSecondList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //投资项目修改页
	        .state('catalog_investmentAlter', {
	            url: '/catalog/investmentAlter/:id',
	            templateUrl: '/management/catalog/html/investmentEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	         //投资项目二级新增页
	        .state('catalog_addSecondCatalog', {
	            url: '/catalog/investmentEdit/addSecondCatalog/:id',
	            templateUrl: '/management/catalog/html/investmentEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //投资项目一级新增页
	        .state('catalog_investmentEdit', {
	            url: '/catalog/investmentEdit/:type',
	            templateUrl: '/management/catalog/html/investmentEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	         //投资项目目录列表(默认显示项目类型列表)
	        .state('catalog_investmentList_projectType', {
	            url: '/catalog/investment/projectTypeList',
	            templateUrl: '/management/catalog/html/investmentProjectTypeList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	         //投资项目目录列表(默认显示建设类型列表)
	        .state('catalog_investmentList_constructionType', {
	            url: '/catalog/investment/constructionTypeList',
	            templateUrl: '/management/catalog/html/investmentConstructionTypeList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录列表页页面(默认显示鼓励类)
	        .state('catalog_policy', {
	            url: '/catalog/policyCatalog',
	            templateUrl: '/management/catalog/html/policyCatalogList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录列表页页面(默认显示允许类)
	        .state('catalog_policyAllowList', {
	            url: '/catalog/policyCatalog/allowList',
	            templateUrl: '/management/catalog/html/policyCatalogAllowList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录列表页页面(默认显示限制类)
	        .state('catalog_policyLimitList', {
	            url: '/catalog/policyCatalog/limitList',
	            templateUrl: '/management/catalog/html/policyCatalogLimitList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录新增页面
	        .state('catalog_policyCatalogEdit', {
	            url: '/catalog/policyCatalogEdit/:type',
	            templateUrl: '/management/catalog/html/policyCatalogEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录条目修改页面
	        .state('catalog_policyCatalogAlter', {
	            url: '/catalog/policyCatalogEdit/:id/',
	            templateUrl: '/management/catalog/html/policyCatalogEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项目录列表页
	        .state('catalog_partApprovalMatters', {
	            url: '/catalog/partApprovalMattersList',
	            templateUrl: '/management/catalog/html/partApprovalMattersList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项新增页
	        .state('catalog_partApprovalMattersEdit', {
	            url: '/catalog/partApprovalMattersEdit',
	            templateUrl: '/management/catalog/html/partApprovalMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项修改页
	        .state('catalog_partApprovalMattersAlter', {
	            url: '/catalog/partApprovalMattersEdit/:id',
	            templateUrl: '/management/catalog/html/partApprovalMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项详情页
	        .state('catalog_partApprovalMattersDetails', {
	            url: '/catalog/partApprovalMattersEdit/:id/',
	            templateUrl: '/management/catalog/html/partApprovalMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //中介服务事项目录列表页
	        .state('catalog_agencyServiceMatters', {
	            url: '/catalog/agencyServiceMattersList',
	            templateUrl: '/management/catalog/html/agencyServiceMattersList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项新增页
	        .state('catalog_agencyServiceMattersEdit', {
	            url: '/catalog/agencyServiceMattersEdit',
	            templateUrl: '/management/catalog/html/agencyServiceMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项修改页
	        .state('catalog_agencyServiceMattersAlter', {
	            url: '/catalog/agencyServiceMattersEdit/:id',
	            templateUrl: '/management/catalog/html/agencyServiceMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项修改页
	        .state('catalog_agencyServiceMattersDetails', {
	            url: '/catalog/agencyServiceMattersEdit/:id/',
	            templateUrl: '/management/catalog/html/agencyServiceMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        
	        
	 
/**********************end#目录管理***************************************/	     
	        
/**********************begin#信用信息管理***************************************/
	        //信用异常名录 列表页面
	        .state('credit_illegalNameList', {
	            url: '/creditInfo/illegalNameList',
	            templateUrl: '/management/creditInfo/html/illegalNameList',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用异常名录 信息录入页面
	        .state('credit_illegalNameEdit', {
	            url: '/creditInfo/illegalNameEdit/:id/:projectNumber/:projectName/:unitName/:createdDate/:shenBaoInfoId',
	            templateUrl: '/management/creditInfo/html/illegalNameEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用异常名录 信息更改页面
	        .state('credit_updateIllegalName', {
	            url: '/creditInfo/updateIllegalName/:id',
	            templateUrl: '/management/creditInfo/html/illegalNameEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用异常名录 详情页面
	        .state('credit_illegalNameDetails', {
	            url: '/creditInfo/illegalNameDetails/:id',
	            templateUrl: '/management/creditInfo/html/illegalNameDetails',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })	   
	        
	        //信用黑名单 列表页面
	        .state('credit_blackList', {
	            url: '/creditInfo/blackList',
	            templateUrl: '/management/creditInfo/html/blackList',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })	   
	        //信用黑名单 信息录入页面
	        .state('credit_blackListEdit', {
	            url: '/creditInfo/blackList//:projectNumber/:projectName/:unitName/:createdDate/:shenBaoInfoId',
	            templateUrl: '/management/creditInfo/html/blackListEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用黑名单 详情页面
	        .state('credit_blackListDetails', {
	            url: '/creditInfo/blackListDetails/:id',
	            templateUrl: '/management/creditInfo/html/blackListDetails',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用黑名单 信息修改页面
	        .state('credit_blackListAlter', {
	            url: '/creditInfo/blackListEdit/:id',
	            templateUrl: '/management/creditInfo/html/blackListUpdate',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常列表页
	        .state('credit_projectAnomaly', {
	            url: '/creditInfo/projectAnomalyList',
	            templateUrl: '/management/creditInfo/html/projectAnomaly',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常 信息录入页面
	        .state('credit_projectAnomalyEdit', {
	            url: '/creditInfo/projectAnomaly/:id/:projectNumber/:projectName/:unitName/:createdDate/:shenBaoInfoId',
	            templateUrl: '/management/creditInfo/html/projectAnomalyEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常 信息录入页面
	        .state('credit_projectAnomalyDetails', {
	            url: '/creditInfo/projectAnomalyDetails/:id',
	            templateUrl: '/management/creditInfo/html/projectAnomalyDetails',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常 信息更改页面
	        .state('credit_updateProjectAnomaly',{ 
	            url: '/creditInfo/updateProjectAnomaly/:id',
	            templateUrl: '/management/creditInfo/html/projectAnomalyUpdate',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        
/**********************end#信用信息管理***************************************/
	        
/**********************begin#工作台***************************************/
	        //待办列表页(taskHead 下一年度计划)
	        .state('task_todo', {
	            url: '/task/todo',
	            templateUrl: '/management/task/html/todo',
	            controller: 'taskYearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //任务处理页--下一年度计划
	        .state('task_handle', {
	            url: '/task/todo/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/handle',
	            controller: 'taskYearPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //已办列表页--下一年度计划(taskRecord)
	        .state('task_complete', {
	            url: '/task/complete',
	            templateUrl: '/management/task/html/complete',
	            controller: 'taskYearPlanCtrl',
	            controllerAs: 'vm'
	        })
	         //待办列表页--审批类
	        .state('task_todo_audit', {
	            url: '/task/todo_audit',
	            templateUrl: '/management/task/html/todo_audit',
	            controller: 'taskAuditCtrl',
	            controllerAs: 'vm'
	        })
	         //任务处理页--审批类
	        .state('task_handle_audit', {
	            url: '/task/handle_audit/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/handle_audit',
	            controller: 'taskAuditCtrl',
	            controllerAs: 'vm'
	        })
	         //已办列表页--审批类(taskRecord)
	        .state('task_shenPi', {
	            url: '/task/shenPi',
	            templateUrl: '/management/task/html/complete_shenPi',
	            controller: 'taskAuditCtrl',
	            controllerAs: 'vm'
	        })
	        //个人已办--审批类详情
	        .state('task_shenPiDetails', {
	            url: '/task/shenPi_details/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/shenPiDetails',
	            controller: 'taskAuditCtrl',
	            controllerAs: 'vm'
	        })
	         //待办列表页--计划类
	        .state('task_todo_plan', {
	            url: '/task/todo_plan',
	            templateUrl: '/management/task/html/todo_plan',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	           //任务处理页--计划类
	        .state('task_handle_plan', {
	            url: '/task/handle_plan/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/handle_plan',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	          //已办列表页--计划类(taskRecord)
	        .state('task_plan', {
	            url: '/task/plan',
	            templateUrl: '/management/task/html/complete_plan',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //个人已办--计划类
	         .state('task_planDetails', {
	            url: '/task/plan_details/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/planDetails',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	        
/**********************end#工作台***************************************/
      //begin中介单位管理
        //中介单位列表
        .state('mediationUnitList', {
            url: '/mediationUnitList',
            templateUrl: '/management/mediationManagement/html/mediationUnitList',
            controller: 'mediationManagementCtrl',
            controllerAs: 'vm'
        })	
        //中介单位编辑or新增
        .state('mediationUnitChange', {
        url: '/mediationUnitChange/:id',
        templateUrl: '/management/mediationManagement/html/mediationUnitChangeDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })  
        //查看中介单位信息
        .state('mediationUnitDetails', {
        url: '/mediationUnitDetails/:id',
        templateUrl: '/management/mediationManagement/html/mediationUnitDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
        //协审活动列表 
        .state('assistReviewList', {
        url: '/assistReviewList',
        templateUrl: '/management/mediationManagement/html/assistReviewList',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
         //协审活动编辑or新增 
        .state('assistReviewChange', {
        url: '/assistReviewChange/:id',
        templateUrl: '/management/mediationManagement/html/assistReviewChangeDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        }) 
        //查看协审活动信息
        .state('assistReviewDetails', {
        url: '/assistReviewDetails/:id',
        templateUrl: '/management/mediationManagement/html/assistReviewDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
        //服务质量评价 serviceEvaluation submitReviewEvaluation
         .state('serviceEvaluation', {
        url: '/serviceEvaluation/:id',
        templateUrl: '/management/mediationManagement/html/serviceEvaluation',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
         //送审文件质量评价 submitReviewEvaluation
         .state('submitReviewEvaluation', {
        url: '/submitReviewEvaluation/:id',
        templateUrl: '/management/mediationManagement/html/submitReviewEvaluation',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
        ;
        
    }]);
    
})();