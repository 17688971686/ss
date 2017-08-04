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
	        //申报信息修改
	         .state('yearPlan_record_edit', {
	            url: '/yearPlan_record_edit/:id/:projectInvestmentType/:stage',
	            templateUrl: '/management/yearPlan/html/edit',
	            controller: 'yearPlanCtrl',
	            controllerAs: 'vm'
	        })	   
	        
/**********************end#年度计划编制***************************************/
	        
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
	        });	
/**********************end#工作台***************************************/        
    }]);
    
})();