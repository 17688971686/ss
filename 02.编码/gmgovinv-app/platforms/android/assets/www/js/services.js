angular.module('starter.services', ['ngResource'])

  .constant('TIMEOUT', 50000)

  .constant('REQUEST_URL_LIST', {
    url_projectlist: '/MobifindDatale/api/MobileApi/GetProjectInfos',
    url_snapshotlist: '/Mobile/api/MobileApi/GetSnapshootList',
    url_login: '/mobile/account/login',
    url_setrealname: '/Mobile/api/MobileApi/EditRealName',
    url_setpassword: '/Mobile/api/MobileApi/EditPassword',
    url_logout: '/Mobile/api/MobileApi/LogOut',
    url_projectdetail: '/mobile/shenbaoAdmin/project',//项目详细信息
    url_projectprepares: '/Mobile/api/MobileApi/GetCuurentProjectPrepares',
    url_projectprocess: '/Mobile/api/MobileApi/GetProjectProcess',
    url_projectschedules: '/Mobile/api/MobileApi/GetProjectSchedules',
    url_projectallprepares: '/Mobile/api/MobileApi/GetProjectPrepares',
    url_projectprocessdetail: '/Mobile/api/MobileApi/GetAuditProjectDetail',
    url_projectscheduledetail: '/Mobile/api/MobileApi/GetMonthDetail',
    url_totalHisData: '/Mobile/api/MobileReportApi/GetInvestTotalHistogram',
    url_arrangeMoneyData: '/Mobile/api/MobileReportApi/GetArrangeMoneyHistogram',
    url_totalPieChartData: '/Mobile/api/MobileReportApi/GetInvestTotalPieChart',
    url_arrangeMoneyPieChartData: '/Mobile/api/MobileReportApi/GetArrangeMoneyPieChart',
    url_horsthChartData: '/Mobile/api/MobileReportApi/GetHistoryDataContrast',
    url_checkupdate: '/Mobile/api/MobileApi/GetMobileNewestVersion',
 		url_basicData:'/mobile/common/basicData/all',
 	  url_projectreposity:'/mobile/shenbaoAdmin/project/unitProject?$inlinecount=allpages&$orderby=createdDate+desc',
 		url_userUnitInfo:'/mobile/shenbaoAdmin/userUnitInfo',//用户单位信息
 		url_shenbao:'/mobile/shenbaoAdmin/shenbao',//项目申报信息
 		url_yearPlan:'/mobile/management/yearPlan?$inlinecount=allpages&%24top=10&orderby=createdDate+desc',//年度计划
 		url_yearPlanProject:'/mobile/management/yearPlan/{0}/projectList?$inlinecount=allpages&%24top=10&orderby=createdDate+desc',//年度计划项目
 		url_shenbaoinfo:"/mobile/management/shenbao",//申报信息（项目库）
 		url_task:'/mobile/management/task'
  })

  .factory('AppService', function ($resource, $q, $http, $rootScope, APP_CONFIG, REQUEST_URL_LIST, APP_EVENTS,TIMEOUT,Shenbaoinfo) {

    return {
      initAllData: function () {
        var deferred = $q.defer();
        localforage.getItem('user').then(function (data) {
        	if(null != data){
        		$rootScope.user = data;

        		/*$http({
          		method: 'GET',
          		url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectreposity,
          		params:{'$filter':common.buildFilter([{name:'isLatestVersion',operator:'eq',value:true,dataType:'boolean'}]),
          						userId:$rootScope.user.id
          		},
          		timeout: TIMEOUT
        		}).then(function (res) {
          		localforage.setItem('projects', res.data.value).then( function () {
	            setTimeout(function () {
	              localforage.getItem('projects').then(function (data) {
	              }).catch(function (err) {
	                console.log(err);
	              })
	            }, 2000);

          	}).catch(function(err){
            	console.log(err);
          	});
        	}, function (err) {
          	console.log(err);
        	});*/
        }

      });

      //查询项目库数据
      Shenbaoinfo.pullData().then(function(res){
      	//console.log('查询申报数据');
      	//console.log(res);

      	localforage.setItem('shenbaolist',res.data.value||[]).then(function(){

      		$rootScope.$broadcast(APP_EVENTS.pullBaoList);
      		setTimeout(function () {
              localforage.getItem('shenbaolist').then(function (data) {
                console.log(data);
              }).catch(function (err) {
                console.log(err);
              })
            }, 2000);

      	}).catch(function(err){
            console.log(err);
        });
      });

			//查询基础数据
			$http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_basicData,
          timeount: TIMEOUT
        }).success(function (data) {
         		var basicData = {};
         		if(data&&data instanceof Array){
         			angular.forEach(data,function(v){
         				basicData[v.id] = v.description;
         			});
         		}
         		$rootScope.basicData = basicData;
            localforage.setItem('basicData', basicData);
        });

        //查询年度计划数据
        $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_yearPlan,
          timeount: TIMEOUT
        }).success(function (res) {
        		if(res&&res.value){
        			localforage.setItem('yearPlannings', res.value);
        		}
        });

      },
      checkUpdate: function (platform, version) {
        var deferred = $q.defer();
        $http({
          method: 'POST',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_checkupdate,
          data: {
            platform: APP_CONFIG.platform,
            versions: APP_CONFIG.version
          },
          timeount: TIMEOUT
        }).success(function (data) {
          if (data.IsSuccess) {
            setTimeout(function () {
              deferred.resolve({
                hasUpdate: data.Data.IsNewest == "1",
                platform: data.Data.Platform,
                version: data.Data.Versions,
                updateUrl: data.Data.UpdateUrl
              });
            }, 500)
          } else {
            deferred.resolve({
              hasUpdate: false
            });
          };
        }).error(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      isAutoCheckUpdate: function () {
        var deferred = $q.defer();
        localforage.getItem('autocheckupdate').then(function (data) {
          if (data == null) {
            deferred.resolve(true); //默认自动更新
          } else {
            deferred.resolve(data);
          };
        });
        return deferred.promise;
      },
      setAutoCheckUpdate: function (isAuto) {
        localforage.setItem('autocheckupdate', isAuto);
      }
    };
  })

  .factory('Account', function ($rootScope, $q, $http, APP_CONFIG, REQUEST_URL_LIST, TIMEOUT) {

    return {
      login: function (username, password) {
        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_login,
          data: {
            loginName: username,
            password: password //base64
          },
          timeount: TIMEOUT
        }).success(function (data) {
          if (data.isSuccess) {

            var user = {
              id: data.object.id,
              username: data.object.loginName,
              realName: data.object.displayName,
              roles:data.object.roles
              //roleName: data.Data.User.Membership_UserInRole[0].Membership_Role.RoleName,
              //accessToken: data.Data.AuthToken
            };
            localforage.setItem('user', user);

            //判断是否是管理员
            $rootScope.haseAnyRole(user,'管理员,超级管理员').then(function(){
	          	$rootScope.isAdmin = true;
	          },function(){
	          	$rootScope.isAdmin = false;
	          });
	          //设置已登录状态
	          $rootScope.isLogin = true;

            deferred.resolve({
              isSuccess: true,
              message: data.Message,
              user: user
            });
          } else {
            deferred.resolve({
              isSuccess: false,
              message: data.Message
            });
          }

        }).error(function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },
      //获取登录的用户
      loggedUser: function () {
        var deferred = $q.defer();
        localforage.getItem('user').then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      // 退出登录
      logout: function () {
        localforage.removeItem('user');
      },
      // 是否登陆
      isLogin: function () {
        var deferred = $q.defer();
        localforage.getItem('user').then(function (data) {
          deferred.resolve(!!data);


          $rootScope.isLogin = true;
          $rootScope.haseAnyRole(data,'管理员,超级管理员').then(function(){
          	$rootScope.isAdmin = true;
          },function(){
          	$rootScope.isAdmin = false;
          });

        });

        return deferred.promise;
      },
      setRealName: function (id, realname) {
        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_setrealname,
          data: {
            Id: id,
            RealName: realname
          },
          timeount: TIMEOUT
        }).success(function (data) {
          if (data.IsSuccess) {
            localforage.getItem('user').then(function (data) {
              var user = data;
              user.realName = realname;
              $rootScope.user = user;
              localforage.setItem('user', user);
              deferred.resolve({
                isSuccess: true,
                message: data.Message,
                user: user
              });
            });
          } else {
            deferred.resolve({
              isSuccess: false,
              message: data.Message
            });
          }

        }).error(function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },
      setPassword: function (username, password, newPassword) {
        var deferred = $q.defer();

        $http({
          method: 'POST',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_setpassword,
          data: {
            LoginId: username,
            PwdOld: window.btoa(password),
            PwdNew: window.btoa(newPassword)
          },
          timeount: TIMEOUT
        }).success(function (data) {
          deferred.resolve({
            isSuccess: data.IsSuccess,
            message: data.Message
          });
        }).error(function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }
    };
  })

  .factory('Industries', function ($q) {

    //行业数据
    var industries = [{
      'id': 1,
      'name': '道路交通'
    }, {
      'id': 2,
      'name': '环境保护及地质灾害治理'
    }, {
      'id': 3,
      'name': '农林、水利设施、水治理'
    }, {
      'id': 4,
      'name': '市容环境体射给你、改善及市容市政设施'
    }, {
      'id': 5,
      'name': '教育'
    }, {
      'id': 6,
      'name': '医疗卫生'
    }, {
      'id': 7,
      'name': '文化教育'
    }, {
      'id': 8,
      'name': '科技产业配套'
    }, {
      'id': 9,
      'name': '公共安全'
    }, {
      'id': 10,
      'name': '城市建设'
    }, {
      'id': 11,
      'name': '党政机关及其他'
    }, {
      'id': 12,
      'name': '社区建设'
    }, {
      'id': 13,
      'name': '专项资金'
    }, {
      'id': 25,
      'name': '环境保护及地质灾害治理、水利设施、水治理'
    }];
    return {
      findAll: function () {
        var deferred = $q.defer();
        deferred.resolve(industries);
        return deferred.promise;
      },
      findById: function (id) {
        var deferred = $q.defer();
        var result = Enumerable.From(industries).Where('$.id == ' + id).SingleOrDefault();
        deferred.resolve(result);
        return deferred.promise;
      }
    };
  })
  .factory('InvestSources', function ($q) {
    var investsources = [{
      'id': 1,
      'name': '市投'
    }, {
      'id': 2,
      'name': '区投'
    }];

    return {
      findAll: function () {
        var deferred = $q.defer();
        deferred.resolve(investsources);
        return deferred.promise;
      },
      findById: function (id) {
        var deferred = $q.defer();
        var result = Enumerable.From(investsources).Where('$.id == ' + id).SingleOrDefault();
        deferred.resolve(result);
        return deferred.promise;
      }
    };
  })

  .factory('ProjectTypes', function ($q) {

    var projecttypes = [{
      'id': 1,
      'name': '市投市建'
    }, {
      'id': 2,
      'name': '区投区建'
    }, {
      'id': 3,
      'name': '市投区建'
    }];

    return {
      findAll: function () {
        var deferred = $q.defer();
        deferred.resolve(projecttypes);
        return deferred.promise;
      },
      findById: function (id) {
        var deferred = $q.defer();
        var result = Enumerable.From(projecttypes).Where('$.id == ' + id).SingleOrDefault();
        deferred.resolve(result);
        return deferred.promise;
      }
    };
  })

  .factory('ProjectCategories', function ($q) {

    var projecttypes = [{
      'id': 'projectCategory_1',
      'name': 'A类'
    }, {
      'id': 'projectCategory_2',
      'name': 'B类'
    }, {
      'id': 'projectCategory_3',
      'name': 'C类'
    }, {
      'id': 'projectCategory_4',
      'name': 'D类'
    }];

    return {
      findAll: function () {
        var deferred = $q.defer();
        deferred.resolve(projecttypes);
        return deferred.promise;
      },
      findById: function (id) {
        var deferred = $q.defer();
        var result = Enumerable.From(projecttypes).Where('$.id == ' + id).SingleOrDefault();
        deferred.resolve(result);
        return deferred.promise;
      }
    };
  })
  .factory('Investments', function ($q) {
    var investments = [{
      'id': 0,
      'name': '1000万以下项目',
      'query': '$.projectInvestSum <= 1000'
    }, {
      'id': 1,
      'name': '1000万以上5000万以下项目',
      'query': '$.projectInvestSum > 1000 && $.projectInvestSum <= 5000'
    }, {
      'id': 2,
      'name': '5000万以上项目',
      'query': '$.projectInvestSum > 5000'
    }];

    return {
      findAll: function () {
        var deferred = $q.defer();
        deferred.resolve(investments);
        return deferred.promise;
      },
      findById: function (id) {
        var deferred = $q.defer();

        var result = Enumerable.From(investments).Where('$.id == ' + id).SingleOrDefault();
        deferred.resolve(result);

        return deferred.promise;
      }
    };
  })

  .factory('Snapshots', function ($q) {
    return {
      findAll: function () {
        var deferred = $q.defer();
        localforage.getItem('snapshots').then(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      },
      get: function (id) {
        var deferred = $q.defer();
        localforage.getItem('snapshots').then(function (data) {
          var snap = Enumerable.From(data).Where('$.id ==' + id).Single();
          deferred.resolve(snap);
        });
        return deferred.promise;

      },
      add: function (snapshot, query) {
        console.log('add snapshot: {snapshot: ' + snapshot + '}, {query: ' + query + ' }')
        var deferred = $q.defer();
        localforage.getItem('snapshots').then(function (data) {
          var snap = {};
          snap.id = Enumerable.From(data).Max('$.id') + 1;
          snap.name = snapshot;
          snap.query = query;

          data.push(snap);
          localforage.setItem('snapshots', data, function (err, value) {
            deferred.resolve(data);
          })

        });
        return deferred.promise;
      },
      delete: function (id) {
        console.log('delete snapshot: {id: ' + id + '}')
        var deferred = $q.defer();
        localforage.getItem('snapshots').then(function (data) {
          var snaps = Enumerable.From(data).Where('$.id!=' + id).ToArray();

          localforage.setItem('snapshots', snaps, function (err, value) {
            deferred.resolve(snaps);
          })

        });
        return deferred.promise;
      }
    };
  })
  .factory('Planning', function ($q,$http,APP_CONFIG,REQUEST_URL_LIST,TIMEOUT) {
    return {
      findAll: function () {
        var deferred = $q.defer();
        localforage.getItem('yearPlannings').then(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      },
      findById: function (plannningId) {
        console.log('find Planning detail: { plannningId : ' + plannningId + ' } ');
        var deferred = $q.defer();
        //项目基本信息
        var q1 = $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_yearPlan,
          params:{'$filter':common.buildFilter([
					          	{name:'id',operator:'eq',value:plannningId}
          				])
          },
          timeount: TIMEOUT
        });

			 var q2 = $http({
          method: 'GET',
          url: common.format(APP_CONFIG.host + REQUEST_URL_LIST.url_yearPlanProject,plannningId),
          timeount: TIMEOUT
        });

				$q.all([q1, q2]).then(function (results) {
          var planning = results[0].data.value[0]||{};
          planning.projects = results[1].data.value||[];
          localforage.setItem('yearPlanning-'+plannningId,planning.projects);

          var statistics = {};//统计信息
					//数据汇总数据计算
					var Capitals = planning.yearPlanCapitalDtos;
					//属于该年度计划编制的申报项目信息
					var shenBaoInfoList = planning.projects;
					//项目总数
					statistics.shenBaoInfoTotal = shenBaoInfoList.length;
					statistics.QianQiTotal = 0;//前期
					statistics.NewStratTotal = 0;//新开工
					statistics.XuJianTotal = 0;//续建
					statistics.ChuBeiTotal = 0;//储备类
					statistics.projectInvestSumTotal = 0;//项目总投资
					statistics.applyYearInvestTotal = 0;//申请资金总额

					for(var j=0;j<shenBaoInfoList.length;j++){
						var obj = shenBaoInfoList[j];
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_qianqi){//前期
							statistics.QianQiTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_xinkaigong){//新开工
							statistics.NewStratTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_xujian){//续建
							statistics.XuJianTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_chubei){//储备类
							statistics.ChuBeiTotal ++;
						}
						if(obj.projectInvestSum){//总投资
							statistics.projectInvestSumTotal += obj.projectInvestSum;
						}
						if(obj.applyYearInvest){//年度申请资金
							statistics.applyYearInvestTotal += obj.applyYearInvest;
						}
//						if(obj.yearInvestApproval){//年度安排资金
//							vm.model.yearInvestApprovalTotal += obj.yearInvestApproval;
//						}
					}
					//计划总规模
					statistics.yearInvestApprovalTotal = 0;//安排资金总计
					statistics.capitalSCZ_ggysTotal = 0;//市投资-公共预算
					statistics.capitalSCZ_gtzjTotal = 0;//市投资-国土基金
					statistics.capitalSCZ_zxzjTotal = 0;//市投资-专项基金
					statistics.capitalQCZ_ggysTotal = 0;//区投资-公共预算
					statistics.capitalQCZ_gtzjTotal = 0;//区投资-国土基金
					statistics.capitalZYYSTotal = 0;//中央预算内投资
					statistics.capitalSHTZTotal = 0;//社会投资

					statistics.capitalOtherTotal = 0;
					for(var i=0;i<Capitals.length;i++){
						var c = Capitals[i];
						if(c.capitalSCZ_ggys){
							statistics.capitalSCZ_ggysTotal += c.capitalSCZ_ggys;
						}
						if(c.capitalSCZ_gtzj){
							statistics.capitalSCZ_gtzjTotal += c.capitalSCZ_gtzj;
						}
						if(c.capitalSCZ_zxzj){
							statistics.capitalSCZ_zxzjTotal += c.capitalSCZ_zxzj;
						}
						if(c.capitalQCZ_ggys){
							statistics.capitalQCZ_ggysTotal += c.capitalQCZ_ggys;
						}
						if(c.capitalQCZ_gtzj){
							statistics.capitalQCZ_gtzjTotal += c.capitalQCZ_gtzj;
						}
						if(c.capitalZYYS){
							statistics.capitalZYYSTotal += c.capitalZYYS;
						}
						if(c.capitalSHTZ){
							statistics.capitalSHTZTotal += c.capitalSHTZ;
						}
						if(c.capitalOther){
							statistics.capitalOtherTotal += c.capitalOther;
						}
						if(c.capitalSum){//年度安排资金
							statistics.yearInvestApprovalTotal += c.capitalSum;
						}
					}

					planning.statistics = statistics;
          deferred.resolve(planning);
        });

        return deferred.promise;
      },
      findProjectsById:function(planningId){
      	  var deferred = $q.defer();
      	  localforage.getItem('yearPlanning-'+planningId).then(function(projects){
      	  	 deferred.resolve(projects);
      	  });

      	  return deferred.promise;
      },
      get: function (id) {
        /*var deferred = $q.defer();
        localforage.getItem('snapshots').then(function (data) {
          var snap = Enumerable.From(data).Where('$.id ==' + id).Single();
          deferred.resolve(snap);
        });
        return deferred.promise;*/

      }
    };
  })
  .factory('Shenbaoinfo',function($q, $http, APP_CONFIG, REQUEST_URL_LIST, TIMEOUT){
  	return {
  		//申报列表用
      findData: function (page, pageSize, query) {
        console.log('find shenbaolist: { page : ' + page + ' } , { pageSzie : ' + pageSize + ' } , { query : ' + query + ' }');
        var deferred = $q.defer();

        localforage.getItem('shenbaolist').then(function (data) {
          var result = {};
          window.p = data;
          var q = Enumerable.From(data);
          if (!!q) {
            q = q.Where(query);
          };
          result.page = page;
          result.pageSize = pageSize;
          result.totalPage = (q.ToArray().length + pageSize - 1) / pageSize;
          result.data = q.Skip(pageSize * (page - 1)).Take(pageSize).ToArray();
          deferred.resolve(result);
        });

        return deferred.promise;
    	},
	    //从服务端获取数据
	    pullData:function(){
    	  var deferred = $q.defer();
			  $http({
		      method: 'GET',
		      url: APP_CONFIG.host + REQUEST_URL_LIST.url_shenbaoinfo+"?$inlinecount=allpages&$top=10&$orderby=createdDate desc&$filter=(projectShenBaoStage eq 'projectShenBaoStage_7' and processState eq 'processState_2')",
		      timeount: TIMEOUT
		    }).then(function(res){
		    	deferred.resolve(res);
		    } ,function (err) {
	      	console.log(err);
	      	deferred.reject();
	    	});

	    	return deferred.promise;
    	},
    	findById:function(id){
    		var deferred = $q.defer();
    		$http({
		      method: 'GET',
		      url: APP_CONFIG.host + REQUEST_URL_LIST.url_shenbaoinfo,
		      params:{'$filter':common.buildFilter([{name:'id',operator:'eq',value:id}])},
		      timeount: TIMEOUT,
		    }).then(function(res){
		    	deferred.resolve(res.data.value[0]||{});
		    } ,function (err) {
	      	console.log(err);
	      	deferred.reject();
	    	});

    		return deferred.promise;
    	},
    	findTask:function(shenbaoId){
    		var deferred = $q.defer();
    		$http({
		      method: 'GET',
		      url: APP_CONFIG.host + REQUEST_URL_LIST.url_task,
		      params:{'$filter':common.buildFilter([{name:'relId',operator:'eq',value:shenbaoId}])},
		      timeount: TIMEOUT,
		    }).then(function(res){
		    	deferred.resolve(res.data.value[0]||{});
		    } ,function (err) {
	      	console.log(err);
	      	deferred.reject();
	    	});

    		return deferred.promise;

    	}
  	};
  })
  .factory('Projects', function ($q, $http, APP_CONFIG, REQUEST_URL_LIST, TIMEOUT) {

    function loadData() {
      var deferred = $q.defer();
      localforage.getItem('projects').then(function (data) {

        deferred.resolve(data);
      });
      return deferred.promise;
    };

    return {
      //项目地图查询用
      findByQuery: function (query) {
        console.log('find projects by query: { query : ' + query + ' }');
        var deferred = $q.defer();

        localforage.getItem('projects').then(function (data) {
          var q = Enumerable.From(data);
          if (!!q) {
            q = q.Where(query);
          };
          deferred.resolve(q.ToArray());
        });

        return deferred.promise;
      },
      //项目列表用
      findData: function (page, pageSize, query) {
        console.log('find projects: { page : ' + page + ' } , { pageSzie : ' + pageSize + ' } , { query : ' + query + ' }');
        var deferred = $q.defer();

        localforage.getItem('projects').then(function (data) {
          var result = {};
          window.p = data;
          var q = Enumerable.From(data);
          if (!!q) {
            q = q.Where(query);
          };
          result.page = page;
          result.pageSize = pageSize;
          result.totalPage = (q.ToArray().length + pageSize - 1) / pageSize;
          result.data = q.Skip(pageSize * (page - 1)).Take(pageSize).ToArray();

          deferred.resolve(result);
        });

        return deferred.promise;
      },
      findById: function (projectId) {
        console.log('find project: { projectId : ' + projectId + ' } ');

        var deferred = $q.defer();
        //项目基本信息
       $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectdetail,
          params:{'$filter':common.buildFilter([
					          	{name:'id',operator:'eq',value:projectId}
          				])
          },
          timeount: TIMEOUT
        }).then(function(res){
        	deferred.resolve(res.data.value[0]||{});
        });

    		return deferred.promise;
      },
      findByIdNumAndUnitName: function (projectId,unitName/*,projectNumber*/) {
        console.log('find project: { projectId : ' + projectId + ' } ');

        var deferred = $q.defer();
        //项目基本信息
        var q1 = $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectdetail,
          params:{'$filter':common.buildFilter([
					          	{name:'id',operator:'eq',value:projectId}
          				])
          },
          timeount: TIMEOUT
        });

				//用户单位信息
       	var q2 = $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_userUnitInfo,
          params: {'$filter':common.buildFilter([
					          	{name:'id',operator:'eq',value:unitName}
          ])}
        });
       	//申报信息
       	/*var q3 = $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_shenbao,
          params: {'$filter':common.buildFilter([
					          	{name:'projectNumber',operator:'eq',value:projectNumber}
          ])}
        });*/


        $q.all([q1, q2/*, q3, q4*/]).then(function (results) {
          var projectdetail = {};
          projectdetail = results[0].data.value[0];
          projectdetail.unit = results[1].data.value[0];
         /* projectdetail.shenbaos = results[2].data.value;  */
          deferred.resolve(projectdetail);
        });

        return deferred.promise;
      },
      //获取项目历史资金来源列表
      findProjectPrepares: function (projectId) {
        console.log('find project prepares: { projectId : ' + projectId + ' } ');

        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectallprepares,
          params: {
            projectId: projectId
          },
          timeount: TIMEOUT
        }).success(function (data) {
          deferred.resolve(data.Data);
        }).error(function (err) {
          deferred.reject(err);
        })

        return deferred.promise;
      },
      //获取项目申报详细信息
      findProjectShenbaoDetail: function (shenbaoId) {
        console.log('find project shenbaoId detail: { shenbaoId : ' + shenbaoId + ' } ');

        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_shenbao,
           params: {'$filter':common.buildFilter([
					          	{name:'id',operator:'eq',value:shenbaoId}
          ])},
          timeount: TIMEOUT
        }).success(function (res) {
          deferred.resolve(res.value[0]);
        }).error(function (err) {
          deferred.reject(err);
        })

        return deferred.promise;
      },
      //获取项目审批详细信息
      findProjectProcessDetail: function (projectId) {
        console.log('find project process detail: { projectId : ' + projectId + ' } ');

        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectprocessdetail,
          params: {
            projectId: projectId
          },
          timeount: TIMEOUT
        }).success(function (data) {
          deferred.resolve(data.Data);
        }).error(function (err) {
          deferred.reject(err);
        })

        return deferred.promise;
      },

      //获取项目月报详细信息
      findProjectScheduleDetail: function (projectId, year, month) {
        console.log('find project schedule detail: { projectId : ' + projectId + ', year : ' + year + ' , month : ' + month + ' }');

        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectscheduledetail,
          params: {
            projectId: projectId,
            year: year,
            month: month
          },
          timeount: TIMEOUT
        }).success(function (data) {
          deferred.resolve(data.Data);
        }).error(function (err) {
          deferred.reject(err);
        })

        return deferred.promise;
      }
    };
  })
  .filter('dict', function($rootScope) { //可以注入依赖
    return function(key) {
    	if(!key){
    		return '';
    	}
    	if(!$rootScope.basicData){
    			$rootScope.basicData = localforage.getItem('basicData');
    	}
    	var str = [];
    	var basicData = $rootScope.basicData;
    	var keys = key.split(',');
    	var val = undefined;
    	angular.forEach(keys,function(v){
    		 	i = basicData[v];
	    		if(i){
	    			str.push(i);
	    		}

    	})

    	return str.join(',');
    }
	});
