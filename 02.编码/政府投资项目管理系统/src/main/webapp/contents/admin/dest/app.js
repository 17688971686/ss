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
        basicDataConfig:basicDataConfig,//基础数据配置
        checkLength:checkLength,//检查输入文本域的字符长度
        uploadFileTypeConfig:uploadFileTypeConfig,//上传文件配置
        stringToArray:stringToArray,
        arrayToString:arrayToString,
        toDecimal4:toDecimal4
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
                    total: function (data) { return data.count; },
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
                };
            },
            noRecordMessage: {
			    template: '暂时没有数据.'
			  }
        };
    }

    function getKendoCheckId($id) {
        var checkbox = $($id).find('tr td:nth-child(1)').find('input:checked');
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
                    var cookieEnd = document.cookie.indexOf(";", cookieStart);
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
                var subcookieParts = [];
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
    	var data = $linq(getBasicData())
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
    		uploadSize:10485760,//本地文件上传大小限制(10M)
    		
    		processState:"processState",//审批状态
    		processState_waitQianShou:"processState_1",//等待签收
    		processState_qianShou:"processState_2",//已签收
    		processState_banJie:"processState_7",//已办结
    		processState_tuiWen:"processState_11",//已退文
    		
    		projectShenBaoStage:"projectShenBaoStage",//申报阶段
    		projectShenBaoStage_qianQi:"projectShenBaoStage_1",//前期
    		projectShenBaoStage_newStart:"projectShenBaoStage_3",//新开工
    		projectShenBaoStage_xuJian:"projectShenBaoStage_4",//续建
    		projectShenBaoStage_nextYearPlan:"projectShenBaoStage_7",//下一年度计划
    		projectShenBaoStage_projectProposal:"projectShenBaoStage_9",//项目建议书
    		projectShenBaoStage_KXXYJBG:"projectShenBaoStage_10",//可行性研究报告
    		projectShenBaoStage_CBSJYGS:"projectShenBaoStage_11",//初步设计与概算
    		projectShenBaoStage_junGong:"projectShenBaoStage_6",//竣工决算
    		
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
    		projectConstrChar_chubei:"projectConstrChar_4",//储备类
    		
    		projectFunctionClassify:"projectFunctionClassify",//功能分类科目
    		projectGoverEconClassify:"projectGoverEconClassify",//政府经济分类科目
    		
    		projectInvestmentType:"projectInvestmentType",//项目投资类型
    		projectInvestmentType_ZF:"projectInvestmentType_1",//政府投资
    		projectInvestmentType_SH:"projectInvestmentType_2",//社会投资
    		
    		projectIndustry:"projectIndustry",//项目行业
    		projectIndustry_ZF:"projectIndustry_1",//政府投资项目行业
    		projectIndustry_SH:"projectIndustry_2",//社会投资项目行业
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
    		taskType_JYS:"taskType_4",//项目建议书
    		taskType_KXXYJBG:"taskType_5",//可行性研究报告
    		taskType_CBSJYGS:"taskType_6",//初步概算与设计
    		taskType_qianQi:"taskType_7",//前期
    		taskType_newStart:"taskType_8",//新开工
    		taskType_xuJian:"taskType_9",//续建

    		auditState:"auditState",//审核状态
    		auditState_noAudit:"auditState_1",//审核状态-未审核
    		auditState_auditPass:"auditState_2",//审核状态-审核通过
    		auditState_auditNotPass:"auditState_3",//审核状态-审核不通过
    			
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
    
    function uploadFileTypeConfig(){
    	return {
    		projectShenBaoStage_projectProposal:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['HYJY','会议纪要及依据 <span class="required">(*)</span>'],
    			['Project_ProPosal','项目建议书（需委托有相应资质的咨询机构按照规范编写）'],['other','其他资料']],
    		projectShenBaoStage_KXXYJBG:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['ProjectProPosalReply_Scanning','项目建议书（或前期工作计划）批复扫描件 <span class="required">(*)</span>'],
    			['KXXYJ_Report','项目可行性研究报告（包括项目建设、管养、招投标等内容）'],['GHXZProposal_Scanning','规划选址意见书扫描件'],['YDYS_Scanning','用地预审扫描件'],['HPPW_Scanning','环评批文扫描件'],
    			['other','其他资料']],
			projectShenBaoStage_CBSJYGS:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['ProjectProPosal_Reply','项目建议书（或前期工作计划）、可行性研究报告'],
				['CBSJYGS_Material','初步设计及项目总概算材料（项目单位需委托有相应资质的咨询机构编制项目总概算）'],['YDGHXKZ_Scanning','用地规划许可证扫描件'],['other','其他资料']]	,
			projectShenBaoStage_YearPlan:[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],['TTJH','历年政府投资计划下大文件  <span class="required">(*)</span>'],
				['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']],
			projectShenBaoStage_qianQi:[['ProjectBasis','项目依据  <span class="required">(*)</span>'],['other','其他']],
			projectShenBaoStage_newStart:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['BudgetReply_Scanning','概算批复扫描件 <span class="required">(*)</span>'],
				['GCGHXKZ_Scanning','工程规划许可证扫描件'],['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']],
			projectShenBaoStage_xuJian:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['LastYearPlanReply_Copy','上一年度计划批文复印件 <span class="required">(*)</span>'],
				['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']],
			projectEdit:[['XMJYSPF','项目建议书批复文本'],['KXXYJBGPF','可行性研究报告批复文本'],['ZGSPFTZ','总概算批复及调整文本'],['HYJY','会议纪要'],
				['GHYJ','规划依据'],['SJXGT','设计效果图'],['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']],
			projectShenBaoStage_junGong:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['LastYearPlanReply_Copy','上一年度计划批文复印件 <span class="required">(*)</span>'],
					['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']]
    	};
    }
    
    function stringToArray(str,substr){
    	if(str.constructor == Array){
    		return str;
    	}
    	var arrTmp=[];
    	if(str !=null && str != ""){
	       	 if(substr==""){
	       		 arrTmp.push(str); 
	       		 return arrTmp; 
	       	 } 
	       	 var i=0,j=0,k=str.length; 
	       	 while(i<k){ 
	       		 j=str.indexOf(substr,i); 
	       		 if(j!=-1){ 
	   	    		if(str.substring(i,j)!="") {
	   	    			arrTmp.push(str.substring(i,j)); 
	   	    		} 
	   	    	i = j+1; 
	       		 } else{
	       			 if(str.substring(i,k)!="") {
	       				 arrTmp.push(str.substring(i,k)); 
	       			 } 
	       		i=k; 
	       		 } 
	       	} 
    	}
    	 return arrTmp; 
    }
    
    function arrayToString(arr,str){
    	if(arr.constructor == String){
    		return str;
    	}
		 var strTmp="";
		 if(arr !=null && arr.length>0){
			 for(var i=0;i<arr.length;i++){ 
	    		 if(arr[i]!=""){ 
	    		  if(strTmp==""){ 
	    			  strTmp = arr[i]; 
	    		  } else { 
	    			  strTmp=strTmp+str+arr[i]; 
	    		  } 
	    		} 
	    	} 
		 }
    	return strTmp; 
    }

    function toDecimal4(x){
    	var f=parseFloat(x);
    	if(isNaN(f)){
    		return;
    	}
    	f=Math.round(x*10000)/10000;
    	return f;
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
        });
        
        //end#grid 处理
        
    }

})();
;(function () {
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
    
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('demoCtrl', demo);

    demo.$inject = ['$location','demoSvc']; 

    function demo($location, demoSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '';
        vm.tabActive=1;
        
        vm.tab=function(tabActive){
        	vm.tabActive=tabActive;        	
        };
        
        
        vm.showDialog=function(){
        	
        	 $('.myDialog').modal({
                 backdrop: 'static',
                 keyboard:false
             });
        };
        
        function datetimePicker(){
        	$("#datepicker").kendoDatePicker({
        		culture:'zh-CN'
        	});
        }
        
        function upload(){
        	 $("#files").kendoUpload({
                 async: {
                     saveUrl: "/demo/save",
                     removeUrl: "/demo/remove",
                     autoUpload: true
                 }
             });
        	 $("#files2").kendoUpload({
                 async: {
                     saveUrl: "/common/save",
                     removeUrl: "/common/remove",
                     autoUpload: true
                 },
                 showFileList:false,
                 select:function(e){
                	 console.log("select:");
                	 console.log(e);
                 },
                 error:function(e){
                	 console.log("error:");
                	 console.log(e);
                	 if(e.XMLHttpRequest.status==200){
                		 var fileName=e.XMLHttpRequest.response;
                		 alert("文件名："+fileName);
                	 }
                 },
                 localization: {
                     select: "选择文件"
                 }
             });
        }
        
        vm.setCookie=function(){
        	common.cookie().set('myCookie','userName',vm.cookie.userName);   
        	common.cookie().set('myCookie','password',vm.cookie.password);  
        };
        vm.getCookie=function(){
        	var value1=common.cookie().get('myCookie','userName');     
        	var value2=common.cookie().get('myCookie','password'); 
        	alert(common.format("用户名:{0},密码:{1}",value1,value2));
        };
        
        vm.textSubmit=function(){
        	alert(vm.content);
        };
        
        vm.init_select=function(){
        	vm.parentCategory="";
        	vm.childCategory="";
        	var basicData=common.getBasicData();
        	vm.parentList=$linq(basicData).where(function(x){return x.identity=='projectIndustry'&&x.pId=="";})
        							  .toArray();
        	vm.parentChange=function(){
        		vm.childList=$linq(basicData).where(function(x){return x.pId==vm.parentCategory;})
				  .toArray();
        	};
        };
        
       vm.popOver=function(e){
    	   vm.isPopOver=true;
    	   vm.popStyle={
    			   border:'1px solid #ccc',
    			   height:'200px',
    			   width:'120px',
    			   position:'absolute',
    			   background:'white',
    			   left:e.pageX+'px',
    			   top:e.pageY+'px'
    	   };  
    	   vm.content="内容";    	
       };
       
        activate();
        function activate() {
        	datetimePicker();
        	upload();
        	demoSvc.treeList(vm);
        	vm.init_select();        	
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('demoSvc', demo);

	demo.$inject = [ '$http' ];

	function demo($http) {
		var url_account_password = "/account/password";
		
		var service = {			
			upload : upload,
			treeList:treeList
		};

		return service;
		
		function treeList(vm){			
			var crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service";
			var dataSource={
                    transport: {
                        read:  {
                            url: crudServiceBaseUrl + "/EmployeeDirectory/All",
                            dataType: "jsonp"
                        }
                    },
                    schema: {
                        model: {
                            id: "EmployeeId",
                            parentId: "ReportsTo",
                            fields: {
                                EmployeeId: { type: "number", editable: false, nullable: false },
                                ReportsTo: { nullable: true, type: "number" },
                                FirstName: { validation: { required: true } },
                                LastName: { validation: { required: true } },
                                HireDate: { type: "date" },
                                Phone: { type: "string" },                               
                                BirthDate: { type: "date" },
                                Extension: { type: "number", validation: { min: 0, required: true } },
                                Position: { type: "string" }
                            }
                        }
                    }
			};
			var columns=[
                { field: "FirstName", title: "First Name", width: "150px" },
                { field: "LastName", title: "Last Name", width: "150px" },
                { field: "Position" },
                { title: "Location",
                  template: "{{ dataItem.City }}, {{ dataItem.Country }}"
                },
                { command: ["edit"] }
            ];
			vm.treelistOptions ={
					dataSource:dataSource,
					columns:columns
			};
                    
		}

		// begin#updatedemo
		function upload(vm) {
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
				// common.alert({
				// vm:vm,
				// msg:"您填写的信息不正确,请核对后提交!"
				// })
			}
		}
	}
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', home);

    home.$inject = ['$location','homeSvc']; 

    function home($location, homeSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '';
        
        vm.changePwd = function () {        	
        	 homeSvc.changePwd(vm);          
        };
        
        activate();
        function activate() {
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('homeSvc', home);

	home.$inject = [ '$http' ];

	function home($http) {
		var url_account_password = "/account/password";
		
		var service = {			
			changePwd : changePwd			
		};

		return service;
				
		// begin#updatehome
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
				// common.alert({
				// vm:vm,
				// msg:"您填写的信息不正确,请核对后提交!"
				// })
			}
		}
	}
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('logCtrl', log);

    log.$inject = ['$location','logSvc']; 

    function log($location, logSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '日志列表';
        

       
        activate();
        function activate() {
            logSvc.grid(vm);
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('logSvc', log);

	log.$inject = [ '$http','$compile' ];	
	function log($http,$compile) {	
		var url_log = "/log";
		var url_back = '#/log';
			
		var service = {
			grid : grid			
		};		
		return service;	
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_log),
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
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});

			// End:dataSource

			// Begin:column
			var columns = [
					  {
						field : "id",
						title : "ID",
						width : 80,						
						filterable : false
					},{
						field : "level",
						title : "级别",
						width : 100,
						filterable : true
					} ,{
						field : "message",
						title : "日志内容",
						filterable : false
					},{
						field : "userId",
						title : "操作者",
						width : 150,
						filterable : true
					}, {
						field : "createdDate",
						title : "操作时间",
						width : 180,
						filterable : false,
						format : "{0:yyyy/MM/dd HH:mm:ss}"

					}

			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
			
		}// end fun grid

		
		
		

	}
	
	
	
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('orgCtrl', org);

    org.$inject = ['$location','orgSvc']; 

    function org($location, orgSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '部门列表';
        

        vm.del = function (id) {       	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    orgSvc.deleteOrg(vm,id);
                 }
             });
        };
        
        vm.dels = function () {     
        	var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'               	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.del(idStr);
            } 
       };
       
        activate();
        function activate() {
            orgSvc.grid(vm);
        }
    }
})();
;(function () {
    'use strict';

    angular
        .module('app')
        .controller('orgEditCtrl', org);

    org.$inject = ['$location','orgSvc','$state']; 

    function org($location, orgSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '新增部门';
        vm.isorgExist=false;
        vm.id = $state.params.id;
        if (vm.id) {
            vm.isUpdate = true;
            vm.title = '更新部门';
        }
        
        vm.create = function () {
        	orgSvc.createOrg(vm);
        };
        vm.update = function () {
        	orgSvc.updateOrg(vm);
        };
        

        activate();
        function activate() {
        	if (vm.isUpdate) {
        		orgSvc.getOrgById(vm);
            } 
        }
    }
})();
;(function () {
    'use strict';

    angular
        .module('app')
        .controller('orgUserCtrl', org);

    org.$inject = ['$location','$state','orgSvc','orgUserSvc']; 

    function org($location,$state, orgSvc,orgUserSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.id = $state.params.id;
       
        
        vm.showAddUserDialog = function () {
        	$('.addUser').modal({
                backdrop: 'static',
                keyboard:false
            });
        	 vm.orgUserGrid.dataSource.read();
        };
        vm.closeAddUserDialog=function(){
        	$('.addUser').modal('hide');		
        	
        };
        vm.add = function (userId) {
        	orgUserSvc.add(vm,userId);
        };
        vm.remove = function (userId) {
        	orgUserSvc.remove(vm,userId);
        };
        vm.removes = function () {     
        	var selectIds = common.getKendoCheckId('.orgUserGrid');
            if (selectIds.length == 0) {
                common.alert({
                	vm:vm,
                	msg:'请选择数据'
                	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.remove(idStr);
            }   
       };

        activate();
        function activate() {
        	
        	orgSvc.getOrgById(vm);
        	orgUserSvc.orgUserGrid(vm);
        	orgUserSvc.allUserGrid(vm);
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('orgSvc', org);

	org.$inject = [ '$http','$compile' ];	
	function org($http,$compile) {	
		var url_org = "/org";
		var url_back = '#/org';
		var url_user='/user';
			
		var service = {
			grid : grid,
			createOrg : createOrg,			
			getOrgById : getOrgById,
			updateOrg:updateOrg,
			deleteOrg:deleteOrg			
		};		
		return service;	
						
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_org),
				schema : common.kendoGridConfig().schema({
					id : "id"
//					fields : {
//						createdDate : {
//							type : "date"
//						}
//					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});

			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
						
					},  {
						field : "orgIdentity",
						title : "部门标识",
						width : 200,						
						filterable : false
					}, {
						field : "name",
						title : "部门名称",
						width : 200,						
						filterable : false
					},{
						field : "comment",
						title : "描述",
						filterable : false
					}, {
						field : "createdDate",
						title : "创建时间",
						width : 180,
						filterable : false,
						template:function(item){
							return common.formatDateTime(item.createdDate);
						}

					},  {
						field : "",
						title : "操作",
						width : 280,
						template:function(item){							
							return common.format($('#columnBtns').html(),"vm.del('"+item.id+"')",item.id);
							
						}
						

					}

			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
			
		}// end fun grid

		function createOrg(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid && vm.isorgExist == false) {
				vm.isSubmit = true;
						               
				var httpOptions = {
					method : 'post',
					url : url_org,
					data : vm.model
				};

				var httpSuccess = function success(response) {									
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {				
//				common.alert({
//					vm:vm,
//					msg:"您填写的信息不正确,请核对后提交!"
//				})
			}
		}// end fun createorg

		

		function getOrgById(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_org + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
				if (vm.isUpdate) {
					//initZtreeClient(vm);
				}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}// end fun getorgById
		
		function updateOrg(vm){
			common.initJqValidation();			
			var isValid = $('form').valid();
			if (isValid && vm.isorgExist == false) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id
							               
				var httpOptions = {
					method : 'put',
					url : url_org,
					data : vm.model
				};

				var httpSuccess = function success(response) {					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {
//				common.alert({
//				vm:vm,
//				msg:"您填写的信息不正确,请核对后提交!"
//			})
			}
		}// end fun updateorg
		
		function deleteOrg(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'delete',
                url:url_org,
                data:id              
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.gridOptions.dataSource.read();
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun deleteorg				
	}	
})();;(function() {
	'use strict';

	angular.module('app').factory('orgUserSvc', org);

	org.$inject = [ '$http','$compile' ];	
	function org($http,$compile) {	
		var url_org = "/org";
		var url_back = '#/org';
		var user_userNotIn='/org/{0}/userNotIn';
		var url_orgUsers="/org/{0}/users";
		
			
		var service = {	
			orgUserGrid:orgUserGrid,
			allUserGrid:allUserGrid,
			add:add,
			remove:remove
		};		
		return service;	
		
		//begin#remove
		function remove(vm,userId){		
            var httpOptions = {
                method: 'delete',
                url:common.format(url_orgUsers,vm.id),
                data:userId               
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {						
	                    vm.gridOptions.dataSource.read();	                   
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		
		//begin#add
		function add(vm,userId){		
            var httpOptions = {
                method: 'post',
                url:common.format(url_orgUsers,vm.id),
                data:userId               
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
						vm.orgUserGrid.dataSource.read();
	                    vm.gridOptions.dataSource.read();	                   
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		//begin#allUserGrid
		function allUserGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(user_userNotIn,vm.id)),
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
						field : "loginName",
						title : "登录名",
						width : 200,
						filterable : true
					},
					{
						field : "displayName",
						title : "显示名",
						width : 200,
						filterable : true
					},
					{
						field : "comment",
						title : "描述",
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 80,
						template : function(item) {
							return common.format($('#allUserGridBtns').html(),
									"vm.add('" + item.id + "')", item.id);

						}

					}

			];
			// End:column

			vm.orgUserGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
			
		}
		
		//begin#orgUserGtid
		function orgUserGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_orgUsers,vm.id)),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : false,
				serverSorting : false,
				serverFiltering : false,
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"

					},
					{
						field : "loginName",
						title : "登录名",
						width : 200,
						filterable : false
					},
					{
						field : "displayName",
						title : "显示名",
						width : 200,
						filterable : false
					},
					{
						field : "comment",
						title : "描述",
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.remove('" + item.id + "')", item.id);

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
		}
	}		
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleCtrl', role);

    role.$inject = ['$location','roleSvc']; 

    function role($location, roleSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '角色列表';
        
        vm.del = function (id) {        	
        	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    roleSvc.deleteRole(vm,id);
                 }
             });
        };
        
        vm.dels = function () {     
        	var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'
                	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.del(idStr);
            }   
       };
        activate();
        function activate() {
            roleSvc.grid(vm);
        }
    }
})();
;(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleEditCtrl', role);

    role.$inject = ['$location','roleSvc','$state']; 

    function role($location, roleSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '添加角色';
        vm.isRoleExist=false;
        vm.id = $state.params.id;
        if (vm.id) {
            vm.isUpdate = true;
            vm.title = '更新角色';
        }
        
        vm.create = function () {
        	roleSvc.createRole(vm);
        };
        vm.update = function () {
        	roleSvc.updateRole(vm);
        };
        vm.checkRole = function () {
        	roleSvc.checkRole(vm);
        };

        activate();
        function activate() {
        	if (vm.isUpdate) {
        		roleSvc.getRoleById(vm);
            } else {
            	roleSvc.initZtreeClient(vm);
            }
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('roleSvc', role);

	role.$inject = [ '$http','$compile' ];	
	function role($http,$compile) {	
		var url_role = "/role";
		var url_back = '#/role';
		var url_resource="/sys/resource";
			
		var service = {
			grid : grid,
			createRole : createRole,
			checkRole : checkRole,
			getRoleById : getRoleById,
			updateRole:updateRole,
			deleteRole:deleteRole,
			initZtreeClient:initZtreeClient
		};		
		return service;	
		
		// begin common fun
		function getZtreeChecked() {
            var treeObj = $.fn.zTree.getZTreeObj("zTree");
            var nodes = treeObj.getCheckedNodes(true);
            return nodes;
        }
		
		function updateZtree(vm) {
            var treeObj = $.fn.zTree.getZTreeObj("zTree");
            var checkedNodes = $linq(vm.model.resources).select(function (x) { return x.path; }).toArray();
            var allNodes = treeObj.getNodesByParam("level", 1, null);

            var nodes = $linq(allNodes).where(function (x) { return $linq(checkedNodes).contains(x.path); }).toArray();
            
            for (var i = 0, l = nodes.length; i < l; i++) {
                treeObj.checkNode(nodes[i], true, true);
            }
        }
		// end common fun
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_role),
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
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});

			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
						
					}, {
						field : "roleName",
						title : "角色名称",
						width : 200,						
						filterable : false
					}, {
						field : "comment",
						title : "描述",
						filterable : false
					}, {
						field : "createdDate",
						title : "创建时间",
						width : 180,
						filterable : false,
						format : "{0:yyyy/MM/dd HH:mm:ss}"

					},  {
						field : "",
						title : "操作",
						width : 180,
						template:function(item){							
							return common.format($('#columnBtns').html(),"vm.del('"+item.id+"')",item.id);							
						}						
					}
			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};			
			}// end fun grid

		function createRole(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid && vm.isRoleExist == false) {
				vm.isSubmit = true;
				
				// zTree
				var nodes = getZtreeChecked();
               var nodes_role = $linq(nodes).where(function (x) { return x.isParent == false; }).select(function (x) { return { id: x.id, name: x.name,path:x.path,method:x.method }; }).toArray();
               vm.model.resources = nodes_role;   
	               
				var httpOptions = {
					method : 'post',
					url : url_role,
					data : vm.model
				};

				var httpSuccess = function success(response) {				
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {													
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			} else {				
//				common.alert({
//					vm:vm,
//					msg:"您填写的信息不正确,请核对后提交!"
//				})
			}
		}// end fun createRole

		function checkRole(vm) {

		}// end fun checkRole

		function getRoleById(vm) {
			
			var httpOptions = {
				method : 'get',
				url : common.format(url_role + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0];
				if (vm.isUpdate) {
					initZtreeClient(vm);
				}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}// end fun getRoleById
		
		function updateRole(vm){
			common.initJqValidation();			
			var isValid = $('form').valid();
			if (isValid && vm.isRoleExist == false) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id
				
				// zTree
				var nodes = getZtreeChecked();
               var nodes_role = $linq(nodes).where(function (x) { return x.isParent == false; }).select(function (x) { return { id: x.id, name: x.name,path:x.path,method:x.method }; }).toArray();
               vm.model.resources = nodes_role; 
               
				var httpOptions = {
					method : 'put',
					url : url_role,
					data : vm.model
				};

				var httpSuccess = function success(response) {					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');							
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {
//				common.alert({
//				vm:vm,
//				msg:"您填写的信息不正确,请核对后提交!"
//			})
			}
		}// end fun updateRole
		
		function deleteRole(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'delete',
                url:url_role,
                data:id               
            };
            
            var httpSuccess = function success(response) {              
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.gridOptions.dataSource.read();
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun deleteRole
		
		function initZtreeClient(vm){
			var httpOptions = {
	                method: 'get',
	                url: url_resource
	            };
			
            var httpSuccess = function success(response) {                             
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    var zTreeObj;
	                    var setting = {
	                        check: {
	                            chkboxType: { "Y": "ps", "N": "ps" },
	                            enable: true
	                        }
	                    };
	                    var zNodes = response.data;	                    
	                    zTreeObj = $.fn.zTree.init($("#zTree"), setting, zNodes);
	                    if (vm.isUpdate) {
	                         updateZtree(vm);
	                    }
	                }					
				});
            };
            
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}// end fun initZtreeClient				
	}	
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('userCtrl', user);

    user.$inject = ['$location','userSvc']; 

    function user($location, userSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '用户列表';
        

        vm.del = function (id) {        	       	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    userSvc.deleteUser(vm,id);
                 }
             });
        };
        
        vm.dels = function () {     
        	var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'              	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.del(idStr);
            }   
       };
       
        activate();
        function activate() {
            userSvc.grid(vm);
        }
    }
})();
;(function () {
    'use strict';

    angular
        .module('app')
        .controller('userEditCtrl', user);

    user.$inject = ['$location','userSvc','$state']; 

    function user($location, userSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};
        vm.title = '添加用户';
        vm.isuserExist=false;
        vm.id = $state.params.id;
        if (vm.id) {
            vm.isUpdate = true;
            vm.title = '更新用户';
        }
        
        vm.create = function () {
        	userSvc.createUser(vm);
        };
        vm.update = function () {
        	userSvc.updateUser(vm);
        };      
        
        vm.initPassword=function(e){
        	var isChecked=$('#initPassword').is(":checked");
        	if(isChecked){
        		vm.model.password="888888";
            	vm.model.passwordConfirm="888888";
        	}else{
        		vm.model.password="";
            	vm.model.passwordConfirm="";
        	}
        	
        };

        activate();
        function activate() {
        	if (vm.isUpdate) {
        		userSvc.getUserById(vm);
            } else {
            	userSvc.initZtreeClient(vm);
            }
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('userSvc', user);

	user.$inject = [ '$http' ];

	function user($http) {
		var url_user = "/user";
		var url_back = '#/user';
		var url_role = "/role";
		var service = {
			grid : grid,
			getUserById : getUserById,
			initZtreeClient : initZtreeClient,
			createUser : createUser,
			deleteUser : deleteUser,
			updateUser : updateUser
		};

		return service;

		// begin#updateUser
		function updateUser(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id = vm.id;// id

				// zTree
				var nodes = getZtreeChecked();
				var nodes_role = $linq(nodes).where(function(x) {
					return x.isParent == false;
				}).select(function(x) {
					return {
						id : x.id,
						roleName : x.name						
					};
				}).toArray();
				vm.model.roles = nodes_role;

				var httpOptions = {
					method : 'put',
					url : url_user,
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
				// common.alert({
				// vm:vm,
				// msg:"您填写的信息不正确,请核对后提交!"
				// })
			}

		}

		// begin#deleteUser
		function deleteUser(vm, id) {
			vm.isSubmit = true;
			
			var httpOptions = {
				method : 'delete',
				url : url_user,
				data : id
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit = false;
						vm.gridOptions.dataSource.read();
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

		// begin#createUser
		function createUser(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				// zTree
				var nodes = getZtreeChecked();
				var nodes_roles = $linq(nodes).where(function(x) {
					return x.isParent == false;
				}).select(function(x) {
					return {
						id : x.id,
						roleName : x.name
					};
				}).toArray();
				vm.model.roles = nodes_roles;

				var httpOptions = {
					method : 'post',
					url : url_user,
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
									location.href = url_back;
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

		// begin#initZtreeClient
		function initZtreeClient(vm) {
			var httpOptions = {
				method : 'get',
				url : url_role
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						var zTreeObj;
						var setting = {
							check : {
								chkboxType : {
									"Y" : "ps",
									"N" : "ps"
								},
								enable : true
							}
						};
						var zNodes = $linq(response.data.value).select(
								function(x) {
									return {
										id : x.id,
										name : x.roleName
									};
								}).toArray();
						var rootNode = {
							id : '',
							name : '角色集合',
							children : zNodes
						};
						zTreeObj = $.fn.zTree.init($("#zTree"), setting,
								rootNode);
						if (vm.isUpdate) {
							updateZtree(vm);

						}
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

		// begin#getUserById
		function getUserById(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_user + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0];
				if (vm.isUpdate) {
					initZtreeClient(vm);
				}
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_user),
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"

					},
					{
						field : "loginName",
						title : "登录名",
						width : 200,
						filterable : true
					},
					{
						field : "displayName",
						title : "显示名",
						width : 200,
						filterable : true
					},
					{
						field : "comment",
						title : "描述",
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建时间",
						width : 180,
						filterable : false,
						format : "{0:yyyy/MM/dd HH:mm:ss}"

					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.del('" + item.id + "')", item.id);

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

		// begin common fun
		function getZtreeChecked() {
			var treeObj = $.fn.zTree.getZTreeObj("zTree");
			var nodes = treeObj.getCheckedNodes(true);
			return nodes;
		}

		function updateZtree(vm) {
			var treeObj = $.fn.zTree.getZTreeObj("zTree");
			var checkedNodes = $linq(vm.model.roles).select(function(x) {
				return x.roleName;
			}).toArray();
			var allNodes = treeObj.getNodesByParam("level", 1, null);

			var nodes = $linq(allNodes).where(function(x) {
				return $linq(checkedNodes).contains(x.name);
			}).toArray();

			for (var i = 0, l = nodes.length; i < l; i++) {
				treeObj.checkNode(nodes[i], true, true);
			}
		}
		// end common fun
	}
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('basicDataCtrl', basicData);

    basicData.$inject = ['$location','basicDataSvc','$state','$scope']; 

    function basicData($location, basicDataSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
        vm.init=function(){  
        	vm.model={};
        	init_ztree();      	
        };//end init
        
        function init_ztree(){
        	var basicData=common.getBasicData();
        	var zTreeObj;
			var setting = {
					view:{
						nameIsHTML:true,
						addHoverDom: function(treeId, treeNode){
							if(treeNode.level != 0 && treeNode.canEdit){//新增按钮最高级没有,不可编辑也没有
								//添加新增按钮
								var sObj = $("#" + treeNode.tId + "_span");
								if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
								var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
								+ "' title='添加子节点' onfocus='this.blur();'></span>";
								sObj.after(addStr);
								var btn = $("#addBtn_"+treeNode.tId);
								//监听新增按钮
								if (btn) btn.bind("click", function(){
									window.global_basicData = null;
									basicData=common.getBasicData();
									
									var zTree = $.fn.zTree.getZTreeObj("zTree");
									//新增按钮触发时新节点的设置
									//获取父节点下的所有子节点的id的尾数的最大值
									var childIds = $linq(basicData)
									.where(function(x){return x.pId==treeNode.id;})
									.select(function(x){return {id:x.id};})
									.toArray();	
									var oldId, newId,oldIdSplit;
									if(childIds.length>0){//有子级代表新点击对象为父级新增										
										var idNum = [];
										var index = 0;
										for(var i=0;i<childIds.length;i++){
											var id = childIds[i].id;
											var idSplit = id.split("_");
											idNum[index+i] = parseInt(idSplit[idSplit.length-1],10);//获取所有子级id最后的一组数字									
										}
										//设置新增子级id的数值 数组中的最大值+1
										//获取数组中的最大值
										var idNumMax = Math.max.apply(null, idNum);
										//替换掉最后的数值
										 oldId = childIds[0].id;
										 oldIdSplit = oldId.split("_");
										 oldIdSplit[oldIdSplit.length-1] = idNumMax+1;//将最后的一个元素的值变更为最大值+1
										 newId = oldIdSplit.join("_");
									}else{//代表点击对象为子级新增按钮										
										 oldId = treeNode.id;
										 newId = oldId+"_1";
									}									
									var newnode={id:newId,name:"请编辑命名",identity:treeNode.identity,pId:treeNode.id,canEdit:true};
									zTree.addNodes(treeNode,newnode);
									//将新增的数据存放到数据库
									vm.model.id=newnode.id;
									vm.model.description=newnode.name;
									vm.model.identity=newnode.identity;
									vm.model.pId=newnode.pId;
									vm.model.canEdit = newnode.canEdit;
									basicDataSvc.createBasicData(vm);		
								});
							}
						},
						removeHoverDom: function(treeId, treeNode){
							$("#addBtn_"+treeNode.tId).unbind().remove(); 
						},
						showIcon: true,
						selectedMulti: true
						},
					edit:{
						enable: true,
						showRenameBtn: function(treeId, treeNode){//最高一级没有编辑按钮,不可编辑也没有
							if(treeNode.level == 0 || !treeNode.canEdit) return false;
							else return true;
						},
						showRemoveBtn: function(treeId, treeNode){//只有最子级才有删除按钮,不可编辑也没有
							if(treeNode.isParent || !treeNode.canEdit) return false;
							else return true;	 											              							
						},
						removeTitle : "删除",
						renameTitle : "编辑"
					},	
					callback:{
						onRename: function(e,treeId,treeNode){
							vm.model.id=treeNode.id;
							vm.model.description=treeNode.name;
							vm.model.identity=treeNode.identity;
							vm.model.pId=treeNode.pId;
							basicDataSvc.updateBasicData(vm);
						},
						onRemove: function(e,treeId, treeNode){							
							basicDataSvc.deleteBasicData(vm,treeNode.id);				                				        
						}
					}									
			};
			 
			
						
			var findChildren=function(pId){
				return $linq(basicData)
				.where(function(x){return x.pId==pId;})
				.select(function(x){return {id:x.id,name:x.description,pId:x.pId,identity:x.identity,canEdit:x.canEdit,children:findChildren(x.id)};})
				.toArray();
			};
			
			var zNodes = $linq(basicData)
				.where(function(x){return x.pId=="";})
				.select(
					function(x) {
						return {
							id : x.id,
							name :common.format('{0}{1}',x.description,x.canEdit?'':'<span style="color:red">[不可编辑]</span>'),
							pId:x.pId,
							canEdit:x.canEdit,
							identity:x.identity,
							children:findChildren(x.id)
						};
					}).toArray();
			
			var rootNode = {
					id : '',
					name : '基础数据',
					children : zNodes
				};
			
			zTreeObj = $.fn.zTree.init($("#zTree"), setting,rootNode);					
        }
        
  
        
        activate();
        function activate() {
        	vm.init();
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('basicDataSvc', basicData);

	basicData.$inject = [ '$http','$compile' ];	
	function basicData($http,$compile) {	
		var url_basicData = "/management/basicData";
	
			
		var service = {
			createBasicData:createBasicData,
			deleteBasicData:deleteBasicData,
			updateBasicData:updateBasicData
		};		
		return service;
		
		/**
		 * 更新基础数据
		 */
		function updateBasicData(vm){
			var httpOptions = {
					method : 'put',
					url : url_basicData,
					data : vm.model
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 删除基础数据
		 */
		function deleteBasicData(vm,id){
			var httpOptions = {
					method : 'delete',
					url : url_basicData,
					data : id
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 创建基础数据
		 */
		function createBasicData(vm){									
			var httpOptions = {
				method : 'post',
				url : url_basicData,
				data : vm.model
			};

			var httpSuccess = function success(response) {	
				common.requestSuccess({
					vm : vm,
					response : response					
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
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.projectId=$state.params.projectId;
		vm.year=$state.params.year;
		vm.month=$state.params.month;
    	vm.model={};    
    	vm.page='list';
    	vm.model.display = false;
    	
        vm.init=function(){
        	if($state.current.name=='monthReport_details'){
        		vm.page='details';
        	}else if($state.current.name=='monthReportChange'){
        		vm.page='changeDetails';
        	}
        	
        	vm.getBasicDataDesc = function(Str){
        		return common.getBasicDataDesc(Str);
        	};
        	
        	vm.checkLength = function(obj,max,id){
     			 common.checkLength(obj,max,id);
          	};
        };//end init
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		monthReportSvc.grid(vm);
        	}
        	if(vm.page=='details'){  
        		page_details();
        	}
        	if(vm.page=='changeDetails'){
        		page_details();
        	}
            
        }
        
        function page_details(){
        	monthReportSvc.getProjectById(vm);
        	//begin#基础数据
        	vm.model.isReportExist = false;
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


          //begin#ng-include load后触发
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
    		//文件选择触发验证文件大小
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
        	
            //begin#删除文件
            vm.delFile=function(idx){
           	 vm.model.monthReport.attachmentDtos.splice(idx,1);
            };
        	//批复类型
         	vm.basicData_approvalType=$linq(common.getBasicData())
    		  .where(function(x){return x.identity=='approvalType'&&x.pId=='approvalType';})
    		  .toArray();
         	//项目进度
         	vm.basicData_projectProgress=$linq(common.getBasicData())
    		  .where(function(x){return x.identity=='projectProgress'&&x.pId=='projectProgress';})
    		  .toArray();
        	//begin#上传类型
         	vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
        	
        	  //begin#提交月报
       	  	vm.submit = function(){
       	  		monthReportSvc.submitMonthReport(vm);
            };
            
            //begin#月报修改
            vm.change = function(){
            	location.href="#/monthReportChange/"+vm.projectId+"/"+vm.year+"/"+vm.month;
            };
            //begin#月报原数据
            vm.befor = function(){
            	vm.model.display = true;
            	monthReportSvc.getProjectById(vm);
            };
            
            vm.back = function(vm){
            	location.href="#/monthReport";
            };
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('monthReportSvc', monthReport);

	monthReport.$inject = [ '$http','$compile','$location' ];	
	function monthReport($http,$compile,$location) {	
		var url_project = "/management/project";	
		var url_projectMonthReport="/management/monthReport";
		var url_back = "/monthReport";
	
		var service = {
			grid : grid,
			getProjectById:getProjectById,
			submitMonthReport:submitMonthReport
		};		
		return service;	
		
		//查询月报信息
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.projectId)
				};
			
			var httpSuccess = function success(response) {					
				vm.model.projectInfo = response.data.value[0]||{};	
							
				if(vm.page=='details' || vm.page=='changeDetails'){	
					//根据年，月查到月报数据
					var report=$linq(vm.model.projectInfo.monthReportDtos)
					.where(function(x){return x.submitYear==vm.year && x.submitMonth==vm.month;})
					.toArray();
					if(report.length>0){
						if(vm.model.display == true){//点击原数据
							for (var i = 0; i < report.length; i++) {
								if(report[i].isLatestVersion == false){
									vm.model.monthReport=report[i];	
								}
							}
						}else{//新数据
							for (var j = 0; j < report.length; j++) {
								if(report[j].isLatestVersion == true){
									vm.model.monthReport=report[j];	
								}
							}
						}
						
						//vm.model.monthReport=report[0];						
						//批复时间处理
						vm.model.monthReport.pifuJYS_date=common.toDate(vm.model.projectInfo.pifuJYS_date);
						vm.model.monthReport.pifuKXXYJBG_date=common.toDate(vm.model.projectInfo.pifuKXXYJBG_date);
						vm.model.monthReport.pifuCBSJYGS_date=common.toDate(vm.model.projectInfo.pifuCBSJYGS_date);
						//开工日期&竣工日期处理
						vm.model.monthReport.beginDate=common.formatDate(vm.model.monthReport.beginDate);
						vm.model.monthReport.endDate=common.formatDate(vm.model.monthReport.endDate);
						//金钱处理
						vm.model.monthReport.invertPlanTotal=common.toMoney(vm.model.monthReport.invertPlanTotal);//项目总投资
						vm.model.monthReport.actuallyFinishiInvestment=common.toMoney(vm.model.monthReport.actuallyFinishiInvestment);//至今完成投资
						vm.model.monthReport.thisYearPlanInvestment=common.toMoney(vm.model.monthReport.thisYearPlanInvestment);//本年度计划完成投资
						vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);//本年度已完成投资
						vm.model.monthReport.thisMonthInvestTotal=common.toMoney(vm.model.monthReport.thisMonthInvestTotal);//本月完成投资
						vm.model.monthReport.firstQuarCompInvestment=common.toMoney(vm.model.monthReport.firstQuarCompInvestment);
						vm.model.monthReport.secondQuarCompInvestment=common.toMoney(vm.model.monthReport.secondQuarCompInvestment);
						vm.model.monthReport.thirdQuarCompInvestment=common.toMoney(vm.model.monthReport.thirdQuarCompInvestment);
						vm.model.monthReport.fourthQuarCompInvestment=common.toMoney(vm.model.monthReport.fourthQuarCompInvestment);
					}
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
				
				var httpOptions = {
						method : 'post',
						url : url_projectMonthReport,
						data : vm.model.monthReport
					};
				
				var httpSuccess = function success(response) {
					vm.model.isReportExist=true;
					vm.model.isSubmit = false;
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									$location.path(url_back);//创建成功返回到列表页
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
		
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
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
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:[{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				},
				{
					field:'isMonthReport',
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
						template:function(item){							
							return common.format('<a href="#/projectDetails/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);							
						},
						filterable : true
					},
					{
						field : "",
						title : "填报月份",
						template:function(data){
							var returnStr="";
							data.monthReportDtos.forEach(function(e,idx){
								returnStr+=common.format('<a class="btn btn-xs btn-success" ng-show="{3}" href="#/monthReport/{0}/{1}/{2}">{1}年{2}月</a> ',
										e.projectId,e.submitYear,e.submitMonth,e.isLatestVersion);
																		
							});
							return returnStr;					
						},
						width:800,
						filterable : false
					}															
			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
	}
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('portalCtrl', portal);

    portal.$inject = ['$location','portalSvc','$state','$scope']; 

    function portal($location, portalSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.type=$state.params.type;
    	vm.id=$state.params.id;
        vm.init=function(){   
        	//title
        	switch (vm.type) {
			case "tzgg":
				vm.title="通知公告";
				break;
			case "zcfg":
				vm.title="政策法规";
				break;
			case "bszn":
				vm.title="办事指南";
				break;
			case "cybg":
				vm.title="常用表格";
				break;			
			}
        	//page
        	switch (vm.id) {
			case undefined:
				vm.page="list";
				break;
			case "":
				vm.page="create";
			break;
			default:
				vm.page="update";
				break;
			} 
        	
        };//end init
        
        vm.init_upload=function(){
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
        	//upload
        	$("#files").kendoUpload({
                async: {
                    saveUrl: "/common/save",
                    removeUrl: "/common/remove",
                    autoUpload: true
                },
                showFileList:false,
                select:vm.onSelect,
                success:function(e){},
                error:function(e){
               	 console.log("error:");
               	 console.log(e);
               	 if(e.XMLHttpRequest.status==200){
               		 var fileName=e.XMLHttpRequest.response;
               		 $scope.$apply(function(){
               			 if(vm.model.attachmentDtos){
               				vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:vm.type});
	           			 }else{
	           				vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:vm.type}];
	           			 }             			
               		 });
               	 }
                },
                localization: {
                    select: "上传文件"
                },
                validation: {
   	                maxFileSize: common.basicDataConfig().uploadSize
   	            }
            });
        };//end init_upload
       
        vm.delFile=function(idx){
        	vm.model.attachmentDtos.splice(idx,1);
        };
        
        vm.del = function (id) {        	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    portalSvc.del(vm,id);
                 }
             });
        };
        
        vm.dels = function () {     
        	var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'               	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.del(idStr);
            }   
       };
        
        vm.create=function(){
        	portalSvc.create(vm);
        };
        vm.update=function(){
        	portalSvc.update(vm);
        };
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		portalSvc.grid(vm);
        	}
        	if(vm.page=='update'){
        		portalSvc.getById(vm);
        	}
        	if(vm.page=='create'||vm.page=='update'){
        		vm.init_upload();
        	}                        
        }
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('portalSvc', portal);

	portal.$inject = [ '$http','$compile' ];	
	function portal($http,$compile) {	
		var url_portal = "/management/portal";
		var url_back = '#/portal/';
			
		var service = {
			grid : grid,
			create : create,			
			getById : getById,
			update:update,
			del:del			
		};		
		return service;	
		
		
		
		function grid(vm) {

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_portal),
				schema : common.kendoGridConfig().schema({
					id : "id"
//					fields : {
//						createdDate : {
//							type : "date"
//						}
//					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'type',
					operator:'eq',
					value:vm.type
				}
			});

			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
						
					},  {
						field : "title",
						title : "标题",
						filterable : false
					}, {
						field : "createdDate",
						title : "创建时间",
						width : 180,
						template:function(item){
							return common.formatDateTime(item.createdDate);
						},
						filterable : false
					},  {
						field : "",
						title : "操作",
						width : 180,
						template:function(item){							
							return common.format($('#columnBtns').html(),item.id);
							
						}
					}

			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
			
		}// end fun grid

		function create(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;
				var httpOptions = {
					method : 'post',
					url : url_portal,
					data : vm.model
				};

				var httpSuccess = function success(response) {									
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back+vm.type;
								}
							});
						}
						
					});

				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {				
				common.alert({
					vm:vm,
					msg:"您填写的信息不正确,请核对后提交!"
				});
			}
		}// end func create

		

		function getById(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_portal + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0];	
				if(vm.model.files){
					vm.files=vm.model.files.split(';');
				}				
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}// end fun getportalById
		
		function update(vm){
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id
				var httpOptions = {
					method : 'put',
					url : url_portal,
					data : vm.model
				};

				var httpSuccess = function success(response) {					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back+vm.type;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			} else {
//				common.alert({
//				vm:vm,
//				msg:"您填写的信息不正确,请核对后提交!"
//			})
			}
		}// end fun updateportal
		
		function del(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'delete',
                url:url_portal,
                data:id                
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.gridOptions.dataSource.read();
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun deleteportal
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
    	vm.search={};
    	vm.model={};
    	vm.basicData={};
        vm.id=$state.params.id;
        vm.projectInvestmentType=$state.params.projectInvestmentType;
    	vm.page="list";
    	function init(){    		
    		if($state.current.name=='projectEdit'){
    			vm.page='create';
    		}
    		if(vm.id){
    			vm.page='update';
    		}
    		if($state.current.name=='projectDetails'){
    			vm.page='details';
    		}
    		
    		vm.getBasicDataDesc = function(Str){
    			return common.getBasicDataDesc(Str);
    		};
    		
    		vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
    		};
    		
    		//用于查询、编辑、新增--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
	   		vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();//获取街道信息
    		
    	}
    	init();    	
    	activate();
        function activate() {
        	        	
        	if(vm.page=='list'){
        		init_list();
        	}
        	if(vm.page=='create'){
        		//初始化CheckBox
        		vm.model.projectType =[];
        		init_create();
        	}
        	if(vm.page=='update'){
        		init_create();
        		init_update();
        	}
        	if(vm.page=='details'){
        		init_details();
        	}
        }
    	
    	function init_list(){
    		projectSvc.grid(vm);
    		//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				filters.push({field:'isIncludLibrary',operator:'eq',value:true});//默认条件--项目纳入项目库   
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
     			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
     		   }
     		   if(vm.search.isMonthReport !=null && vm.search.isMonthReport !=''){
     			   if(vm.search.isMonthReport == "true"){
     				  filters.push({field:'isMonthReport',operator:'eq',value:true});
     			   }else if(vm.search.isMonthReport == "false"){
     				  filters.push({field:'isMonthReport',operator:'eq',value:false});
     			   }
     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		  vm.gridOptions.dataSource.filter(filters);
     		  vm.gridOptions.dataSource.read();
    		};
    		
     	   //点击新增项目弹出模态框
     	   vm.addProject = function(){
     		  $("#myModal_add").modal({
 			        backdrop: 'static',
 			        keyboard:false  			  
     		  });
     	   };
     	   //点击模态框确认按钮跳转不同的信息录入页面
     	   vm.confirmInvestmentType=function(){
     		   $(".modal-backdrop").remove();
     		   $location.path("/projectEdit//"+vm.model.projectInvestmentType);
     	   };
     	  vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目
    		
			vm.isMonthReport=function(id,isMonthReport){
				vm.model.isMonthReport = isMonthReport;
				vm.model.id=id;
				//弹出模态框
				$("#myModal_edit").modal({
	                backdrop: 'static',
	                keyboard:false
	            });   			
			};
    		
    		//更新项目是否填报状态
    		vm.updateIsMonthReport = function(){
    			projectSvc.updateIsMonthReport(vm);
    		}; 
    		
    		vm.del = function (id) {
                common.confirm({
               	 vm:vm,
               	 title:"",
               	 msg:"确认删除数据吗？",
               	 fn:function () { 
               		$('.confirmDialog').modal('hide');
                    projectSvc.deleteProject(vm,id);
                    }
                });
           };//del
    		
    		vm.dels = function(){
            	var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据'                	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}  
                    var idStr=ids.join(',');
                    vm.del(idStr);
                }   
           };//dels         
    	}//init_list
    	
    	function init_create(){
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
    		//获取当前所有的用户单位信息
    		projectSvc.getUserUnits(vm);
    		
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
    		vm.relatedType=common.uploadFileTypeConfig().projectEdit;
	   		
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
   	        	   vm.gridOptions_documentRecords.dataSource.read();//批复文件列表数据刷新
   	   		};
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
	        };
   	   		
    		//文件选择触发验证文件大小
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
			 		+ (parseFloat(vm.model.capitalOther)||0);
    	   };
	        
    	   vm.create = function () {
    		    projectSvc.createProject(vm);    		     
    		};    		     		     			    		 
    	}//init_create
    	
    	function init_update(){
    		vm.title = "编辑项目";
    		//获取项目信息
    		projectSvc.getProjectById(vm);
    		//更新项目
    		vm.update = function(){
    			projectSvc.updateProject(vm);
    		};  	   		
    	}//init_update
    	
    	function init_details(){
    		projectSvc.getProjectById(vm);
    		
    		if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
   			  vm.isZFInvestment = true; 			  
   		   	}else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			  
   			  vm.isSHInvestment = true;
   		   	}
    		//相关附件文件上传文件种类
    		vm.relatedType=common.uploadFileTypeConfig().projectEdit;   		
    	}
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = [ '$http' ];

	function project($http) {
		var url_project = "/management/project";//获取项目信息数据
		var url_userUnit = "/management/userUnit";//获取单位信息
		var url_back = "#/project";
		var url_document="/management/replyFile";
		var service = {
			grid : grid,			
			getProjectById:getProjectById,
			getUserUnits:getUserUnits,
			updateProject:updateProject,
			createProject:createProject,
			updateIsMonthReport:updateIsMonthReport,
			documentRecordsGird:documentRecordsGird
		};

		return service;
		
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
		function getUserUnits(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
				var httpSuccess = function success(response) {
					vm.userUnits = response.data.value;
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
				vm.model.projectType=common.arrayToString(vm.model.projectType,',');//项目类型的处理

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
									location.href = url_back;									
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
				common.alert({
					 vm:vm,
					 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		//end#createProject
		
		/**
		 * 更新是否填写月报
		 */
		function updateIsMonthReport(vm){
			var httpOptions = {
					method : 'put',
					url : url_project+"/isMonthReport",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					//关闭模态框
					$("#myModal_edit").modal('hide');
					//刷新表格数据
					vm.gridOptions.dataSource.read(); 					
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			} 
		
		/**
		 * 更新项目信息
		 */
		//begin#updateProject
		function updateProject(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.projectType=common.arrayToString(vm.model.projectType,',');
				var httpOptions = {
					method : 'put',
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
									location.href = url_back;
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
		//end#updateProject
		
		
		
		/**
		 * 通过项目代码查询项目信息
		 */
		//begin#getProjectById
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
				vm.projectType=common.stringToArray(vm.model.projectType,',');

				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				
				//金额处理
        		vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
				vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
				vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
				vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
				vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算内投资
				vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
				vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
				if(vm.page=='update'){
					if(vm.model.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资项目
						//项目行业归口
						var child = $linq(common.getBasicData()).where(function(x){return x.id==vm.model.projectIndustry;}).toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();	
					}     		        		
				}
				if(vm.page=='details'){				
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
		//end#getProjectById
		
		//文件选择模态框
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
				pageSize : 10
					
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
	
		
		// begin#grid
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
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
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
				filter:[
					{
						field:"isLatestVersion",
						operator:"eq",
						value:true
					},{
						field:"isIncludLibrary",
						operator:"eq",
						value:true
					}
				]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					 {
						field : "projectNumber",
						title : "项目代码",
						width : 180,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						filterable : true
					},
					{
						field : "unitName",
						title : "建设单位",
						width : 150,
						filterable : true
					},
					{
						field : "projectStage",
						title : "项目阶段",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectStage),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
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
						field : "isMonthReport",
						title : "是否月报",
						template : function(item) {
							if(item.isMonthReport){
								return "是";
							}else if(!item.isMonthReport){
								return "否";
							}								 
						},
						width : 150,
						filterable : true
					},
					{
						field : "",
						title : "操作",
						width : 250,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')");
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
        .controller('sysConfigCtrl', sysConfig);

    sysConfig.$inject = ['$location','sysConfigSvc','$state','$scope']; 

    function sysConfig($location, sysConfigSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.model.config=[];
    	vm.model.checkedButton = [];
    	activate();
    	
        function activate() {        	
        	init_getAllTask();
        	init_getAllUser();
        	init();
        }
        
		/**
		 * 初始化任务签收人
		 */
		function init(){
			sysConfigSvc.getSysConfigs(vm);	
			for (var i = 0; i < vm.model.taskList.length; i++) {
				vm.model.checkedButton[i] = true;
			}
			
			//修改按钮
			vm.checked = function(index){
				//设置修改按钮隐藏、下拉选显示
	        	for (var i = 0; i < vm.model.checkedButton.length; i++) {
					if(index == i)
						vm.model.checkedButton[i] = false;
				}
	        };
			//下拉选发生变化
			 vm.userChange = function(index,userName){
				 vm.model.taskList[index].taskUser = userName;
				 //设置确认按钮可操作
				 vm.hasChange = true;
			 };
			//系统配置：更新
			 vm.create = function(){
	        	sysConfigSvc.createTaskUser(vm);
	        };
		}
        
        /**
		 * 系统配置：查询所有username
		 * @return usernameList
		 */
        function init_getAllUser(){
        	sysConfigSvc.getAllUser(vm);
        }
        
        /**
		 * 系统配置：查询所有task
		 * @return taskList
		 */
        function init_getAllTask(){
        	sysConfigSvc.getAllTask(vm);
        }
        
    }    
})();
;(function() {
	'use strict';

	angular.module('app').factory('sysConfigSvc', sysConfig);

	sysConfig.$inject = [ '$http' ];

	function sysConfig($http) {

		var url_user = "/user";//获取所有的user
		var url_task = "/management/task";//获取需要设置的task
		var url_taskUser = "/sys/create";//设置task签收人
		var url_getSysConfigs = "/sys/getSysConfigs";
		
		
		var service = {
			getAllUser : getAllUser,
			getAllTask : getAllTask,
			createTaskUser : createTaskUser,
			getSysConfigs : getSysConfigs
		};

		return service;

		/**
		 * 初始化任务签收人
		 */
		function getSysConfigs(vm){
			var httpOptions = {
					method : 'get',
					url : url_getSysConfigs,
					data : vm.model
				};
			
			var httpSuccess = function success(response) {
				vm.userTaskList = response.data;//所有的配置
				for (var j = 0; j < vm.userTaskList.length; j++) {
					for (var i = 0; i < vm.model.taskList.length; i++) {
						if(vm.userTaskList[j].configName == vm.model.taskList[i].id && vm.userTaskList[j].configType ==common.basicDataConfig().taskType){
							if(vm.userTaskList[j].configName == common.basicDataConfig().taskType_monthReport 
									|| vm.userTaskList[j].configName == common.basicDataConfig().taskType_yearPlan){//如果为月报、下一年度计划系统配置
								vm.model.taskList[i].taskUser = vm.userTaskList[j].configValue;
							}else if(vm.userTaskList[j].configName == common.basicDataConfig().taskType_sendMesg){//如果为发送短信系统配置
								vm.model.taskList[i].taskEnable = vm.userTaskList[j].enable;
							}
						}
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
		 * 系统配置：查询所有username
		 * @return usernameList
		 */
		function createTaskUser(vm){
			var data=[];
		    for(var i in vm.model.taskList){		    
		    	data.push({configName:vm.model.taskList[i].id,configValue:vm.model.taskList[i].taskUser,enable:vm.model.config[i].enable});
		    }
		   
			var httpOptions = {
					method : 'post',
					url : url_taskUser,
					data : data
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function() {							
						common.alert({
							vm:vm,
							msg:"操作成功",
							fn:function() {
								vm.isSubmit = false;
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
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
		
		/**
		 * 系统配置：设置task签收人
		 * 
		 */
		function getAllUser(vm) {
			
			var httpOptions = {
				method : 'get',
				url : url_user,
				data : vm.model
			};
			
			var httpSuccess = function success(response) {
				vm.userList = response.data.value;
				vm.user=[];
				for (var i = 0; i < vm.userList.length; i++) {
					var roles = vm.userList[i].roles;
					for (var j = 0; j < roles.length; j++) {
						if(roles[j].roleName == common.basicDataConfig().management){
							vm.user.push(vm.userList[i]);
						}
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
		 * 系统配置：查询所有task
		 * @return taskList
		 */
		function getAllTask(vm){
			vm.model.taskList = common.getBacicDataByIndectity(common.basicDataConfig().taskType);				
		}
		
		function updateTaskUser(){
			
			var httpOptions = {
					method : 'put',
					url : url_user
				};
			
			var httpSuccess = function success(response) {
				vm.userList = response.data.value;
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
	}
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskCtrl', task);

    task.$inject = ['$location','taskSvc','$state','$scope','$sce']; 

    function task($location, taskSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;        
    	vm.page="todoList";
    	function init(){   		
    		if($state.current.name=='task_todo'){//待办列表
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){//任务处理
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){//已办列表
    			vm.page='complete';
    		}
    		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    		vm.getBasicDataDesc=function(str){
    			return common.getBasicDataDesc(str);
    		};
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};

           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoList'){
        		init_todoList();
        	}
        	if(vm.page=='handle'){
        		init_handle();
        	}
        	if(vm.page=='complete'){
        		init_completeList();
        	}
        }
        
        function init_todoList(){
        	taskSvc.grid(vm);
        }//end init_todoList
        
        function init_completeList(){
        	taskSvc.completeGird(vm);
        }//end init_completeList
        
        
    	function init_handle(){
    	   vm.processState_qianShou=common.basicDataConfig().processState_qianShou;
    	   vm.processState_tuiWen=common.basicDataConfig().processState_tuiWen;

    	   taskSvc.getTaskById(vm);//查询任务信息
    	   taskSvc.getDept(vm);
    	  
    	   if(vm.taskType == common.basicDataConfig().taskType_monthReport){//如果为月报
    		   vm.isMonthReport = true;
    		   taskSvc.getMonthReportById(vm);//查询月报信息
    	   }else{
    		   if(vm.taskType == common.basicDataConfig().taskType_yearPlan){//如果为下一年度计划申报
    			   vm.isYearPlan = true; 
    		   }else if(vm.taskType == common.basicDataConfig().taskType_JYS){//项目建议书
    			   vm.isProjectProposal = true;
    		   }else if(vm.taskType == common.basicDataConfig().taskType_KXXYJBG){//可行性研究报告
    			   vm.isKXXYJBG = true;
    		   }else if(vm.taskType == common.basicDataConfig().taskType_CBSJYGS){//初步概算与概算
    			   vm.isCBSJYGS = true;
    		   }
    		   taskSvc.getShenBaoInfoById(vm);//查询申报信息
    	   }
    		   
    	   vm.dialog_shenbaoInfo=function(){
    		   $('#shenbaoInfo').modal({
                   backdrop: 'static',
                   keyboard:false
               });
			   //初始化tab
	     	   vm.tabStripOptions={
	     			//TODO
	     	   };
    	   };
    	   
    	   vm.getUserId = function(name){
    		   console.log(name);
    		   $("input:radio[name='radio']").eq(0).attr("checked",'checked');
    		   if(name == ""){
    			   return;
    		   }
    		   vm.nextUser = name;
    	   };
    	   
    	   vm.changed=function(id){
    		  
    		   if(id == ""){
    			   vm.model.deptUsers ="";
    			   return;
    		   }
    		   for ( var x in vm.model.dept) {
				if(vm.model.dept[x].id== id ){
					vm.nextUser = vm.model.dept[x].name;
				}
			}
    		   
    		   vm.id = id;
    		   taskSvc.getDeptUsers(vm);
    	   };
    	   
    	   //处理操作
    	   vm.handle=function(processState){
    		   common.initJqValidation();
   			   var isValid = $('form').valid();
	   			if (isValid) {
	   				vm.isSubmit = true;
	   				vm.model.taskRecord.processState=processState;
	     		   taskSvc.handle(vm);
	   			}
    	   };    		
    	}//init_handle
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('taskSvc', task);

	task.$inject = [ '$http' ];

	function task($http) {
		var url_task = "/management/task";
		var url_taskRecord = "/management/taskRecord";
		var url_shenbao = "/management/shenbao";
		var url_monthReport = "/management/monthReport";
		var url_project = "/management/project";
		var url_back = "#/task/todo";
		var url_dept = "/org";
		var url_users="/org/{0}/users";
		var service = {
			grid : grid,//待办任务列表
			completeGird:completeGird,//已办任务列表
			getTaskById:getTaskById,//根据任务id获取任务信息
			getShenBaoInfoById:getShenBaoInfoById,//根据id获取申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			handle:handle,
			getDept:getDept,//获取部门数据
			getDeptUsers:getDeptUsers
		};
		
		return service;
		
		//根据部门id获取人员
		function getDeptUsers(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_users + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response){
				vm.model.deptUsers = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		//获取部门
		function getDept(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				vm.model.dept = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
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
				if(vm.model.project.projectType != "" && vm.model.project.projectType != undefined){
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
					url : common.format(url_monthReport + "?$filter=id eq '{0}'", vm.relId)				
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
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.relId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo= response.data.value[0]||{};
				//项目类型的显示
				vm.model.shenBaoInfo.projectType=common.stringToArray(vm.model.shenBaoInfo.projectType,",");
				//判断项目的投资类型
				if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
					vm.isSHInvestment = true;
				}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
					vm.isZFInvestment = true;
				}
				//日期展示
				vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
				vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
				vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
				vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
				//资金处理
				vm.model.shenBaoInfo.projectInvestSum=common.toMoney(vm.model.shenBaoInfo.projectInvestSum);//项目总投资
				vm.model.shenBaoInfo.projectInvestAccuSum=common.toMoney(vm.model.shenBaoInfo.projectInvestAccuSum);//累计完成投资
				vm.model.shenBaoInfo.capitalSCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys);//市财政-公共预算
				vm.model.shenBaoInfo.capitalSCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.shenBaoInfo.capitalSCZ_zxzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.shenBaoInfo.capitalQCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_ggys);//区财政-公共预算
				vm.model.shenBaoInfo.capitalQCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.shenBaoInfo.capitalZYYS=common.toMoney(vm.model.shenBaoInfo.capitalZYYS);//中央预算
				vm.model.shenBaoInfo.capitalSHTZ=common.toMoney(vm.model.shenBaoInfo.capitalSHTZ);//社会投资
				vm.model.shenBaoInfo.capitalOther=common.toMoney(vm.model.shenBaoInfo.capitalOther);//其他
				//申请资金
				vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear);
				vm.model.shenBaoInfo.capitalSCZ_qita=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
				//计算资金筹措总计
				vm.capitalTotal=function(){
		  			 return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_zxzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_ggys)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_gtzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSHTZ)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalZYYS)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalOther)||0) ;
		  		 };
				if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
					vm.isYearPlan = true;
					vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
				}else if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
					vm.isProjectProposal=true;
					vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
				}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
					vm.isKXXYJBG=true;
					vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
				}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
					vm.isCBSJYGS=true;
					vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
				}
		  		//申请资金计算
		  		vm.lastTwoYearCapitalTotal = function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear)||0);
		  		};
		  		vm.lastYearCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear)||0);
		  		};
		  		vm.theYearCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear)||0);
		  		};
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end getShenBaoInfoById
		
		function handle(vm){
			vm.model.taskRecord.nextUser = vm.nextUser;
			var httpOptions = {
				method : 'put',
				url : url_task+"/"+vm.taskId,
				data : vm.model.taskRecord
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
								location.href = url_back;
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
	}//handle

		/**
		 * 根据任务id查询任务信息
		 */
		function getTaskById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_task + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				vm.task = response.data.value[0] || {};
				if(vm.task){
					vm.task.taskTypeDesc=common.getBasicDataDesc(vm.task.taskType);
					if(vm.task.isComplete){//如果任务为已完成
						vm.isComplete=true;
					}
				}	
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//getTaskById
		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
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
				},
				filter:{
					field:'isComplete',
					operator:'eq',
					value:false
				},
				requestEnd:function(e){						
					$('#todoNumber').html(e.response.count);					
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "title",
						title : "标题",						
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 400,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 200,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: $linq(common.getBasicData())
			             	       					.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			             	       					.toArray(),
			                            dataTextField: "description",
			                            dataValueField: "id"
			                        });
			                    }
						}
					},
					 {
						field : "taskType",
						title : "任务类型",
						width : 180,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 180,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
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
				
		function completeGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord),
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "title",
						title : "标题",						
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 400,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 200,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: $linq(common.getBasicData())
			             	       					.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			             	       					.toArray(),
			                            dataTextField: "description",
			                            dataValueField: "id"
			                        });
			                    }
						}
					},
					 {
						field : "taskType",
						title : "任务类型",
						width : 180,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 180,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
						}

					}

			];
			// End:column

			vm.gridOptions_complete = {
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
        .controller('yearPlanCtrl', yearPlan);

    yearPlan.$inject = ['$location','yearPlanSvc','$state','$scope','$sce']; 

    function yearPlan($location, yearPlanSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.model={};
    	vm.basicData={};
    	vm.title='申报信息编辑';
    	vm.search={};
        vm.id=$state.params.id;
        vm.investmentType=$state.params.projectInvestmentType;
        vm.stage=$state.params.stage;
    	vm.page="shenbaoInfoList";//默认为申报信息列表页面
        
    	function init(){
    		if($state.current.name=='yearPlan_shenbaoInfoEdit'){//申报信息编辑页面
    			vm.page='shenbaoInfoEdit';
    		}
    		if($state.current.name=='yearPlan_planList'){
    			vm.page='planList';
    		}
    		if($state.current.name=='yearPlan_planEdit'){
    			vm.page='plan_create';
    		}
    		if($state.current.name=='yearPlan_planEdit'&&vm.id){
    			vm.page='plan_update';
    		}
    		if($state.current.name=='yearPlan_planBZ'){
    			vm.page='planBZ';
    		}
    		
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};
           	
           	vm.getBasicDataDesc = function(str){
           		return common.getBasicDataDesc(str);
           	};
           	
           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
           	
           	//编制列表全选框选择
        	$(document).on('click', '#checkboxAll_shenBaoList', function () {
                var isSelected = $(this).is(':checked');
                $('.yearPlanCapitalGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
           	//条件查询、编辑--基础数据
           	vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	
	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
      	   	vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段 	   		
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质	   		
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
   	   			.toArray(); //行政区划街道  			   		
    	}
    	init();    	
    	activate();
        function activate() {        	
        	if(vm.page=='shenbaoInfoList'){
        		init_shenbaoInfoList();
        	}
        	if(vm.page=='shenbaoInfoEdit'){
        		init_shenbaoInfoEdit();
        	}
        	if(vm.page=='planList'){
        		init_planList();
        	}
        	if(vm.page=='plan_create'){
        		init_planCreate();
        	}
        	if(vm.page=='plan_update'){
        		vm.isPlanEdit=true;
        		init_planUpadte();
        	}
        	if(vm.page=='planBZ'){
        		init_planBZ();
        	}
        	
        	//全选框选择
        	$(document).on('click', '#checkboxAll_shenBaoList', function () {
                var isSelected = $(this).is(':checked');
                $('.yearPlanCapitalGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        }
        
    	function init_shenbaoInfoList(){
    		yearPlanSvc.grid_shenbaoInfoList(vm);
    		//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_qianShou});//默认条件--申报信息的状态为签收状态   
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.projectCategory !=null && vm.search.projectCategory !=''){//查询条件--项目类别
     			   filters.push({field:'projectCategory',operator:'eq',value:vm.search.projectCategory});
     		   }
     		   if(vm.search.planYear !=null && vm.search.planYear !=''){//查询条件--计划年度
     			  filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear)});
     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位名称
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.auditState !=null && vm.search.auditState !=''){//查询条件--审核状态
     			  filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
     		   }
     		   if(vm.search.projectConstrChar !=null && vm.search.projectConstrChar !=''){//查询条件--建设性质
     			  filters.push({field:'projectConstrChar',operator:'eq',value:vm.search.projectConstrChar});
     		   }
     		  vm.gridOptions.dataSource.filter(filters);
     		  vm.gridOptions.dataSource.read();
    		};
    		//申报详情模态框
    		vm.dialog_shenbaoInfo = function(id){
    			yearPlanSvc.getShenBaoInfoById(vm,id);
    			$('#shenbaoInfo').modal({
                    backdrop: 'static',
                    keyboard:false
                });
    			//初始化tab
          	   vm.tabStripOptions={
          			//TODO
          	   };
    		};
    		//列表退文按钮
    		vm.retreat = function(id){
    			common.confirm({
    				vm:vm,
    				msg:"确定需要退文吗？",
    				fn:function(){
    					$('.confirmDialog').modal('hide');
    					//退文信息收集模态框弹出
    					$("#shenbaoInfoTuiWen").modal({
    				        backdrop: 'static',
    				        keyboard:false
    				    });
    					vm.model.relId = id;
    	    			vm.model.processState = common.basicDataConfig().processState_tuiWen;
    					//退文信息收集模态框确认
    					vm.retreatSubmit=function(){
    						$("#shenbaoInfoTuiWen").modal('hide');
    						yearPlanSvc.updateShenBaoInfoState(vm);
    					};
    				}
    			});
    		};
    		
    	}//end#init_shenbaoInfoList
    	
    	function init_shenbaoInfoEdit(){
    		vm.auditState_auditPass=common.basicDataConfig().auditState_auditPass;//审核通过
    		vm.auditState_auditNotPass=common.basicDataConfig().auditState_auditNotPass;//审核未通过
    		//初始化页面
    		var init_page = function(){
	 		  vm.isYearPlan=vm.stage==common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为下一年度计划
	 		  if(vm.isYearPlan){
	 			 vm.isYearPlan = true;
   			   //初始化项目材料清单
   			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
   			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
	 		  }
	 	
	 		//禁止点击Tab切换
	 		  $("#tab1").attr("disabled","true");
	 		  $("#tab2").attr("disabled","true");
	 		  $("#tab3").attr("disabled","true");
	 		  $("#tab4").attr("disabled","true");
    		};
    		//初始化基础数据
    		var init_basicData = function(){
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
    	};
    	
    	init_page();
    	init_basicData();
    	
    	yearPlanSvc.getShenBaoInfoById(vm,vm.id);
    	
   		//获取项目类型， 多选
   		vm.updateSelection = function(id){
        	var index = vm.model.projectType.indexOf(id);
        	if(index == -1){
        		vm.model.projectType.push(id);
	       	}else{
	       		vm.model.projectType.splice(index,1);
	       	}	        	
        };
        
        //申报年份发生变化时触发
        vm.changeYear = function(){
  		   vm.planYear = parseInt(vm.model.shenBaoInfo.planYear);
  	    };
        
        //展示批复文件选择模态框
   		vm.choseDocument = function(e){
   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
     	   $("#documentRecords").modal({
		        backdrop: 'static',
		        keyboard:false  			  
     	   });
     	   vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
   		};
   		yearPlanSvc.documentRecordsGird(vm);//查询批复文件
 	   		
   		//批复文件选择模态框确认
   		vm.pifuChoseConfirm = function(){
   			//关闭模态框
   			$("#documentRecords").modal('hide');
   			$(".modal-backdrop").remove();
   			//获取选择框中的信息
   			var select = common.getKendoCheckId('.grid');
         	var fileName = select[0].value;
         	
			    if(vm.model.shenBaoInfo.attachmentDtos){
				  vm.model.shenBaoInfo.attachmentDtos.push({name:fileName,url:fileName,type:vm.pifuType});
			    }else{
				  vm.model.shenBaoInfo.attachmentDtos=[{name:fileName,url:fileName,type:vm.pifuType}];
			    }    			          		
        };
     	  
   		//文件上传
 	   vm.uploadSuccess=function(e){
			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
           	 if(e.XMLHttpRequest.status==200){
           		 var fileName=e.XMLHttpRequest.response;
           		 $scope.$apply(function(){
           			 if(vm.model.shenBaoInfo.attachmentDtos){
           				 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
           			 }else{
           				 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
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
           	 vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
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
      		
      	//项目纳入项目库
  		vm.addProjectToLibray=function(){
  			yearPlanSvc.addProjectToLibrary(vm);
  		};
      	//更新项目信息
  		vm.updateProject=function(){
  			yearPlanSvc.updateProject(vm);
  		};
  		//确认更新
     	vm.update = function(){
     		yearPlanSvc.updateShenBaoInfo(vm);
     	};
     	//更新审核状态
     	vm.updateAuditState=function(auditState){
     		yearPlanSvc.updateAuditState(vm,auditState);
     	};
    }//end#init_shenbaoInfoEdit

    	//init_planList
    	function init_planList(){
    		yearPlanSvc.grid_planList(vm);
    	}//init_planBZList    
    	
    	function init_planCreate(){
    		vm.create=function(){    		
    			yearPlanSvc.plan_create(vm);
    		};
    	}//init_planBZList 
    	
    	function init_planUpadte(){
    		yearPlanSvc.getPlanById(vm);
    		vm.update=function(){
    			yearPlanSvc.plan_update(vm);
    		};
    	}//init_planUpadte
    	
    	function init_planBZ(){   		
    		yearPlanSvc.grid_yearPlan_shenbaoInfoList(vm);//查询年度计划编制中的申报信息列表
    		yearPlanSvc.grid_yearPlan_addShenbaoInfoList(vm);//查询所有的可添加的申报信息列表 
    		
    		//添加项目计划弹出模态框
    		vm.dialog_addPlan=function(){
    			 $('#addPlanList').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
    		};
    		//年度筛选
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_qianShou});//默认条件--申报信息的状态为签收状态   
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.projectCategory !=null && vm.search.projectCategory !=''){//查询条件--项目类别
     			   filters.push({field:'projectCategory',operator:'eq',value:vm.search.projectCategory});
     		   }
     		   if(vm.search.planYear !=null && vm.search.planYear !=''){//查询条件--计划年度
     			  filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear)});
     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位名称
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.auditState !=null && vm.search.auditState !=''){//查询条件--审核状态
     			  filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
     		   }
     		   if(vm.search.projectConstrChar !=null && vm.search.projectConstrChar !=''){//查询条件--建设性质
     			  filters.push({field:'projectConstrChar',operator:'eq',value:vm.search.projectConstrChar});
     		   }
     		  vm.addPlanGridOptions.dataSource.filter(filters);
     		  vm.addPlanGridOptions.dataSource.read();
    		};
    		//模态框点击确认
    		vm.dialogConfirmSubmit=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	return;
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');              
                    $('#addPlanList').modal('toggle');//关闭模态框
                    yearPlanSvc.addShenBaoInfoconfirm(vm,idStr);//添加申报信息到计划中                  
                }   
    		};
    		//编制计划中的申报信息
    		 vm.popOver=function(e,id){
    			 //根据申报信息id查询出年度计划编制
    			 vm.currentCapitalId=id;
    			 yearPlanSvc.getYearPlanCapitalById(vm,id);
    			 //编制信息输入显示
    	    	   vm.isPopOver=true;
    	    	   var minClick=$(document).height()-50-230;
    	    	   if(e.pageY>minClick){
    	    		   e.pageY=minClick;
    	    	   }
    	    	   vm.popStyle={    	    			  
    	    			   left:e.pageX+'px',
    	    			   top:e.pageY+'px'
    	    	   };  
    	       };//popOver
    	     //更新编制信息  
    		 vm.updateCapital = function(){
    			 yearPlanSvc.updateYearPlanCapital(vm);
    		 };
    		 //移除计划中的申报信息
    		 vm.removeYearPlanCapital=function(){
    	    		var selectIds = common.getKendoCheckId('.yearPlanCapitalGrid');
    	            if (selectIds.length == 0) {
    	            	common.alert({
    	                	vm:vm,
    	                	msg:'请选择数据'              	
    	                });
    	            } else {
    	            	var ids=[];
    	                for (var i = 0; i < selectIds.length; i++) {
    	                	ids.push(selectIds[i].value);
    					}
    	                var idStr=ids.join(','); 
    	                yearPlanSvc.removeYearPlanCapital(vm,idStr);
    	            }
    	    	};//removeYearPlanCapital   			
    	}//init_planBZ   	    	    	   	
    } //yearPlan
})();
;(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http','$location'];

	function yearPlan($http,$location) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_planList="/management/yearPlan";
		var url_planCapital="/management/yearPlanCapital";
		var url_back_planList="#/yearPlan/planList";
		var url_document="/management/replyFile";
		var url_back_shenbaoInfoList="#/yearPlan/shenbaoInfoList";
		
		var service = {
			grid_shenbaoInfoList : grid_shenbaoInfoList,//申报项目列表
			updateShenBaoInfoState:updateShenBaoInfoState,//更新申报信息的状态
			addProjectToLibrary:addProjectToLibrary,//项目纳入项目库
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			updateAuditState:updateAuditState,//更新申报信息的审核状态
			updateProject:updateProject,//更新项目基本信息
			grid_planList:grid_planList,//年度计划列表
			plan_create:plan_create,//创建年度计划
			plan_update:plan_update,//更新年度计划
			getPlanById:getPlanById,//根据年度计划id查找计划信息
			grid_yearPlan_shenbaoInfoList:grid_yearPlan_shenbaoInfoList,//年度计划编制信息列表
			grid_yearPlan_addShenbaoInfoList:grid_yearPlan_addShenbaoInfoList,//年度计划编制新增项目申报列表
			addShenBaoInfoconfirm:addShenBaoInfoconfirm,//年度计划新增项目申报			
			getShenBaoInfoById:getShenBaoInfoById,//根据申报id查找申报信息
			getYearPlanCapitalById:getYearPlanCapitalById,//根据申报id查找年度计划编制信息
			updateYearPlanCapital:updateYearPlanCapital,//更新年度计划编制信息	
			removeYearPlanCapital:removeYearPlanCapital,//移除申报项目
			documentRecordsGird:documentRecordsGird//批复文件列表
		};
		
		//查询批复文件
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
				pageSize : 10
					
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
		 * 项目纳入项目库
		 */
		function addProjectToLibrary(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbaoInfoList+"/addProjectToLibrary?shenbaoInfoId={0}",vm.id)
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
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
				
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 * 更新项目基本信息
		 */
		function updateProject(vm){
			//处理项目类型多选问题
			vm.model.shenBaoInfo.projectType=common.arrayToString(vm.model.shenBaoInfo.projectType,',');
			var httpOptions = {
					method : 'put',
					url : common.format(url_shenbaoInfoList+"/updateProjectBasic"),
					data:vm.model.shenBaoInfo
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
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 *更新申报信息的审核状态
		 */
		function updateAuditState(vm,auditState){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbaoInfoList+"/updateAuditState"),
					dataType:'json',
					data:{"id":vm.id,"auditState":auditState}
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
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		/**
		 *更新申报信息的状态 
		 */
		function updateShenBaoInfoState(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbaoInfoList+"/updateState"),
					data:vm.model
				};
			
			var httpSuccess = function success(response) {
				common.alert({
					vm:vm,
					msg:"操作成功！",
					fn:function(){
						$('.alertDialog').modal('hide');
						$('.modal-backdrop').remove();
						vm.grid.dataSource.read();
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});	
		}
		
		function updateShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//处理项目类型多选问题
				vm.model.shenBaoInfo.projectType=common.arrayToString(vm.model.shenBaoInfo.projectType,',');
				vm.model.shenBaoInfo.auditState=common.basicDataConfig().auditState_noAudit;//后台修改保存申报信息之后默认为未审核状态
				//安排资金计算
				vm.model.shenBaoInfo.yearInvestApproval=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastTwoYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear || 0);
				var httpOptions = {
						method : 'put',
						url : common.format(url_shenbaoInfoList),
						data:vm.model.shenBaoInfo
					};
			
				var httpSuccess = function success(response) {
					common.alert({
						vm:vm,
						msg:"操作成功！",
						fn:function(){
							$('.alertDialog').modal('hide');
							$('.modal-backdrop').remove();
							location.href=url_back_shenbaoInfoList;
						}
					});
				};
			
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		
		function removeYearPlanCapital(vm,id){
			var httpOptions = {
					method : 'post',
					url : common.format(url_planList+"/removeCapital?planId={0}&yearPlanCapitalId={1}",vm.id,id)
				};
			
			var httpSuccess = function success(response) {
				vm.planGridOptions.dataSource.read();//编制申报信息列表数据刷新
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});	
		}//removeYearPlanCapital
		
		/**
		 * 更新年度计划编制信息
		 */
		function updateYearPlanCapital(vm){
			vm.model.capital.capitalSum=common.toDecimal4(
						parseFloat(vm.model.capital.capitalSCZ_ggys || 0)
					   +parseFloat(vm.model.capital.capitalSCZ_gtzj||0)
					   +parseFloat(vm.model.capital.capitalSCZ_zxzj||0)
					   +parseFloat(vm.model.capital.capitalQCZ_ggys||0)
					   +parseFloat(vm.model.capital.capitalQCZ_gtzj||0)
					   +parseFloat(vm.model.capital.capitalSHTZ||0)
					   +parseFloat(vm.model.capital.capitalZYYS||0)
					   +parseFloat(vm.model.capital.capitalOther||0));

			var httpOptions = {
					method : 'put',
					url : url_planCapital,
					data:vm.model.capital
				};
			
			var httpSuccess = function success(response) {
				getPlanById(vm);//查询计划--更新页面数据
				$('#capitalSum_'+vm.currentCapitalId).val(vm.model.capital.capitalSum);
				vm.isPopOver = false;
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end updateYearPlanCapital
		
		/**
		 * 根据申报id查找年度计划编制信息
		 */
		function getYearPlanCapitalById(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planCapital + "?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.capital = response.data.value[0]||{};
				//进行金额的处理
				vm.model.capital.capitalSCZ_ggys = common.toMoney(vm.model.capital.capitalSCZ_ggys);
				vm.model.capital.capitalSCZ_gtzj = common.toMoney(vm.model.capital.capitalSCZ_gtzj);
				vm.model.capital.capitalSCZ_zxzj = common.toMoney(vm.model.capital.capitalSCZ_zxzj);
				vm.model.capital.capitalQCZ_ggys = common.toMoney(vm.model.capital.capitalQCZ_ggys);
				vm.model.capital.capitalQCZ_gtzj = common.toMoney(vm.model.capital.capitalQCZ_gtzj);
				vm.model.capital.capitalSHTZ = common.toMoney(vm.model.capital.capitalSHTZ);
				vm.model.capital.capitalZYYS = common.toMoney(vm.model.capital.capitalZYYS);
				vm.model.capital.capitalOther = common.toMoney(vm.model.capital.capitalOther);
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getYearPlanCapitalById
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbaoInfoList + "?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value[0]||{};
				//年度计划申报年份处理
				vm.planYear = vm.model.shenBaoInfo.planYear;
				//项目类型的显示
				vm.model.shenBaoInfo.projectType = common.stringToArray(vm.model.shenBaoInfo.projectType,',');
				//判断项目的投资类型
				if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
					vm.isSHInvestment = true;
				}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
					vm.isZFInvestment = true;
				}
				//日期展示
				vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
				vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
				vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
				vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
				//资金处理
				vm.model.shenBaoInfo.projectInvestSum=common.toMoney(vm.model.shenBaoInfo.projectInvestSum);//项目总投资
				vm.model.shenBaoInfo.projectInvestAccuSum=common.toMoney(vm.model.shenBaoInfo.projectInvestAccuSum);//累计完成投资
				vm.model.shenBaoInfo.capitalSCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys);//市财政-公共预算
				vm.model.shenBaoInfo.capitalSCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.shenBaoInfo.capitalSCZ_zxzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.shenBaoInfo.capitalQCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_ggys);//区财政-公共预算
				vm.model.shenBaoInfo.capitalQCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.shenBaoInfo.capitalZYYS=common.toMoney(vm.model.shenBaoInfo.capitalZYYS);//中央预算
				vm.model.shenBaoInfo.capitalSHTZ=common.toMoney(vm.model.shenBaoInfo.capitalSHTZ);//社会投资
				vm.model.shenBaoInfo.capitalOther=common.toMoney(vm.model.shenBaoInfo.capitalOther);//其他
				//申请资金
				vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear);
				vm.model.shenBaoInfo.capitalSCZ_qita=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastYear);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
				
				//安排资金
				vm.model.capitalAP_ggys_TheYear=common.toMoney(vm.model.capitalAP_ggys_TheYear);
				vm.model.capitalAP_gtzj_TheYear=common.toMoney(vm.model.capitalAP_gtzj_TheYear);
				vm.model.capitalAP_qita=common.toMoney(vm.model.capitalAP_qita);
				
				vm.model.capitalAP_gtzj_LastYear=common.toMoney(vm.model.capitalAP_gtzj_LastYear);
				vm.model.capitalAP_ggys_LastYear=common.toMoney(vm.model.capitalAP_ggys_LastYear);
				vm.model.capitalAP_qita_LastYear=common.toMoney(vm.model.capitalAP_qita_LastYear);
				
				vm.model.capitalAP_ggys_LastTwoYear=common.toMoney(vm.model.capitalAP_ggys_LastTwoYear);
				vm.model.capitalAP_gtzj_LastTwoYear=common.toMoney(vm.model.capitalAP_gtzj_LastTwoYear);
				vm.model.capitalAP_qita_LastTwoYear=common.toMoney(vm.model.capitalAP_qita_LastTwoYear);
				
			
				//计算资金筹措总计
				vm.capitalTotal=function(){
		  			 return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_zxzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_ggys)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_gtzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSHTZ)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalZYYS)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalOther)||0) ;
		  		 };
		  		 
		  		 //申请资金计算
		  		vm.lastTwoYearCapitalTotal = function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear)||0);
		  		};
		  		vm.lastYearCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear)||0);
		  		};
		  		vm.theYearCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear)||0);
		  		};
		  		
		  		//安排资金
		  		vm.lastTwoYearAPCapitalTotal = function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear)||0);
		  		};
		  		vm.lastYearAPCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear)||0);
		  		};
		  		vm.theYearAPCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear)||0);
		  		};
				//如果申报信息的申报阶段为下一年度计划
		  		if(vm.page=='shenbaoInfoList'){//如果为列表页时--申报详情链接
		  			if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
						 vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
						 vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
		    			   vm.isYearPlan = true;
					}
		  		}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getShenBaoInfoById
				
		/**
		 * 年度计划新增项目申报
		 */
		function addShenBaoInfoconfirm(vm,ids){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList+"/addCapital?planId={0}&shenBaoId={1}",vm.id,ids)
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
								$('.alertDialog').modal('hide');
								vm.planGridOptions.dataSource.read();//编制申报信息列表数据刷新								
							}
						});
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});			
		}//end addShenBaoInfoconfirm
		
		/**
		 * 根据id查找年度计划信息
		 */
		function getPlanById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList + "?$filter=id eq '{0}'", vm.id)					
				};
			
			var httpSuccess = function success(response) {
				if(vm.page=='plan_update'){//用于年度计划基本信息的编辑
					vm.model=response.data.value[0] || {};
				}					
				if(vm.page=='planBZ'){//用于年度计划的编制
					vm.model.plan=response.data.value[0] || {};						
					//数据汇总数据计算
					var Capitals = vm.model.plan.yearPlanCapitalDtos;
					//属于该年度计划编制的申报项目信息
					var shenBaoInfoList = vm.planGridOptions.dataSource._data;
					//项目总数
					vm.model.shenBaoInfoTotal = shenBaoInfoList.length;
					vm.model.QianQiTotal = 0;//前期
					vm.model.NewStratTotal = 0;//新开工
					vm.model.XuJianTotal = 0;//续建
					vm.model.ChuBeiTotal = 0;//储备类
					vm.model.projectInvestSumTotal = 0;//项目总投资
					vm.model.applyYearInvestTotal = 0;//申请资金总额
					
					for(var j=0;j<shenBaoInfoList.length;j++){
						var obj = shenBaoInfoList[j];
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_qianqi){//前期
							vm.model.QianQiTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_xinkaigong){//新开工
							vm.model.NewStratTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_xujian){//续建
							vm.model.XuJianTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_chubei){//储备类
							vm.model.ChuBeiTotal ++;
						}
						if(obj.projectInvestSum){//总投资
							vm.model.projectInvestSumTotal += obj.projectInvestSum;
						}
						if(obj.applyYearInvest){//年度申请资金
							vm.model.applyYearInvestTotal += obj.applyYearInvest;
						}
//						if(obj.yearInvestApproval){//年度安排资金
//							vm.model.yearInvestApprovalTotal += obj.yearInvestApproval;
//						}
					}
					//计划总规模						
					vm.model.yearInvestApprovalTotal = 0;//安排资金总计
					vm.model.capitalSCZ_ggysTotal = 0;//市投资-公共预算
					vm.model.capitalSCZ_gtzjTotal = 0;//市投资-国土基金
					vm.model.capitalSCZ_zxzjTotal = 0;//市投资-专项基金
					vm.model.capitalQCZ_ggysTotal = 0;//区投资-公共预算
					vm.model.capitalQCZ_gtzjTotal = 0;//区投资-国土基金
					vm.model.capitalZYYSTotal = 0;//中央预算内投资
					vm.model.capitalSHTZTotal = 0;//社会投资

					vm.model.capitalOtherTotal = 0;
					for(var i=0;i<Capitals.length;i++){						
						if(Capitals[i].capitalSCZ_ggys){
							vm.model.capitalSCZ_ggysTotal += Capitals[i].capitalSCZ_ggys;
						}
						if(Capitals[i].capitalSCZ_gtzj){
							vm.model.capitalSCZ_gtzjTotal += Capitals[i].capitalSCZ_gtzj;
						}
						if(Capitals[i].capitalSCZ_zxzj){
							vm.model.capitalSCZ_zxzjTotal += Capitals[i].capitalSCZ_zxzj;
						}
						if(Capitals[i].capitalQCZ_ggys){
							vm.model.capitalQCZ_ggysTotal += Capitals[i].capitalQCZ_ggys;
						}
						if(Capitals[i].capitalQCZ_gtzj){
							vm.model.capitalQCZ_gtzjTotal += Capitals[i].capitalQCZ_gtzj;
						}
						if(Capitals[i].capitalZYYS){
							vm.model.capitalZYYSTotal += Capitals[i].capitalZYYS;
						}
						if(Capitals[i].capitalSHTZ){
							vm.model.capitalSHTZTotal += Capitals[i].capitalSHTZ;
						}
						if(Capitals[i].capitalOther){
							vm.model.capitalOtherTotal += Capitals[i].capitalOther;
						}
						if(Capitals[i].capitalSum){//年度安排资金
							vm.model.yearInvestApprovalTotal += Capitals[i].capitalSum;
						}
					}
				}
				
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getPlanById
		
		/**
		 * 年度计划编制信息列表
		 */
		function grid_yearPlan_shenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList+"/"+vm.id+"/projectList"),
				schema : common.kendoGridConfig().schema({
					id : "yearPlanCapitalId"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 1000,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				requestEnd:function(){
					getPlanById(vm);//请求结束后查询年度计划刷新数据
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						field:"",
						template : function(item) {
							return kendo.format("<input type='checkbox' relId='{0}' name='checkbox' class='checkbox'/>",item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll_shenBaoList' type='checkbox'  class='checkbox'/>"
					},
					{
						field : "shenBaoUnitInfoDto.unitName",
						title : "建设单位",
						width:120,
						template:function(item){
							return common.format(item.shenBaoUnitInfoDto.unitName);
						},
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format('<a href="#/projectDetails/{0}/{1}" >{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						width:200,
						filterable : false
					},					
					{
						field : "functionSubjects",
						title : "功能科目",
//						template:function(item){
//							return common.getBasicDataDesc(item.functionSubjects);
//						},
						width:110,
						filterable : false
					},
					{
						field : "econClassSubjects",
						title : "经济分类科目",
//						template:function(item){
//							return common.getBasicDataDesc(item.econClassSubjects);
//						},
						width:140,
						filterable : false
					},
					{
						field : "projectIndustryDesc",
						title : "行业领域",
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						width:100,
						filterable : false	
					},
					{
						field : "projectCategoryDesc",
						title : "项目类别",
						width : 80,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : false
					},
					{
						field : "projectConstrCharDesc",
						title : "建设性质",						
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						width : 80,
						filterable : false
					},
					{
						field : "beginDate",
						title : "开工/竣工时间",
						width : 100,
						template:function(item){
							if(item.projectCategory==common.basicDataConfig().projectCategory_A){
								return common.formatDate(item.endDate);
							}else if(item.projectCategory==common.basicDataConfig().projectCategory_B || 
									item.projectCategory==common.basicDataConfig().projectCategory_C ||
									item.projectCategory==common.basicDataConfig().projectCategory_D){
								return common.formatDate(item.beginDate);
							}					
						},
						filterable : false
					},
					{
						field : "projectGuiMo",
						title : "建设规模及主要建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.projectGuiMo); },
						filterable : false
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width:120,
						filterable : false
					},
					{
						field : "projectInvestAccuSum",
						title : "已拨付资金（万元）",
						width:145,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
						width:100,
						filterable : false
					},
					{
						field : "yearConstructionContent",
						title : "本年度建设内容",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContent); },
						filterable : false
					},
					{
						field : "capitalSCZ_ggys_TheYear",
						title : "资金需求及资金来源--公共预算（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_gtzj_TheYear",
						title : "资金需求及资金来源--国土基金（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_qita",
						title : "资金需求及资金来源--其他（万元）",
						width:100,
						filterable : false
					},
					{
						field : "planYear+1",
						title : "计划年度",
						width:100,
						filterable : false
					},
					{
						field : "yearConstructionContentLastYear",
						title : "本年度建设内容",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastYear); },
						filterable : false
					},
					{
						field : "capitalSCZ_ggys_LastYear",
						title : "资金需求及资金来源--公共预算（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_gtzj_LastYear",
						title : "资金需求及资金来源--国土基金（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_qita_LastYear",
						title : "资金需求及资金来源--其他（万元）",
						width:100,
						filterable : false
					},
					{
						field : "planYear+2",
						title : "计划年度",
						width:100,
						filterable : false
					},
					{
						field : "yearConstructionContentLastTwoYear",
						title : "本年度建设内容",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastTwoYear);},
						filterable : false
					},
					{
						field : "capitalSCZ_ggys_LastTwoYear",
						title : "资金需求及资金来源--公共预算（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_gtzj_LastTwoYear",
						title : "资金需求及资金来源--国土基金（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_qita_LastTwoYear",
						title : "资金需求及资金来源--其他（万元）",
						width:100,
						filterable : false
					},
