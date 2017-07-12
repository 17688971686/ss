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
/**********************************************begin#管理首页*********************************/        
        	//首页-管理中心
        	.state('index', {
        		url: '/',
        		templateUrl: '/shenbaoAdmin/html/welcome',
        		controller: 'indexCtrl',
        		controllerAs: 'vm'
        	})
        	//任务流程记录列表
        	.state('task', {
        		url: '/task',
        		templateUrl: '/shenbaoAdmin/task/html/list',
        		controller: 'indexCtrl',
        		controllerAs: 'vm'
        	})
        	//修改密码
        	.state('accountPwd', {
        		url: '/accountPwd',
        		templateUrl: '/account/html/changePwdQ.html',
        		controller: 'indexCtrl',
        		controllerAs: 'vm'
        	})
        	//月报详情页面
	        .state('monthReportDetails', {
	            url: '/monthReportDetails/:monthReportId',
	            templateUrl:'/shenbaoAdmin/projectMonthReport/html/details.html',           
	            controller: 'indexCtrl',
	            controllerAs: 'vm'
	        })
/**********************************************end#管理首页*********************************/

/**********************************************begin#单位信息维护****************************/        	
             //begin#deptInfoMaintain（单位信息维护）
	        .state('deptInfoMaintain', {
	            url: '/deptInfoMaintain',
	            templateUrl: '/contents/shenbaoAdmin/deptInfoMaintain/html/deptInfoManager.html',
	            controller: 'deptInfoMaintainCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptInfoMaintain
/**********************************************end#单位信息维护****************************/
	        
/**********************************************begin#项目信息维护**************************/
	        //begin#项目管理
	        //列表页
	        .state('project', {
	            url: '/project', 
	            templateUrl: '/shenbaoAdmin/project/html/list.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        //编辑页
	        .state('projectEdit', {
	            url: '/projectEdit/:id/:projectInvestmentType', 
	            templateUrl: '/shenbaoAdmin/project/html/edit.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        //项目详情页面
	        .state('project_projectInfo', {
	            url: '/project/projectInfo/:id/:projectInvestmentType', 
	            templateUrl: '/shenbaoAdmin/project/html/projectInfo.html',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#项目管理
/**********************************************end#项目信息维护**************************/	        
             
 /**********************************************begin#月报*********************************/
            //需要填报项目列表 页面
	        .state('projectMonthReport', {
	            url: '/projectMonthReport', 
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/list.html',
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //填报月份选择页面	        
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:projectId',
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/selectMonth',   	            	 	           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })	        
	        //填报信息录入页面
	        .state('projectMonthReportInfoFill', {
	            url: '/projectMonthReportInfoFill/:projectId/:year/:month/:processState',
	            templateUrl:'/shenbaoAdmin/projectMonthReport/html/fillInfo/',           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })	        
/**********************************************end#月报*********************************/
	        	        	        
 /**********************************************begin#项目申报****************************/
	        //单位项目列表页
	         .state('shenbao', {
	            url: '/shenbao', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/list.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目申报页
	         .state('shenbao_edit', {
	            url: '/shenbao/:id/:projectInvestmentType/:stage', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/edit.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        })
	        //申报记录列表页
	        .state('shenbao_records', {
	            url: '/shenbao_records', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/records.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        })
	        //申报记录详情页
	        .state('shenbao_record', {
	            url: '/shenbao_record/:id', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/shenBaoInfo.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        })
	        //申报记录编辑页
	        .state('shenbao_record_edit', {
	            url: '/shenbao_record_edit/:id/:stage', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/edit.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        });
/**********************************************end#项目申报*********************************/	        
    }]);
    
})();