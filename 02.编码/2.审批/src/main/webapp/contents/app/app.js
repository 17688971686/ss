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
    }]);
    
})();