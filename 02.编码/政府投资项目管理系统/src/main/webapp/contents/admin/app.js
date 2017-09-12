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
	        //列表页
	        .state('monthReport', {
	            url: '/monthReport',
	            templateUrl: '/management/monthReport/html/list',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
	        //修改页
	           .state('monthReportChange', {
	            url: '/monthReportChange/:projectId/:year/:month',
	            templateUrl: '/management/monthReport/html/changeDetails',
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
	        //年度计划项目库列表（被签收的申报信息）
	         .state('yearPlan_shenbaoInfoList', {
	            url: '/yearPlan/shenbaoInfoList',
	            templateUrl: '/management/yearPlan/html/shenbaoInfoList',
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
	        //年度计划编制列表
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
	        //投资项目目录列表
	        .state('catalog_investment', {
	            url: '/catalog/investment',
	            templateUrl: '/management/catalog/html/investmentList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	       
	        //
	        .state('catalog_investment_projectIndustry', {
	            url: '/catalog/investment/projectIndustry/:id',
	            templateUrl: '/management/catalog/html/investmentEdit',
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
	            url: '/creditInfo/illegalNameEdit/:id/:projectNumber/:projectName/:unitName/:createdDate',
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
	            url: '/creditInfo/blackList//:projectNumber/:projectName/:unitName/:createdDate',
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
	            url: '/creditInfo/projectAnomaly/:id/:projectNumber/:projectName/:unitName/:createdDate',
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
	        //待办列表页(taskHead)
	        .state('task_todo', {
	            url: '/task/todo',
	            templateUrl: '/management/task/html/todo',
	            controller: 'taskCtrl',
	            controllerAs: 'vm'
	        })
	        //任务处理页
	        .state('task_handle', {
	            url: '/task/todo/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/handle',
	            controller: 'taskCtrl',
	            controllerAs: 'vm'
	        })
	        //已办列表页(taskRecord)
	        .state('task_complete', {
	            url: '/task/complete',
	            templateUrl: '/management/task/html/complete',
	            controller: 'taskCtrl',
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