//					{
//						field : "yearInvestApproval",
//						title : "安排资金（万元）",
//						width:100,
//						filterable : false
//					},
					{
						field : "yearInvestApproval",
						title : "安排资金（万元）",
						template :function(item){					
							return common.format($('#input').html(),item.id,item.yearInvestApproval || 0);
						},
						width:130,
						filterable : false
					},
					{
						field : "yearConstructionContentShenBao",
						title : "备注",
						width : 150,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:10px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.remark); },
						filterable : false				
					}

			];
			// End:column
			
			var excelExport = function(e) {
					var data = e.data;
					var sheet = e.workbook.sheets[0];
					var template = this.columns[8].template;
					
					for(var j=0;j<data.length;j++){
						var timeFormat = template(data[j]);
						for (var i = 1; i < sheet.rows.length; i++) {
						      var row = sheet.rows[i];
							  row.cells[7].value = 	timeFormat;		      
						    }
					}				    
				  };

			vm.planGridOptions = {
				excel: {
		                fileName: "年度计划编制.xlsx"
		            	},
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,				
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				excelExport:excelExport
			};
		}//end grid_yearPlan_shenbaoInfoList
		
		/**
		 * 年度计划编制新增项目申报列表
		 */
		function grid_yearPlan_addShenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
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
				},
				filter:[{//申报阶段为下一年度计划
					field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
				},{//审批状态为签收
					field:'processState',
					operator:'eq',
					value:common.basicDataConfig().processState_qianShou
				},{//审核状态为审核通过
					field:'auditState',
					operator:'eq',
					value:common.basicDataConfig().auditState_auditPass
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width:200,
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						},
						width : 150,
						filterable : false
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资（万元）",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){
							return common.formatDateTime(item.createdDate);
							}
					}

			];
			// End:column

			vm.addPlanGridOptions = {	
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end grid_addShenbaoInfoList
		
		/**
		 *创建年度计划 
		 */
		function plan_create(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				
				var httpOptions = {
					method : 'post',
					url : url_planList,
					data : vm.model
				};
				
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//end plan_create
		
		/**
		 * 更新年度计划
		 */
		function plan_update(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				
				var httpOptions = {
					method : 'put',
					url : url_planList,
					data : vm.model
				};
				
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//end plan_update

		return service;
		
		/**
		 * 年度计划列表
		 */
		function grid_planList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList),
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
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "编制名称",						
					filterable : true
				},
				{
					field : "year",
					title : "计划年度",
					width : 150,
					filterable : false
				},
				{
					field : "createdDate",
					title : "创建日期",
					width : 180,
					filterable : false,
					template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
				},{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
					}
				}
			];
			// End:column

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid_planList
		
		
		/**
		 * 申报项目列表
		 */
		function grid_shenbaoInfoList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						isIncludLibrary:{
							type:"boolean"
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
					field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
				},{
					field:'processState',
					operator:'eq',
					value:common.basicDataConfig().processState_qianShou
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.id,item.projectName);
						},
						filterable : true
					},
					{
						field : "unitName",
						title : "建设单位",
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectCategory),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
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
						field : "planYear",
						title : "计划年度",
						width : 100,
						filterable : false
					},
					{
						field : "auditState",
						title : "审核状态",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().auditState),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "isIncludLibrary",
						title : "项目是否纳入项目库",
						width : 150,
						template:function(item){
							if(item.isIncludLibrary){
								return "已纳入";
							}else{
								return "未纳入";
							}
						},
						filterable :true
					},
					{
						field : "projectInvestSum",
						title : "总投资(万元)",
						width : 100,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资(万元)",
						width : 100,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){
							return common.formatDateTime(item.createdDate);
							}
					},
					{
						filed:"",
						title:"操作",
						width:150,
						template:function(item){
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
						}
					}
			];
			// End:column
			var excelExport = function(e) {
			    var sheet = e.workbook.sheets[0];

			    for (var i = 1; i < sheet.rows.length; i++) {
			      var row = sheet.rows[i];
			      row.cells[2].value = common.getBasicDataDesc(row.cells[2].value);//建设性质
			      row.cells[3].value = common.getBasicDataDesc(row.cells[3].value);//项目类别
			      row.cells[4].value = common.getBasicDataDesc(row.cells[4].value);//项目分类
				  row.cells[6].value = common.getBasicDataDesc(row.cells[6].value);//审核状态
				  if(row.cells[7].value){//项目是否纳入项目库
					  row.cells[7].value = "已纳入";
				  }else{
					  row.cells[7].value = "未纳入";
				  }
				  row.cells[10].value = common.formatDateTime(row.cells[10].value);//创建日期
			    }
			  };

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				excelExport:excelExport,
				resizable : true
			};

		}// end fun grid_shenbaoInfoList
	}
})();