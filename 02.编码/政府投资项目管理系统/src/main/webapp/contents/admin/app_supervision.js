(function () {
    'use strict';

    angular.module('appSupervision', [
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
                 templateUrl:  '/adminSupervision/welcome_supervision.html',
                 controller: 'roleCtrl',
                 controllerAs: 'vm'
             })
             
            /**********************begin#basic***************************************/
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
	            templateUrl: '/verifyNum/html/changePwd.html',
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
	        /**********************end#basic***************************************/
	        
	        
	        /**********************begin#project***************************************/
	        //政府投资项目  
	        //列表页
	        .state('supervision_tzxm', {
	            url: '/supervision/tzxm',
	            templateUrl: '/management/supervision/project/html/list',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	        .state('task_todo_feedback', {
	            url: '/task/todo_feedback',
	            templateUrl: '/management/supervision/task/html/todo_feedback',
	            controller: 'taskFeedbackCtrl',
	            controllerAs: 'vm'
	        })
	        .state('task_complete_feedback', {
	            url: '/task/complete_feedback',
	            templateUrl: '/management/supervision/task/html/complete_feedback',
	            controller: 'taskFeedbackCtrl',
	            controllerAs: 'vm'
	        })
	        .state('handle_feedback', {
	            url: '/task/handle_feedback/:processInstanceId/:shenbaoInfoId/:projectId',
	            templateUrl: '/management/supervision/task/html/handle_feedback',
	            controller: 'handleFeedbackCtrl',
	            controllerAs: 'vm'
	        })
	        .state('handle_details_feedback', {
	            url: '/task/handle_details_feedback/:processInstanceId/:shenbaoInfoId/:projectId',
	            templateUrl: '/management/supervision/task/html/handle_details_feedback',
	            controller: 'handleDetailsFeedbackCtrl',
	            controllerAs: 'vm'
	        })
	        //编辑页
	        .state('projectEdit', {
	            url: '/projectEdit/:id/:projectInvestmentType',
	            templateUrl: '/management/supervision/project/html/edit.html',
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
	          //审批单管理  
	          //列表页
	        .state('supervision_spdw', {
	            url: '/supervision/spdw',
	            templateUrl: '/management/supervision/project/html/unitList',
	            controller: 'projectCtrl',
	            controllerAs: 'vm'
	        })
	         //审批单位编辑or新增 shenpiUnitDetail
		    .state('shenpiUnitChange', {
		    url: '/shenpiUnitChange/:id',
		    templateUrl: '/management/supervision/project/html/shenpiUnitChange',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
		      //审批单位详情 
		    .state('shenpiUnitDetail', {
		    url: '/shenpiUnitDetail/:id',
		    templateUrl: '/management/supervision/project/html/shenpiUnitDetail',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    })   
		     //审批事项列表  
		    .state('shenpiItemsList', {
		    url: '/supervision/spsx',
		    templateUrl: '/management/supervision/project/html/shenpiItemsList',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
		     //审批事项编辑or新增  
		    .state('shenpiItemsChange', {
		    url: '/shenpiItemsChange/:id',
		    templateUrl: '/management/supervision/project/html/shenpiItemsChange',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    })
		     //审批事项详情 
		    .state('shenpiItemsDetail', {
		    url: '/shenpiItemsDetail/:id',
		    templateUrl: '/management/supervision/project/html/shenpiItemsDetail',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
		     //审批反馈事项列表    
		    .state('shenpifankuiItemsList', {
		    url: '/supervision/spfk',
		    templateUrl: '/management/supervision/project/html/shenpifankuiItemsList',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
		    //填写审批反馈结果  
		     .state('shenpifankuiItemsChange', {
		    url: '/shenpifankuiItemsChange/:id',
		    templateUrl: '/management/supervision/project/html/shenpifankuiItemsChange',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
		       //审批反馈结果详情 
		    .state('shenpifankuiItemsDetail', {
		    url: '/shenpifankuiItemsDetail/:id',
		    templateUrl: '/management/supervision/project/html/shenpifankuiItemsDetail',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
		    //该逾期事项项目的所以事项  
		    .state('projectItems', {
		    url: '/projectItems/:id',
		    templateUrl: '/management/supervision/project/html/projectItems',
		    controller: 'projectCtrl',
		    controllerAs: 'vm'
		    }) 
	        ;
        
	        /**********************end#project***************************************/
        
    }]);
    
})();