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
        	//首页-管理中心
        	.state('index', {
        		url: '/',
        		templateUrl: '/managerCenter/html/tmpl.html',
        		controller: 'indexCtrl',
        		controllerAs: 'vm'
        	})
             //日志列表
             .state('operationRecord', {
                 url: '/operationRecord/:id',
                 templateUrl:  '/contents/shenbaoAdmin/operationRecord/html/list.html',
                 controller: 'logCtrl',
                 controllerAs: 'vm'
             })
 /*******************************Begin#公共的***********************************************/            
             //begin#projectDetails(项目详情查看-根据不同的申报阶段返回不同的页面)
	        .state('projectDetails', {
	            url: '/projectDetails/:id',	
	            templateUrl: '/projectInfo/html/projectDetails.html',	        	                      
	            controller: 'projectDetailsCtrl',
	            controllerAs: 'vm'
	        })          
             //end#projectDetails
 /*******************************End#公共的***********************************************/               
             //begin#deptInfoMaintain（单位信息维护）
	        .state('deptInfoMaintain', {
	            url: '/deptInfoMaintain',
	            templateUrl: '/contents/shenbaoAdmin/deptInfoMaintain/html/deptInfoManager.html',
	            controller: 'deptInfoMaintainCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#deptInfoMaintain
	        
/**********************************************begin#项目申报*********************************/
	        //begin#projectDeclaration（项目申报）
	        //列表页
              .state('projectDeclaration', {
                 url: '/projectDeclaration',
                 templateUrl:  '/contents/shenbaoAdmin/projectDeclaration/html/project.list.html',
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })             
             
             //end#projectDeclaration            
                        
             //begin#projectDeclarationAdd（项目申报--项目新增-根据不同的申报阶段返回不同的页面）
              .state('projectDeclarationAdd', {
                 url: '/projectDeclarationAdd/:stage',
                 templateUrl:function($stateParams){
                	 return "/contents/shenbaoAdmin/projectDetails/html/project.add/"+$stateParams.stage+"/projectInfo.add.html";
                 },
                 controller: 'projectDeclarationCtrl',
                 controllerAs: 'vm'
             })
             
              //**********************************************end#项目申报*********************************//
             
 /**********************************************begin#月报*********************************/
              //begin#projectMonthReport（项目月报）
	        //列表页
             .state('projectMonthReport', {
	            url: '/projectMonthReport', //匹配规则
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/list.html',//此处对应列表页面地址-controller里面的请求地址
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#projectMonthReport
	        
	        
	        //begin#projectMonthReportFill（项目月报填报--月份选择）
	        .state('projectMonthReportFill', {
	            url: '/projectMonthReportFill/:id/:name/:projectBuildStage',
	            templateUrl: '/shenbaoAdmin/projectMonthReport/html/fill.html',   	            	 	           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })	        
	        //end#projectMonthReportFill
	        
	        //begin#projectMonthReportInfoFill（项目月报填报--具体信息填写）
	        .state('projectMonthReportInfoFill', {
	            url: '/projectMonthReportInfoFill/:id/:name/:projectBuildStage/:month',
	            templateUrl:'/shenbaoAdmin/projectMonthReport/html/fillInfo/',           
	            controller: 'projectMonthReportCtrl',
	            controllerAs: 'vm'
	        })        
/**********************************************end#月报*********************************/
	        
	         //**********************************************begin#问题协调和建议反馈*********************************//
	        
	         //begin#problemCoordinition（问题协调）
	        .state('problemCoordinition', {
	            url: '/problemCoordinition',
	            templateUrl: '/contents/shenbaoAdmin/problemCoordinition/html/list.html',
	            controller: 'problemCoordinitionCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#problemCoordinition
	        
	        //begin#problemCoordinition（问题协调--编辑）
	        .state('problemInfoEdit', {
	            url: '/problemInfoEdit/:id',
	            templateUrl: '/contents/shenbaoAdmin/problemCoordinition/html/edit.html',
	            controller: 'problemEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#problemCoordinition   
	        
	        //begin#suggestFeedback（建议反馈）
	        .state('suggestFeedback', {
	            url: '/suggestFeedback',
	            templateUrl: '/contents/shenbaoAdmin/suggestFeedback/html/list.html',
	            controller: 'suggestFeedbackCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestFeedback
	        
	         //begin#suggestInfoEdit（建议反馈--编辑）
	        .state('suggestInfoEdit', {
	            url: '/suggestInfoEdit/:id',
	            templateUrl: '/contents/shenbaoAdmin/suggestFeedback/html/edit.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoEdit
	        
	         //begin#suggestInfoLook（建议反馈--详情）
	        .state('suggestInfoLook', {
	            url: '/suggestInfoLook/:id',
	            templateUrl: '/contents/shenbaoAdmin/suggestFeedback/html/details.html',
	            controller: 'suggestFeedbackEditCtrl',
	            controllerAs: 'vm'
	        }) 
	        //end#suggestInfoLook
	        //**********************************************end#问题协调和建议反馈*********************************//
	        
	        
	        
	        
	        
    }]);
    
})();