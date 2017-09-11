﻿(function () {
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
        checkLength:checkLength,
        uploadFileTypeConfig:uploadFileTypeConfig,//上传文件配置
        stringToArray:stringToArray,
        arrayToString:arrayToString,
        toDecimal4:toDecimal4,//保留4位小数
        getUserUnits:getUserUnits,//获取所有的建设单位信息
        getUnitName:getUnitName,//根据单位id获取单位名称
        getSum:getSum,//求和
        repSign:repSign,//将英文类型的标点符号转换为中文的标点符号
        getRoles:getRoles//获取所有的角色
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
            keyboard:true
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
    		taskType_shenBao:"taskType_4",//任务状态-申报
    		
    		auditState:"auditState",//审核状态
    		auditState_noAudit:"auditState_1",//审核状态-未审核
    		auditState_auditPass:"auditState_2",//审核状态-审核通过
    		auditState_auditNotPass:"auditState_3",//审核状态-审核不通过
    		
    		packageType:"packageType",//打包类型
    		packageType_danLie:"packageType_1",
    			
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
			projectShenBaoStage_YearPlan:[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],['TTJH','历年政府投资计划下大文件  <span class="required">(*)</span>'],
				['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']],
			projectEdit:[['XMJYSPF','项目建议书批复文本'],['KXXYJBGPF','可行性研究报告批复文本'],['ZGSPFTZ','总概算批复及调整文本'],['HYJY','会议纪要'],
				['GHYJ','规划依据'],['SJXGT','设计效果图'],['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']]
    	};
    }
    
    function stringToArray(str,substr){
    	var arrTmp=[];
    	if(str !=null && str != ""){
    		if(str.constructor == Array){
        		return str;
        	}
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
		 var strTmp="";
		 if(arr !=null && arr.length>0){
			 if(arr.constructor == String){
		    		return str;
		    	}
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
    
    function getUserUnits(){
    	if(window.global_userUnits){ 
    		return window.global_userUnits;
    	}
    	$.ajax({
    		url:'/common/userUnit',
    		async:false,
    		success:function(response){
    			window.global_userUnits=response;    			
    		}
    	});
    	return window.global_userUnits;
    }
    
    function getUnitName(id){
    	var userUnits = getUserUnits();
    	var unitName = '';
    	for(var i=0;i<userUnits.length;i++){
    		var obj = userUnits[i];
    		if(id == obj.id){
    			unitName =  obj.unitName;
    			break;
    		}
    	}
    	return unitName;
    }
    
    function getSum(array){
    	var sum = 0;
    	function sumAdd(item, index, array){
    		sum += parseFloat(item);
    	}
    	array.forEach(sumAdd);
    	return toDecimal4(sum);
    }
    
    function repSign(str) {
    	var tmp = '',c=0;
    	  for(var i=0;i<str.length;i++){
    		 c=str.charCodeAt(i);
    		 tmp += String.fromCharCode((c>0 && c<0x80) ? (c+0xfee0) : c);
    	  }
    	  return tmp;
    }
    
    
    function getRoles(){
    	if(window.global_manageUser){ 
    		return window.global_roles;
    	}
    	$.ajax({
    		url:'/common/roles',
    		async:false,
    		success:function(response){
    			window.global_roles=response;    			
    		}
    	});
    	return window.global_roles;
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
