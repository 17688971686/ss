(function () {
    'use strict';

    var service = {
        initJqValidation: initJqValidation,//重置form验证
        requestError: requestError,//请求错误时执行
        requestSuccess: requestSuccess,//请求成功时执行
        format: format,//string格式化
        blockNonNumber: blockNonNumber,//只允许输入数字
        floatNumberInput: floatNumberInput,
        adminContentHeight: adminContentHeight,//当前Content高度
        alert: alertDialog,//显示alert窗口
        confirm: confirmDialog,//显示Confirm窗口
        getQuerystring: getQuerystring,//取得Url参数
        kendoGridConfig: kendoGridConfig,//kendo grid配置
        getKendoCheckId: getKendoCheckId,//获得kendo grid的第一列checkId
        cookie: cookie,//cookie操作
        getToken:getToken,//获得令牌
        appPath: "",//app路径
        http: http,//http请求    
        gridDataSource: gridDataSource,//gridDataSource
        loginUrl: '/',
        getBasicData:getBasicData,
        getBasicDataDesc:getBasicDataDesc,
        getBacicDataByIndectity:getBacicDataByIndectity,
        toDate:toDate,
        toMoney:toMoney,
        formatDate:formatDate,
        formatDateTime:formatDateTime,
        basicDataConfig:basicDataConfig,
        checkLength:checkLength
    };

    window.common = service;

    function initJqValidation() {
        $("form").removeData("validator");
        $("form").removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse("form");
    }
    function requestError(options) {    	
        var message = '发生错误,系统已记录,我们会尽快处理！';
        if (options.response != undefined) {
            if (options.response.status == 401) {
                location.href = service.loginUrl;
            }

            message = options.response.data.message || message;
        }       
        service.alert({
        	vm:options.vm,
        	msg:message,
        	fn:function() {
    			options.vm.isSubmit = false;
				$('.alertDialog').modal('hide');							
			}
        });
    }
    function requestSuccess(options) {    
    	console.log(options);
    	var showError=function(msg){ 
			service.alert({
				vm:options.vm,
				msg:msg,
				fn:function() {
	    			options.vm.isSubmit = false;
					$('.alertDialog').modal('hide');							
				}
			});
    	};
        if (options.response.status > 400) {          
            showError( "发生错误！");

        } else {          	
        	var data = options.response.data;        	
        	if(data&&data.status==555){        		
        		 showError(data.message);
        	}
        	else if (options.fn) {
        		options.fn(data);
            }
        }
    }
    function format() {
        var theString = arguments[0];

        // start with the second argument (i = 1)
        for (var i = 1; i < arguments.length; i++) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        }

        return theString;
    }
    function blockNonNumber(val) {
        var str = val.toString().replace(/[^0-9]/g, '');
        return parseInt(str, 10);
    }
    function floatNumberInput(val) {
        return isNaN(parseFloat(val, 10)) ? 0 : parseFloat(val, 10);
    }
    function adminContentHeight() {
        return $(window).height() - 180;
    }
    function alertDialog(options) {
    	
        //$('.alertDialog').modal('hide');//bug:backdrop:static会失效
    	options.vm.alertDialogMessage = options.msg;
    	options.vm.alertDialogFn = function () {
            if (options.fn) {
            	options.fn();               
            } else {
                $('.alertDialog').modal('hide');                
            }
        };
        $('.alertDialog').modal({
            backdrop: 'static',
            keyboard:false
        });
    }
    function confirmDialog(options) {    	
    	options.vm.dialogConfirmTitle = options.title;
    	options.vm.dialogConfirmMessage = options.msg;
        $('.confirmDialog').modal({ backdrop: 'static' });
        options.vm.dialogConfirmSubmit = options.fn;

    }
    function getQuerystring(key, default_) {
        if (default_ == null) default_ = "";
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if (qs == null)
            return default_;
        else
            return qs[1];
    }
    function kendoGridConfig() {
        return {
            filterable: {
                extra: false,
                //mode: "row", 将过滤条件假如title下,如果不要直接与title并排
                operators: {
                    string: {
                        "contains": "包含",
                        "eq": "等于"
                        //"neq": "不等于",                        
                        //"doesnotcontain": "不包含"
                    },
                    number: {
                        "eq": "等于",
                        "neq": "不等于",
                        gt: "大于",
                        lt: "小于"
                    },
                    date: {
                        gt: "大于",
                        lt: "小于"
                    }
                }
            },
            pageable: {
                pageSize: 10,
                previousNext: true,
                buttonCount: 5,
                refresh: true,
                pageSizes: true
            },
            schema: function (model) {
                return {
                    data: "value",
                    total: function (data) { return data['count']; },
                    model: model
                };
            },
            transport: function (url) {
                return {
                    read: {
                        url: url,
                        dataType: "json",
                        type: "GET",
                        beforeSend: function (req) {
                            
                            req.setRequestHeader('Token', service.getToken());
                        }
                    }
                }
            },
            noRecordMessage: {
			    template: '暂时没有数据.'
			  }
        }
    }

    function getKendoCheckId($id) {
        var checkbox = $($id).find('tr td:nth-child(1)').find('input:checked')
        var data = [];
        checkbox.each(function () {
            var id = $(this).attr('relId');
            data.push({ name: 'id', value: id });
        });
        return data;
    }

    function http(options) {
        options.headers = { Token: service.getToken()};
        options.$http(options.httpOptions).then(options.success, function (response) {         
        	common.requestError({        		
        		vm:options.vm,
        		response:response
        	}); 
        });
    }
    
    //begin:cookie
    function cookie() {
        var cookieUtil = {
            get: function (name, subName) {
                var subCookies = this.getAll(name);
                if (subCookies) {
                    return subCookies[subName];
                } else {
                    return null;
                }
            },
            getAll: function (name) {
                var cookieName = encodeURIComponent(name) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = null,
                result = {};
                if (cookieStart > -1) {
                    var cookieEnd = document.cookie.indexOf(";", cookieStart)
                    if (cookieEnd == -1) {
                        cookieEnd = document.cookie.length;
                    }
                    cookieValue = document.cookie.substring(cookieStart + cookieName.length, cookieEnd);
                    if (cookieValue.length > 0) {
                        var subCookies = cookieValue.split("&");
                        for (var i = 0, len = subCookies.length; i < len; i++) {
                            var parts = subCookies[i].split("=");
                            result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
                        }
                        return result;
                    }
                }
                return null;
            },
            set: function (name, subName, value, expires, path, domain, secure) {
                var subcookies = this.getAll(name) || {};
                subcookies[subName] = value;
                this.setAll(name, subcookies, expires, path, domain, secure);
            },
            setAll: function (name, subcookies, expires, path, domain, secure) {
                var cookieText = encodeURIComponent(name) + "=";
                var subcookieParts = new Array();
                for (var subName in subcookies) {
                    if (subName.length > 0 && subcookies.hasOwnProperty(subName)) {
                        subcookieParts.push(encodeURIComponent(subName) + "=" + encodeURIComponent(subcookies[subName]));
                    }
                }
                if (subcookieParts.length > 0) {

                    cookieText += subcookieParts.join("&");
                    if (expires instanceof Date) {

                        cookieText += ";expires=" + expires.toGMTString();
                    }
                    if (path) {
                        cookieText += ";path=" + path;
                    }
                    if (domain) {
                        cookieText += ";domain=" + domain;
                    }
                    if (secure) {
                        cookieText += ";secure";
                    }
                } else {

                    cookieText += ";expires=" + (new Date(0)).toGMTString();
                }
                document.cookie = cookieText;
            },
            unset: function (name, subName, path, domain, secure) {
                var subcookies = this.getAll(name);
                if (subcookies) {
                    delete subcookies[subName];
                    this.setAll(name, subcookies, null, path, domain, secure);
                }
            },
            unsetAll: function (name, path, domain, secure) {
                this.setAll(name, null, new Date(0), path, domain, secure);
            }
        };
        return cookieUtil;
    }
    //end:cookie

    function getToken() {
        var data = cookie().getAll("data");
        return data != null ? data.token : "";
    }

    function gridDataSource(dataSource) {
        dataSource.error = function (e) {
             if (e.status == 401) {
                location.href = service.loginUrl;
            }else{
            	
            }
         };        
         return dataSource;
    }

    function getBasicData(){   
    	if(window.global_basicData){ 
    		return window.global_basicData;
    	}
    	$.ajax({
    		url:'/common/basicData/all',
    		async:false,
    		success:function(response){
    			window.global_basicData=response;    			
    		}
    	});
    	return window.global_basicData;
    }
    
    function getBasicDataDesc(id){
    	var data=$linq(common.getBasicData())
		.where(function(x){return x.id==id;}).firstOrDefault();    	
    	if(data){
    		return data.description;
    	}else{
    		return "";
    	}
    }
    
    function getBacicDataByIndectity(identity){
    	var data = $linq(this.getBasicData())
   		.where(function(x){return x.identity==identity&&x.pId==identity;})
   		.toArray();
    	if(data){
    		return data;
    	}else{
    		return "";
    	}
    }
    
    function toDate(dateStr){
    	if(dateStr){
   			return new Date(dateStr);
   		 }else{
   			 return null;
   		 }
    }
    
    function toMoney(money){
    	if(money){
  			 return money;
  		 }else{
  			 return 0;
  		 }
    }
    function formatDate(dateStr){
    	if(dateStr){
    		return kendo.toString(new Date(dateStr),"yyyy-MM-dd");
    	}else{
    		return null;
    	}
    	
    }
    function formatDateTime(dateStr){
    	if(dateStr){
    		return kendo.toString(new Date(dateStr),"yyyy-MM-dd HH:mm:ss");
    	}else{
    		return null;
    	}
    	
    }
    function basicDataConfig(){
    	return {
    		uploadSize:10485760,//本地文件上传大小限制
    		
    		processState_waitQianShou:"processState_1",//等待签收
    		processState_qianShou:"processState_2",//已签收
    		processState_banJie:"processState_7",//已办结
    		processState_tuiWen:"processState_11",//已退文
    		
    		projectShenBaoStage:"projectShenBaoStage",//申报阶段
    		projectShenBaoStage_nextYearPlan:"projectShenBaoStage_7",//下一年度计划
    		
    		projectCategory:"projectCategory",//项目类别
    		projectCategory_A:"projectCategory_1",//A类
    		projectCategory_B:"projectCategory_2",//B类
    		projectCategory_C:"projectCategory_3",//C类
    		projectCategory_D:"projectCategory_4",//D类
    		
    		projectClassify:"projectClassify",//项目分类
    		projectClassify_ZF:"projectClassify_1",//政府投资项目分类
    		projectClassify_SH:"projectClassify_2",//社会投资项目分类
    		
    		projectConstrChar:"projectConstrChar",//项目建设性质
    		projectConstrChar_qianqi:"projectConstrChar_1",//前期
    		projectConstrChar_xinkaigong:"projectConstrChar_2",//新开工
    		projectConstrChar_xujian:"projectConstrChar_3",//续建
    		
    		projectFunctionClassify:"projectFunctionClassify",//功能分类科目
    		projectGoverEconClassify:"projectGoverEconClassify",//政府经济分类科目
    		
    		projectInvestmentType:"projectInvestmentType",//项目投资类型
    		projectInvestmentType_ZF:"projectInvestmentType_1",//政府投资
    		projectInvestmentType_SH:"projectInvestmentType_2",//社会投资
    		
    		projectIndustry:"projectIndustry",//项目行业
    		projectIndustry_ZF:"projectIndustry_1",//政府投资项目行业
    		projectIndustry_SH:"projectIndustry_2",//社会投资项目行业
    		projectInvestmentType:"projectInvestmentType",//投资类型
    		projectProgress:"projectProgress",//项目进度
    		projectStage:"projectStage",//项目阶段
    		projectType:"projectType",//项目类型
    		
    		approvalType:"approvalType",//批复类型
    		unitProperty:"unitProperty",//单位性质
    		area:"area",//行政区划
    		area_GM:"area_1",//光明新区
    		capitalOtherType:"capitalOtherType",//资金其他来源分类
    		
    		taskType:"taskType",//任务类型
    		taskType_monthReport:"taskType_1",//任务类型-月报
    		taskType_yearPlan:"taskType_2",//任务类型-下一年度计划
    		taskType_sendMesg:"taskType_3",//任务类型-发送短信
    			
    		management:"管理员"
    		
    		
    	};
    }
    
    function checkLength(obj,max,id){
    	if(obj){
    		var length = obj.length;
    		if(length>max){
    			$("#"+id).html("<font size='5'>"+0+"</font>");
    		}else if(length<=max){
    			$("#"+id).html("<font size='5'>"+(max-length)+"</font>");
    		}
    	}else{
    		$("#"+id).html("<font size='5'>"+max+"</font>");
    	}
    }

    //init
    init();
    function init() {
    	
    	//begin#grid 处理
    	//全选
        $(document).on('click', '#checkboxAll', function () {
            var isSelected = $(this).is(':checked');
            $('.grid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });
        //点击行，改变背景
        $('body').on('click', '.grid tr', function (e) {
            $(this).parent().find('tr').removeClass('selected');
            $(this).addClass('selected');
            //$(this).find('td:nth-child(1)').find('input').prop('checked', true);
            //$(this).find('td:nth-child(2)').find('input').prop('checked', true);
        })
        
        //end#grid 处理
        
    }

})();
;(function () {
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
            //需要填报项目列表页面
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
	            url: '/projectMonthReportInfoFill/:projectId/:year/:month',
	            templateUrl:'/shenbaoAdmin/projectMonthReport/html/fillInfo',           
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
	            url: '/shenbao_record_edit/:id/:projectInvestmentType/:stage', 
	            templateUrl: '/shenbaoAdmin/shenbao/html/edit.html',
	            controller: 'shenbaoCtrl',
	            controllerAs: 'vm'
	        });
/**********************************************end#项目申报*********************************/	        
    }]);
    
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', index);

    index.$inject = ['$location','$state','indexSvc']; 

    function index($location , $state,indexSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};
        vm.monthReportId = $state.params.monthReportId;
        vm.page="index";
                       
       function init(){
    	   //任务流程列表
           if($state.current.name=='task'){
           	vm.page='taskList';
           }
           //月报详情
           if($state.current.name=='monthReportDetails'){
           	vm.page='monthReportDetails';
           }
           //修改密码
           if($state.current.name=='accountPwd'){
           	vm.page='changePwd';
           }
                     
	       vm.formatDate=function(str){
	  			return common.formatDate(str);
	  			};
	       vm.formatDateTime=function(str){
	  			return common.formatDateTime(str);
	  			};
	   	   vm.getBasicDataDesc=function(str){
	  			return common.getBasicDataDesc(str);
	  			};	   
	   	   vm.taskType_yearPlan=common.basicDataConfig().taskType_yearPlan;
	   	   vm.taskType_monthReport=common.basicDataConfig().taskType_monthReport;	   	   	   	      	   
       }

              
        activate();
        function activate() {
        	init();
        	if(vm.page=='index'){
        		page_index();    
  	   	   	}
        	if(vm.page == 'taskList'){
        		page_task();
 	   	   	}
        	if(vm.page == 'monthReportDetails'){
        		page_monthReportDetails();
        	}
        	if(vm.page == 'changePwd'){
        		page_changePwd();
        	}
        }
        
       function page_index(){
    	   indexSvc.getTask(vm);//获取最新动态
		   indexSvc.getUnitShenBaoInfos(vm);//获取单位申报信息
       }
       
       function page_task(){
    	   indexSvc.taskList(vm);//获取当前用户的动态
       }
       
       function page_changePwd(){
    	   vm.changePwd = function(){
    		   indexSvc.changePwd(vm);//修改密码 
    	   };  	  
       }
       
       function page_monthReportDetails(){
    	   indexSvc.getMonthReportById(vm);//获取月报信息
       }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = ['$http'];	

	function index($http) {	
		var url_task="/shenbaoAdmin/task";
		var url_unitShenBao="/shenbaoAdmin/shenbao";
		var url_account_password="/account/password";
		var url_monthReport = "/shenbaoAdmin/projectMonthReport";
		var url_project = "/shenbaoAdmin/project";
		var url_login = "/";
		var service = {
			getTask:getTask, //获取任务最新动态
			getUnitShenBaoInfos:getUnitShenBaoInfos,//获取单位申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			taskList:taskList,//任务流程列表
			changePwd:changePwd//修改密码
		};		
		return service;
		
		/**
		 * 根据id获取项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.model.monthReport.projectId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.project= response.data.value[0]||{};
				//项目类型的显示
				if(vm.model.project.projectType != ""){
					vm.model.project.projectType = vm.model.project.projectType.split(",");
				}else{
					vm.model.project.projectType =[];
				}				
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 根据id获取月报信息
		 */
		function getMonthReportById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_monthReport + "?$filter=id eq '{0}'", vm.monthReportId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.monthReport= response.data.value[0]||{};
				getProjectById(vm);//根据关联的项目id获取项目信息
				//处理数据
				vm.model.monthReport.beginDate = common.formatDate(vm.model.monthReport.beginDate);
				vm.model.monthReport.endDate = common.formatDate(vm.model.monthReport.endDate);
				//上传文件类型
				vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 修改密码
		 */
		function changePwd(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				var httpOptions = {
					method : 'put',
					url : url_account_password,
					data : vm.model.password
				};

				var httpSuccess = function success(response) {

					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {

							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									//跳转到登录页面进行重新登录
									location.href=url_login;
								}
							});
						}

					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

			} else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		
		/**
		 * 任务流程列表
		 */
		function taskList(vm){
			//begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_task),
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource
			// Begin:column
			var columns = [					
					{
						field : "title",
						title : "名称",
						template:function(item){
							if(item.taskType == vm.taskType_yearPlan){
								return common.format('<a href="#/shenbao_record/{0}">{1}</a>',item.relId,item.title);
							}else if(item.taskType == vm.taskType_monthReport){
								return common.format('<a href="#/monthReportDetails/{0}">{1}</a>',item.relId,item.title);
							}							
						},
						width:305,
						filterable : false						
					},
					{
						field : "processSuggestion",
						title : "信息",
						width:441,
						template:function(item){
							return common.format('<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:441px;" title="{0}">{0}</span>',item.processSuggestion);
						},
						filterable : false
					},
					{
						field : "processState",
						title : "状态",
						template:function(item){
							return common.getBasicDataDesc(item.processState);
						},
						width:210,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建时间",
						width:165,
						template:function(item){
							return common.formatDateTime(item.createdDate);
						},
						filterable : false
					}
			];
			// End:column
			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}
		
		/**
		 * 获取单位项目申报信息
		 */
		function getUnitShenBaoInfos(vm){
			var httpOptions = {
					method : 'get',
					url : url_unitShenBao+"/unit"
				};

			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value;	
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 获取当前用户任务最新动态
		 */
		function getTask(vm){
			var httpOptions = {
					method : 'get',
					url : url_task+"?$orderby=createdDate desc"
				};

			var httpSuccess = function success(response) {
				vm.model.task = response.data.value;
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 查询申报的项目信息
		 */
		function getDeclareProjects(vm){
			var httpOptions = {
					method : 'get',
					url : declareProjects
				};

				var httpSuccess = function success(response) {
					vm.modelLists = response.data.value;
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 查询操作记录的信息
		 */
		function getOprationRecords(vm){
			var httpOptions = {
					method : 'get',
					url : common.format("{0}?filter=userId eq '{1}'",oprationRecords,global_userName)
				};

				var httpSuccess = function success(response) {
					vm.modelOprationLists = response.data.value;
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		//begin#getArticle
		function getArticle(vm,type){
			var httpOptions = {
					method : 'get',
					url : user_article+type+'.js',
					data : vm.model
				};

				var httpSuccess = function success(response) {
					vm["article_"+type]=response.data;
					if(type=="announcement"){
						vm.articles=response.data;
					}
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

		}
		//end#getArticle								
	}			
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('deptInfoMaintainCtrl', deptInfoMaintain);

    deptInfoMaintain.$inject = ['$location','deptInfoMaintainSvc']; 

    function deptInfoMaintain($location, deptInfoMaintainSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.page = "index";
        
        function init(){
	    	//基础数据--单位性质
	        vm.basicData_unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);        	
	        //基础数据--行政区划街道
	        vm.basicData_area_Street=$linq(common.getBasicData())
									.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
									.toArray();
        }
               
        activate();
        function activate() {
        	init();
        	if(vm.page == 'index'){
        		page_index();
        	}
        }
        
        function page_index(){
        	deptInfoMaintainSvc.getDeptInfo(vm);//获取单位的基本信息
        	
        	vm.submit=function(){
            	deptInfoMaintainSvc.save(vm);//保存单位基本信息
            };
        }
    }
})();;(function() {
	'use strict';

	angular.module('app').factory('deptInfoMaintainSvc', deptInfoMaintain);

	deptInfoMaintain.$inject = [ '$http','$compile' ];	
	function deptInfoMaintain($http,$compile) {	
		var url_userUnitInfo = "/shenbaoAdmin/userUnitInfo";
			
		var service = {
			getDeptInfo : getDeptInfo,
			save:save
		};		
		return service;	
		
		//begin#save
		function save(vm){
			//验证表单信息
			common.initJqValidation();
			var isValid = $('form').valid();
			//验证通过
			if(isValid){
				vm.isSubmit = true;
				
				var httpOptions = {
						method : 'post',
						url : url_userUnitInfo,
						data : vm.model
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									location.reload();
								}
							});
						}
					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			}		
		}
		
		/**
		 * 获取单位的基本信息
		 */
		//begin#getDeptInfo
		function getDeptInfo(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnitInfo
				};
			
			var httpSuccess = function success(response) {					
				vm.model=response.data.value[0] || {};
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
	}
})();;(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('projectMonthReportCtrl', projectMonthReport);

    projectMonthReport.$inject = ['$location','projectMonthReportSvc','$state','$scope']; 

    function projectMonthReport($location, projectMonthReportSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};        
        vm.page='list';
        vm.init=function(){
        	vm.projectId = $state.params.projectId;
            vm.month = $state.params.month;
            vm.year=$state.params.year;
            vm.processState=$state.params.processState;
            if(vm.projectId){
            	vm.page='selectMonth';
            }
            if(vm.month){
            	vm.page='fillReport';
            }
            
            vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
            };
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='selectMonth'){
        		page_selectMonth();        		
        	}
        	
        	if(vm.page=='fillReport'){//如果填报信息
        		//查询基础数据
        		page_fillReport();        		
        	}  
        }
        
       function page_list(){      
    	   projectMonthReportSvc.grid(vm);
        }//end page_list
        
       function page_selectMonth(){
        	projectMonthReportSvc.getProjectById(vm);//获取项目的基本信息
        	
        	 var date=new Date();
        	 vm.submitYear=date.getFullYear();
        	 vm.submitYearMonth={};
        	 vm.tuiwenYearMonth={};
        	 vm.monthRow1=['一月','二月','三月','四月','五月','六月'];
        	 vm.monthRow2=['七月','八月','九月','十月','十一月','十二月'];
        	 //当填报年份发生变化时触发
        	 vm.setMonthSelected=function(){
        		//将月份暂时全部设为未填状态
        		 for (var i =1; i <= 12; i++) {
            		 vm.submitYearMonth['m'+i]=false;
            		 vm.tuiwenYearMonth['m'+i]=false;
    			}
        		
        		//获取项目当前年份现有月报
        		 var monthReports=$linq(vm.model.projectInfo.monthReportDtos)
     		 		.where(function(x){return x.submitYear==vm.submitYear;});
        		//设置按钮状态
        		 monthReports.foreach(function(x){
        			 if(x.processState != null){//有状态则代表已有填写月报
        				 if(x.processState == common.basicDataConfig().processState_tuiWen){//如果为退文状态
        					 vm.tuiwenYearMonth['m'+x.submitMonth]=true;
        				 }else{//如果为其他状态
        					 vm.submitYearMonth['m'+x.submitMonth]=true;
        				 }
        			 }
        		 });
        	 };
        	 //月份按钮被触发
        	 vm.fillReport = function(month){
        		//跳转到月报信息填写页面
               	location.href = "#/projectMonthReportInfoFill/"+vm.projectId+"/"+vm.submitYear+"/"+month;	
			};
        }//end page_selectMonth
        
        function page_fillReport(){ 
        	//begin#init
        	vm.model.monthReport={};
        	
        	//begin#下拉选择年份
     	   vm.years=[];
     	   vm.currentYear=(new Date()).getFullYear();     	   
     	   vm.years.push(vm.currentYear);
     	   for(var i=1;i<=5;i++){
     		   vm.years.push(vm.currentYear+i);
     		   vm.years.push(vm.currentYear-i);
     	   }
     	  vm.years=vm.years.sort();
     	  //end#下拉选择年份
     	  
     	  vm.model.monthReport.proposalsYear=vm.currentYear;
     	  vm.model.monthReport.reportYear=vm.currentYear;
     	  vm.model.monthReport.allEstimateYear=vm.currentYear;
     	  
     	 projectMonthReportSvc.getProjectById(vm);
     	 
     	   //begin#提交月报
     	  vm.submit = function(){
          	projectMonthReportSvc.submitMonthReport(vm);
          };
     	  
     	  //begin#ng-include load后触发
     	 vm.page_fillReport_init=function(){
     		 
     		 vm.uploadSuccess=function(e){
     			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.model.monthReport.attachmentDtos){
	           				 vm.model.monthReport.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.model.monthReport.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
     		 };
     		 
     		vm.onSelect=function(e){
       			$.each(e.files, function (index, value) {
       	            if(value.size > common.basicDataConfig().uploadSize){
       	            	$scope.$apply(function(){
       		   				common.alert({
       			        		vm : vm,
       							msg : "上传文件过大！"
       			            });	
       	          		 });
       	            }
       	            
       	        });
       		};
       		
       		vm.uploadOptions={
       				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
       				error:vm.uploadSuccess,	   				
       				localization:{select:'上传文件'},
       				showFileList:false,
       				multiple:true,
       				validation: {
       	                maxFileSize: common.basicDataConfig().uploadSize
       	            },
       	            select:vm.onSelect
       		};
     	 };//end init_page_fillReport
     	 
     	
   		
   		
     	 
     	//begin#删除文件
         vm.delFile=function(idx){
        	 vm.model.monthReport.attachmentDtos.splice(idx,1);
         };
                 
       //begin#创建问题和删除问题
     	vm.createProblem=function(){
        	if(vm.model.monthReport.monthReportProblemDtos){
        		vm.model.monthReport.monthReportProblemDtos.push({problemIntroduction:'',solutionsAndSuggest:''});
        	}else{
        		vm.model.monthReport.monthReportProblemDtos=[{problemIntroduction:'',solutionsAndSuggest:''}];
        	}
        };
     	
     	 vm.deleteProblem = function(idx){
     		vm.model.monthReport.monthReportProblemDtos.splice(idx,1);        	
          };
     	 //begin#基础数据
     	 //批复类型
     	vm.basicData_approvalType=common.getBacicDataByIndectity(common.basicDataConfig().approvalType);
     	//项目进度
     	vm.basicData_projectProgress=common.getBacicDataByIndectity(common.basicDataConfig().projectProgress);
     		    	
     	//begin#上传类型
     	vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];    	
      }//page_fillReport
    }
})();;(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {
		var url_project = "/shenbaoAdmin/project/unitProject";
		var url_basicData = "/common/basicData";//获取基础数据
		var url_projectMonthReport="/shenbaoAdmin/projectMonthReport";
		var url_userUnitInfo="/shenbaoAdmin/userUnitInfo";
		
		var service = {
			grid : grid,
			submitMonthReport:submitMonthReport,
			getProjectById:getProjectById
			
		};		
		return service;	
		
		/**
		 * 查询项目数据
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}' ", vm.projectId)
				};
				var httpSuccess = function success(response) {					
					vm.model.projectInfo = response.data.value[0]||{};
										
					if(vm.page=='selectMonth'){//如果为月份选择页面
						vm.setMonthSelected();//设置月份选择按钮的状态
					}
					if(vm.page=='fillReport'){//如果为月报填报页面
						//vm.isReportTuiWen = false; 此块用于月报的退文（暂时不需要）
						//判断是否有月报
						var report=$linq(vm.model.projectInfo.monthReportDtos)
											.where(function(x){return x.submitYear==vm.year && x.submitMonth==vm.month;})
											.toArray();
						if(report.length>0){//有月报
							vm.isReportExist=true;
							for (var i = 0; i < report.length; i++) {
								if(report[i].isLatestVersion == true){
									vm.model.monthReport=report[i];
								}
							}
							
							//TODO 此块用于月报的退文（暂时不需要）
//							if(vm.model.monthReport.processState == common.basicDataConfig().processState_tuiWen){//如果是退文
//								vm.isReportExist=false;
//								vm.isReportTuiWen = true;
//		        			}
						}else{//没有月报
							vm.isReportExist=false;
						}
						//关联上项目
						vm.model.monthReport.projectId=vm.model.projectInfo.id;
						vm.model.monthReport.projectNumber=vm.model.projectInfo.projectNumber;
						vm.model.monthReport.projectRepName=vm.model.projectInfo.projectRepName;
						vm.model.monthReport.projectRepMobile=vm.model.projectInfo.projectRepMobile;
						//项目开工以及竣工日期的获取
						vm.model.monthReport.beginDate=common.formatDate(vm.model.projectInfo.beginDate);
						vm.model.monthReport.endDate=common.formatDate(vm.model.projectInfo.endDate);
						//项目相关资金获取
						vm.model.monthReport.invertPlanTotal=common.toMoney(vm.model.projectInfo.projectInvestSum);//项目总投资
						vm.model.monthReport.actuallyFinishiInvestment=common.toMoney(vm.model.projectInfo.projectInvestAccuSum);//累计完成投资
						//资金处理
						vm.model.monthReport.releasePlanTotal = common.toMoney(vm.model.monthReport.releasePlanTotal);//截止上年底累计下达计划
						vm.model.monthReport.thisYearPlanInvestment=common.toMoney(vm.model.monthReport.thisYearPlanInvestment);//本年度计划完成投资
						vm.model.monthReport.thisYearPlanHasInvestment=common.toMoney(vm.model.monthReport.thisYearPlanHasInvestment);//本年度已下达计划
						vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);				
						vm.model.monthReport.thisMonthPlanInvestTotal=common.toMoney(vm.model.monthReport.thisMonthPlanInvestTotal);//本月计划完成投资
						vm.model.monthReport.thisMonthInvestTotal=common.toMoney(vm.model.monthReport.thisMonthInvestTotal);//本月完成投资
						vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);//本年度已完成投资						
						vm.model.monthReport.firstQuarCompInvestment=common.toMoney(vm.model.monthReport.firstQuarCompInvestment);//1到3月份完成投资
						vm.model.monthReport.secondQuarCompInvestment=common.toMoney(vm.model.monthReport.secondQuarCompInvestment);//1到6月份完成投资
						vm.model.monthReport.thirdQuarCompInvestment=common.toMoney(vm.model.monthReport.thirdQuarCompInvestment);//1到9月份完成投资
						vm.model.monthReport.fourthQuarCompInvestment=common.toMoney(vm.model.monthReport.fourthQuarCompInvestment);//1到12月份完成投资
					}		
					
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		/**
		 * 提交项目月报信息到数据库
		 */
		function submitMonthReport(vm){
			//验证表单信息
			common.initJqValidation();
			var isValid = $('form').valid();
			//验证通过
			if(isValid){				
				vm.model.monthReport.submitYear=vm.year;
				vm.model.monthReport.submitMonth=vm.month;
				vm.model.monthReport.projectId=vm.projectId;
				vm.isSubmit = true;
				var httpOptions = {
						method : 'post',
						url : url_projectMonthReport,
						data : vm.model.monthReport
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									location.reload();
								}
							});
						}

					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			}			
		}
		
		/**
		 * 月报列表页数据查询以及列表设计（申报的项目）
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:[{
					field:'isMonthReport',
					operator:'eq',
					value:true
				},{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);
						}
					},
					{
						field : "projectStage",
						title : "项目阶段",
						width : 150,
						filterable : false,
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						}
					},
					{
						field : "projectClassify",
						title : "项目分类",
						width : 150,
						filterable : false,
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						}
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,"vm.del('" + item.id + "')");
						}

					}

			];
			// End:column
			//TODO 此块用于月报的退文（暂时不需要）
//			var dataBound = function(e){
//				var dataSource = e.sender._data;
//				for(var i=0;i<dataSource.length;i++){
//					var model = dataSource[i];
//					var monthReports = model.monthReportDtos;
//					var number = 0;
//					for(var j=0;j<monthReports.length;j++){
//						var monthReport = monthReports[j];
//						if(monthReport.processState == common.basicDataConfig().processState_tuiWen){//如果是退文
//							number += 1;
//						}
//					}
//					if(number>0){
//						$("#tuiwenNumber"+model.id).html(number);//添加提示徽章
//					}
//				}
//			}

			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
//				dataBound:dataBound,
				resizable : true
			};

		}// end fun grid

	}
	
	
	
})();;(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('projectCtrl', project);

    project.$inject = ['$location','projectSvc','$state','$scope']; 

    function project($location, projectSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = "新增项目";
        vm.id=$state.params.id;//请求中的id参数
        vm.projectInvestmentType=$state.params.projectInvestmentType;//请求中的projectInvestmentType参数
        vm.model={};
        vm.basicData={};
        vm.page='list';
        
        vm.init=function(){
        	if($state.current.name=='projectEdit'){
    			vm.page='create';
    		}
    		if(vm.id){
    			vm.page='update';
    		}
    		if($state.current.name=='project_projectInfo'){
            	vm.page='projectInfo';
            }

    		vm.getBasicDataDesc = function(str){
    			return common.getBasicDataDesc(str);
    		};
    		
    		vm.checkLength = function(obj,max,id){
    			 common.checkLength(obj,max,id);
    		};
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='create'){
        		//初始化CheckBox
        		vm.model.projectType =[];
        		//新增
        		page_create();        		
        	}
        	if(vm.page=='update'){
        		//编辑
        		page_create(); 
        		page_update();        		
        	}
        	if(vm.page=='projectInfo'){
        		//查询项目信息
        		page_projectInfo();
        	}
        }
        
       function page_list(){
    	   //加载单位项目信息列表
    	   projectSvc.grid(vm);
    	   //基础数据--项目投资类型
    	   vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
    	   //点击新增项目弹出模态框
    	   vm.addProject = function(){
    		  $("#myModal").modal({
			        backdrop: 'static',
			        keyboard:false  			  
    		  });
    		  vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目
    	   };
    	   //点击模态框确认按钮跳转不同的信息录入页面
    	   vm.confirmInvestmentType=function(){
    		   $(".modal-backdrop").remove();
    		   $location.path("/projectEdit//"+vm.model.projectInvestmentType);
    	   };
        }//end#page_list
       
       function page_create(){
    	   vm.model.projectInvestmentType = vm.projectInvestmentType;//项目投资类型用于数据收集
    	   if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
    		   //基础数据--项目分类
    		  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
	       		.toArray();
    		  //基础数据--行业归口
    		  vm.basicData.projectIndustry=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	       		.toArray();
 			  vm.isZFInvestment = true; 			  
 		   }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
 			  //基础数据--项目分类
 			  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
	       		.toArray();
 			  //基础数据--行业归口
 			 vm.basicData.projectIndustry=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
	       		.toArray();
 			 
 			vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		};
 			  vm.isSHInvestment = true;
 		   }
    	   
    	   	//设置单位信息
    	   	projectSvc.getUserUnit(vm);
    	   	
	   		//begin#基础数据	   		    	   		
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.capitalOther=common.getBacicDataByIndectity(common.basicDataConfig().capitalOtherType);//资金其他来源类型
	   		vm.basicData.area_Street=$linq(common.getBasicData())
			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
			.toArray();//获取街道信息
	   			   		
	   		//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.model.projectType.indexOf(id);
	        	if(index == -1){
	        		vm.model.projectType.push(id);
		       	}else{
		       		vm.model.projectType.splice(index,1);
		       	}	        	
	        };
	   		//end#基础数据
	   		
	   		//批复文件上传
	   		vm.uploadType=[['JYS','项目建议书批复'],['KXXYJBG','可行性研究报告批复'],['CBSJYGS','初步设计与概算批复']];
	   		//相关附件文件上传文件种类
	   		vm.relatedType=[['XMJYSPF','项目建议书文本'],['KXXYJBGPF','可行性研究报告文本'],['ZGSPFTZ','总概算及调整文本'],
	   						['HYJY','会议纪要'],['GHYJ','规划依据'],['SJXGT','设计效果图'],
	   						['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']];

	   		vm.uploadSuccess=function(e){
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.model.attachmentDtos){
	           				 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
	   		};
	   		
	   		//展示批复文件选择模态框
	   		vm.choseDocument = function(e){
	   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
        	   $("#documentRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
	   		}
	   		projectSvc.documentRecordsGird(vm);//查询批复文件
	   		
	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			$(".modal-backdrop").remove();
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	
   			    if(vm.model.attachmentDtos){
   				  vm.model.attachmentDtos.push({name:fileName,url:fileName,type:vm.pifuType});
   			    }else{
   				  vm.model.attachmentDtos=[{name:fileName,url:fileName,type:vm.pifuType}];
   			    }    			          		
	        }
	   		
	   		vm.onSelect=function(e){
	   			$.each(e.files, function (index, value) {
	   	            if(value.size > common.basicDataConfig().uploadSize){
	   	            	$scope.$apply(function(){
	   		   				common.alert({
	   			        		vm : vm,
	   							msg : "上传文件过大！"
	   			            });               			           			
	   	          		 });
	   	            }
	   	            
	   	        });
	   		};
	   		//批复文件上传配置
	   		vm.uploadOptions_pifu={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:false,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		//相关附件上传配置
	   		vm.uploadOptions={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		
	   		
	   		 vm.delFile=function(idx){
	           	 vm.model.attachmentDtos.splice(idx,1);
	            };
	   		 
	   		 vm.capitalTotal=function(){
	   			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
	   			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
	   			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
	   			 		+ (parseFloat(vm.model.capitalZYYS)||0 )
	   			 		+ (parseFloat(vm.model.capitalOther)||0) ;
	   		 };
		        
	   		 vm.create = function () {
	   			vm.model.projectType =vm.model.projectType.join(",");
	   		     projectSvc.createProject(vm);	   		     
	   		 };
       }//end#page_create
       
       function page_update(){
    	   vm.title = "编辑项目";
    	   projectSvc.getProjectById(vm);
   		
	   		vm.update = function(){
	   			vm.model.projectType =vm.model.projectType.join(",");
	   			projectSvc.updateProject(vm);
	   		};   	   		
       }//end#page_update
       
       function page_projectInfo(){
    	   $(".modal-backdrop").remove();
    	   projectSvc.getProjectById(vm);
    	   if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
 			  vm.isZFInvestment = true; 			  
 		   }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			  
 			  vm.isSHInvestment = true;
 		   }
    	 //相关附件文件上传文件种类
    	   vm.relatedType=[['XMJYSPF','项目建议书批复文件'],['KXXYJBGPF','可行性研究报告批复文件'],['ZGSPFTZ','总概算批复及调整文件'],
					['HYJY','会议纪要'],['GHYJ','规划依据'],['SJXGT','设计效果图'],
					['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']];
       }//end#page_projectInfo
		
    }
})();;(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = ['$http','$compile','$location'];	
	function project($http,$compile,$location) {
		var url_project = "/shenbaoAdmin/project/unitProject";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_back = "/project";
		var url_document="/shenbaoAdmin/replyFile";
		
		var service = {
			grid : grid,
			createProject:createProject,
			getUserUnit:getUserUnit,
			getProjectById:getProjectById,
			updateProject:updateProject,
			documentRecordsGird:documentRecordsGird
		};		
		return service;
		
		/**
		 * 更新项目信息
		 */		
		function updateProject(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				var httpOptions = {
					method : 'put',
					url : url_project,
					data : vm.model
				};

				var httpSuccess = function success(response) {
					vm.model.projectType =vm.model.projectType.split(",");
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									$location.path(url_back);		
								}
							});
						}

					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

			} else {
				vm.model.projectType =vm.model.projectType.split(",");
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}

		
		/**
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				
				//查询项目的所属单位的单位名称
			   	getProjectUnit(vm);
			   	
				//项目类型的处理--多选框回显					
				if(vm.model.projectType != "" && vm.model.projectType != null){
					vm.model.projectType = vm.model.projectType.split(",");
				}else{
					vm.model.projectType =[];
				}
				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				//资金处理
				vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
				vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
				vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
				vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
				vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算
				vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
				vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
				
				if(vm.page=='update'){
					if(vm.model.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资项目
						//项目行业归口
						var child = $linq(common.getBasicData()).where(function(x){return x.id==vm.model.projectIndustry}).toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();	
					}	        			        		
				}				
				if(vm.page=='projectInfo'){				
					//计算资金筹措总计
					vm.capitalTotal=function(){
			  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
			  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
			  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
			  			 		+ (parseFloat(vm.model.capitalZYYS)||0 )
			  			 		+ (parseFloat(vm.model.capitalOther)||0);
			  		 };						
				}
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "?$filter=userName eq '{0}'", vm.model.unitName)
				};
				var httpSuccess = function success(response) {
					vm.userUnit = response.data.value[0] || {};
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 获取当前登录用户用户的单位信息
		 */
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
				var httpSuccess = function success(response) {
					vm.userUnit = response.data.value[0] || {};
					vm.model.unitName = vm.userUnit.userName;
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 创建项目
		 */		
		function createProject(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;				
				var httpOptions = {
					method : 'post',
					url : url_project,
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									$location.path(url_back);//创建成功返回到列表页								
								}
							});
						}
					});
				};

				var error = function error(response){
					common.requestError({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作失败",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									vm.model.projectType =vm.model.projectType.split(",");						
								}
							});
						}
					});
					
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess,
					error : error
				});
			}else{//表单验证失败
				vm.model.projectType =vm.model.projectType.split(",");
			}
		}
	
		function documentRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_document),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='radio'  relId='{0}' name='checkbox'/>",
											item.fullName);
						},
						filterable : false,
						width : 40,
						title : ""
					},
					{
						field : "number",
						title : "文号",
						width:180,
						
						filterable : true
					},
					{
						field : "fullName",
						title : "文件名",
						width : 550,
						filterable : true
						
					}
					
			];
			// End:column

			vm.gridOptions_documentRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}

		/**
		 * 项目列表数据获取
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [				
					{
						field : "projectName",
						title : "项目名称",
						filterable : true,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);
						}
					},
					{
						field : "projectStage",
						title : "项目阶段",
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						},
						width : 150,
						filterable : false
					},
					{
						field : "projectClassify",
						title : "项目分类",
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						},
						width : 150,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.del('" + item.id + "')");
						}
					}

			];
			// End:column
			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid

	}	
})();;(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('shenbaoCtrl', shenbao);

    shenbao.$inject = ['$location','shenbaoSvc','$state','$scope']; 

    function shenbao($location, shenbaoSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;        
        vm.id=$state.params.id;//获取url上面的id参数
        vm.investmentType=$state.params.projectInvestmentType;//获取url上面的项目投资类型参数
        vm.stage=$state.params.stage;//获取url上面的申报阶段参数
        vm.model={}; 
        vm.basicData={};  
        vm.page='list';
        vm.title='申报信息录入';
        $scope.animationsEnabled = true;

        vm.init=function(){
        	if($state.current.name=='shenbao_edit'){//申报信息填写
    			vm.page='edit';
    		}
        	if($state.current.name=='shenbao_records'){//所有的申报信息记录
        		vm.page='records';
        	}
        	if($state.current.name=='shenbao_record'){//单条申报信息详情
        		vm.page='record';
        		$(".modal-backdrop").remove();//去除模态框跳转页面之后遗留背景色
        	}
        	if($state.current.name=='shenbao_record_edit'){//申报信息编辑
        		vm.page='record_edit';
        	}
        	vm.getBasicDataDesc = function(Str){
        		return common.getBasicDataDesc(Str);
        	};
        	
        	vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
        	};
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='edit'){
        		//编辑
        		page_edit();        		
        	}
        	if(vm.page=='records'){
        		//申报记录
        		page_records();
        	}
        	if(vm.page=='record'){
        		//申报信息详情
        		page_record();
        	}
        	if(vm.page=='record_edit'){
        		//申报信息编辑
        		vm.isRecordEdit = true;
        		vm.title = "申报信息编辑";
        		page_edit();
        		page_record();
        	}
        }
        
       function page_list(){
    	   //获取项目列表
    	   shenbaoSvc.grid(vm);
    	   
    	   //点击列表中的申报按钮
    	   vm.shenbaoBtn=function(id,projectInvestmentType,name){
	           	vm.projectId = id;//绑定项目id用于url
	           	vm.projectInvestmentType=projectInvestmentType;//绑定项目投资类型用于url
	           	vm.projectName=name;//绑定项目名称用于模态框显示
	           	vm.projectShenBaoStage='';//清空下拉选选中的值
	           	//基础数据--申报阶段用于模态框
	           	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);	   		
	   	   		//展示模态框
	           	 $('#myModal').modal('show');
           };
           
    	   //点击模态框的确认按钮
           vm.confirm = function(){
           	$(".modal-backdrop").remove(); //去掉模态框背面的阴影
           	location.href = "#/shenbao/"+vm.projectId+"/"+vm.projectInvestmentType+"/"+vm.projectShenBaoStage;
           };    	   
           
           //点击列表中的申报记录按钮
           vm.checkShenBaoRecords = function(projectNumber){
        	  //展示模态框
        	   $("#shenBaoRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.projectNumber = projectNumber;
        	 //根据项目代码查询项目的申报记录 	  
        	   vm.gridOptions_shenBaoRecords.dataSource.filter({
					field:'projectNumber',
					operator:'eq',
					value:vm.projectNumber
				});
        	   vm.gridOptions_shenBaoRecords.dataSource.read();
        	   //定义退文状态
        	   vm.processState = common.basicDataConfig().processState_tuiWen;
           };
           shenbaoSvc.projectShenBaoRecordsGird(vm);     
        }//end#page_list
       
       function page_edit(){
    	   //禁止点击Tab切换
		   document.getElementById("tab1").setAttribute("disabled","disabled");
		   document.getElementById("tab2").setAttribute("disabled","disabled");
		   document.getElementById("tab3").setAttribute("disabled","disabled");
		   document.getElementById("tab4").setAttribute("disabled","disabled");
    	   //判断tab显示
    	   var init_tab_show=function(){
    		   vm.isYearPlan=vm.stage==common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为下一年度计划
    		   if(vm.isYearPlan){
    			   //初始化项目材料清单
    			   vm.materialsType=[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],
	   					['TTJH','历年政府投资计划下大文件(*)'],['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],
	   					['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']];
    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
    		   }
    	   };
    	   init_tab_show();
    	   
    	   if(vm.page=='edit'){
   	  		 shenbaoSvc.getProjectById(vm); 
   		 	}	
    	   
    	   if(vm.investmentType == common.basicDataConfig().projectInvestmentType_ZF){//如果为政府投资
    		   vm.isZFInvestment = true; 
  			 	//基础数据--项目分类
    		   vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
	       		.toArray();
    		   //基础数据--行业归口
    		   vm.basicData.projectIndustry=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	       		.toArray();
    	   }else if(vm.investmentType == common.basicDataConfig().projectInvestmentType_SH){//如果为社会投资
    		   vm.isSHInvestment = true;
 			   //基础数据--项目分类
 			  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
	       		.toArray();
 			  //基础数据--行业归口
 			 vm.basicData.projectIndustry=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
	       		.toArray();
 			vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		};
    	   }
    	      	   
    	   //获取基础数据    	   	
    	   	vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段 	   		
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	   			   			       		   		
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质	   		
	   		//行政区划街道
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();   			   		
	   		//资金其他来源类型
	   		vm.basicData.capitalOther=common.getBacicDataByIndectity(common.basicDataConfig().capitalOtherType);

	   		//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.model.projectType.indexOf(id);
	        	if(index == -1){
	        		vm.model.projectType.push(id);
		       	}else{
		       		vm.model.projectType.splice(index,1);
		       	}	        	
	        };
	      //展示批复文件选择模态框
	   		vm.choseDocument = function(e){
	   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
        	   $("#documentRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
	   		}
	   		shenbaoSvc.documentRecordsGird(vm);//查询批复文件
	   		
	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			$(".modal-backdrop").remove();
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	
   			    if(vm.model.attachmentDtos){
   				  vm.model.attachmentDtos.push({name:fileName,url:fileName,type:vm.pifuType});
   			    }else{
   				  vm.model.attachmentDtos=[{name:fileName,url:fileName,type:vm.pifuType}];
   			    }    			          		
	        }
    	  
	   		//文件上传
    	   vm.uploadSuccess=function(e){
   			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.model.attachmentDtos){
	           				 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
  		};
  		
  		vm.onSelect=function(e){
   			$.each(e.files, function (index, value) {
   	            if(value.size > common.basicDataConfig().uploadSize){
   	            	$scope.$apply(function(){
   		   				common.alert({
   			        		vm : vm,
   							msg : "上传文件过大！"
   			            });               			           			
   	          		 });
   	            }
   	            
   	        });
   		};
   		//批复文件上传配置
   		vm.uploadOptions_pifu={
   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
   				error:vm.uploadSuccess,	   				
   				localization:{select:'上传文件'},
   				showFileList:false,
   				multiple:false,
   				validation: {
   	                maxFileSize: common.basicDataConfig().uploadSize
   	            },
   	            select:vm.onSelect
   		};
   		//相关附件上传配置
   		vm.uploadOptions={
   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
   				error:vm.uploadSuccess,	   				
   				localization:{select:'上传文件'},
   				showFileList:false,
   				multiple:true,
   				validation: {
   	                maxFileSize: common.basicDataConfig().uploadSize
   	            },
   	            select:vm.onSelect
   		};
   		
    	   //删除上传文件
  		 vm.delFile=function(idx){
          	 vm.model.attachmentDtos.splice(idx,1);
  		 };
  		 	 
  		 //tab切换(上一步)
  		 vm.tabReturn = function(tabId){
    			var activeTab = $("#tab"+tabId);
				vm.tabStrip.activateTab(activeTab);
     		};
  		
  		 //tab切换(下一步)
  		 vm.tabChange = function(tabId){
     			//验证表单
     			common.initJqValidation();
    			var isValid = $('form').valid();
    			var activeTab = $("#tab"+tabId);
    			if(isValid){//通过则跳转到下一页面
    				vm.tabStrip.activateTab(activeTab);
    			}
     		};
  		
  		 //确认提交
    	vm.submit = function(){
    		vm.model.projectType =vm.model.projectType.join(",");
    		shenbaoSvc.createShenBaoInfo(vm);
    	};             
    }//end#page_edit
       
       function page_records(){
    	   shenbaoSvc.recordsGird(vm);
       }//end#page_records
       
       function page_record(){
    	   shenbaoSvc.getShenBaoInfoById(vm);//获取申报信息
    	   $(".modal-backdrop").remove();

    	   vm.update = function(){
    		   shenbaoSvc.updateShenBaoInfo(vm);
    	   };
       }//end#page_record
   }
})();;(function() {
	'use strict';

	angular.module('app').factory('shenbaoSvc', shenbao);

	shenbao.$inject = ['$http','$compile','$location'];	
	function shenbao($http,$compile,$location) {
		var url_project = "/shenbaoAdmin/project/unitProject";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_shenbao = "/shenbaoAdmin/shenbao";
		var url_back = "/shenbao_records";
		var url_document="/shenbaoAdmin/replyFile";
		
		var service = {
			grid : grid,//项目列表
			getProjectById:getProjectById,//根据id查询项目信息
			projectShenBaoRecordsGird:projectShenBaoRecordsGird,//根据项目代码查询项目申报信息列表
			createShenBaoInfo:createShenBaoInfo,//创建申报信息
			recordsGird:recordsGird,//所有的申报记录列表
			getShenBaoInfoById:getShenBaoInfoById,//根据id查询项目申报信息
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			documentRecordsGird:documentRecordsGird//批复文件列表
		};		
		return service;
		
		/**
		 * 根据项目代码查询项目的申报记录
		 */
		function getShenBaoRecordsByProjectNumber(vm,projectNumber,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=projectNumber eq '{0}'", projectNumber)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoRecords = response.data.value;
				if(vm.model.shenBaoRecords.length>0){
					var number = 0;
					for(var i=0;i<vm.model.shenBaoRecords.length;i++){
						var shenBaoRecord = vm.model.shenBaoRecords[i];
						if(shenBaoRecord.processState == common.basicDataConfig().processState_tuiWen){//如果是退文
							number += 1;
						}
					}
					if(number>0){
						$("#tuiwenNumber"+id).html(number);//添加提示徽章
					}
				}
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 查询申报记录列表
		 */
		function projectShenBaoRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),						
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}		
			});
			// End:dataSource
			// Begin:column
			var columns = [					
					{
						field : "projectName",
						title : "项目名称",
						width:200,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						filterable : false						
					},
					{
						field : "processState",
						title : "审批状态",
						width : 150,
						filterable : false,
						template:function(item){
							var processStateDesc=common.getBasicDataDesc(item.processState);
							var css='text-danger';
							return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
						}
					},
					{
						field : "projectShenBaoStage",
						title : "申报阶段",	
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectShenBaoStage);
						},
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",	
						width : 100,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 200,
						template : function(item) {					
							var isShow=item.processState==common.basicDataConfig().processState_waitQianShou
							   ||item.processState==common.basicDataConfig().processState_tuiWen;
							return common.format($('#columnBtns_Record').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none');
						}
					}
			];
			// End:column

			vm.gridOptions_shenBaoRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}
				
		/**
		 * 更新申报信息
		 */
		function updateShenBaoInfo(vm){		
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				if(vm.model.projectType != "" && vm.model.projectType != undefined){
					vm.model.projectType = vm.model.projectType.join(",");
				}else{
					vm.model.projectType ="";
				}
				var httpOptions = {
					method : 'put',
					url : url_shenbao,
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$(".modal-backdrop").remove();
									$location.path("/shenbao");
								}
							});
						}

					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

			} else {
				vm.model.projectType = vm.model.projectType.split(",");
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}//end#updateShenBaoInfo
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)
				};
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0]||{};
						//多选框回显						
						if(vm.model.projectType != ""){
							vm.model.projectType = vm.model.projectType.split(",");
						}else{
							vm.model.projectType =[];
						}
						//日期展示
						vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
						vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
						vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
						vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期						
						//资金处理
						vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
						vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
						vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
						vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
						vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
						vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
						vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
						vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算
						vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
						vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
						vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请年度投资
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.capitalOther)||0) ;
				  		 };
						if(vm.page=='record'){
							if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
								vm.isYearPlan = true;
								vm.materialsType=[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],
				   					['TTJH','历年政府投资计划下大文件(*)'],['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],
				   					['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']];
			    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
							}
						}
		        		if(vm.page=='record_edit' && vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){
		        			//项目行业归口
							var child = $linq(common.getBasicData()).where(function(x){return x.id==vm.model.projectIndustry}).toArray()[0];
			        		vm.model.projectIndustryParent=child.pId;
			        		vm.projectIndustryChange();			        	
		        		}									
								
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		
		/**
		 * 创建申报信息
		 */
		function createShenBaoInfo(vm){
			common.initJqValidation();
			var isValid=function(){
				var validFields=[
					['projectConstrChar','required','年度计划信息-项目建设性质必选'],
					['planYear','required','年度计划信息-计划年度必填'],
					['applyYearInvest','required','年度计划信息-申请年度投资必填'],
					['yearConstructionContent','required','年度计划信息-年度建设内容必填'],					
					['shenBaoUnitInfoDto.unitName','required','项目单位信息-单位名称必填'],
					['shenBaoUnitInfoDto.unitTel','required','项目单位信息-单位电话必填'],
					['shenBaoUnitInfoDto.unitEmail','required','项目单位信息-单位邮箱必填'],					
					['shenBaoUnitInfoDto.unitProperty','required','项目单位信息-单位性质必选'],
					['shenBaoUnitInfoDto.divisionId','required','项目单位信息-单位区域必选'],
					['shenBaoUnitInfoDto.unitAddress','required','项目单位信息-单位地址必填'],
					['shenBaoUnitInfoDto.unitResPerson','required','项目单位信息-单位负责人名称必填'],
					['shenBaoUnitInfoDto.resPersonTel','required','项目单位信息-单位负责人电话必填'],
					['shenBaoUnitInfoDto.resPersonMobile','required','项目单位信息-单位负责人手机必填'],
					['shenBaoUnitInfoDto.resPersonEmail','required','项目单位信息-单位负责人邮箱必填']					
				];
				vm.validMessage=[];
				$.each(validFields,function(idx,item){
					var value='';
					if(item[0].indexOf('.')>0){
						var fields=item[0].split('.');
						value=vm.model[fields[0]][fields[1]];
					}
					else{
						value=vm.model[item[0]];
					}
							
					var msg=item[2];					
					if(item[1]=='required'){				
						var isExist=value&&value.trim()!="";					
						if(!isExist){
							vm.validMessage.push(msg);
						}						
					}
					
				});
				if(vm.validMessage.length>0){
					$('#validMsgDialog').modal({
		                 backdrop: 'static',
		                 keyboard:false
		             });
				}else{
					return true;
				}												
			};
			
			if (isValid()) {
				vm.isSubmit = true;				
				var httpOptions = {
					method : 'post',
					url : url_shenbao,
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功,等待管理员签收！",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();									
									$location.path("/shenbao");
								}
							});
						}
					});
				};
				
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});			
			}else{
				vm.model.projectType = vm.model.projectType.split(",");
			}
		}
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "?$filter=userName eq '{0}'", vm.model.unitName)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoUnitInfoDto = response.data.value[0] || {};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
				
		/**
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				//获取项目单位信息
				getProjectUnit(vm);
				
				if(vm.page=='edit'){
					//多选框回显						
					if(vm.model.projectType != "" && vm.model.projectType !=undefined){
						vm.model.projectType = vm.model.projectType.split(",");
					}else{
						vm.model.projectType =[];
					}
					//日期展示
					vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
					vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
					vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
					vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
					vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期       										
					//资金处理
					vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
					vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
					vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
					vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
					vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
					vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
					vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
					vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算
					vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
					vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
					vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请年度投资
					//计算资金筹措总计
					vm.capitalTotal=function(){
			  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
			  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
			  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
			  			 		+ (parseFloat(vm.model.capitalZYYS)||0 )
			  			 		+ (parseFloat(vm.model.capitalOther)||0) ;
			  		 };
			  		//基础数据--行业归口
			  		  if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			 			  
			 			var child = $linq(common.getBasicData())
			 				.where(function(x){return x.id==vm.model.projectIndustry})
			 				.toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();
			 		   }							
					vm.model.projectId = vm.model.id;//申报信息中的字段数据录入
				}
				vm.model.projectShenBaoStage = vm.stage;//申报信息中的字段数据录入			
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 单位申报记录列表数据获取
		 */
		function recordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao+"/unit"),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource
			// Begin:column
			var columns = [					
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						filterable : true
						
					},
					{
						field : "processState",
						title : "审批状态",
						width : 150,
						filterable : false,
						template:function(item){
							var processStateDesc=common.getBasicDataDesc(item.processState);
							var css='text-danger';
							return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
						}
					},
					{
						field : "projectShenBaoStage",
						title : "申报阶段",	
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectShenBaoStage);
						},
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",	
						width : 100,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 150,
						template : function(item) {
							var isShow=item.processState==common.basicDataConfig().processState_waitQianShou
									   ||item.processState==common.basicDataConfig().processState_tuiWen;
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none');
						}
					}
			];
			// End:column

			vm.gridOptions_records = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//End recordsGird
		
		/**
		 * 项目最新版本列表数据获取
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [					
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);
						}
					},
					{
						field : "projectStage",
						title : "项目阶段",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						},
						filterable : false
					},
					{
						field : "projectClassify",
						title : "项目分类",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						},
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectName,item.projectNumber);
						}

					}

			];
			// End:column
			var dataBound = function(e){
				var dataSource = e.sender._data;
				for(var i=0;i<dataSource.length;i++){
					var model = dataSource[i];
					//根据项目代码获取其申报记录根据情况添加徽章
					getShenBaoRecordsByProjectNumber(vm,model.projectNumber,model.id);				
				}
			};


			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				dataBound:dataBound,
				resizable : true
			};

		}// end fun grid
		
		function documentRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_document),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='radio'  relId='{0}' name='checkbox'/>",
											item.fullName);
						},
						filterable : false,
						width : 40,
						title : ""
					},
					{
						field : "number",
						title : "文号",
						width:180,
						
						filterable : true
					},
					{
						field : "fullName",
						title : "文件名",
						width : 550,
						filterable : true
						
					}
					
			];
			// End:column

			vm.gridOptions_documentRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}


	}
})();