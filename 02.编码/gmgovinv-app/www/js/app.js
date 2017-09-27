// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.interceptors'])

  //定义一些常量
  .constant('APP_CONFIG', {
    app_name: '光明政府投资项目',
    platform: 'android',
    version: '1.0.0',
    host: 'http://192.168.1.18:8080'
  })

  .constant('APP_EVENTS', {
    loggedIn: 'login-success',
    loginFailed: 'login-failed',
    loggedOut: 'logout-success',
    sessionTimeout: 'session-timeout',
    notAuthenticated: 'not-authenticated',
    notAuthorized: 'not-authorized',
    pullBaoList:'pullBaoList'
  })

  .run(function ($ionicPlatform, $rootScope, $ionicModal, AppService, APP_EVENTS,$q) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        // StatusBar.styleDefault();
      }

      //初始化数据
      AppService.initAllData();
    });

    $rootScope.loginModal = null;
    $rootScope.showLoginView = function () {
      if (!!$rootScope.loginModal) {
        $rootScope.loginModal.show();
      } else {
        $ionicModal.fromTemplateUrl('templates/modal-login.html', {
          scope: $rootScope,
          animation: 'slide-in-up',
          backdropClickToClose: false
        }).then(function (modal) {
          $rootScope.loginModal = modal;
          $rootScope.loginModal.show();
        });

        $rootScope.$on(APP_EVENTS.loggedIn, function (e) {
          $rootScope.loginModal.hide();
        });
      }
    }
    //判断是否是admin
    
    
    
    $rootScope.haseAnyRole = function(user,roleNames){
    	
    	var deferred = $q.defer();
    	var flag = false;
    	
    	if(!user||!user.roles||!roleNames){
    	}else{
    		var rNames = roleNames.split(',');
    	 	var roleName = '';
    	 	angular.forEach(user.roles,function(role){
    	 		roleName = role.roleName;
    	 		angular.forEach(rNames,function(v){
    	 			if(v == roleName){
    	 				flag = true;
    	 			}
    	 		});
    	 	})
    	}
    	 
    	 if(flag){
    	 	deferred.resolve();
    	 }else{
    	 	deferred.reject();
    	 }
    	return deferred.promise;
    	
  }
    
   
  })

  .config(function ($httpProvider,$stateProvider, $urlRouterProvider, $ionicConfigProvider) {


	  //Reset headers to avoid OPTIONS request (aka preflight)
	

    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
		
		$httpProvider.interceptors.push('AuthInterceptor');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.planning', {
        url: '/planning',
        views: {
          'tab-planning': {
            templateUrl: 'templates/tab-planning.html',
            controller: 'PlanningCtrl'
          }
        }
      })
			.state('tab.planning-detail', {
        url: '/planning-detail/:id',
        views: {
          'tab-planning': {
            templateUrl: 'templates/yearplanning-detail.html',
            controller: 'PlanningDetailCtrl'
          }
        }
      })
			.state('tab.planning-projects', {
        url: '/planning-projects/:id',
        views: {
          'tab-planning': {
            templateUrl: 'templates/yearplanning-projects.html',
            controller: 'PlanningProjectsCtrl'
          }
        }
     })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('tab.general', {
        url: '/general',
        views: {
          'tab-settings': {
            templateUrl: 'templates/general.html',
            controller: 'GeneralCtrl'
          }
        }
      })

      .state('tab.update', {
        url: '/update',
        views: {
          'tab-settings': {
            templateUrl: 'templates/update.html',
            controller: 'UpdateCtrl'
          }
        }
      })

      .state('tab.about', {
        url: '/about',
        views: {
          'tab-settings': {
            templateUrl: 'templates/about.html',
            controller: 'AboutCtrl'
          }
        }
      })

      .state('tab.project', {
        url: '/project',
        views: {
          'tab-project': {
            templateUrl: 'templates/tab-project.html',
            controller: 'ProjectCtrl'
          }
        }
      })

      .state('tab.project-list', {
        url: '/project-list?snapshot',
        views: {
          'tab-project': {
            templateUrl: 'templates/project-list.html',
            controller: 'ProjectListCtrl'
          }
        }
      })
     
      .state('tab.project-detail', {
        url: '/project-detail/:type/:id/:unitName',
        views: {
          'tab-planning': {
            templateUrl: 'templates/project-detail.html',
            controller: 'ProjectDetailCtrl'
          }
        }
      })
       //项目库（申报信息）
			.state('tab.shenbaoinfo-list', {
        url: '/shenbaoinfo-list',
        views: {
          'tab-shenbaoinfo': {
            templateUrl: 'templates/shenbaoinfo-list.html',
            controller: 'ShenbaoinfoListCtrl'
          }
        }
      })
			.state('tab.shenbaoinfo-detail', {
        url: '/shenbaoinfo-detail/:id',
        views: {
          'tab-shenbaoinfo': {
            templateUrl: 'templates/shenbaoinfo-detail.html',
            controller: 'ShenbaoinfoDetailCtrl'
          }
        }
      })
      //项目进展
			.state('tab.monthreport-list', {
        url: '/monthreport-list/:id',
        views: {
          'tab-shenbaoinfo': {
            templateUrl: 'templates/monthreport-list.html',
            controller: 'MonthReportCtrl'
          }
        }
      })
			//年度计划项目进展
			.state('tab.plan-monthreport-list', {
        url: '/plan-monthreport-list/:id',
        views: {
          'tab-planning': {
            templateUrl: 'templates/plan-monthreport-list.html',
            controller: 'MonthReportCtrl'
          }
        }
      })
			
			//月报详细情况-项目库
			.state('tab.monthreport-detail', {
        url: '/monthreport-detail/:id/:year/:month',
        views: {
          'tab-shenbaoinfo': {
            templateUrl: 'templates/monthreport-detail.html',
            controller: 'MonthReportDetailCtrl'
          }
        }
      })
      //月报详细情况-年度计划
			.state('tab.plan-monthreport-detail', {
        url: '/plan-monthreport-detail/:id/:year/:month',
        views: {
          'tab-planning': {
            templateUrl: 'templates/plan-monthreport-detail.html',
            controller: 'MonthReportDetailCtrl'
          }
        }
      })
			//项目申报详情
 			.state('tab.project-shenbao', {
        url: '/project-shenbao/:id',
        views: {
          'tab-project': {
            templateUrl: 'templates/project-shenbao.html',
            controller: 'ProjectShenboCtrl'
          }
        }
     })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/shenbaoinfo-list');
    

  })

  .directive('hideTabs', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {

        scope.$on('$ionicView.beforeEnter', function () {

          scope.$watch(attributes.hideTabs, function (value) {
            $rootScope.hideTabs = 'tabs-item-hide';
          });

        });

        scope.$on('$ionicView.beforeLeave', function () {
          scope.$watch(attributes.hideTabs, function (value) {
            $rootScope.hideTabs = 'tabs-item-hide';
          });
          scope.$watch('$destroy', function () {
            $rootScope.hideTabs = false;
          })

        });
      }
    };
  })

  ;