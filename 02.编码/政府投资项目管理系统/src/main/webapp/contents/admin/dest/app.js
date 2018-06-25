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
        checkLength:checkLength,
        uploadFileTypeConfig:uploadFileTypeConfig,//上传文件配置
        stringToArray:stringToArray,
        arrayToString:arrayToString,
        toDecimal4:toDecimal4,//保留4位小数
        getUserUnits:getUserUnits,//获取所有的建设单位信息
        getUnitName:getUnitName,//获取单位名称
        getSum:getSum,//求和
        repSign:repSign,//将英文类型的标点符号转换为中文的标点符号
        getLoginUser:getLoginUser,
        getRoles:getRoles,//获取所有的角色
        getRoleName:getRoleName//获取角色名称

    };

    window.common = service;

    function getLoginUser(){
    	var data = "";
    	if(window.global_User){ 
    		return window.global_User;
    	}else{
    		window.global_User = "";
    	}
    	$.ajax({
    		url:'/common/getUser',
    		async:false,
    		success:function(response){
    			data=response;    			
    		}

    	});
    	 data = data.split("\\u");
    	for (var i = 0; i < data.length; i++) {
    		if(data[i] != ""){
    			window.global_User+=String.fromCharCode(parseInt(data[i],16).toString(10));
    		}
		}
    	return window.global_User;
    }
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
    	//console.log(options);
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
    		processState_msFenBan:"processState_3",//秘书科分办
    		processState_banJie:"processState_11",//已办结
    		processState_tuiWen:"processState_15",//已退文
    		processState_next:"processState_16",
    		
    		fileSet:"fileSet",//文件缓急分类
    		fileSet_pingJian:"fileSet_1",//平件
    		fileSet_pingJi:"fileSet_2",//平急
    		fileSet_jiJian:"fileSet_3",//急件
    		fileSet_teJi:"fileSet_4",//特急
    		fileSet_teTi:"fileSet_5",//特提
    		
    		openType:"openType",//公开类型
    		openType_zhuDong:"openType_1",//主动公开
    		openType_yiShenQing:"openType_2",//依申请公开
    		openType_no:"openType_3",//不公开
    		
    		hecretHierarchy:"hecretHierarchy",//秘密等级
    		hecretHierarchy_gongKai:"hecretHierarchy_1",//公开
    		hecretHierarchy_guoNei:"hecretHierarchy_2",//国内
    		hecretHierarchy_neiBu:"hecretHierarchy_3",//内部
    		hecretHierarchy_miMi:"hecretHierarchy_4",//秘密
    		hecretHierarchy_jiMi:"hecretHierarchy_5",//机密
    		hecretHierarchy_jueMi:"hecretHierarchy_6",//绝密
    		
    		postingCategory:"postingCategory",//发文种类
    		postingCategory_shang:"postingCategory_1",//上行文
    		postingCategory_ping:"postingCategory_2",//平行文
    		postingCategory_xia:"postingCategory_3",//下行文
    		
    		documentType:"documentType",//文件种类
    		documentType_han:"documentType_1",//函
    		documentType_zhiShi:"documentType_2",//指示
    		documentType_tongZhi:"documentType_3",//通知
    		documentType_mingLing:"documentType_4",//命令
    		documentType_jueDing:"documentType_5",//决定
    		documentType_gongGao:"documentType_6",//公告
    		documentType_tongGao:"documentType_7",//通告
    		documentType_tongBao:"documentType_8",//通报
    		documentType_yiAn:"documentType_9",//议案
    		documentType_baoGao:"documentType_10",//报告
    		documentType_qingShi:"documentType_11",//请示
    		documentType_piFu:"documentType_12",//批复
    		documentType_yiJian:"documentType_13",//意见
    		
    		projectShenBaoStage:"projectShenBaoStage",//申报阶段
    		projectShenBaoStage_projectProposal:"projectShenBaoStage_1",//项目建议书
    		projectShenBaoStage_KXXYJBG:"projectShenBaoStage_2",//可行性研究报告
    		projectShenBaoStage_CBSJYGS:"projectShenBaoStage_3",//初步设计与概算
    		projectShenBaoStage_prePlanFee:"projectShenBaoStage_4",//规划前期费
    		projectShenBaoStage_newStratPlan:"projectShenBaoStage_5",//新开工计划
    		projectShenBaoStage_xuJianPlan:"projectShenBaoStage_6",//续建计划
    		projectShenBaoStage_nextYearPlan:"projectShenBaoStage_7",//下一年度计划
    		projectShenBaoStage_junGong:"projectShenBaoStage_8",//竣工决算
    		projectShenBaoStage_capitalApplyReport:"projectShenBaoStage_9",//资金申请报告
    		
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
    		taskType_shenBao:"taskType_4",//任务状态-申报端口
    		taskType_JYS:"taskType_5",//项目建议书
    		taskType_KXXYJBG:"taskType_6",//可行性研究报告
    		taskType_CBSJYGS:"taskType_7",//初步概算与设计
    		taskType_qianQi:"taskType_8",//前期
    		taskType_newStart:"taskType_9",//新开工
    		taskType_xuJian:"taskType_10",//续建
    		taskType_junGongJueSuan:"taskType_11",//竣工决算
    		taskType_ZJSQBG:"taskType_12",//资金申请报告
   		
    		auditState:"auditState",//审核状态
    		auditState_noAudit:"auditState_1",//审核状态-未审核
    		auditState_auditPass:"auditState_2",//审核状态-审核通过
    		auditState_auditNotPass:"auditState_3",//审核状态-审核不通过
    		
    		packageType:"packageType",//打包类型
    		packageType_danLie:"packageType_1",
    			
    		management:"管理员",
    			
    	    credentialsType:"credentialsType",
    	    serviceRating:"serviceRating"
    		
    		
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
			projectShenBaoStage_prePlanFee:[['ProjectBasis','项目依据  <span class="required">(*)</span>'],['other','其他']],
			projectShenBaoStage_newStart:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['BudgetReply_Scanning','概算批复扫描件 <span class="required">(*)</span>'],
				['GCGHXKZ_Scanning','工程规划许可证扫描件'],['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']],
			projectShenBaoStage_xuJian:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['LastYearPlanReply_Copy','上一年度计划批文复印件 <span class="required">(*)</span>'],
				['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']],
			projectShenBaoStage_YearPlan:[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],['TTJH','历年政府投资计划下大文件  <span class="required">(*)</span>'],
					['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']],
			projectShenBaoStage_junGong:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['LastYearPlanReply_Copy','上一年度计划批文复印件 <span class="required">(*)</span>'],
					['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']],
			projectShenBaoStage_capitalApplyReport:[['ApplyReport_pdf','申请报告（pdf版，加盖公章）<span class="required">(*)</span>'],['ApplyReport_word','申请报告（Word版）<span class="required">(*)</span>'],['LastYearPlanReply_Copy','上一年度计划批文复印件 <span class="required">(*)</span>'],
				['IssuedReplyFile_Scanning','全部已下达计划批复文件扫描件 <span class="required">(*)</span>'],['other','其他']],	
			projectEdit:[['XMJYSPF','项目建议书批复文本'],['KXXYJBGPF','可行性研究报告批复文本'],['ZGSPFTZ','总概算批复及调整文本'],['HYJY','会议纪要'],
				['GHYJ','规划依据'],['SJXGT','设计效果图'],['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']],
			projectEdit_SH:[['XMJYSPF','项目建议书批复文本'],['KXXYJBGPF','可行性研究报告批复文本'],['ZGSPFTZ','总概算批复及调整文本'],['HYJY','会议纪要'],
				['GHYJ','规划依据'],['SJXGT','设计效果图'],['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']],
			reviewResult:[['PSBG','1、评审报告'],['TZKSSHB','（1）投资匡算审核表'],['ZJPSYJ','（2）专家评审意见'],['ZJPSZMD','（3）专家评审组名单'],
				['QT','2、其他']]
    	
    	//projectShenBaoStage_qianQi:[['ProjectBasis','项目依据  <span class="required">(*)</span>'],['other','其他']],
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
    
    function getUnitName(unitId){
    	getUserUnits();
    	var unitName = '';
    	for(var i=0;i<window.global_userUnits.length;i++){
    		var obj = window.global_userUnits[i];
    		if(unitId == obj.id){
    			unitName =  obj.unitName;
    			break;
    		}
    	}
    	return unitName;
    }
    
    function getRoles(){
    	if(window.global_manageUser){ 
    		return window.global_roles;
    	}else{
    		$.ajax({
        		url:'/common/roles',
        		async:false,
        		success:function(response){
        			window.global_roles=response;    			
        		}
        	});
    	}   		
    	return window.global_roles;
    }
    
    function getRoleName(roles,roleId){
    	//getRoles();
    	var roleName = '';
    	for(var i=0;i<window.global_roles.length;i++){
    		var obj = window.global_roles[i];
    		if(roleId == obj.id){
    			roleName =  obj.roleName;
    			break;
    		}
    	}
    	return roleName;
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
/**********************begin#monthReport***************************************/
	        //列表页--政府投资项目
	        .state('monthReport', {
	            url: '/monthReport',
	            templateUrl: '/management/monthReport/html/list',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
	        //列表页--社会投资项目
	        .state('monthReport_SH', {
	            url: '/monthReport_SH',
	            templateUrl: '/management/monthReport/html/list_SH',
	            controller: 'monthReportCtrl',
	            controllerAs: 'vm'
	        })
	        //修改页
           .state('monthReportChange', {
        	   url: '/monthReportChange/:projectId/:year/:month',
        	   templateUrl: '/management/monthReport/html/edit',
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
	        //政府投资项目
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
	        //社会投资项目
	        //列表页
	        .state('project_SH', {
	            url: '/project_SH',
	            templateUrl: '/management/project/html/list_SH.html',
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
	        
/**********************begin#目录管理***************************************/
	        //投资项目目录列表(默认显示项目行业分类列表)
	        .state('catalog_investment', {
	            url: '/catalog/investment',
	            templateUrl: '/management/catalog/html/investmentList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //投资项目次级列表页面
	        .state('catalog_investment_projectIndustry', {
	            url: '/catalog/investment/projectIndustry/:id/',
	            templateUrl: '/management/catalog/html/investmentSecondList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //投资项目修改页
	        .state('catalog_investmentAlter', {
	            url: '/catalog/investmentAlter/:id',
	            templateUrl: '/management/catalog/html/investmentEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	         //投资项目二级新增页
	        .state('catalog_addSecondCatalog', {
	            url: '/catalog/investmentEdit/addSecondCatalog/:id',
	            templateUrl: '/management/catalog/html/investmentEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //投资项目一级新增页
	        .state('catalog_investmentEdit', {
	            url: '/catalog/investmentEdit/:type',
	            templateUrl: '/management/catalog/html/investmentEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	         //投资项目目录列表(默认显示项目类型列表)
	        .state('catalog_investmentList_projectType', {
	            url: '/catalog/investment/projectTypeList',
	            templateUrl: '/management/catalog/html/investmentProjectTypeList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	         //投资项目目录列表(默认显示建设类型列表)
	        .state('catalog_investmentList_constructionType', {
	            url: '/catalog/investment/constructionTypeList',
	            templateUrl: '/management/catalog/html/investmentConstructionTypeList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录列表页页面(默认显示鼓励类)
	        .state('catalog_policy', {
	            url: '/catalog/policyCatalog',
	            templateUrl: '/management/catalog/html/policyCatalogList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录列表页页面(默认显示允许类)
	        .state('catalog_policyAllowList', {
	            url: '/catalog/policyCatalog/allowList',
	            templateUrl: '/management/catalog/html/policyCatalogAllowList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录列表页页面(默认显示限制类)
	        .state('catalog_policyLimitList', {
	            url: '/catalog/policyCatalog/limitList',
	            templateUrl: '/management/catalog/html/policyCatalogLimitList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录新增页面
	        .state('catalog_policyCatalogEdit', {
	            url: '/catalog/policyCatalogEdit/:type',
	            templateUrl: '/management/catalog/html/policyCatalogEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //政策目录条目修改页面
	        .state('catalog_policyCatalogAlter', {
	            url: '/catalog/policyCatalogEdit/:id/',
	            templateUrl: '/management/catalog/html/policyCatalogEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项目录列表页
	        .state('catalog_partApprovalMatters', {
	            url: '/catalog/partApprovalMattersList',
	            templateUrl: '/management/catalog/html/partApprovalMattersList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项新增页
	        .state('catalog_partApprovalMattersEdit', {
	            url: '/catalog/partApprovalMattersEdit',
	            templateUrl: '/management/catalog/html/partApprovalMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项修改页
	        .state('catalog_partApprovalMattersAlter', {
	            url: '/catalog/partApprovalMattersEdit/:id',
	            templateUrl: '/management/catalog/html/partApprovalMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项详情页
	        .state('catalog_partApprovalMattersDetails', {
	            url: '/catalog/partApprovalMattersEdit/:id/',
	            templateUrl: '/management/catalog/html/partApprovalMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //中介服务事项目录列表页
	        .state('catalog_agencyServiceMatters', {
	            url: '/catalog/agencyServiceMattersList',
	            templateUrl: '/management/catalog/html/agencyServiceMattersList',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项新增页
	        .state('catalog_agencyServiceMattersEdit', {
	            url: '/catalog/agencyServiceMattersEdit',
	            templateUrl: '/management/catalog/html/agencyServiceMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项修改页
	        .state('catalog_agencyServiceMattersAlter', {
	            url: '/catalog/agencyServiceMattersEdit/:id',
	            templateUrl: '/management/catalog/html/agencyServiceMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        //部门审批事项修改页
	        .state('catalog_agencyServiceMattersDetails', {
	            url: '/catalog/agencyServiceMattersEdit/:id/',
	            templateUrl: '/management/catalog/html/agencyServiceMattersEdit',
	            controller: 'catalogCtrl',
	            controllerAs: 'vm'
	        })
	        
	        
	 
/**********************end#目录管理***************************************/	     
	        
/**********************begin#信用信息管理***************************************/
	        //信用异常名录 列表页面
	        .state('credit_illegalNameList', {
	            url: '/creditInfo/illegalNameList',
	            templateUrl: '/management/creditInfo/html/illegalNameList',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用异常名录 信息录入页面
	        .state('credit_illegalNameEdit', {
	            url: '/creditInfo/illegalNameEdit/:id/:projectNumber/:projectName/:unitName/:createdDate/:shenBaoInfoId',
	            templateUrl: '/management/creditInfo/html/illegalNameEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用异常名录 信息更改页面
	        .state('credit_updateIllegalName', {
	            url: '/creditInfo/updateIllegalName/:id',
	            templateUrl: '/management/creditInfo/html/illegalNameEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用异常名录 详情页面
	        .state('credit_illegalNameDetails', {
	            url: '/creditInfo/illegalNameDetails/:id',
	            templateUrl: '/management/creditInfo/html/illegalNameDetails',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })	   
	        
	        //信用黑名单 列表页面
	        .state('credit_blackList', {
	            url: '/creditInfo/blackList',
	            templateUrl: '/management/creditInfo/html/blackList',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })	   
	        //信用黑名单 信息录入页面
	        .state('credit_blackListEdit', {
	            url: '/creditInfo/blackList//:projectNumber/:projectName/:unitName/:createdDate/:shenBaoInfoId',
	            templateUrl: '/management/creditInfo/html/blackListEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用黑名单 详情页面
	        .state('credit_blackListDetails', {
	            url: '/creditInfo/blackListDetails/:id',
	            templateUrl: '/management/creditInfo/html/blackListDetails',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //信用黑名单 信息修改页面
	        .state('credit_blackListAlter', {
	            url: '/creditInfo/blackListEdit/:id',
	            templateUrl: '/management/creditInfo/html/blackListUpdate',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常列表页
	        .state('credit_projectAnomaly', {
	            url: '/creditInfo/projectAnomalyList',
	            templateUrl: '/management/creditInfo/html/projectAnomaly',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常 信息录入页面
	        .state('credit_projectAnomalyEdit', {
	            url: '/creditInfo/projectAnomaly/:id/:projectNumber/:projectName/:unitName/:createdDate/:shenBaoInfoId',
	            templateUrl: '/management/creditInfo/html/projectAnomalyEdit',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常 信息录入页面
	        .state('credit_projectAnomalyDetails', {
	            url: '/creditInfo/projectAnomalyDetails/:id',
	            templateUrl: '/management/creditInfo/html/projectAnomalyDetails',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        //项目异常 信息更改页面
	        .state('credit_updateProjectAnomaly',{ 
	            url: '/creditInfo/updateProjectAnomaly/:id',
	            templateUrl: '/management/creditInfo/html/projectAnomalyUpdate',
	            controller: 'creditInfoCtrl',
	            controllerAs: 'vm'
	        })
	        
/**********************end#信用信息管理***************************************/
	        
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
	        //已办列表页--下一年度计划(taskRecord)
	        .state('task_complete', {
	            url: '/task/complete',
	            templateUrl: '/management/task/html/complete',
	            controller: 'taskCtrl',
	            controllerAs: 'vm'
	        })
	         //已办列表页--审批类(taskRecord)
	        .state('task_shenPi', {
	            url: '/task/shenPi',
	            templateUrl: '/management/task/html/complete_shenPi',
	            controller: 'taskCtrl',
	            controllerAs: 'vm'
	        })
	          //已办列表页--审批类(taskRecord)
	        .state('task_plan', {
	            url: '/task/plan',
	            templateUrl: '/management/task/html/complete_plan',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	        //个人已办--审批类
	        .state('task_shenPiDetails', {
	            url: '/task/shenPi_details/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/shenPiDetails',
	            controller: 'taskCtrl',
	            controllerAs: 'vm'
	        })
	        //个人已办--计划类
	         .state('task_planDetails', {
	            url: '/task/plan_details/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/planDetails',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	         //待办列表页--计划类
	        .state('task_todo_plan', {
	            url: '/task/todo_plan',
	            templateUrl: '/management/task/html/todo_plan',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	           //任务处理页--计划类
	        .state('task_handle_plan', {
	            url: '/task/handle_plan/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/handle_plan',
	            controller: 'taskPlanCtrl',
	            controllerAs: 'vm'
	        })
	         //待办列表页--审批类
	        .state('task_todo_audit', {
	            url: '/task/todo_audit',
	            templateUrl: '/management/task/html/todo_audit',
	            controller: 'taskAuditCtrl',
	            controllerAs: 'vm'
	        })
	         //任务处理页--审批类
	        .state('task_handle_audit', {
	            url: '/task/handle_audit/:taskType/:taskId/:relId',
	            templateUrl: '/management/task/html/handle_audit',
	            controller: 'taskAuditCtrl',
	            controllerAs: 'vm'
	        })
/**********************end#工作台***************************************/
      //begin中介单位管理
        //中介单位列表
        .state('mediationUnitList', {
            url: '/mediationUnitList',
            templateUrl: '/management/mediationManagement/html/mediationUnitList',
            controller: 'mediationManagementCtrl',
            controllerAs: 'vm'
        })	
        //中介单位编辑or新增
        .state('mediationUnitChange', {
        url: '/mediationUnitChange/:id',
        templateUrl: '/management/mediationManagement/html/mediationUnitChangeDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })  
        //查看中介单位信息
        .state('mediationUnitDetails', {
        url: '/mediationUnitDetails/:id',
        templateUrl: '/management/mediationManagement/html/mediationUnitDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
        //协审活动列表 
        .state('assistReviewList', {
        url: '/assistReviewList',
        templateUrl: '/management/mediationManagement/html/assistReviewList',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
         //协审活动编辑or新增 
        .state('assistReviewChange', {
        url: '/assistReviewChange/:id',
        templateUrl: '/management/mediationManagement/html/assistReviewChangeDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        }) 
        //查看协审活动信息
        .state('assistReviewDetails', {
        url: '/assistReviewDetails/:id',
        templateUrl: '/management/mediationManagement/html/assistReviewDetails',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
        //服务质量评价 serviceEvaluation submitReviewEvaluation
         .state('serviceEvaluation', {
        url: '/serviceEvaluation/:id',
        templateUrl: '/management/mediationManagement/html/serviceEvaluation',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
         //送审文件质量评价 submitReviewEvaluation
         .state('submitReviewEvaluation', {
        url: '/submitReviewEvaluation/:id',
        templateUrl: '/management/mediationManagement/html/submitReviewEvaluation',
        controller: 'mediationManagementCtrl',
        controllerAs: 'vm'
        })
        ;
        
    }]);
    
})();;(function () {
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
	        ;
        
	        /**********************end#project***************************************/
        
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
                 success:function(e){
                	 console.log("error:");
                	 console.log(e);
                	 if(e.XMLHttpRequest.status==200){
                		 var fileName=eval("("+e.XMLHttpRequest.response+")").data[0].randomName;
                		 alert("文件名："+fileName);
                	 }
                 },
                 error: function(e){
                     common.alert({
                         vm : vm,
                         msg : e.XMLHttpRequest.response.message
                     });
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
		var url_account_password = "/verifyNum/password";
		
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
					method : 'post',
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
		var url_account_password = "/verifyNum/password";
		
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
					method : 'post',
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
						format : "{0:yyyy/MM/dd HH:mm:ss}"

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
					method : 'post',
					url : url_org+'/updateOrg',
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
		}// end fun updateorg
		
		function deleteOrg(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'post',
                url:url_org+'/deleteOrg',
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
		var url_deleteOrgUsers="/org/{0}/deleteUsers";
		
			
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
                method: 'post',
                url:common.format(url_deleteOrgUsers,vm.id),
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
        .module('appSupervision')
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
;(function() {
	'use strict';

	angular.module('appSupervision').factory('orgSvc', org);

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
						format : "{0:yyyy/MM/dd HH:mm:ss}"

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
					method : 'post',
					url : url_org+'/updateOrg',
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
		}// end fun updateorg
		
		function deleteOrg(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'post',
                url:url_org+'/deleteOrg',
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
})();;(function () {
    'use strict';

    angular
        .module('appSupervision')
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
        .module('appSupervision')
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

	angular.module('appSupervision').factory('orgUserSvc', org);

	org.$inject = [ '$http','$compile' ];	
	function org($http,$compile) {	
		var url_org = "/org";
		var url_back = '#/org';
		var user_userNotIn='/org/{0}/userNotIn';
		var url_orgUsers="/org/{0}/users";
		var url_deleteOrgUsers="/org/{0}/deleteUsers";
			
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
                method: 'post',
                url:common.format(url_deleteOrgUsers,vm.id),
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
					method : 'post',
					url : url_role+'/updateRole',
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
                method: 'post',
                url:url_role+'/deleteRole',
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
        .module('appSupervision')
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
        .module('appSupervision')
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

	angular.module('appSupervision').factory('roleSvc', role);

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
					method : 'post',
					url : url_role+'/updateRole',
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
                method: 'post',
                url:url_role+'/deleteRole',
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
					method : 'post',
					url : url_user+'/updateUser',
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
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}

		}

		// begin#deleteUser
		function deleteUser(vm, id) {
			vm.isSubmit = true;
			
			var httpOptions = {
				method : 'post',
				url : url_user+'/deleteUser',
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
        .module('appSupervision')
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
        .module('appSupervision')
        .controller('userEditCtrl', user);

    user.$inject = ['$location','userSvc','$state']; 

    function user($location, userSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};
        vm.title = '添加用户';
        vm.isuserExist=false;
        vm.isSupervise=true;
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

	angular.module('appSupervision').factory('userSvc', user);

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
					method : 'post',
					url : url_user+'/updateUser',
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
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}

		}

		// begin#deleteUser
		function deleteUser(vm, id) {
			vm.isSubmit = true;
			
			var httpOptions = {
				method : 'post',
				url : url_user+'/deleteUser',
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
											idNum[index+i] = parseInt(idSplit[idSplit.length-1],10);//获取所有子级id最后的一组数字并解析为int类型								
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
					method : 'post',
					url : url_updateBasicData,
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
					method : 'post',
					url : url_basicData+'/deleteBasicData',
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
        .controller('catalogCtrl', catalog);

    catalog.$inject = ['$location','catalogSvc','$state','$scope','$sce']; 

    function catalog($location, catalogSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.model={};
    	vm.basicData={};
    	vm.secondary = {};
    	vm.id = $state.params.id;
    	vm.type = $state.params.type;
    	vm.title='投资项目分类列表';
        
    	function init(){
    		
    		if($state.current.name == 'catalog_investment'){
    			vm.page = 'investment';
    			vm.type = 'projectIndustry';
    		}
    		if($state.current.name == 'catalog_investment_projectIndustry'){
    			vm.page = 'investment_projectIndustry';
    		}
    		if($state.current.name == 'catalog_addSecondCatalog'){
    			vm.page = 'addSecondCatalog';
    		}
    		if($state.current.name == 'catalog_investmentEdit'){
    			vm.page = 'investmentEdit';
    		}
    		if($state.current.name == 'catalog_investmentAlter'){
    			vm.page = 'investmentAlter';
    		}
    		if($state.current.name == 'catalog_investmentList_projectType'){
    			vm.page = 'investment';
    			vm.type = 'projectType';
    		}
    		if($state.current.name == 'catalog_investmentList_constructionType'){
    			vm.page = 'investment';
    			vm.type = 'constructionType';
    		}
    		if($state.current.name == 'catalog_policy'){
    			vm.page = 'policy';
    			vm.type = 'encourage';
    		}
    		if($state.current.name == 'catalog_policyAllowList'){
    			vm.page = 'policy';
    			vm.type = 'allow';
    		}
    		if($state.current.name == 'catalog_policyLimitList'){
    			vm.page = 'policy';
    			vm.type = 'limit';
    		}
    		if($state.current.name == 'catalog_policyCatalogEdit'){
    			vm.page = 'policyCatalogEdit';
    		}
    		if($state.current.name == 'catalog_policyCatalogAlter'){
    			vm.page = 'policyCatalogAlter';
    		}
    		if($state.current.name == 'catalog_partApprovalMatters'){
    			vm.page = 'partApprovalMattersList';
    		}
    		if($state.current.name == 'catalog_partApprovalMattersEdit'){
    			vm.page = 'partApprovalMattersEdit';
    		}
    		if($state.current.name == 'catalog_partApprovalMattersAlter'){
    			vm.page = 'partApprovalMattersAlter';
    		}
    		if($state.current.name == 'catalog_partApprovalMattersDetails'){
    			vm.page = 'partApprovalMattersDetails';
    		}
    		if($state.current.name == 'catalog_agencyServiceMatters'){
    			vm.page = 'agencyServiceMattersList';
    		}
    		if($state.current.name == 'catalog_agencyServiceMattersEdit'){
    			vm.page = 'agencyServiceMattersEdit';
    		}
    		if($state.current.name == 'catalog_agencyServiceMattersAlter'){
    			vm.page = 'agencyServiceMattersAlter';
    		}
    		if($state.current.name == 'catalog_agencyServiceMattersDetails'){
    			vm.page = 'agencyServiceMattersDetails';
    		}
    		
    		//全选框选择--项目行业分类
        	$(document).on('click', '#checkboxAll_projectIndustry', function () {
                var isSelected = $(this).is(':checked');
                $('.projectIndustryGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--项目类型
        	$(document).on('click', '#checkboxAll_projectType', function () {
                var isSelected = $(this).is(':checked');
                $('.projectTypeGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--建设类型
        	$(document).on('click', '#checkboxAll_constructionType', function () {
                var isSelected = $(this).is(':checked');
                $('.constructionTypeGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
    		vm.alert=function(str){
    			vm.type= str;
    		};
    	}
    	
    	activate();
    	
        function activate() {
        	init();
        	if(vm.page == 'investment'){
        		page_investmentList();
        	}
        	if(vm.page == 'investment_projectIndustry'){
        		page_investment_projectIndustry();
        	}
        	if(vm.page == 'investmentEdit'){
        		page_investmentEdit();
        	}
        	if(vm.page == 'addSecondCatalog'){
        		page_addSecondCatalog();
        	}
        	if(vm.page == 'investmentAlter'){
        		page_investmentAlter();
        	}
        	if(vm.page == 'policy'){
        		page_policy();//政策目录列表
        	}
        	if(vm.page == 'policyCatalogEdit'){
        		page_policyCatalogEdit();//政策目录主目录添加页
        	}
        	if(vm.page == 'policyCatalogAlter'){
        		page_policyCatalogAlter();//政策条目修改
        	}
        	if(vm.page == 'partApprovalMattersList'){
        		page_partApprovalMattersList();//部门审批事项列表页
        	}
        	if(vm.page == 'partApprovalMattersEdit'){
        		page_partApprovalMattersEdit();//部门审批事项编辑页
        	}
        	if(vm.page == 'partApprovalMattersAlter'){
        		page_partApprovalMattersAlter();//部门审批事项更新页
        	}
        	if(vm.page == 'partApprovalMattersDetails'){
        		page_partApprovalMattersDetails();//部门审批事项详情页
        	}
        	if(vm.page == 'agencyServiceMattersList'){
        		page_agencyServiceMattersList();//中介服务事项目录列表页
        	}
        	if(vm.page == 'agencyServiceMattersEdit'){
        		page_agencyServiceMattersEdit();//中介服务事项编辑页
        	}
        	if(vm.page == 'agencyServiceMattersAlter'){
        		page_agencyServiceMattersAlter();//中介服务事项修改页
        	}
        	if(vm.page == 'agencyServiceMattersDetails'){
        		page_agencyServiceMattersDetails();//中介服务事项详情页
        	}
        	
        	
        }
        
        
      
        
        //中介服务事项详情页
        function page_agencyServiceMattersDetails(){
        	vm.title= '中介服务事项详情页';
        	vm.isAgencyServiceMattersDetails = true;
        	catalogSvc.getAgencyServiceMattersById(vm);
        }//end fun page_agencyServiceMattersDetails
        
        //中介服务事项修改页
        function page_agencyServiceMattersAlter(){
        	vm.title = '中介服务事项修改';
        	//显示更新按钮
        	vm.isShowConfirm = true;
        	//根据id获取原数据，显示在页面中
        	catalogSvc.getAgencyServiceMattersById(vm);
        	//更新按钮
        	vm.updateAgencyServiceMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则进行下一步
        			catalogSvc.updateAgencyServiceMatters(vm);
        		}
        	};
        	
        }//end fun page_agencyServiceMattersAlter
        
        //中介服务事项编辑页
        function page_agencyServiceMattersEdit(){
        	vm.title = '中介服务事项编辑';
        	vm.saveAgencyServiceMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则执行下一步
        			catalogSvc.createAgencyServiceMatters(vm);
        		}
        		
        	};
        	
        }//end fun page_agencyServiceMattersEdit
        
        //中介服务事项目录列表页
        function page_agencyServiceMattersList(){
        	vm.title = '中介服务事项列表';
        	catalogSvc.grid_agencyServiceMatters(vm);
        	//删除按钮
        	vm.deleteAgencyServiceMattersCatalog = function(id){
        		common.confirm({
        			vm : vm,
        			msg : '确认要删除此记录吗？',
        			fn : function(){
        				$('.confirmDialog').modal('hide');
        				catalogSvc.deleteAgencyServiceMattersCatalog(vm,id);
        			}
        		});
        	};
        	//批量删除按钮
        	vm.deleteAgencyServiceMattersCatalogs = function(){
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
	                common.confirm({
	               	 	vm:vm,
	               	 	title:"",
	               	 	msg:"确认删除数据吗？",
	               	 	fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.deleteAgencyServiceMattersCatalogs(vm,idStr);
	                    }
	                });
	            }
        	};
        	
        }//end fun page_agencyServiceMattersList
        
        //部门审批事项详情页
        function page_partApprovalMattersDetails(){
        	vm.title = '部门审批事项详情';
        	vm.isPartApprovalMattersDetails = true;
        	catalogSvc.getpartApprovalMattersById(vm);
        }//end fun page_partApprovalMattersDetails
        
        //部门审批事项更新页
        function page_partApprovalMattersAlter(){
        	vm.title = '部门审批事项修改';
        	//显示更新按钮
        	vm.isShowConfirm = true;
        	//获取原数据
        	catalogSvc.getpartApprovalMattersById(vm);
        	//点击更新按钮
        	vm.updatePartApprovalMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则进行下一步
        			catalogSvc.updatePartApprovalMatters(vm);
        		}
        	};
        }//end fun page_partApprovalMattersAlter
        
        //部门审批事项编辑页
        function page_partApprovalMattersEdit(){
        	vm.title = '部门审批事项编辑';
        	vm.savePartApprovalMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则可以进行下一步
        			catalogSvc.createPartApprovalMatters(vm);
        		}
        	};
        }//end fun page_partApprovalMattersEdit
        
        //部门审批事项列表页
        function page_partApprovalMattersList(){
        	vm.title = '部门审批事项列表';
        	catalogSvc.grid_partApprovalMatters(vm);
        	//点击列表中的删除按钮，根据提示是否删除数据
        	vm.deletePartApprovalMattersCatalog = function(id){
        		common.confirm({
        			vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deletePartApprovalMatters(vm,id);
            		}
        		});
        	};
        	//点击批量删除按钮，根据提示是否删除数据
        	vm.deletePartApprovalMattersCatalogs = function(){
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
	                common.confirm({
	               	 	vm:vm,
	               	 	title:"",
	               	 	msg:"确认删除数据吗？",
	               	 	fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.deletePartApprovalMattersCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        }//end fun page_partApprovalMattersList
        
        //政策条目修改
        function page_policyCatalogAlter(){
        	vm.title = '政策条目修改';
        	//显示更新按钮
        	vm.isShowConfirm = true;
        	//根据id获取源数据信息
        	catalogSvc.getPolicyCatalogById(vm);
        	//点击更新按钮进行更新数据操作
        	vm.updatePolicyCatalog = function(){
        		common.initJqValidation();
    			var isValid = $('form').valid();
        		if(isValid){//通过则可以进行下一步
        			catalogSvc.updatePolicyCatalog(vm);
        		}
        	};
        }//end fun page_policyCatalogAlter
        
        //政策条目添加页
        function page_policyCatalogEdit(){

        	if(vm.type == 'encourage'){
        		vm.title = '适用产业政策条目(鼓励类)编辑';
        		vm.policyCatalogEncourage = true;
        	}
        	if(vm.type == 'allow'){
        		vm.title = '适用产业政策条目(允许类)编辑';
        		vm.policyCatalogAllow = true;
        	}
        	if(vm.type == 'limit'){
        		vm.title = '适用产业政策条目(限制类)编辑';
        		vm.policyCatalogLimit = true;
        	}
        	vm.model.type = vm.type;
        	//创建按钮
        	vm.savePolicyCatalog = function(){
        		common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createPolicyCatalog(vm);
    			}
        	};
        }
        
        //政策目录页面
        function page_policy(){
        	vm.title = '适用产业政策类型列表';
        	//获取策类型列表
        	catalogSvc.grid_policyCatalog(vm);
        	catalogSvc.grid_policyAllow(vm);
        	catalogSvc.grid_policyLimit(vm);
        	//点击删除按钮，进行删除操作，同时删除所依附的次级所有目录
        	vm.deleteFirstPolicyCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deletePolicyCatalog(vm,id);
            		}
            	});
        	};
        	//点击批量删除按钮，根据提示是否删除记录
        	vm.deleteFirstPolicyCatalogs = function(){
        		var selectIds;
        		if(vm.type == 'encourage'){
        			selectIds = common.getKendoCheckId('.policyCatalogEncourageGrid');
				}else if(vm.type == 'allow'){
					selectIds = common.getKendoCheckId('.policyCatalogAllowGrid');
				}else if(vm.type == 'limit'){
					selectIds = common.getKendoCheckId('.policyCatalogLimitGrid');
				}
        		
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
	                common.confirm({
	               	 	vm:vm,
	               	 	title:"",
	               	 	msg:"确认删除数据吗？",
	               	 	fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.deletePolicyCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        }//end fun page_policy
        
        //投资项目修改和项目行业二级目录编辑页面
        function page_investment_projectIndustry(){
        	vm.title = '项目行业分类';
        	catalogSvc.getCatalogById(vm);
        	catalogSvc.grid_InvestmentProjectSecondary(vm);
        	
        	//点击批量删除按钮
        	vm.deleteSecondaryCatalogs = function(){
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
	                common.confirm({
	               	 	vm:vm,
	               	 	title:"",
	               	 	msg:"确认删除数据吗？",
	               	 	fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.removeSecondCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        	
        	//删除按钮
        	vm.deleteSecondary = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deleteSecondaryCatalog(vm,id);
            		}
            	});
        	};
        }
        
        //投资项目修改页
        function page_investmentAlter(){
        	vm.isShowConfirm = true;
        	catalogSvc.getCatalogById(vm);
        	//更新按钮
    		vm.updateCatalog = function(){
        		vm.model.id = vm.id;
        		common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				vm.secondary.parentId = vm.id;
    				vm.secondary.type = 'projectIndustry';
    				catalogSvc.updateCatalog(vm);
    			}
        	};
        }
        
        //投资项目二级新增页
        function page_addSecondCatalog(){
        	vm.title = '项目行业编辑';
        	vm.projectIndustrySecondCatalog = true;
        	vm.model.type = 'projectIndustry';
        	vm.model.parentId = vm.id;
        	//创建按钮
        	vm.saveInvestment = function(){
    			common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createCatalog(vm);
    			}
    		};
        }//end fun page_addSecondCatalog
        
        //投资项目一级新增页
        function page_investmentEdit(){
        	if(vm.type == 'projectIndustry'){
        		vm.title = '项目行业编辑';
        		vm.projectIndustryCatalog = true;
        	}
        	if(vm.type == 'projectType'){
        		vm.title = '项目类型编辑';
        		vm.projectTypeCatalog = true;
        	}
        	if(vm.type == 'constructionType'){
        		vm.title = '建设类型编辑';
        		vm.constructionTypeCatalog = true;
        	}
        	vm.model.type = vm.type;
        	//创建按钮
        	vm.saveInvestment = function(){
    			common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createCatalog(vm);
    			}
    		};
        }//end fun page_investmentEdit
        
        //投资项目列表页
        function page_investmentList(){
        		
        	//获取投资项目列表,默认为项目行业
        	catalogSvc.grid_InvestmentProject(vm);
        	catalogSvc.grid_projectType(vm);
        	catalogSvc.grid_constructionType(vm);
        	
        	//删除按钮
        	vm.deleteCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deleteCatalog(vm,id);
            		}
            	});
        	};
        	//批量删除按钮
        	vm.deleteCatalogs = function(){
        		var selectIds;
        		if(vm.type == 'projectIndustry'){
        			selectIds = common.getKendoCheckId('.projectIndustryGrid');
				}else if(vm.type == 'projectType'){
					selectIds = common.getKendoCheckId('.projectTypeGrid');
				}else if(vm.type == 'constructionType'){
					selectIds = common.getKendoCheckId('.constructionTypeGrid');
				}
				
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
	                common.confirm({
	               	 	vm:vm,
	               	 	title:"",
	               	 	msg:"确认删除数据吗？",
	               	 	fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.removeFirstCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        	
        }//end fun page_catalog_investmentList
        
        
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('catalogSvc', catalog);

	catalog.$inject = [ '$http','$location'];

	function catalog($http,$location) {
		
		var url_catalog = '/management/catalog';
		
		var service = {
				createCatalog : createCatalog,//创建投资项目
				grid_InvestmentProject : grid_InvestmentProject,//获取投资项目类型列表
				getCatalogById : getCatalogById,//根据id获取，投资项目信息
				updateCatalog : updateCatalog,//更新投资项目信息
				grid_InvestmentProjectSecondary : grid_InvestmentProjectSecondary,//获取投资项目次级目录列表
				deleteSecondaryCatalog : deleteSecondaryCatalog,//投资项目删除次级目录
				createSecondCatalog : createSecondCatalog,//创建投资项目次级目录
				changeSecondCatalog : changeSecondCatalog,//更改投资项目次级目录信息
				getSecondCatalogById : getSecondCatalogById,//根据投资项目二级目录id获取二级目录信息
				grid_projectType : grid_projectType,//投资项目类型信息列表
				grid_constructionType : grid_constructionType,//投资项目建设类型列表
				removeSecondCatalogs : removeSecondCatalogs,//批量删除投资项目次级目录
				deleteCatalog : deleteCatalog,//投资项目删除主目录
				removeFirstCatalogs : removeFirstCatalogs,//投资项目批量删除主目录
				grid_policyCatalog : grid_policyCatalog,//政策目录类型列表(鼓励类)
				grid_policyAllow : grid_policyAllow,//政策目录类型列表(允许类)
				grid_policyLimit : grid_policyLimit,//政策目录类型列表(限制类)
				createPolicyCatalog : createPolicyCatalog,//创建政策目录
				getPolicyCatalogById : getPolicyCatalogById,//根据政策目录id获取信息
				deletePolicyCatalog : deletePolicyCatalog,//根据政策条目id删除记录
				deletePolicyCatalogs : deletePolicyCatalogs,//批量删除政策条目信息
				updatePolicyCatalog : updatePolicyCatalog,//更新政策条目数据
				grid_partApprovalMatters : grid_partApprovalMatters,//获取部门审批事项目录列表
				createPartApprovalMatters : createPartApprovalMatters,//创建部门审批事项
				getpartApprovalMattersById : getpartApprovalMattersById,//根据id获取部门审批事项信息
				updatePartApprovalMatters : updatePartApprovalMatters,//更新部门审批事项
				deletePartApprovalMatters : deletePartApprovalMatters,//删除部门审批事项
				deletePartApprovalMattersCatalogs : deletePartApprovalMattersCatalogs,//批量删除部门审批事项
				grid_agencyServiceMatters : grid_agencyServiceMatters,//获取中介服务事项列表
				createAgencyServiceMatters : createAgencyServiceMatters,//创建中介服务事项
				getAgencyServiceMattersById : getAgencyServiceMattersById,//根据id获取中介服务事项
				updateAgencyServiceMatters : updateAgencyServiceMatters,//更新中介服务事项
				deleteAgencyServiceMattersCatalog : deleteAgencyServiceMattersCatalog,//删除中介服务事项
				deleteAgencyServiceMattersCatalogs : deleteAgencyServiceMattersCatalogs//批量删除中介服务事项
				
		};
		return service;
		
		//批量删除中介服务事项
		function deleteAgencyServiceMattersCatalogs(vm,id){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/deleteAgencyServiceMattersCatalogs"),
					data : id
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : '操作成功',
							fn : function(){
								$('.alertDialog').modal('hide');
								vm.agencyServiceMattersGrid.dataSource.read();
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
			
		}//end fun deleteAgencyServiceMattersCatalogs
		
		//删除中介服务事项
//		function deleteAgencyServiceMattersCatalog(vm,id){
//			var httpOptions = {
//					method : 'put',
//					url : common.format(url_catalog+"/deleteAgencyServiceMatters?id={0}",id)
//			};
//			var httpSuccess = function(response){
//				common.requestSuccess({
//					vm : vm,
//					response : response,
//					fn : function(){
//						common.alert({
//							vm : vm,
//							msg : '删除成功！',
//							fn : function(){
//								$('.alertDialog').modal('hide');
//								vm.agencyServiceMattersGrid.dataSource.read();
//							}
//						});
//					}
//				});
//			};
//			common.http({
//				vm : vm,
//				$http : $http,
//				httpOptions : httpOptions,
//				success : httpSuccess
//			});
//		}//end fun deleteAgencyServiceMattersCatalog
		
		//更新中介服务事项
		function updateAgencyServiceMatters(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/updateAgencyServiceMatters"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : '修改成功！',
							fn : function(){
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
			};
			
			common.http({
				vm : vm ,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun updateAgencyServiceMatters
		
		
		//根据id获取中介服务事项
		function getAgencyServiceMattersById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog+"/agencyServiceMatters?$filter=id eq '{0}'",vm.id)
			};
			var httpSuccess = function(response){
				vm.model = response.data.value[0]||{};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getAgencyServiceMattersById
		
		//创建中介服务事项
		function createAgencyServiceMatters(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/agencyServiceMatters"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : '添加成功!',
							fn : function(){
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								location.href = '#/catalog/agencyServiceMattersList';
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
			
		}//end fun createAgencyServiceMatters
		
		//中介服务事项列表
		function grid_agencyServiceMatters(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/agencyServiceMatters")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 200,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.agencyServiceMattersGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_agencyServiceMatters
		
		//批量删除部门审批事项
		function deletePartApprovalMattersCatalogs(vm,id){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/deletePartApprovalMattersCatalogs"),
					data : id
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : '删除成功！',
							fn : function(){
								$('.alertDialog').modal('hide');
								vm.partApprovalMattersGrid.dataSource.read();
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
			
		}//end fun deletePartApprovalMattersCatalogs
		
		//删除部门审批事项
//		function deletePartApprovalMatters(vm,id){
//			var httpOptions = {
//					method : 'put',
//					url : common.format(url_catalog+"/deletePartApprovalMatters?id={0}",id)
//			};
//			var httpSuccess = function(response){
//				common.requestSuccess({
//					vm : vm,
//					response : response,
//					fn : function(){
//						common.alert({
//							vm : vm,
//							msg : '删除成功！',
//							fn : function(){
//								$('.alertDialog').modal('hide');
//								vm.partApprovalMattersGrid.dataSource.read();
//							}
//						});
//					}
//				});
//			};
//			
//			common.http({
//				vm : vm,
//				$http : $http,
//				httpOptions : httpOptions,
//				success : httpSuccess
//			});
//			
//		}//end fun deletePartApprovalMatters
		//更新部门审批事项
		function updatePartApprovalMatters(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/updatePartApprovalMatters"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : '操作成功！',
							fn : function(){
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
			
		}//end fun updatePartApprovalMatters
		
		//根据id获取部门审批事项信息
		function getpartApprovalMattersById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog+"/partApprovalMatters?$filter=id eq '{0}'",vm.id)
			};
			var httpSuccess = function(response){
				vm.model = response.data.value[0]||{};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
			
		}//end fun getpartApprovalMattersById
		
		//创建部门审批事项
		function createPartApprovalMatters(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/partApprovalMatters"),
					data : vm.model
			};
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								location.href = '#/catalog/partApprovalMattersList';
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
		}//end fun createPartApprovalMatters
		
		//获取部门审批事项目录列表
		function grid_partApprovalMatters(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/partApprovalMatters")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 200,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.partApprovalMattersGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}
		
		//更新政策条目数据
		function updatePolicyCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/updatePolicyCatalog"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
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
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun updatePolicyCatalog
		
		//批量删除政策条目信息
		function deletePolicyCatalogs(vm,id){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/deletePolicyCatalogs"),
					data : id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								if(vm.type == 'encourage'){
									vm.policyCatalogGrid.dataSource.read();
								}
								if(vm.type == 'allow'){
									vm.policyCatalogGrid_allow.dataSource.read();
								}
								if(vm.type == 'limit'){
									vm.policyCatalogGrid_limit.dataSource.read();
								}
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
		}//end fun deletePolicyCatalogs
		
		//根据政策项目次级条目id删除记录
//		function deletePolicyCatalog(vm,id){
//			var httpOptions = {
//					method : 'put',
//					url : common.format(url_catalog+"/deletePolicyCatalog?id={0}", id)
//			};
//			var httpSuccess = function (response){
//				common.requestSuccess({
//					vm : vm,
//					response : response,
//					fn : function(){
//						common.alert({
//							vm : vm,
//							msg : "操作成功",
//							fn : function() {
//								$('.alertDialog').modal('hide');
//								if(vm.type == 'encourage'){
//									vm.policyCatalogGrid.dataSource.read();
//								}
//								if(vm.type == 'allow'){
//									vm.policyCatalogGrid_allow.dataSource.read();
//								}
//								if(vm.type == 'limit'){
//									vm.policyCatalogGrid_limit.dataSource.read();
//								}
//							}
//						});
//					}
//				});
//			};
//			common.http({
//				vm : vm,
//				$http : $http,
//				httpOptions : httpOptions,
//				success : httpSuccess
//			});
//		}//end fun deleteolicyCatalog
		
		//根据政策目录id获取信息
		function getPolicyCatalogById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog + "/policyCatalog?$filter=id eq '{0}'", vm.id)					
				};
			var httpSuccess = function success(response) {
					vm.model=response.data.value[0] || {};
					if(vm.model.type == 'encourage'){
						vm.title = '适用产业政策条目(鼓励类)修改';
						vm.policyCatalogEncourage = true;
					}else if(vm.model.type == 'allow'){
						vm.title = '适用产业政策条目(允许类)修改';
						vm.policyCatalogAllow = true;
					}else if(vm.model.type == 'limit'){
						vm.title = '适用产业政策条目(限制类)修改';
						vm.policyCatalogLimit = true;
					}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getPolicyCatalogById
		
		
		//创建政策目录
		function createPolicyCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/policyCatalog"),
					data:vm.model
			};
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								if(vm.type == 'encourage'){
									location.href = '#/catalog/policyCatalog';
								}else if(vm.type == 'allow'){
									location.href = '#/catalog/policyCatalog/allowList';
								}else if(vm.type == 'limit'){
									location.href = '#/catalog/policyCatalog/limitList';
								}
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
		}//end fun createPolicyCatalog
		
		//政策目录类型列表(鼓励类)
		function grid_policyCatalog(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/policyCatalog")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只显示父级目录
					field:'type',
					operator:'eq',
					value:'encourage'
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 220,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.policyCatalogGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_policyCatalog
		
		//政策目录类型列表(允许类)
		function grid_policyAllow(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/policyCatalog")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只显示父级目录
					field:'type',
					operator:'eq',
					value:'allow'
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 220,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.policyCatalogGrid_allow = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_policyAllow
		
		//政策目录类型列表(限制类)
		function grid_policyLimit(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/policyCatalog")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只显示父级目录
					field:'type',
					operator:'eq',
					value:'limit'
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 220,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.policyCatalogGrid_limit = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_policyLimit
		
		//批量删除主目录
		function removeFirstCatalogs(vm,id){
			var httpOptions = {
					method : 'post',
					url : url_catalog+'/deleteInvestment',
					data : id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						$('.alertDialog').modal('hide');
						$('.modal-backdrop').remove();
						if(vm.type == 'projectIndustry'){
							vm.investmentProjectGrid.dataSource.read();
						}
						if(vm.type == 'projectType'){
							vm.projectTypeGrid.dataSource.read();
						}
						if(vm.type == 'constructionType'){
							vm.constructionTypeGrid.dataSource.read();
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
		
		//删除主目录
//		function deleteCatalog(vm,id){
//			var httpOptions = {
//					method : 'put',
//					url : common.format(url_catalog+"/delete?id={0}", id)
//			};
//			var httpSuccess = function (response){
//				common.requestSuccess({
//					vm : vm,
//					response : response,
//					fn : function(){
//						common.alert({
//							vm : vm,
//							msg : "操作成功",
//							fn : function() {
//								$('.alertDialog').modal('hide');
//								$('.modal-backdrop').remove();
//								if(vm.type == 'projectIndustry'){
//									vm.investmentProjectGrid.dataSource.read();
//								}
//								if(vm.type == 'projectType'){
//									vm.projectTypeGrid.dataSource.read();
//								}
//								if(vm.type == 'constructionType'){
//									vm.constructionTypeGrid.dataSource.read();
//								}
//							}
//						});
//					}
//				});
//			};
//			common.http({
//				vm : vm,
//				$http : $http,
//				httpOptions : httpOptions,
//				success : httpSuccess
//			});
//		}
		
		
		//批量删除次级目录
		function removeSecondCatalogs(vm,id){
			var httpOptions = {
					method : 'post',
					url : url_catalog+'/deleteInvestment',
					data : id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						vm.investmentProjectSecondaryGrid.dataSource.read();
					}
				});
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun removeSecondCatalogs
		
		//建设类型列表
		function grid_constructionType(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:[{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				},
				{
					field:'type',
					operator:'eq',
					value:'constructionType'
					
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll_constructionType' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns_alter').html(),item.id);
					}
				}
			];
			// End:column

			vm.constructionTypeGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
		}//end fun grid_constructionType
		
		//项目类型信息列表
		function grid_projectType(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:[{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				},
				{
					field:'type',
					operator:'eq',
					value:'projectType'
					
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll_projectType' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns_alter').html(),item.id);
					}
				}
			];
			// End:column

			vm.projectTypeGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
		}
		
		//更改次级目录信息
		function changeSecondCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : url_catalog+'/updateInvestment',
					data : vm.secondary
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.investmentProjectSecondaryGrid.dataSource.read();
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
		}//end fun changeSecondCatalog
		
		//删除次级目录
//		function deleteSecondaryCatalog(vm,id){
//			var httpOptions = {
//					method : 'put',
//					url : common.format(url_catalog+"/delete?id={0}", id)
//			};
//			var httpSuccess = function (response){
//				common.requestSuccess({
//					vm : vm,
//					response : response,
//					fn : function(){
//						common.alert({
//							vm : vm,
//							msg : "操作成功",
//							fn : function() {
//								$('.alertDialog').modal('hide');
//								vm.investmentProjectSecondaryGrid.dataSource.read();
//							}
//						});
//					}
//				});
//			};
//			common.http({
//				vm : vm,
//				$http : $http,
//				httpOptions : httpOptions,
//				success : httpSuccess
//			});
//		}//end fun deleteSecondaryCatalog
		
		//获得次级目录信息
		function grid_InvestmentProjectSecondary(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只根据父id显示子项
					field:'parentId',
					operator:'eq',
					value:vm.id
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 230,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.investmentProjectSecondaryGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_InvestmentProjectSecondary
		
		//更新一级目录信息
		function updateCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : url_catalog+'/updateInvestment',
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
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
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun updateCatalog
		
		function getCatalogById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog + "?$filter=id eq '{0}'", vm.id)					
				};
			var httpSuccess = function success(response) {
					vm.model=response.data.value[0] || {};
					if(vm.model.parentId !=""){
						vm.title = '项目行业修改';
						vm.projectIndustrySecondCatalog = true;
					}else if(vm.model.type == 'projectIndustry'){
						vm.title = '项目行业修改';
						vm.projectIndustryCatalog = true;
					}else if(vm.model.type == 'projectType'){
						vm.title = '项目类型修改';
						vm.projectTypeCatalog = true;
					}else if(vm.model.type == 'constructionType'){
						vm.title = '建设类型修改';
						vm.constructionTypeCatalog = true;
					}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getCatalogById
		
		function getSecondCatalogById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog + "?$filter=id eq '{0}'", vm.secondCatalogId)					
				};
			var httpSuccess = function success(response) {
				vm.secondary=response.data.value[0] || {};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getSecondCatalogById
		
		function grid_InvestmentProject(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:[{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				},
				{
					field:'type',
					operator:'eq',
					value:'projectIndustry'
					
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll_projectIndustry' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",	
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 255,
//					attributes: { 
//				      	style: "text-align: right;"  
//					},  
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.investmentProjectGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_InvestmentProject
		
		//新增投资项目数据
		function createCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog),
					data:vm.model
			};
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								if(vm.id){
									location.href ="#/catalog/investment/projectIndustry/"+vm.id+"/";
								}else if(vm.type == 'projectIndustry'){
									location.href = '#/catalog/investment';
								}else if(vm.type == 'projectType'){
									location.href = '#/catalog/investment/projectTypeList';
								}else if(vm.type == 'constructionType'){
									location.href = '#/catalog/investment/constructionTypeList';
								}
								
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
		}//end fun createCatalog
		
		//创建二级目录数据
		function createSecondCatalog(vm){
			
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog),
					data:vm.secondary
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								vm.investmentProjectSecondaryGrid.dataSource.read();
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
		}//end fun createSecondCatalog
	}
})();;(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('creditInfoCtrl', creditInfo);

    creditInfo.$inject = ['$location','creditInfoSvc','$state','$scope','$sce']; 

    function creditInfo($location,creditInfoSvc,$state,$scope,$sce) {
        var vm = this;
        vm.title = "异常项目申报单位列表";
        vm.model={};
        vm.standby = {};
        vm.blackListModel = {};
        vm.illegalNameModel = {};
        vm.projectAnomalyModel = {};
        vm.page='list';
        vm.basicData = {};
        vm.id=$state.params.id;
        vm.projectNumber = $state.params.projectNumber;
        vm.projectName = $state.params.projectName;
        vm.unitName = $state.params.unitName;
        vm.createdDate = $state.params.createdDate;
        vm.shenBaoInfoId = $state.params.shenBaoInfoId;
        
        function init(){
        	if($state.current.name=='credit_illegalNameList'){
        		vm.page = 'illegalNameList';
        	}
        	if($state.current.name=='credit_illegalNameEdit'){
        		vm.page = 'addIllegalName';
        	}
        	if($state.current.name=='credit_updateIllegalName'){
        		vm.page='updateIllegalNameEdit';
        	}
        	if($state.current.name=='credit_illegalNameDetails'){
        		vm.page='illegalNameDetails';
        	}
        	if($state.current.name=='credit_blackList'){
        		vm.title = '黑名单项目申报单位列表';
        		vm.page = 'blackList';
        	}
        	if($state.current.name=='credit_blackListEdit'){
        		vm.title = '黑名单项目申报单位信息录入';
        		vm.page = 'addBlackList';
        	}
        	if($state.current.name=='credit_blackListDetails'){
        		vm.title = '黑名单项目申报单位信息详情';
        		vm.page = 'blackListDetails';
        	}
        	if($state.current.name=='credit_blackListAlter'){
        		vm.title = '黑名单项目申报单位信息更改';
        		vm.page = 'blackListAlter';
        	}
        	if($state.current.name=='credit_projectAnomaly'){
        		vm.title = '项目异常列表';
        		vm.page = 'projectAnomaly';
        	}
        	if($state.current.name=='credit_projectAnomalyEdit'){
        		vm.title = '项目异常信息录入';
        		vm.page = 'projectAnomalyEdit';
        	}
        	if($state.current.name=='credit_projectAnomalyDetails'){
        		vm.title = '项目异常信息详情';
        		vm.page = 'projectAnomalyDetails';
        	}
        	if($state.current.name=='credit_updateProjectAnomaly'){
        		vm.title = '项目异常信息修改';
        		vm.page = 'updateProjectAnomaly';
        	}
        	
        	vm.getBasicDataDesc = function(str){
           		return common.getBasicDataDesc(str);
           	};
        	
        	vm.getUnitName=function(unitId){
        		return common.getUnitName(unitId);
        	};
        	
        	vm.toDate=function(stringDate){
        		return common.toDate(stringDate);
        	};
        	
        	vm.formatDate=function(stringDate){
        		return common.formatDate(stringDate);
        	};
        	
        	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
        	
        	vm.basicData.userUnit = common.getUserUnits();
        }
        
        activate();
        function activate() {        	
        	init();
        	if(vm.page == 'illegalNameList'){
        		page_illegalNameList();
        	}
        	if(vm.page == 'addIllegalName'){
        		page_addIllegalNameInfo();
        	}
        	if(vm.page == 'updateIllegalNameEdit'){
        		vm.isIllegalEdit = true;
        		page_illegalNameEdit();
        	}
        	if(vm.page == 'illegalNameDetails'){
        		page_illegalNameDetails();
        	}
        	if(vm.page == 'blackList'){
        		page_blackList();
        	}
        	if(vm.page == 'addBlackList'){
        		page_addBlackList();
        	}
        	if(vm.page == 'blackListDetails'){
        		page_blackListDetails();
        	}
        	if(vm.page == 'blackListAlter'){
        		vm.isBlackListEdit = true;
        		page_blackListAlter();
        	}
        	if(vm.page == 'projectAnomaly'){
        		page_projectAnomaly();
        	}
        	if(vm.page == 'projectAnomalyEdit'){
        		page_projectAnomalyEdit();
        	}
        	if(vm.page == 'projectAnomalyDetails'){
        		page_projectAnomalyDetails();
        	}
        	if(vm.page == 'updateProjectAnomaly'){
        		page_updateProjectAnomaly();
        	}
        	
        }
        
        //项目异常信息变更页
        function page_updateProjectAnomaly(){
        	creditInfoSvc.getProjectAnomalyById(vm);
        	vm.updateProjectAnomalyInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		creditInfoSvc.updateProjectAnomalyById(vm);
            	}
        	};
        	vm.returnProjectAnomalyPage = function(){
        		location.href = "#/creditInfo/projectAnomalyList";
        	};
        }
        
        //项目异常详情页
        function page_projectAnomalyDetails(){
        	creditInfoSvc.getProjectAnomalyById(vm);
        }
        
        vm.returnProjectAnomalyPage = function(){
        	location.href = "#/creditInfo/projectAnomalyList";
        };
        
        //项目异常 录入页面
        function page_projectAnomalyEdit(){
        	vm.projectAnomalyModel.projectNumber = vm.projectNumber;
        	vm.projectAnomalyModel.projectName = vm.projectName;
        	vm.projectAnomalyModel.unitName = vm.unitName;
        	vm.projectAnomalyModel.shenbaoDate = vm.createdDate;
        	vm.projectAnomalyModel.shenBaoInfoId = vm.shenBaoInfoId;
        	vm.saveProjectAnomalyInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		vm.projectAnomalyModel.shenbaoDate = vm.toDate(vm.projectAnomalyModel.shenbaoDate);
            		creditInfoSvc.createProjectAnomaly(vm);
            	}
        	};
        }//end fun page_projectAnomalyEdit
        
        //项目异常列表页
        function page_projectAnomaly(){
        	creditInfoSvc.projectAnomalyGrid(vm);
        	//条件查询
     	    vm.searchProjectAnomaly=function(){
        		vm.projectAnomalyModel.shenbaoDate = vm.toDate(vm.projectAnomalyModel.shenbaoDate);
     		    var filters = [];
     		    if(vm.projectAnomalyModel.unitName !=null && vm.projectAnomalyModel.unitName !=''){
       			   filters.push({field:'unitName',operator:'eq',value:vm.projectAnomalyModel.unitName});
       		    }
     		    if(vm.projectAnomalyModel.shenbaoDate != null && vm.projectAnomalyModel.shenbaoDate != ''){
     			   filters.push({field:'shenbaoDate',operator:'eq',value:vm.projectAnomalyModel.shenbaoDate});
     		    }
     		    vm.gridProjectAnomalyInfo.dataSource.filter(filters);
     	    };
        	//点击录入按钮
        	vm.addAnomalyProject = function(){
            	//获取申报项目列表
            	creditInfoSvc.grid(vm);
            	//显示项目列表模态框
            	$('#shenbaoList').modal('show');
            	//没有选择数据的时候，"确定"按钮不可用
            	vm.isConfirm = true;
            	//选择一条数据后，"确定"按钮可用
            	vm.change=function(){
            		vm.isConfirm = false;
            	};
            	//点击模态框的确定按钮
    			vm.confirmSubmit = function(){
    				var selectId = common.getKendoCheckId('.grid');
    				if (selectId.length == 0) {
    					return;
    				} else {
    					var selectValue = selectId[0].value;
    					var str = selectValue.split(",");
    					var projectNumber = str[0];
    					var projectName = str[1];
    					var unitName = str[2];
    					var createdDate = str[3];
    					var shenBaoInfoId = str[4];
    					vm.projectNumber = projectNumber;
    					vm.projectName = projectName;
    					vm.unitName = unitName;
    					vm.createdDate = createdDate;
    					vm.shenBaoInfoId = shenBaoInfoId;
    					creditInfoSvc.haveProjectAnomaly(vm);
    					$('.checkbox').removeAttr("checked");
    					$('#shenbaoList').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    				}   
    			};   
    			//点击模态框的取消或X按钮
    			vm.closeWindow = function(){
    				$('.checkbox').removeAttr("checked");
    				$('#shenbaoList').modal('hide');
    				$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    			};
            };
            //点击删除按钮
            vm.deleteProjectAnomaly = function(id){
            	vm.id = id;
            	common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			creditInfoSvc.deleteProjectAnomalyById(vm);
            		}
            	});
            };
        }//end fun page_projectAnomaly
        
        
        //黑名单修改页
        function page_blackListAlter(){
        	//根据黑名单id获取数据
        	creditInfoSvc.getBlackListById(vm);
        	vm.basicData.legalRepCertType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	//点击更新按钮，进行数据更新操作
        	vm.updateBlackListInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		creditInfoSvc.updateBlackListById(vm);
            	}
        	};
        }
    	//点击取消按钮，返回黑名单列表页
    	vm.returnBlackListPage = function(){
    		location.href="#/creditInfo/blackList";
    	};
    	
        
        //黑名单详情页
        function page_blackListDetails(){
        	creditInfoSvc.getBlackListById(vm);
        }
        
        //黑名单录入页面
        function page_addBlackList(){
        	vm.basicData.legalRepCertType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.title='黑名单信息录入';
        	vm.blackListModel.projectNumber=vm.projectNumber;
        	vm.blackListModel.projectName=vm.projectName;
        	vm.blackListModel.unitName=vm.unitName;
        	vm.blackListModel.shenbaoDate=vm.createdDate;
        	vm.blackListModel.shenBaoInfoId = vm.shenBaoInfoId;
        	//点击确定按钮，把页面录入的数据保存到数据库
        	vm.saveBlackListInfo=function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		vm.blackListModel.shenbaoDate = vm.toDate(vm.blackListModel.shenbaoDate);
            		creditInfoSvc.createBlackList(vm);
            	}
        	};
        }//end fun page_addBlackList
        
        //信用黑名单列表
        function page_blackList(){
        	creditInfoSvc.blackListGrid(vm);
            //黑名单列表页面 查询按钮
            vm.searchBlackList=function(){
            	vm.blackListModel.shenbaoDate = vm.toDate(vm.blackListModel.shenbaoDate);
     		    var filters = [];
     		    if(vm.blackListModel.unitName !=null && vm.blackListModel.unitName !=''){
       			   filters.push({field:'unitName',operator:'eq',value:vm.blackListModel.unitName});
       		    }
     		    if(vm.blackListModel.shenbaoDate != null && vm.blackListModel.shenbaoDate != ''){
     			   filters.push({field:'shenbaoDate',operator:'eq',value:vm.blackListModel.shenbaoDate});
     		    }
     		    vm.gridBlackListGrid.dataSource.filter(filters);
     	    };
     	    //信用黑名单列表 录入按钮
            vm.addBlackList = function(){
            	//获取申报项目列表
            	creditInfoSvc.grid(vm);
            	//显示项目列表模态框
            	$('#shenbaoList').modal('show');
            	//没有选择数据的时候，"确定"按钮不可用
            	vm.isConfirm = true;
            	//选择一条数据后，"确定"按钮可用
            	vm.change=function(){
            		vm.isConfirm = false;
            	};
            	//点击模态框的确定按钮
            	vm.confirmBlackList = function(){
            		var selectId = common.getKendoCheckId('.grid');
            		if (selectId.length == 0) {
            			return;
            		} else {
            			var selectValue = selectId[0].value;
            			var str = selectValue.split(",");
            			var projectNumber = str[0];
            			var projectName = str[1];
            			var unitName = str[2];
            			var createdDate = str[3];
            			var shenBaoInfoId = str[4];
            			vm.blackListModel.projectNumber = projectNumber;
            			vm.blackListModel.projectName = projectName;
            			vm.blackListModel.unitName = unitName;
            			vm.blackListModel.createdDate = createdDate;
            			vm.blackListModel.shenBaoInfoId = shenBaoInfoId;
            			creditInfoSvc.haveBlackList(vm);
            			$('.checkbox').removeAttr("checked");
            			$('#shenbaoList').modal('hide');
            			$(".modal-backdrop").remove(); //去掉模态框背面的阴影
            		}   
            	};   
            	//点击模态框的取消或X按钮
            	vm.closeShenBaoWindow = function(){
            		$('.checkbox').removeAttr("checked");
            		$('#shenbaoList').modal('hide');
            		$(".modal-backdrop").remove(); //去掉模态框背面的阴影
            	};
            };
     	    //点击删除按钮，删除该条黑名单信息
        	vm.deleteBlackList = function(id){
        		vm.id = id;
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			creditInfoSvc.deleteBlackListById(vm);
            		}
            	});
        	};
        }//end fun page_blackList
        
        //点击查看按钮，查看项目异常具体信息
        function page_illegalNameDetails(){
        	creditInfoSvc.getIllegalNameById(vm);
        }
        
        function page_illegalNameList(){
        	//获取异常项目名列表
        	creditInfoSvc.illegalNameGrid(vm);
        	//条件查询
     	    vm.searchIllegalName=function(){
        		vm.illegalNameModel.shenbaoDate = vm.toDate(vm.illegalNameModel.shenbaoDate);
     		    var filters = [];
     		    if(vm.illegalNameModel.unitName !=null && vm.illegalNameModel.unitName !=''){
       			   filters.push({field:'unitName',operator:'eq',value:vm.illegalNameModel.unitName});
       		    }
     		    if(vm.illegalNameModel.shenbaoDate != null && vm.illegalNameModel.shenbaoDate != ''){
     			   filters.push({field:'shenbaoDate',operator:'eq',value:vm.illegalNameModel.shenbaoDate});
     		    }
     		    vm.gridIllegalNameInfo.dataSource.filter(filters);
     	    };
     	    //信用异常名录列表页面 录入按钮
            vm.addIllegalName = function(){
            	//获取申报项目列表
            	creditInfoSvc.grid(vm);
            	//显示项目列表模态框
            	$('#shenbaoList').modal('show');
            	//没有选择数据的时候，"确定"按钮不可用
            	vm.isConfirm = true;
            	//选择一条数据后，"确定"按钮可用
            	vm.change=function(){
            		vm.isConfirm = false;
            	};
            	//点击模态框的确定按钮
    			vm.confirmSubmit = function(){
    				var selectId = common.getKendoCheckId('.grid');
    				if (selectId.length == 0) {
    					return;
    				} else {
    					var selectValue = selectId[0].value;
    					var str = selectValue.split(",");
    					var projectNumber = str[0];
    					var projectName = str[1];
    					var unitName = str[2];
    					var createdDate = str[3];
    					var shenBaoInfoId = str[4];
    					vm.projectNumber = projectNumber;
    					vm.projectName = projectName;
    					vm.unitName = unitName;
    					vm.createdDate = createdDate;
    					vm.shenBaoInfoId = shenBaoInfoId;
    					creditInfoSvc.haveIllegalName(vm);
    					$('.checkbox').removeAttr("checked");
    					$('#shenbaoList').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    				}   
    			};   
    			//点击模态框的取消或X按钮
    			vm.closeWindow = function(){
    				$('.checkbox').removeAttr("checked");
    				$('#shenbaoList').modal('hide');
    				$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    			};
            };
            //点击删除按钮
            vm.deleteIllegalName = function(id){
            	vm.id = id;
            	common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			creditInfoSvc.deleteIllegalNameById(vm);
            		}
            	});
            };
        }//end fun page_illegalNameList
        
        //项目异常名录输入页面
        function page_addIllegalNameInfo(){
        	vm.title='项目异常名录信息录入';
        	vm.illegalNameModel.projectNumber = vm.projectNumber;
        	vm.illegalNameModel.projectName = vm.projectName;
        	vm.illegalNameModel.unitName = vm.unitName;
        	vm.illegalNameModel.shenbaoDate = vm.createdDate;
        	vm.illegalNameModel.shenBaoInfoId = vm.shenBaoInfoId;
        	//点击确定按钮，把页面录入的数据保存到数据库
        	vm.saveIllegalNameInfo=function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		vm.illegalNameModel.shenbaoDate = vm.toDate(vm.illegalNameModel.shenbaoDate);
            		creditInfoSvc.createIllegalName(vm);
            	}
        	};
        }//end fun page_addIllegalNameInfo
        
        //点击取消按钮，返回信用异常目录页
        vm.returnIllegalNamePage=function(){
        	location.href="#/creditInfo/illegalNameList";
        };
        
      //申报详情模态框
		vm.dialog_shenbaoInfo = function(id){
			vm.id = id;
			creditInfoSvc.getShenBaoInfoById(vm);
			$('#shenbaoInfo').modal({
                backdrop: 'static',
                keyboard:false
            });
			//初始化tab
      	   vm.tabStripOptions={
      			//TODO
      	   };
		};
		
    	//点击修改按钮 修改数据
        function page_illegalNameEdit(){
        	vm.title='信用异常名录信息更改';
        	creditInfoSvc.getIllegalNameById(vm);
        	vm.updateIllegalNameInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		creditInfoSvc.updateIllegalNameById(vm);
            	}
        	};
        }
        
    }
})();;(function() {
	'use strict';

	angular.module('app').factory('creditInfoSvc', creditInfo);

	creditInfo.$inject = ['$http','$compile','$location'];	
	function creditInfo($http,$compile,$location) {
		var url_shenbao = "/management/shenbao";
		var url_creditInfo = "/management/creditInfo";
		var service = {
				grid : grid,//获取申报项目列表
				getShenBaoInfoById : getShenBaoInfoById,//根据申报id获取申报信息
				createIllegalName : createIllegalName,
				illegalNameGrid : illegalNameGrid,
				getIllegalNameById : getIllegalNameById,
				updateIllegalNameById : updateIllegalNameById,
				deleteIllegalNameById : deleteIllegalNameById,
				haveIllegalName : haveIllegalName,
				haveBlackList : haveBlackList,
				createBlackList : createBlackList,
				blackListGrid : blackListGrid,
				getBlackListById : getBlackListById,
				updateBlackListById : updateBlackListById,
				deleteBlackListById : deleteBlackListById,
				projectAnomalyGrid : projectAnomalyGrid,
				haveProjectAnomaly : haveProjectAnomaly,
				createProjectAnomaly : createProjectAnomaly,
				getProjectAnomalyById : getProjectAnomalyById,
				updateProjectAnomalyById : updateProjectAnomalyById,
				deleteProjectAnomalyById : deleteProjectAnomalyById
		};		
		return service;
		
		//根据id 删除项目异常信息
		function deleteProjectAnomalyById(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_creditInfo+"/projectAnomaly/delete"),
					data : vm.id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.gridProjectAnomalyInfo.dataSource.read();
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
		
		//根据id更新项目异常信息
		function updateProjectAnomalyById(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_creditInfo+"/updateProjectAnomaly"),
					data : vm.standby
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
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
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		//根据id获取项目异常信息
		function getProjectAnomalyById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo + "/projectAnomaly?$filter=id eq '{0}'", vm.id)
			};
			var httpSuccess = function (response) {
				vm.standby = response.data.value[0]||{};
				//处理时间问题
				vm.standby.shenbaoDate=vm.formatDate(vm.standby.shenbaoDate);
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		//创建项目异常数据
		function createProjectAnomaly(vm){
			var httpOptions = {
					method : "post",
					url : common.format(url_creditInfo+"/projectAnomaly"),
					data : vm.projectAnomalyModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						location.href = "#/creditInfo/projectAnomalyList";
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
		
		//查看数据库是否存在该项目
		function haveProjectAnomaly(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo+"/projectAnomaly?$filter=projectNumber eq '{0}'", vm.projectNumber)
			};
			var httpSuccess = function (response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isIllegalName = response.data.value[0];
						if(vm.isIllegalName){
							common.alert({
								vm:vm,
								msg:'该条申报项目已存在',
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/projectAnomaly//"+vm.projectNumber+"/"+vm.projectName+"/"+vm.unitName+"/"+vm.createdDate+"/"+vm.shenBaoInfoId;
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
		
		//获取项目异常数据
		function projectAnomalyGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_creditInfo+"/projectAnomaly")),
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.shenBaoInfoId,item.projectName);
					},
					width : 180,
					filterable : true
				},
				{
					field : "unitName",
					title : "申报单位名称",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					width : 180,
					template:function(item){
						return common.getUnitName(item.unitName);
					}
				},
				
				{
					field : "shenbaodDate",
					title : "申报日期",
					template:function(item){
						return common.formatDate(item.shenbaoDate);
					},
					width : 180,						
					filterable : false
				},
				{
					field : "isIllegalName",
					title : "项目审批和建设过程异常",
					width : 180,						
					filterable : true
				},
				{
					field : "isBlackList",
					title : "被纳入黑名单异常",
					width : 180,						
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						return common.format($('#projectAnomalyColumnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.gridProjectAnomalyInfo = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}
		//根据黑名单id 删除黑名单信息
		function deleteBlackListById(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_creditInfo+"/blackList/delete"),
					data : vm.id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.gridBlackListGrid.dataSource.read();
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
		
		//根据黑名单id 更新黑名单信息
		function updateBlackListById(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_creditInfo+"/updateBlackList"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
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
			
		
			
		
			
		}
		
		//根据黑名单id获取黑名单信息
		function getBlackListById(vm){

			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo + "/blackList?$filter=id eq '{0}'", vm.id)
			};
			var httpSuccess = function (response) {
				vm.model = response.data.value[0]||{};
				//处理时间问题
				vm.model.blackDate=vm.formatDate(vm.model.blackDate);
				vm.model.shenbaoDate=vm.formatDate(vm.model.shenbaoDate);
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		
		}
		
		//获取黑名单列表数据
		function blackListGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_creditInfo+"/blackList")),
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.shenBaoInfoId,item.projectName);
					},
					width : 180,
					filterable : true
				},
				{
					field : "unitName",
					title : "申报单位名称",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					width : 180,
					template:function(item){
						return common.getUnitName(item.unitName);
					}
				},
				
				{
					field : "shenbaodDate",
					title : "申报日期",
					template:function(item){
						return common.formatDate(item.shenbaoDate);
					},
					width : 180,						
					filterable : false
				},
				{
					field : "enterpriseName",
					title : "法人单位名称",
					width : 180,						
					filterable : true
				},
				{
					field : "blackReason",
					title : "列入黑名单原因",
					width : 180,						
					filterable : true
				},
				{
					field : "departmentName",
					title : "监管部门",
					width : 180,						
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						return common.format($('#blackColumnBtns').html(),item.id);
					}
				}
				
				
			];
			// End:column

			vm.gridBlackListGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}
		
		//创建黑名单信息
		function createBlackList(vm){
			var httpOptions = {
					method : "post",
					url : common.format(url_creditInfo+"/blackList"),
					data : vm.blackListModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
//						common.alert({
//							vm:vm,
//							msg:'录入成功！',
//							fn:function(){
//								$('.alertDialog').modal('hide');
								location.href = "#/creditInfo/blackList";
//							}
//						});
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
		
		//判断是否存在该申报项目，不存在则可以存入到黑名单表中
		function haveBlackList(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo+"/blackList?$filter=projectNumber eq '{0}'", vm.blackListModel.projectNumber)
			};
			var httpSuccess = function (response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.model = response.data.value[0];
						if(vm.model){
							common.alert({
								vm:vm,
								msg:'该条申报项目已存在',
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/blackList//"+vm.blackListModel.projectNumber+"/"+vm.blackListModel.projectName+"/"+vm.blackListModel.unitName+"/"+vm.blackListModel.createdDate+"/"+vm.blackListModel.shenBaoInfoId;
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
		
		//判断是否存在该申报项目，不存在则可以存入到项目异常名录表中
		function haveIllegalName(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo+"?$filter=projectNumber eq '{0}'", vm.projectNumber)
			};
			var httpSuccess = function (response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isIllegalName = response.data.value[0];
						if(vm.isIllegalName){
							common.alert({
								vm:vm,
								msg:'该条申报项目已存在',
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/illegalNameEdit//"+vm.projectNumber+"/"+vm.projectName+"/"+vm.unitName+"/"+vm.createdDate+"/"+vm.shenBaoInfoId;
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
		
//		function deleteIllegalNameById(vm){
//			var httpOptions = {
//					method : 'put',
//					url : common.format(url_creditInfo+"/delete?id={0}", vm.id)
//			};
//			var httpSuccess = function (response){
//				common.requestSuccess({
//					vm : vm,
//					response : response,
//					fn : function(){
//						common.alert({
//							vm : vm,
//							msg : "操作成功",
//							fn : function() {
//								$('.alertDialog').modal('hide');
//								vm.gridIllegalNameInfo.dataSource.read();
//							}
//						});
//					}
//				});
//			};
//			common.http({
//				vm : vm,
//				$http : $http,
//				httpOptions : httpOptions,
//				success : httpSuccess
//			});
//		}
		
		//根据id更新项目异常名录信息
		function updateIllegalNameById(vm){
			var httpOptions = {
					method : 'post',
					url : url_creditInfo+'/updateIllegalName',
					data : vm.illegalNameModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
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
			
		
			
		}//end fun updateIllegalNameById
		
		//根据id获取项目异常名录信息
		function getIllegalNameById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo + "?$filter=id eq '{0}'", vm.id)
			};
			var httpSuccess = function (response) {
				vm.illegalNameModel = response.data.value[0]||{};
				//处理时间问题
				vm.illegalNameModel.illegalDate=vm.formatDate(vm.illegalNameModel.illegalDate);
				vm.illegalNameModel.shenbaoDate=vm.formatDate(vm.illegalNameModel.shenbaoDate);
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getIllegalNameById
		
		//获取异常名录列表
		function illegalNameGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_creditInfo),
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
//						return common.format("<a>{0}</a>",item.projectName);
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.shenBaoInfoId,item.projectName);
					},
					width : 180,
					filterable : true
				},
				{
					field : "unitName",
					title : "申报单位名称",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					width : 180,
					template:function(item){
						return common.getUnitName(item.unitName);
					}
				},
				
				{
					field : "shenbaodDate",
					title : "申报日期",
					template:function(item){
						return common.formatDate(item.shenbaoDate);
					},
					width : 180,						
					filterable : false
				},
				{
					field : "illegalType",
					title : "异常情形代码",
					width : 180,						
					filterable : true
				},
				{
					field : "illegalContent",
					title : "异常内容",
					width : 180,						
					filterable : true
				},
				{
					field : "departmentName",
					title : "监管部门",
					width : 180,						
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
				
				
			];
			// End:column

			vm.gridIllegalNameInfo = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}//end fun illegalNameGrid
		
		//创建项目异常名录信息
		function createIllegalName(vm){
			var httpOptions = {
					method : "post",
					url : url_creditInfo,
					data : vm.illegalNameModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						location.href = "#/creditInfo/illegalNameList";
					}
				});
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
			
		}//end fun createIllegalName
		
		//根据申报id获取申报信息
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value[0]||{};
//				if(vm.shenBaoInfoEdit){//如果是编辑页面
//					//年度计划申报年份处理
//					vm.planYear = vm.model.shenBaoInfo.planYear;
//				}
//				if(vm.shenBaoInfoAdd){//如果是新增页面
//					//初始化相关数据
//		    		vm.model.shenBaoInfo.projectInvestmentType = vm.investmentType;//投资类型
//		     		vm.model.shenBaoInfo.projectShenBaoStage = vm.stage;//申报阶段
//		    		//初始化申报年份（三年滚动）
//					var date = new Date();
//					vm.planYear = vm.model.shenBaoInfo.planYear = parseInt(date.getFullYear()+1);
//				}
				
				//项目类型、建设单位的显示
				vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,',');
				vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
//				if(vm.constructionUnits.length >1){//如果建设单位有多个则可以删除
//					vm.canDelete = true;
//				}else{
//					vm.canDelete = false;
//				}
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
				vm.model.shenBaoInfo.apInvestSum=common.toMoney(vm.model.shenBaoInfo.apInvestSum);//累计安排投资
				vm.model.shenBaoInfo.capitalAP_ggys_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_TheYear);
				vm.model.shenBaoInfo.capitalAP_gtzj_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear);
				vm.model.shenBaoInfo.capitalAP_qita=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita);
				
				vm.model.shenBaoInfo.capitalAP_gtzj_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear);
				vm.model.shenBaoInfo.capitalAP_ggys_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastYear);
				vm.model.shenBaoInfo.capitalAP_qita_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastYear);
				
				vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear);
				
			
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
//		  		if(vm.page=='shenbaoInfoList'){//如果为列表页时--申报详情链接
		  			if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
						 vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
						 vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
		    			   vm.isYearPlan = true;
					}
//		  		}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getShenBaoInfoById
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),
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
				filter:{
					field:"isIncludLibrary",
					operator:"eq",
					value:true
				}
			});
			// End:dataSource
			
			// Begin:column
			var columns = [
				{
					template : function(item) {
//						return kendo.format("<input type='radio' relId='{0},{1},{2},{3}' id='checkbox' name='checkbox' class='checkbox' ng-click='vm.change()'/>",item.projectNumber,item.projectName,item.unitName,common.formatDateTime(item.createdDate));
						return kendo.format("<input type='radio' relId='{0},{1},{2},{3},{4}' id='checkbox' name='checkbox' class='checkbox' ng-click='vm.change()'/>",item.projectNumber,item.projectName,item.unitName,common.formatDateTime(item.createdDate),item.id);
					},
					filterable : false,
					width : 40				
				},
				{
					field : "projectNumber",
					title : "项目代码",
					width : 180,						
					filterable : true
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
					title : "申报单位",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					template:function(item){
						return common.getUnitName(item.unitName);
					}
				},
				{
					field : "createdDate",
					title : "创建时间",
					template:function(item){
						return common.formatDate(item.createdDate);
					},
					width : 180,						
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

		}// end fun grid
		
	}	
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('mediationManagementCtrl', mediationManagement);

    mediationManagement.$inject = ['$location','mediationManagementSvc','$state','$scope']; 

    function mediationManagement($location, mediationManagementSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.model={}; 
    	vm.model.projectDto={};
    	vm.model.mediationUnitDtos=[];
    	vm.basicData={};
    	vm.model.display = false;
    	vm.id=$state.params.id;
    	vm.init=function(){
         	var routeName=$state.current.name;  
         	switch (routeName) {
 			case "mediationUnitList":
 				vm.page="mediationUnitList";
 				break;
 			case "mediationUnitChange":
 				if(vm.id){
 					vm.page="mediationUnitUpdate";
 				}else{
 					vm.page="mediationUnitCreate";
 				}break;
 			case "mediationUnitDetails":
 				vm.page="mediationUnitDetails";
 				break;
 			case "assistReviewList":
 				vm.page="assistReviewList";
 				break;
 			case "assistReviewChange":
 				if(vm.id){
 					vm.page="assistReviewUpdate";
 				}else{
 					vm.page="assistReviewCreate";
 				}break; 
 			case "assistReviewDetails":
 				vm.page="assistReviewDetails";
 				break;
 			case "serviceEvaluation":
 				vm.page="serviceEvaluation"; 
 				break;
 			case "submitReviewEvaluation":
 				vm.page="submitReviewEvaluation"; 
 				
 			}
         	vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};
         };//end init   
         
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='mediationUnitList'){
        		vm.title="中介单位列表" ;
        		page_mediationUnitList();
        	} 
        	if(vm.page=='mediationUnitUpdate'){
        		vm.title="中介单位编辑" ;
        		page_mediationUnitUpdate();
        	} 
        	if(vm.page=='mediationUnitCreate'){
        		vm.title="中介单位新增" ;
        		page_mediationUnitCreate();
        	} 
        	if(vm.page=='mediationUnitDetails'){
        		vm.title="中介单位信息查看" ;
        		page_mediationUnitDetails();
        	} 
        	if(vm.page=='assistReviewList'){
        		vm.title="协审活动列表" ;
        		page_assistReviewList();
        	} 
        	if(vm.page=='assistReviewUpdate'){
        		vm.title="协审活动编辑" ;
        		page_assistReviewUpdate();
        	} 
        	if(vm.page=='assistReviewCreate'){
        		vm.title="协审活动新增" ;
        		page_assistReviewCreate();
        	} 
        	if(vm.page=='assistReviewDetails'){
        		vm.title="协审活动详情" ;
        		page_assistReviewDetails();
        	}
        	if(vm.page=='serviceEvaluation'){
        		vm.title="服务质量评价" ;
        		page_serviceEvaluation();
        	}
        	if(vm.page=='submitReviewEvaluation'){
        		vm.title="送审文件质量评价" ;
        		page_submitReviewEvaluation();
        	}
        }
        function page_submitReviewEvaluation(){
        	vm.submitReviewEvaluation=function(){
        		 mediationManagementSvc.updateAssistReview(vm);
        	};
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.basicData.rating=common.getBacicDataByIndectity(common.basicDataConfig().serviceRating);
       	    vm.delFile=function(index,i){
     		     var file = vm.model.submitReviewEvaluationDtos[index].attachmentDtos[i];
     		     console.log(file);
 	   			 if(file){
 	   				vm.model.submitReviewEvaluationDtos[index].attachmentDtos.splice(i,1);
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
     	 vm.uploadSuccess=function(e){
 			var index=$(e.sender.element).parents('.uploadBox').attr('data-type');
             if(e.XMLHttpRequest.status==200){
                 angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, inx) {
                     console.log(index);
                     if(vm.model.submitReviewEvaluationDtos[index].attachmentDtos){
                         vm.model.submitReviewEvaluationDtos[index].attachmentDtos.push({
                             name: fileObj.originalFilename,
                             url: fileObj.randomName,
                         });
                     }else{
                         vm.model.submitReviewEvaluationDtos[index].attachmentDtos=[];
                         vm.model.submitReviewEvaluationDtos[index].attachmentDtos=[{
                             name: fileObj.originalFilename,
                             url: fileObj.randomName,
                         }];
                     }
                 })
                 // var fileName=e.XMLHttpRequest.response;
                 // $scope.$apply(function(){
                 //     console.log(index);
                 //     if(vm.model.submitReviewEvaluationDtos[index].attachmentDtos){
                 //         vm.model.submitReviewEvaluationDtos[index].attachmentDtos.push({name:fileName.split('_')[2],url:fileName});
                 //     }else{
                 //         vm.model.submitReviewEvaluationDtos[index].attachmentDtos=[];
                 //         vm.model.submitReviewEvaluationDtos[index].attachmentDtos=[{name:fileName.split('_')[2],url:fileName}];
                 //     }
                 // });
             }
		};
        vm.uploadError = function(e) {
            common.alert({
                vm : vm,
                msg : e.XMLHttpRequest.response.message
            });
        }
		vm.uploadOptions={
  				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
                error:vm.uploadError,
                success:vm.uploadSuccess,
  				localization:{select:'上传文件'},
  				showFileList:false,
  				multiple:true,
  				validation: {
  	                maxFileSize: common.basicDataConfig().uploadSize
  	            },
  	            select:vm.onSelect
  		};
        }
        function page_serviceEvaluation(){
        	vm.submitServiceEvaluation=function(){
        		 mediationManagementSvc.updateAssistReview(vm);
        	};
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.basicData.rating=common.getBacicDataByIndectity(common.basicDataConfig().serviceRating);
        	 vm.delFile=function(index,i){
      		     var file = vm.model.serviceEvaluationDtos[index].attachmentDtos[i];
      		     console.log(file);
  	   			 if(file){
  	   				vm.model.serviceEvaluationDtos[index].attachmentDtos.splice(i,1);
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
      	 vm.uploadSuccess=function(e){
  			var index=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, inx) {
                         $scope.$apply(function() {
                             if(vm.model.serviceEvaluationDtos[index].attachmentDtos){
                                 vm.model.serviceEvaluationDtos[index].attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                 });
                             } else {
                                 vm.model.serviceEvaluationDtos[index].attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  console.log(index);
	           			//  if(vm.model.serviceEvaluationDtos[index].attachmentDtos){
	           			// 	 vm.model.serviceEvaluationDtos[index].attachmentDtos.push({name:fileName.split('_')[2],url:fileName});
	           			//  }else{
	           			// 	 vm.model.serviceEvaluationDtos[index].attachmentDtos=[];
	           			// 	 vm.model.serviceEvaluationDtos[index].attachmentDtos=[{name:fileName.split('_')[2],url:fileName}];
	           			//  }
	           		 // });
	           	 }
 		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

 		vm.uploadOptions={
   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
                error:vm.uploadError,
                success:vm.uploadSuccess,
   				localization:{select:'上传文件'},
   				showFileList:false,
   				multiple:true,
   				validation: {
   	                maxFileSize: common.basicDataConfig().uploadSize
   	            },
   	            select:vm.onSelect
   		};
        	
        }
        function page_assistReviewDetails(){
        	mediationManagementSvc.getAssistReviewById(vm);
        }
        function page_assistReviewCreate(){
        	vm.choiceProject=function(){
            	 $('.myDialog').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
            };
       	vm.choiceMediationUnit=function(){
      		 $('.myDialog1').modal({
                   backdrop: 'static',
                   keyboard:false
               });
      	    };
       	mediationManagementSvc.mediationUnitGrid(vm);
       	mediationManagementSvc.projectGrid(vm);
       	//提交选择项目
           vm.choiceProjectSubmit=function(){
           	var str=$('input:radio[name="radio"]:checked').val();
           	 if (str==""||str==null) {
                	/*common.alert({
                    	vm:vm,
                    	msg:'请选择数据'
                    	
                    });*/
                } else {
               	 var strs= []; //定义一数组 
                	 strs=str.split(","); //字符分割 
                	 vm.model.projectDto.id=strs[0];
                	 vm.model.projectDto.projectName=strs[1];
                	 $('.myDialog').modal('hide');
                }
           
         };
       	 //提交选择专家
       	vm.choiceAssistReviewSubmit=function(){
        	   if(vm.model.mediationUnitDtos.length>0){
        		   vm.model.mediationUnitDtos=[];
        	   }
        	   $('input[type="checkbox"][name="mediationUnit"]:checked').each(
                       function(i) {
                           var strs=[]; //定义一数组 
	                    	strs=$(this).val().split(","); //字符分割 
	                    	vm.model.mediationUnitDtos.push({id:strs[0],mediationUnitName:strs[1]});
	                    	$('.myDialog1').modal('hide');
                       }
                   );
        	   
           };
       	 //移除选择项目
           vm.removeProject=function(){
            	 vm.model.projectDto={};            
                 };
       	//移除选择专家
       	 vm.removeMediationUnit=function(i){
          	 vm.model.mediationUnitDtos.splice(i,1);
           };
       	vm.createAssistReview=function(){
       		mediationManagementSvc.createAssistReview(vm);
       	};
        }
        
        function page_assistReviewUpdate(){
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.choiceProject=function(){
             	 $('.myDialog').modal({
                      backdrop: 'static',
                      keyboard:false
                  });
             };
        	vm.choiceMediationUnit=function(){
       		 $('.myDialog1').modal({
                    backdrop: 'static',
                    keyboard:false
                });
       	    };
        	mediationManagementSvc.mediationUnitGrid(vm);
        	mediationManagementSvc.projectGrid(vm);
        	//提交选择项目
            vm.choiceProjectSubmit=function(){
            	var str=$('input:radio[name="radio"]:checked').val();
            	 if (str==""||str==null) {
                 	/*common.alert({
                     	vm:vm,
                     	msg:'请选择数据'
                     	
                     });*/
                 } else {
                	 var strs= []; //定义一数组 
                 	 strs=str.split(","); //字符分割 
                 	 vm.model.projectDto.id=strs[0];
                 	 vm.model.projectDto.projectName=strs[1];
                 	 $('.myDialog').modal('hide');
                 }
            
          };
        	 //提交选择专家
        	vm.choiceAssistReviewSubmit=function(){
         	   if(vm.model.mediationUnitDtos.length>0){
         		   vm.model.mediationUnitDtos=[];
         	   }
         	   $('input[type="checkbox"][name="mediationUnit"]:checked').each(
                        function(i) {
                            var strs=[]; //定义一数组 
 	                    	strs=$(this).val().split(","); //字符分割 
 	                    	vm.model.mediationUnitDtos.push({id:strs[0],mediationUnitName:strs[1]});
 	                    	$('.myDialog1').modal('hide');
                        }
                    );
         	   
            };
        	 //移除选择项目
            vm.removeProject=function(){
             	 vm.model.projectDto={};            
                  }; 
        	//移除选择专家
        	 vm.removeMediationUnit=function(i){
        		 vm.model.mediationUnitDtos.splice(i,1);
            };
        	 vm.updateAssistReview=function(){
        		 mediationManagementSvc.updateOnlyAssistReview(vm);
        	 };
        }
        function page_assistReviewList(){
        	mediationManagementSvc.assistReviewGrid(vm);
        	vm.delAssistReview = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	mediationManagementSvc.delAssistReview(vm,id);
                         }
                     });
                };
             vm.delAssistReviews = function () {     
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
                        vm.delAssistReview(idStr);
                    }   
               };
        	
        	
        }
        function page_mediationUnitDetails(){
        	mediationManagementSvc.geMediationUnitById(vm);
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        }
        function page_mediationUnitList(){
        	mediationManagementSvc.unitGrid(vm);
        	vm.delMediationUnit = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	mediationManagementSvc.delMediationUnit(vm,id);
                         }
                     });
                };
             vm.delMediationUnits = function () {     
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
                        vm.delMediationUnit(idStr);
                    }   
               };
        	
        }
        function page_mediationUnitUpdate(){
        	mediationManagementSvc.geMediationUnitById(vm);
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.updateMediationUnit=function(){
        		mediationManagementSvc.updateMediationUnit(vm);
        	};
        }
        function page_mediationUnitCreate(){
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.createMediationUnit=function (){
        		mediationManagementSvc.createMediationUnit(vm);
        	};
        }
        
        function page_mediationManagementList(){
        	mediationManagementSvc.softwarGrid(vm);
        	vm.del = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	mediationManagementSvc.del(vm,id);
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
        }
      
       
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('mediationManagementSvc', mediationManagement);

	mediationManagement.$inject = [ '$http','$compile','$location' ];	
	function mediationManagement($http,$compile,$location) {	
		var url_mediationManagement="/management/mediationManagement";
		var url_project = "/management/project";//获取项目信息数据
		var service = {
			unitGrid:unitGrid,//中介单位列表
			geMediationUnitById:geMediationUnitById,//中介单位详细信息
			updateMediationUnit:updateMediationUnit,//编辑中介单位
			createMediationUnit:createMediationUnit,//创建中介单位
			delMediationUnit:delMediationUnit,//删除中介单位
			assistReviewGrid:assistReviewGrid,//协审活动列表
			getAssistReviewById:getAssistReviewById,//协审活动详细信息
			mediationUnitGrid:mediationUnitGrid,//中介单位弹出列表
			projectGrid:projectGrid,//项目库弹出列表
			updateAssistReview:updateAssistReview,  //编辑协审活动评价
			createAssistReview:createAssistReview ,  //创建协审活动
			delAssistReview:delAssistReview, //删除协审活动
			updateOnlyAssistReview:updateOnlyAssistReview //编辑协审活动
		};		
		return service;	
		function delMediationUnit(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url:url_mediationManagement+'/deleteMediation',
                data:id
            };
            var httpSuccess = function success(response) {
                
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.unitGridOptions.dataSource.read();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun delete
		function delAssistReview(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url:url_mediationManagement+"/delAssistReview",
                data:id 
            };
            var httpSuccess = function success(response) {
                
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.assistReviewGridOptions.dataSource.read();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun delete
		//创建协审活动
		function createAssistReview(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement+"/createAssistReview",
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
									location.href = "#/assistReviewList";
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
			}
		}// end func createAssistReview
		function updateMediationUnit(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement+'/updateMediationManagement',
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
			}
		}// end fun update
		function geMediationUnitById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_mediationManagement + "?$filter=id eq '{0}'", vm.id)
				};
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];	
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		function getAssistReviewById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_mediationManagement+"/assistReviewList" + "?$filter=id eq '{0}'", vm.id)
				};
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];	
					vm.model.assistReviewBeginDate=common.formatDateTime(vm.model.assistReviewBeginDate);
					vm.model.assistReviewEndDate=common.formatDateTime(vm.model.assistReviewEndDate);
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		//编辑协审活动评价
		function updateAssistReview(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement+"/updateAssistReview",
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
			}
		}// end fun updateAssistReview
		//编辑协审活动评价
		function updateOnlyAssistReview(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement+"/updateOnlyAssistReview",
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
			}
		}// end fun updateOnlyAssistReview
		//创建中介单位信息
		function createMediationUnit(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement,
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
									location.href = "#/mediationUnitList";
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
			}
		}// end func create
		//协审活动列表
		function assistReviewGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_mediationManagement+"/assistReviewList"), //获取数据
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
					field : "assistReviewName",
					title : "协审活动名称",						
					template:"",
					filterable : true
				},
				{
					field : "assistReviewBeginDate",
					title : "协审活动开始时间",						
					template:function(item){
						return common.formatDateTime(item.assistReviewBeginDate);
					},
					filterable : true
				},
				{
					field : "assistReviewEndDate",
					title : "协审活动结束时间",						
					template:function(item){
						return common.formatDateTime(item.assistReviewEndDate);
					},
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 380,
					template:function(item){
						var flag;
						if(item.isEvaluation){
							flag=false;
						}else {
							flag=true;
						}
						return common.format($('#columnBtns').html(),item.id,flag);
						
					}
				}
					  								
			];
			// End:column
		
			vm.assistReviewGridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
		//中介单位列表
		function unitGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_mediationManagement), //获取数据
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
						field : "mediationUnitName",
						title : "中介单位名称",						
						template:"",
						filterable : true
					},
					{
						field : "businessScope",
						title : "中介机构经营范围",						
						template:"",
						filterable : true
					},
					{
						field : "",
						title : "操作",
						width : 280,
						template:function(item){
							var flag;
							if(item.reviewResult!=null&&item.reviewResult!=""){
								flag=false;
							}else {
								flag=true;
							}
							return common.format($('#columnBtns').html(),item.id,flag);
							
						}
					}
																				
			];
			// End:column
		
			vm.unitGridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
		function mediationUnitGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_mediationManagement), //获取数据
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
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  value='{0}'  relId='{0}' name='mediationUnit' class='checkbox' />",
											item.id+","+item.mediationUnitName);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
						
					},
					  
					{
						field : "mediationUnitName",
						title : "中介单位名称",						
						template:"",
						filterable : true
					},
					{
						field : "businessScope",
						title : "中介机构经营范围",						
						template:"",
						filterable : true
					}
					
																				
			];
			// End:column
		
			vm.mediationUnitGridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
		// begin#grid
		function projectGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
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
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_ZF
					},
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
											"<input  type='radio'  relId='{0}' value='{0}' name='radio' class='radio' />",
											item.id+","+item.projectName);
						},
						filterable : false,
						width : 40,
						title : ""

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
					}
					
				

			];
			// End:column

			vm.projectGridOptions = {
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
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.projectId=$state.params.projectId;
    	vm.projectInvestmentType=$state.params.projectInvestmentType;
		vm.year=$state.params.year;
		vm.month=$state.params.month;
		vm.search={};
    	vm.model={};
    	vm.basicData={};
    	vm.page='list';
    	vm.model.display = false;
    	
        vm.init=function(){
        	if($state.current.name=='monthReport_SH'){
        		vm.page='list_SH';
        	}
        	if($state.current.name=='monthReport_details'){
        		vm.page='details';
        	}
        	if($state.current.name=='monthReportChange'){
        		vm.page='edit';
        	}
        	
        	vm.getBasicDataDesc = function(Str){
        		return common.getBasicDataDesc(Str);
        	};
        	
        	vm.checkLength = function(obj,max,id){
     			 common.checkLength(obj,max,id);
          	};
          	
          	vm.getUnitName = function(unitId){
          		return common.getUnitName(unitId);
          	};
          	
          	//清空查询条件
	   		vm.filterClear=function(){
	   			location.reload();
	   		};
          	
          	//用于查询--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectInvestmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//投资类型
	   		vm.basicData.userUnit=common.getUserUnits();//获取所有用户单位
	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	   			.toArray();//政府投资项目行业
	   		vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
	   			.toArray();//社会投资项目行业
        };//end init
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		page_list();
        	}
        	if(vm.page=='list_SH'){
        		page_list_SH();
        	}
        	if(vm.page=='details'){  
        		page_details();
        	}
        	if(vm.page=='edit'){
        		page_details();
        	}
            
        }
        
        function page_list(){
        	monthReportSvc.grid(vm);
        	//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				filters.push({field:'isMonthReport',operator:'eq',value:true});//默认条件--需要填报月报 
				filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--社会投资
				
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   	if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
     			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
     		   	}
     		   	if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
        		   	filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
    		   	}
     		   	if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   	}
 			  vm.gridOptions.dataSource.filter(filters);
    		};
        }
        
        function page_list_SH(){
        	monthReportSvc.grid_SH(vm);
        	
        	//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				filters.push({field:'isMonthReport',operator:'eq',value:true});//默认条件--需要填报月报 
				filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_SH});//默认条件--社会投资
				 
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
					filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		}
     		   	if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
     		   		filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
     		   	}
     		   	if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     		   	filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   	}
     		   	if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   	}
 			  vm.gridOptions_SH.dataSource.filter(filters);
    		};
        	
        	//条件查询--项目行业子集发生变化
   	   	   vm.searchIndustryChildChange=function(){
   	   		   vm.searchIndustryChild=false;
   	   		   if(vm.search.projectIndustryChild !=null && vm.search.projectIndustryChild !=''){
   	   				vm.basicData.projectIndustryChild_SH=$linq(common.getBasicData())
   	   					.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.search.projectIndustryChild;})
   	   					.toArray();//社会投资项目行业子集
   	   				vm.searchIndustryChild=true;
   	   		   }
   	   	   };
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
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.monthReport.attachmentDtos){
                                 vm.model.monthReport.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type:type
                                 });
                             } else {
                                 vm.model.monthReport.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type:type
                                 }];
                             }
                         });
                     })
   	           		 // var fileName=e.XMLHttpRequest.response;
   	           		 // $scope.$apply(function(){
   	           			//  if(vm.model.monthReport.attachmentDtos){
   	           			// 	 vm.model.monthReport.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
   	           			//  }else{
   	           			// 	 vm.model.monthReport.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
   	           			//  }
   	           		 // });
   	           	 }
    		 };
            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
            	if(vm.isZFInvestment){
            		location.href="#/monthReport";
            	}else if(vm.isSHInvestment){
            		location.href="#/monthReport_SH";
            	}
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
		var url_backToZFlist = "/monthReport";
		var url_backToSHlist = "/monthReport_SH";
	
		var service = {
			grid : grid,
			grid_SH:grid_SH,
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
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.projectInfo = response.data.value[0]||{};
						//判断项目的投资类型
						if(vm.model.projectInfo.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){
							vm.isZFInvestment = true;
						}else if(vm.model.projectInfo.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){
							vm.isSHInvestment = true;
						}
						if(vm.page=='details' || vm.page=='edit'){	
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
								//金钱处理(TODO 这一块没必要了)
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
									if(vm.isZFInvestment){
										$location.path(url_backtToZFlist);//创建成功返回到列表页
									}else if(vm.isSHInvestment){
										$location.path(url_backToSHlist);//创建成功返回到列表页
									}
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
				},
				{
					field:'projectInvestmentType',
					operator:'eq',
					value:common.basicDataConfig().projectInvestmentType_ZF
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
					width:300,
					template:function(item){							
						return common.format('<a href="#/projectDetails/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);							
					},
					filterable : true
				},
				{
					field : "unitName",
					title : "责任单位名称",
					width:200,
					template:function(item){
						return vm.getUnitName(item.unitName);
					},
					filterable : {
						ui:function(element){
							element.kendoDropDownList({
								valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
							});
						}
					}
				},
				{
					field : "projectStage",
					title : "项目阶段",
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectStage,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false
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
					resizable: true,
					sortable:true,
					scrollable:true
				};
		}// end fun grid
		
		function grid_SH(vm) {
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
				},
				{
					field:'projectInvestmentType',
					operator:'eq',
					value:common.basicDataConfig().projectInvestmentType_SH
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
					width:300,
					template:function(item){							
						return common.format('<a href="#/projectDetails/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);							
					},
					filterable : true
				},
				{
					field : "unitName",
					title : "责任单位名称",
					width:200,
					template:function(item){
						return vm.getUnitName(item.unitName);
					},
					filterable : {
						ui:function(element){
							element.kendoDropDownList({
								valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
							});
						}
					}
				},
				{
					field : "projectStage",
					title : "项目阶段",
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectStage,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false
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
					filterable : false
				}															
			];
			// End:column
		
			vm.gridOptions_SH={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true,
					sortable:true,
					scrollable:true
				};
		}// end fun grid_SH
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
    	vm.model={};
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
                success:function(e){
                    if(e.XMLHttpRequest.status==200){
                        angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                            $scope.$apply(function() {
                                if(vm.model.attachmentDtos){
                                    vm.model.attachmentDtos.push({
                                        name: fileObj.originalFilename,
                                        url: fileObj.randomName,
                                        type: type
                                    });
                                } else {
                                    vm.model.attachmentDtos = [{
                                        name: fileObj.originalFilename,
                                        url: fileObj.randomName,
                                        type: type
                                    }];
                                }
                            });
                        })
                        // var fileName=e.XMLHttpRequest.response;
                        // $scope.$apply(function(){
                        //     if(vm.model.attachmentDtos){
                        //         vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:vm.type});
                        //     }else{
                        //         vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:vm.type}];
                        //     }
                        // });
                    }
                },
                error:function(e){
               	 console.log("error:");
               	 console.log(e);
                    common.alert({
                        vm : vm,
                        msg : e.XMLHttpRequest.response.message
                    });
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
					method : 'post',
					url : url_portal+'/updatePortal',
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
                method: 'post',
                url:url_portal+'/deletePortal',
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

    project.$inject = ['$location','projectSvc','$state','$scope','$sce']; 

    function project($location, projectSvc,$state,$scope,$sce) {
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
    		if($state.current.name=='project'){
    			vm.isZFInvestment = true;
    		}
    		if($state.current.name=='project_SH'){
    			vm.isSHInvestment = true;
    		}
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
    		
    		vm.html = function(val){
    			return $sce.trustAsHtml(val);
    		};
    		
    		//用于查询、编辑、新增--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
	   		vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
	   		vm.basicData.projectIndustryAll=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
   	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
   	   			.toArray();//政府投资项目行业
   	   		vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
   	   			.toArray();//社会投资项目行业
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();//获取街道信息
	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	       		.toArray();//政府投资项目行业
	   		vm.basicData.userUnit=common.getUserUnits();
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
    		if(vm.isZFInvestment){
    			projectSvc.grid(vm);
    		}
    		if(vm.isSHInvestment){
    			projectSvc.grid_SH(vm);
    		}
    		projectSvc.grid(vm);
    		//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				if(vm.isZFInvestment){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--政府投资项目 
					filters.push({field:'isIncludLibrary',operator:'eq',value:true});//默认条件--项目纳入项目库  
				}
				if(vm.isSHInvestment){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_SH});//默认条件--政府投资项目 
				}
				 
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
     			  filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		   
     		   if(vm.isZFInvestment){
     			  vm.gridOptions.dataSource.filter(filters);
     		   }else if(vm.isSHInvestment){
     			  vm.gridOptions_SH.dataSource.filter(filters);
     		   }

    		};
    		//条件查询--项目行业子集发生变化
   	   	   vm.searchIndustryChildChange=function(){
   	   		vm.searchIndustryChild=false;
   	   		if(vm.search.projectIndustryChild !=null && vm.search.projectIndustryChild !=''){
   	   		vm.basicData.projectIndustryChild_SH=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.search.projectIndustryChild;})
   	   			.toArray();//社会投资项目行业子集
   	   		vm.searchIndustryChild=true;
   	   		}
   	   	   };
	   	  //清空查询条件
	   		vm.filterClear=function(){
	   			location.reload();
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
  			 //资金来源计算
  	 		 vm.capitalTotal=function(){
  	 			 return common.getSum([
  	 					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
  	 					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
  	 					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
  	 					 vm.model.capitalOther||0]);
  	 		 };
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
  			//投资去处计算（社投）
   	   		 vm.investTotal=function(){
   	   			 vm.model.projectInvestSum=common.getSum([vm.model.landPrice||0,vm.model.equipmentInvestment||0,
 	   				 	 vm.model.buidSafeInvestment||0,vm.model.capitalOther||0]);
   	   			 return vm.model.projectInvestSum;
   	   		 };
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
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.attachmentDtos){
                                 vm.model.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.attachmentDtos){
	           			// 	 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
    		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

    		//展示批复文件选择模态框
    		vm.choseDocument = function(e){
    			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
   	        	   $("#documentRecords").modal({
   				        backdrop: 'static',
   				        keyboard:true		  
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
            	if(fileName){
            		var file = common.stringToArray(fileName,",");
            		var number = file[0];
            		var name = file[1];
            		var url =file[2];
            		vm.model['pifu'+vm.pifuType+'_wenhao'] = number;
            		if(vm.model.attachmentDtos){
         				  vm.model.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
         			 }else{
         				  vm.model.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
         			 }
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
    		
    	   vm.delFile=function(idx){
    		   var file = vm.model.attachmentDtos[idx];
	   			 if(file){//删除上传文件的同时删除批复文号
	   				var pifuType = file.type;
	   				vm.model['pifu'+pifuType+'_wenhao'] = "";
	   				vm.model.attachmentDtos.splice(idx,1);
	   			 }
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
   			  //相关附件文件上传文件种类
   			  vm.relatedType=common.uploadFileTypeConfig().projectEdit; 
   		   	}else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			  
   			  vm.isSHInvestment = true;
   			 //相关附件文件上传文件种类
   			  vm.relatedType=common.uploadFileTypeConfig().projectEdit_SH; 
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
		var url_backSH = "#/project_SH";
		var url_document="/management/replyFile";
		var service = {
			grid : grid,
			grid_SH:grid_SH,
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
					url : common.format(url_userUnit + "?$filter=id eq '{0}'", vm.model.unitName)
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
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}									
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
			vm.isSumbit=true;
			var httpOptions = {
					method : 'post',
					url : url_project+"/isMonthReport",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							vm.isSumbit=false;
							//关闭模态框
							$("#myModal_edit").modal('hide');
							//刷新表格数据
							if(vm.isZFInvestment){
								vm.gridOptions.dataSource.read(); 
							}else if(vm.isSHInvestment){
								vm.gridOptions_SH.dataSource.read(); 
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
					method : 'post',
					url : url_project+'updateProject',
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
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}
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
				vm.model.projectType=common.stringToArray(vm.model.projectType,',');

				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				
				//金额处理 （TODO 这一块可以不需要了）
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
					//资金来源计算
			   		 vm.capitalTotal=function(){
			   			 return common.getSum([
			   					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
			   					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
			   					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
			   					 vm.model.capitalOther||0]);
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
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
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
					field : "name",
					title : "文件名",
					width : 550,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
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
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
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
					field : "projectIndustry",
					dir : "desc"
				},
				filter:[
					{
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_ZF
					},
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
						width : 130,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						width:300,
						filterable : true
					},
					{
						field : "unitName",
						title : "项目所属单位",
						width : 150,
						filterable:{
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.userUnit,
			                        dataTextField: "unitName",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						template:function(item){
							return common.getUnitName(item.unitName);
						}
					},
					{
						field : "projectStage",
						title : "项目阶段",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.projectStage,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						}
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 100,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.projectIndustry_ZF,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
						}
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
						width : 100,
						filterable : true
					},
					{
						field : "",
						title : "操作",
						width : 150,
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
				resizable : true,
				sortable:true,
				scrollable:true
			};

		}// end fun grid
		
		// begin#grid
		function grid_SH(vm) {
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
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_SH
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
						width : 120,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						width:300,
						filterable : true
					},
					{
						field : "unitName",
						title : "责任单位",
						width : 200,
						filterable:{
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.userUnit,
			                        dataTextField: "unitName",
			                        dataValueField: "id",
			                        filter: "startswith"
			                    });
			                }
						},
						template:function(item){
							return common.getUnitName(item.unitName);
						}
					},
					{
						field : "projectStage",
						title : "项目阶段",
						width : 120,
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
						field : "projectIndustry",
						title : "项目行业",
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						width : 120,
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
						width : 120,
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

			vm.gridOptions_SH = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				scrollable:true,
				sortable:true
			};

		}// end fun grid
	}
	
	
})();;(function () {
    'use strict';

    angular
        .module('appSupervision')
        .controller('projectCtrl', project);

    project.$inject = ['$location','projectSupervisedSvc','$state','$scope','$sce']; 

    function project($location, projectSupervisedSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "新增项目";
    	vm.search={};
    	vm.model={};
    	vm.model.projectDto={};
    	vm.model.shenPiUnitDto={};
    	vm.basicData={};
        vm.id=$state.params.id;
        vm.projectInvestmentType=$state.params.projectInvestmentType;
    	vm.page="list";
    	function init(){
    		var routeName=$state.current.name;  
    		if($state.current.name=='project'){
    			vm.isZFInvestment = true;
    		}
    		if($state.current.name=='project_SH'){
    			vm.isSHInvestment = true;
    		}
    		if($state.current.name=='projectEdit'){
    			vm.page='create';
    		}
    		if(vm.id){
    			vm.page='update';
    		}
    		if($state.current.name=='projectDetails'){
    			vm.page='details';
    		}
    		switch (routeName) {
 			case "supervision_spdw":
 				vm.page="shenpiUnitList";
 				break;
 			case "shenpiUnitChange":  
 				if(vm.id){
 					vm.page="shenpiUnitUpdate";
 				}else{
 					vm.page="shenpiUnitCreate";
 				}break;
 			case "shenpiUnitDetail": 
 				vm.page="shenpiUnitDetail";
 				break;
 			case "shenpiItemsList":
 				vm.page="shenpiItemsList";
 				break;
 			case "shenpiItemsChange":  
				if(vm.id){
					vm.page="shenpiItemsUpdate";
				}else{
					vm.page="shenpiItemsCreate";
				}break;
 			case "shenpifankuiItemsList":
 				vm.page="shenpifankuiItemsList";
 				break;	
 			case "shenpifankuiItemsChange":
 				vm.page="shenpifankuiItemsChange";
 				break;
 			case "shenpifankuiItemsDetail":
 				vm.page="shenpifankuiItemsDetail";
 				break;
 			case "shenpiItemsDetail":
 				vm.page="shenpiItemsDetail";
    		}
    		
    		vm.getBasicDataDesc = function(Str){
    			return common.getBasicDataDesc(Str);
    		};
    		
    		vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
    		};
    		
    		vm.html = function(val){
    			return $sce.trustAsHtml(val);
    		};
    		
    		//用于查询、编辑、新增--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
	   		vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();//获取街道信息
	   		vm.basicData.userUnit=common.getUserUnits();
    	}
    	init();    	
    	activate(); 
        function activate() {
        	
        	if(vm.page=="shenpiItemsDetail"){
        		vm.title='审批事项详情';
        		shenpiItemsDetail();
        	}
        	if(vm.page=="shenpifankuiItemsDetail"){
        		vm.title='审批事项反馈详情';
        		shenpifankuiItemsDetail();
        	}
        	if(vm.page=="shenpifankuiItemsChange"){
        		vm.title='审批事项反馈';
        		shenpifankuiItemsChange();
        	}
        	if(vm.page=="shenpifankuiItemsList"){
        		vm.title='审批事项反馈列表';
        		shenpifankuiItemsList();
        	}
        	if(vm.page=="shenpiItemsCreate"){
        		vm.title='审批事项新增';
        		shenpiItemsCreate();
        	}
        	if(vm.page=="shenpiItemsUpdate"){
        		vm.title='审批事项编辑';
        		shenpiItemsUpdate();
        	}
        	if(vm.page=="shenpiItemsList"){
        		vm.title='审批事项列表';
        		shenpiItemsList();
        	}
        	if(vm.page=='shenpiUnitDetail'){
        		shenpiUnitDetail();
        	}
        	if(vm.page=='shenpiUnitCreate'){
        		shenpiUnitCreate();
        	}
        	if(vm.page=='shenpiUnitUpdate'){
        		shenpiUnitUpdate();
        	}
        	if(vm.page=='list'){
        		init_list();
        	}
        	if(vm.page=='shenpiUnitList'){
        		vm.title='审批单位列表';
        		shenpiUnitList();
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
        function shenpiItemsDetail(){
        	projectSupervisedSvc.getShenPiItemsById(vm);
        }
        function shenpifankuiItemsDetail(){
        	
        	projectSupervisedSvc.getShenPiItemsById(vm);
        }
        function shenpifankuiItemsChange(){
        	
        	projectSupervisedSvc.getShenPiItemsById(vm);
        	vm.updateShenpiFanKui=function(){
        		projectSupervisedSvc.updateShenpiItems(vm);
        	};
        }
        function shenpifankuiItemsList(){
        	projectSupervisedSvc.shenpifankuiItemsGrid(vm);
        	vm.searchShenPiItems=function(){
    			var filters = [];
    			if(vm.search.shenpiName !=null && vm.search.shenpiName !=''){
	     			   filters.push({field:'shenpiName',operator:'contains',value:vm.search.shenpiName});
	     		   }
    			if(vm.search.projectName !=null && vm.search.projectName !=''){
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
    			if(vm.search.shenpiUnitName !=null && vm.search.shenpiUnitName !=''){
	     			   filters.push({field:'shenpiUnitName',operator:'contains',value:vm.search.shenpiUnitName});
	     		   }
    		     vm.gridOptions.dataSource.filter(filters);
        	};
        	
        }
        function shenpiItemsCreate(){
        	vm.choiceProject=function(){
              	 $('.myDialog').modal({
                       backdrop: 'static',
                       keyboard:false
                   });
              };
           	vm.choiceShenPiUnit=function(){
           		 $('.myDialog1').modal({
                        backdrop: 'static',
                        keyboard:false
                    });
           	};
           	projectSupervisedSvc.projectGrid(vm);
        	projectSupervisedSvc.shenpiUnitGridSelect(vm);
        	//提交选择项目
            vm.choiceProjectSubmit=function(){
            	var str=$('input:radio[name="radio"]:checked').val();
            	 if (str==""||str==null) {
                 	/*common.alert({
                     	vm:vm,
                     	msg:'请选择数据'
                     	
                     });*/
                 } else {
                	 var strs= []; //定义一数组 
                 	 strs=str.split(","); //字符分割 
                 	 vm.model.projectDto.id=strs[0];
                 	 vm.model.projectDto.projectName=strs[1];
                 	 $('.myDialog').modal('hide');
                 }
            
          };
            vm.choiceShenPiUnitSubmit=function(){
            	var str=$('input:radio[name="radio1"]:checked').val();
	           	if (str==""||str==null) {
	                	/*common.alert({
	                    	vm:vm,
	                    	msg:'请选择数据'
	                    	
	                    });*/
	                } else {
	               	 var strs= []; //定义一数组 
	                	 strs=str.split(","); //字符分割 
	                	 vm.model.shenPiUnitDto.id=strs[0];
	                	 vm.model.shenPiUnitDto.shenpiUnitName=strs[1];
	                	 $('.myDialog1').modal('hide');
	                }
            	
            };
            //移除选择项目
            vm.removeProject=function(){
             	  vm.model.projectDto={};            
                  }; 
            //移除选择单位
            vm.removeShenPiUnit=function(){
             	  vm.model.shenPiUnitDto={};            
                  };
            vm.createShenpiUnit=function(){
            	projectSupervisedSvc.createShenpiItems(vm);
            };
        }
        function shenpiItemsUpdate(){
        	vm.choiceProject=function(){
           	 $('.myDialog').modal({
                    backdrop: 'static',
                    keyboard:false
                });
           };
        	vm.choiceShenPiUnit=function(){
        		 $('.myDialog1').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
        	};
        	projectSupervisedSvc.projectGrid(vm);
        	projectSupervisedSvc.shenpiUnitGridSelect(vm);
        	projectSupervisedSvc.getShenPiItemsById(vm);
        	//提交选择项目
            vm.choiceProjectSubmit=function(){
            	var str=$('input:radio[name="radio"]:checked').val();
            	 if (str==""||str==null) {
                 	/*common.alert({
                     	vm:vm,
                     	msg:'请选择数据'
                     	
                     });*/
                 } else {
                	 var strs= []; //定义一数组 
                 	 strs=str.split(","); //字符分割 
                 	 vm.model.projectDto.id=strs[0];
                 	 vm.model.projectDto.projectName=strs[1];
                 	 $('.myDialog').modal('hide');
                 }
            
          };
            vm.choiceShenPiUnitSubmit=function(){
            	var str=$('input:radio[name="radio1"]:checked').val();
	           	if (str==""||str==null) {
	                	/*common.alert({
	                    	vm:vm,
	                    	msg:'请选择数据'
	                    	
	                    });*/
	                } else {
	               	 var strs= []; //定义一数组 
	                	 strs=str.split(","); //字符分割 
	                	 vm.model.shenPiUnitDto.id=strs[0];
	                	 vm.model.shenPiUnitDto.shenpiUnitName=strs[1];
	                	 $('.myDialog1').modal('hide');
	                }
            	
            };
            //移除选择项目
            vm.removeProject=function(){
             	  vm.model.projectDto={};            
                  };
            //移除选择单位
            vm.removeShenPiUnit=function(){
             	  vm.model.shenPiUnitDto={};            
                  };
            //提交更新
            vm.updateShenpiItems=function (){
            	projectSupervisedSvc.updateShenpiItems(vm);
            };
        }
        function shenpiItemsList(){
        	projectSupervisedSvc.shenpiItemsGrid(vm);
        	vm.searchShenPiItems=function(){
    			var filters = [];
    			if(vm.search.shenpiName !=null && vm.search.shenpiName !=''){
	     			   filters.push({field:'shenpiName',operator:'contains',value:vm.search.shenpiName});
	     		   }
    			if(vm.search.projectName !=null && vm.search.projectName !=''){
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
    			if(vm.search.shenpiUnitName !=null && vm.search.shenpiUnitName !=''){
	     			   filters.push({field:'shenpiUnitName',operator:'contains',value:vm.search.shenpiUnitName});
	     		   }
    		     vm.gridOptions.dataSource.filter(filters);
        	};
        	vm.delShenPiItem = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	projectSupervisedSvc.delShenPiItem(vm,id);
                         }
                     });
                };
             vm.delShenPiItems = function () {     
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
                        vm.delShenPiItem(idStr);
                    }   
               };
        }
        function shenpiUnitDetail(){
        	vm.title = "审批单位详情";
        	projectSupervisedSvc.getShenPiUnitById(vm);
        }
        function shenpiUnitCreate(){
        	vm.title = "审批单位新增";
        	vm.createMediationUnit=function(){
        		projectSupervisedSvc.createShenpiUnit(vm);
        	};
        }
        function shenpiUnitUpdate(){
        	vm.title = "审批单位编辑";
        	projectSupervisedSvc.getShenPiUnitById(vm);
        	vm.updateShenpiUnit=function(){
        		projectSupervisedSvc.updateShenpiUnit(vm);
        	};
        }
        
    	function shenpiUnitList(){
    		projectSupervisedSvc.shenpiUnitGrid(vm);   
    		vm.searchShenPiUnit=function(){
    			var filters = [];
    			if(vm.search.shenpiUnitName !=null && vm.search.shenpiUnitName !=''){//查询条件--项目名称
	     			   filters.push({field:'shenpiUnitName',operator:'contains',value:vm.search.shenpiUnitName});
	     		   }
    			if(vm.search.contacts !=null && vm.search.contacts !=''){//查询条件--项目名称
	     			   filters.push({field:'contacts',operator:'contains',value:vm.search.contacts});
	     		   }
    		vm.gridOptions.dataSource.filter(filters);
    			
    		};
    		vm.delShenPiUnit = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	projectSupervisedSvc.delShenPiUnit(vm,id);
                         }
                     });
                };
             vm.delShenPiUnits = function () {     
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
                        vm.delShenPiUnit(idStr);
                    }   
               };
    		
    	}
    	function init_list(){
    		if(vm.isZFInvestment){
    			projectSupervisedSvc.grid(vm);
    		}
    		if(vm.isSHInvestment){
    			projectSupervisedSvc.grid_SH(vm);
    		}
    		projectSupervisedSvc.grid(vm);
    		//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				if(vm.isZFInvestment){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--政府投资项目 
					filters.push({field:'isIncludLibrary',operator:'eq',value:true});//默认条件--项目纳入项目库  
				}
				if(vm.isSHInvestment){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_SH});//默认条件--政府投资项目 
				}
				 
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
     			  filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
     		   }
     		   
     		   if(vm.isZFInvestment){
     			  vm.gridOptions.dataSource.filter(filters);
     		   }else if(vm.isSHInvestment){
     			  vm.gridOptions_SH.dataSource.filter(filters);
     		   }

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
    			projectSupervisedSvc.updateIsMonthReport(vm);
    		}; 
    		
    		vm.del = function (id) {
                common.confirm({
               	 vm:vm,
               	 title:"",
               	 msg:"确认删除数据吗？",
               	 fn:function () { 
               		$('.confirmDialog').modal('hide');
                    projectSupervisedSvc.deleteProject(vm,id);
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
    		projectSupervisedSvc.getUserUnits(vm);
    		
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
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.attachmentDtos){
                                 vm.model.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.attachmentDtos){
	           			// 	 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
    		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

    		//展示批复文件选择模态框
    		vm.choseDocument = function(e){
    			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
   	        	   $("#documentRecords").modal({
   				        backdrop: 'static',
   				        keyboard:false  			  
   	        	   });
   	        	   vm.gridOptions_documentRecords.dataSource.read();//批复文件列表数据刷新
   	   		};
   	   		projectSupervisedSvc.documentRecordsGird(vm);//查询批复文件
   	   		
   	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			$(".modal-backdrop").remove();
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	if(fileName){
            		var file = common.stringToArray(fileName,",");
            		var number = file[0];
            		var name = file[1];
            		var url =file[2];
            		vm.model['pifu'+vm.pifuType+'_wenhao'] = number;
            		if(vm.model.attachmentDtos){
         				  vm.model.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
         			 }else{
         				  vm.model.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
         			 }
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
    		
    	   vm.delFile=function(idx){
    		   var file = vm.model.attachmentDtos[idx];
	   			 if(file){//删除上传文件的同时删除批复文号
	   				var pifuType = file.type;
	   				vm.model['pifu'+pifuType+'_wenhao'] = "";
	   				vm.model.attachmentDtos.splice(idx,1);
	   			 }
    	   };
    	 //资金来源计算
 		 vm.capitalTotal=function(){
 			 return common.getSum([
 					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
 					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
 					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
 					 vm.model.capitalOther||0]);
 		 };
	        
    	   vm.create = function () {
    		    projectSupervisedSvc.createProject(vm);    		     
    		};    		     		     			    		 
    	}//init_create
    	
    	function init_update(){
    		vm.title = "编辑项目";
    		//获取项目信息
    		projectSupervisedSvc.getProjectById(vm);
    		//更新项目
    		vm.update = function(){
    			projectSupervisedSvc.updateProject(vm);
    		};  	   		
    	}//init_update
    	
    	function init_details(){
    		projectSupervisedSvc.getProjectById(vm);
    		
    		if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
   			  vm.isZFInvestment = true;
   			  //相关附件文件上传文件种类
   			  vm.relatedType=common.uploadFileTypeConfig().projectEdit; 
   		   	}else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			  
   			  vm.isSHInvestment = true;
   			 //相关附件文件上传文件种类
   			  vm.relatedType=common.uploadFileTypeConfig().projectEdit_SH; 
   		   	}
    		//相关附件文件上传文件种类
    		vm.relatedType=common.uploadFileTypeConfig().projectEdit;   		
    	}
    }
})();
;(function() {
	'use strict';

	angular.module('appSupervision').factory('projectSupervisedSvc', project);

	project.$inject = [ '$http' ];

	function project($http) {
		var url_project = "/management/supervision/project";//获取项目信息数据
		var url_userUnit = "/management/userUnit";//获取单位信息
		var url_back = "#/supervision/tzxm";
		var url_backSH = "#/project_SH";
		var url_document="/management/replyFile";
		var service = {
			grid : grid,
			grid_SH:grid_SH,
			getProjectById:getProjectById,
			getUserUnits:getUserUnits,
			updateProject:updateProject,
			createProject:createProject,
			updateIsMonthReport:updateIsMonthReport,
			documentRecordsGird:documentRecordsGird,
			shenpiUnitGrid:shenpiUnitGrid,
			getShenPiUnitById:getShenPiUnitById,
			updateShenpiUnit:updateShenpiUnit,
			createShenpiUnit:createShenpiUnit,
			delShenPiUnit:delShenPiUnit,
			shenpiItemsGrid:shenpiItemsGrid,
			getShenPiItemsById:getShenPiItemsById,
			projectGrid:projectGrid,
			shenpiUnitGridSelect:shenpiUnitGridSelect,
			updateShenpiItems:updateShenpiItems,
			createShenpiItems:createShenpiItems,
			delShenPiItem:delShenPiItem,
			shenpifankuiItemsGrid:shenpifankuiItemsGrid
			
		};

		return service;
		function delShenPiItem(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url:url_project+"/delShenPiItem",
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
        }// end fun delete
		function delShenPiUnit(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url:url_project+"/delShenPiUnit",
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
        }// end fun delete
		// begin#grid
		function shenpiUnitGridSelect(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiUnit")),
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
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input  type='radio'  relId='{0}' value='{0}' name='radio1' class='radio' />",
											item.id+","+item.shenpiUnitName);
						},
						filterable : false,
						width : 40,
						title : ""

					},
					{
						field : "shenpiUnitName",
						title : "单位名称",
						template:"",
						filterable : true
					},
					{
						field : "contacts",
						title : "单位负责人",
						template:"",
						filterable : true
					},
					{
						field : "contactsTel",
						title : "联系人电话",
						template:"",
						filterable : true
					}
			];
			// End:column

			vm.shenpiUnitGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		// begin#grid
		function projectGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format("/management/project/unitName")),
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
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_ZF
					},
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
											"<input  type='radio'  relId='{0}' value='{0}' name='radio' class='radio' />",
											item.id+","+item.projectName);
						},
						filterable : false,
						width : 40,
						title : ""

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
					}
					
				

			];
			// End:column

			vm.projectGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		function createShenpiUnit(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_project+"/createShenpiUnit",
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
									location.href = "#/supervision/spdw";
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
			}
		}// end func create
		function createShenpiItems(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_project+"/createShenpiItems",
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
									location.href = "#/supervision/spsx";
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
			}
		}// end func create
		/**
		 *获取审批事项信息 
		 */
		function getShenPiItemsById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project+"/shenpiItems" + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		/**
		 *获取审批单位信息 
		 */
		function getShenPiUnitById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project+"/shenpiUnit" + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
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
		/*
		 * 审批事项编辑
		 * 
		 */
		function updateShenpiItems(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_project+"/updateShenpiItems",
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
			}
		}// end fun update
		/*
		 * 审批单位编辑
		 * 
		 */
		function updateShenpiUnit(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_project+"/updateShenpiUnit",
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
			}
		}// end fun update
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
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}									
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
					method : 'post',
					url : url_project+"/isMonthReport",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					//关闭模态框
					$("#myModal_edit").modal('hide');
					//刷新表格数据
					if(vm.isZFInvestment){
						vm.gridOptions.dataSource.read(); 
					}else if(vm.isSHInvestment){
						vm.gridOptions_SH.dataSource.read(); 
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
					method : 'post',
					url : url_project+'/updateProject',
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
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}
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
				vm.model.projectType=common.stringToArray(vm.model.projectType,',');

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
					//资金来源计算
			   		 vm.capitalTotal=function(){
			   			 return common.getSum([
			   					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
			   					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
			   					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
			   					 vm.model.capitalOther||0]);
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
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
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
					field : "name",
					title : "文件名",
					width : 550,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
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
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
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
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_ZF
					},
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
						title : "项目所属单位",
						width : 150,
						filterable:{
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.userUnit,
			                        dataTextField: "unitName",
			                        dataValueField: "id"
			                    });
			                }
						},
						template:function(item){
							return common.getUnitName(item.unitName);
						}
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
		// begin#shenpifankuiItemsGrid
		function shenpifankuiItemsGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiItems")),
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
						field : "shenpiName",
						title : "审批事项",				
						filterable : false
					},
					 {
						field : "projectName",
						title : "审批项目",
						width : '',						
						filterable : false
					},
					 {
						field : "shenpiUnitName",
						title : "审批单位",
						width : "",						
						filterable : false
					},
{
						
						field : "",
						title : "剩余天数",
						width : "",			
						template : function(item) {
							var falg1=new Date(item.shenpiBeginDate).getTime()-new Date(common.formatDate(new Date())).getTime();
							var flag=((new Date(item.shenpiEndDate).getTime())-(new Date(common.formatDate(new Date())).getTime()))/(24 * 60 * 60 * 1000);
							if(falg1>0){
								return"尚未开始";
							}
							else{
							if(flag>0){
								return  flag ;}
							else{
								return  "<span style='color:red'>" +flag+"</span>";}
							}
							}
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id);
						}

					}

			];
			// End:column
			var dataBound= function(e) {
				    console.log(e);
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

		}// end fun shenpifankuiItemsGrid
		// begin#shenpiItemsGrid
		function shenpiItemsGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiItems")),
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
						field : "shenpiName",
						title : "审批事项",				
						filterable : false
					},
					 {
						field : "projectName",
						title : "审批项目",
						width : '',						
						filterable : false
					},
					 {
						field : "shenpiUnitName",
						title : "审批单位",
						width : "",						
						filterable : false
					},
					{
						
						field : "",
						title : "剩余天数",
						width : "",			
						template : function(item) {
							var falg1=new Date(item.shenpiBeginDate).getTime()-new Date(common.formatDate(new Date())).getTime();
							var flag=((new Date(item.shenpiEndDate).getTime())-(new Date(common.formatDate(new Date())).getTime()))/(24 * 60 * 60 * 1000);
							if(falg1>0){
								return"尚未开始";
							}
							else{
							if(flag>0){
								return  flag ;}
							else{
								return  "<span style='color:red'>" +flag+"</span>";}
							}
							}
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id);
						}

					}

			];
			// End:column
			var dataBound= function(e) {
				    console.log(e);
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

		}// end fun shenpiItemsGrid
		// begin#shenpiUnitGrid
		function shenpiUnitGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiUnit")),
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
						field : "shenpiUnitName",
						title : "单位名称",
						width : "",						
						filterable : false
					},
					 {
						field : "contacts",
						title : "单位负责人",
						width : '',						
						filterable : false
					},
					 {
						field : "contactsTel",
						title : "单位负责人电话",
						width : "",						
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id);
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
		
		// begin
		function grid_SH(vm) {
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
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_SH
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

			vm.gridOptions_SH = {
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
    	
    	vm.roles = {};
    	
        function activate() {        	
        	init();
        }
        
		function init(){
			
			//sysConfigSvc.getRoles(vm);
			
			sysConfigSvc.getSysConfigs(vm);	
			
			//修改按钮
			vm.checked = function(index){
				//设置修改按钮隐藏、下拉选显示
	        };
		
			//系统配置：更新
			 vm.create = function(){
				 sysConfigSvc.editSysConfigs(vm);
	        };
	        
	        vm.getConfigName = function(configName){
	        	
		        return $linq(common.getBasicData())
		   			   .where(function(x){return x.identity==common.basicDataConfig().taskType&&x.id==configName;})
		   			   .toArray()[0].description;//获取秘密等级信息	
	        };
	        
	        vm.getConfigValue = function(enable){
	        	if(enable == true){
	        		return "是";
	        	}else{
	        		return "否";
	        	}
	        };
		}
        
        
    }    
})();
;(function() {
	'use strict';

	angular.module('app').factory('sysConfigSvc', sysConfig);

	sysConfig.$inject = [ '$http' ];

	function sysConfig($http) {

		var url_back = "#/sysConfig";//获取所有的user
		var url_taskUser = "/sys/create";//设置task签收人
		var url_getSysConfigs = "/sys/getSysConfigs";
		var url_role="/role";
		
		var service = {
			getSysConfigs : getSysConfigs,
			editSysConfigs:editSysConfigs
		};

		return service;
		
		
		/**
		 * 获取所有需要的系统配置
		 */
		function getSysConfigs(vm){
			var httpOptions = {
					method : 'get',
					url : url_getSysConfigs,
					data : vm.model
				};
			
			var httpSuccess = function success(response) {
				vm.configs = response.data;//所有的配置
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 
		 */
		function editSysConfigs(vm){
			var httpOptions = {
					method : 'post',
					url : url_taskUser,
					data : vm.configs
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
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
		
		
		/**
		 * 系统配置：查询所有task
		 * @return taskList
		 */
		function getAllTask(vm){
			vm.model.taskList = common.getBacicDataByIndectity(common.basicDataConfig().taskType);				
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
        vm.search={};
        vm.basicData={};
        vm.model.taskRecord = {};
    	vm.page="todoList";
	
    	function init(){
    		if($state.current.name=='task_todo'){//待办列表
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){//任务处理
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){//已办列表--下一年度计划
    			vm.page='complete';
    		}
    		if($state.current.name=='task_shenPi'){//已办列表--审批类
    			vm.page='complete_shenPi';
    		}
    		if($state.current.name=='task_shenPiDetails'){//审批类详细信息展示
    			vm.page='task_shenPiDetails';
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
           	
           	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	taskSvc.getDepts(vm);
           	//taskSvc.getShenBaoInfoById(vm);//查询申报信息
           	taskSvc.getTaskById(vm);
           	
        	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			.toArray();//政府投资行业
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   				.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
           	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();

    	}
    	
    	vm.callBack=function(){
       		window.history.back(-1);
       	};
    	   	
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
        	if(vm.page=='complete_shenPi'){
        		init_complete_shenPiList();
        	}
        	if(vm.page=='task_shenPiDetails'){
        		init_task_shenPiDetails();
        	}
        }
        
        function init_task_shenPiDetails(){
        	vm.getUser =function(id){
        		for (var i = 0; i < vm.model.depts.length; i++) {
    				for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
    					if(vm.model.depts[i].userDtos[j].id == id){//获得部门人员
    						return vm.model.depts[i].userDtos[j].displayName;
    					}
    				}
    			}
        	};
        	
        	//相关附件文件上传文件种类
	   		vm.relatedType=common.uploadFileTypeConfig().reviewResult;
        	 
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
      	   
	      	//打开评审结果模态框
	       	vm.showReviewResult=function(){
	       		
	       		taskSvc.getComission(vm);
	       		
	       		taskSvc.getReviewResult(vm);
	       		
	       		$('.reviewResult').modal({
	                   backdrop: 'static',
	                   keyboard:false
	               });
	       	};
      	   
	      	//查询委托书
	       	vm.proxyOpen=function(){
	       		
	       		taskSvc.getApproval(vm);
	       		
	       		taskSvc.getComission(vm);
	       		
	       		$('.proxy').modal({
	                   backdrop: 'static',
	                   keyboard:false
	            });
	       	};
      	   
	      	//拟稿纸模态框
	       	vm.draftOpen=function(){
	       		//查询发文拟稿
	       		taskSvc.getDraftIssued(vm);
	       		
	       		$('.draft_issued').modal({
	                   backdrop: 'static',
	                   keyboard:false
	               });
	       		
	       		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
		   			.toArray();//获取秘密等级信息
	       		vm.basicData.fileSet=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
		   			.toArray();//获取文件缓急信息
	       		vm.basicData.documentType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
		   			.toArray();//获取文件种类信息
	       		vm.basicData.openType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
		   			.toArray();//获取公开种类信息
	       		vm.basicData.postingCategory=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
		   			.toArray();//获取发文种类信息
	       		
	       	};
      	   
      	   //评审报批模态框
      	  vm.editApproval=function(){
	    	   taskSvc.getApproval(vm);
	    	   
	    	   $('.approval').modal({
                 backdrop: 'static',
                 keyboard:false
             });
	       };
        }
        
        function init_todoList(){
        	taskSvc.gridForPlan(vm);
        	taskSvc.gridForShenpi(vm);
        	taskSvc.grid(vm);
        	
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions.dataSource.filter(filters);
        	};
        	
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_completeList(){
        	taskSvc.completeGird(vm);
        }//end init_completeList
        
        function init_complete_shenPiList(){
        	
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions_complete_shenPi.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        	
        	
        	taskSvc.complete_shenPiGird(vm);
        }
    	function init_handle(){
    	   vm.processState_qianShou=common.basicDataConfig().processState_qianShou;
    	   vm.processState_tuiWen=common.basicDataConfig().processState_tuiWen;

    	   taskSvc.getTaskById(vm);//查询任务信息
    	   //taskSvc.getDept(vm);
    	  
    	   if(vm.taskType == common.basicDataConfig().taskType_monthReport){//如果为月报
    		   vm.isMonthReport = true;
    		   taskSvc.getMonthReportById(vm);//查询月报信息
    	   }else{
    		   if(vm.taskType == common.basicDataConfig().taskType_yearPlan){//如果为下一年度计划申报
    			   vm.isYearPlan = true;
    			   vm.model.taskRecord.processSuggestion = "符合申报";//设置默认为符合申报
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
		var url_taskRecord_shenPi = "/management/taskRecord/shenPi";
		var url_shenbao = "/management/shenbao";
		var url_monthReport = "/management/monthReport";
		var url_project = "/management/project";
		var url_back = "#/task/todo";
		var url_dept = "/org";
		var url_taskAudit = "/management/task/audit";
		var url_taskPlan = "/management/task/plan";
		var url_users="/org/{0}/users";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		var url_draft ="/management/draft";
		
		var service = {
			grid : grid,//待办任务列表
			completeGird:completeGird,//已办任务列表
			getTaskById:getTaskById,//根据任务id获取任务信息
			getShenBaoInfoById:getShenBaoInfoById,//根据id获取申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			handle:handle,
			gridForShenpi:gridForShenpi,
			complete_shenPiGird:complete_shenPiGird,
			getApproval:getApproval,
			getDraftIssued:getDraftIssued,
			getComission:getComission,
			getReviewResult:getReviewResult,
			getDepts:getDepts,
			gridForPlan:gridForPlan
		};
		
		return service;
		
		//查询评审结果
		function getReviewResult(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_review + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.review = response.data || {};
						if(vm.review == ""){
							vm.projectInvestSum = vm.model.shenBaoInfo.projectInvestSum;
						}else{
							vm.nuclear = vm.review.nuclear;
							vm.cut = vm.review.cut;
							vm.projectInvestSum = vm.review.projectInvestSum;
						}
						vm.review.approvalDate = common.formatDate(vm.review.approvalDate);
						vm.review.receiptDate = common.formatDate(vm.review.receiptDate);
						vm.review.approvalEndDate= common.formatDate(vm.review.approvalEndDate);
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
		
		//查询审批委托书
		function getComission(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_proxy + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.proxy = response.data || {};
						vm.proxy.beginDate = common.formatDate(vm.proxy.beginDate);
						vm.proxy.approvalType=$linq(common.getBasicData())
	   	   				.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.id==vm.proxy.approvalType;}).toArray()[0].description;
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
		
		//发文拟稿
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data || {};
						vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
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
		
		//查询审批单
		function getApproval(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_approval + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.approval = response.data || {};
						vm.approval.beginDate = common.formatDate(vm.approval.beginDate);
						vm.approval.approvalType=$linq(common.getBasicData())
	   	   				.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.id==vm.approval.approvalType;}).toArray()[0].description;
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
		 * 查询部门
		 */
		function getDepts(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.depts = response.data.value||{};
					}
				});
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
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.shenBaoInfo= response.data.value[0]||{};
						//项目类型的显示
						vm.model.shenBaoInfo.projectType=common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
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
				  		 
				  		if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){
							vm.isZFInvestment = true; 
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){
							vm.isSHInvestment = true; 
						}
						if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
							vm.isProjectProposal=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
							vm.isKXXYJBG=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
							vm.isCBSJYGS=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_prePlanFee){//申报阶段为:规划设计前期费
							vm.isPrePlanFee=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_prePlanFee;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_newStratPlan){//申报阶段为:新开工计划
							vm.isNewStart=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_xuJianPlan){//申报阶段为:续建计划
							vm.isXuJian=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
							vm.isYearPlan = true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_junGong){//申报阶段为:竣工决算
							vm.isJunGong=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_junGong;
						}
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
					}
				});
				
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end getShenBaoInfoById
		
		function handle(vm){
			var httpOptions = {
				method : 'post',
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
		
		/**
		 * 个人待办列表(计划)
		 */
		function gridForPlan(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskPlan
				};
			
			var httpSuccess = function success(response) {				
				$('#todoNumber_plan').html(response.data.value.length);
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//getTaskById
		
		/**
		 * 个人待办列表(审批)
		 */
		function gridForShenpi(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskAudit
				};
			
			var httpSuccess = function success(response) {				
				$('#todoNumber_audit').html(response.data.value.length);
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
				filter:[{
					field:'isComplete',
					operator:'eq',
					value:false
				},{
					field:'taskType',
					operator:'eq',
					value:"taskType_2"
				}],
				requestEnd:function(e){						
					$('#todoNumber').html(e.response.value.length);					

				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.userOptions = grid.getOptions();
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
						width:500,
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
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
						width : 120,						
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
			if(window.userOptions && window.userOptions !=''){
				vm.gridOptions = window.userOptions;
        	}else{
        		vm.gridOptions = {
        				dataSource : common.gridDataSource(dataSource),
        				filterable : common.kendoGridConfig().filterable,
        				pageable : common.kendoGridConfig().pageable,
        				noRecords : common.kendoGridConfig().noRecordMessage,
        				columns : columns,
        				resizable : true,
        				sortable:true,
        				scrollable:true
        			};
        	}

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
				},
				filter:{
					field:'taskType',
					operator:'eq',
					value:"taskType_2"
				},
				change: function(e) {//当数据发生变化时
				    var filters = dataSource.filter();//获取所有的过滤条件
				    vm.filters = filters;
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
						width:350,
						template:function(item){
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 200,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
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
						width : 120,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 150,
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
				resizable : true,
				sortable:true,
				scrollable:true
			};

		}// end fun grid
		
		function complete_shenPiGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord_shenPi),
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
				change: function(e) {//当数据发生变化时
				    var filters = dataSource.filter();//获取所有的过滤条件
				    vm.filters = filters;
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
							return common.format("<a href='#/task/shenPi_details/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
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

			vm.gridOptions_complete_shenPi = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};

		}// end fun grid
	}	
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskAuditCtrl', taskAudit);

    taskAudit.$inject = ['$location','taskAuditSvc','$state','$scope','$sce','$rootScope']; 

    function taskAudit($location, taskAuditSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.search={};
    	vm.basicData={};
    	vm.page="todoAuditList";
    	
    	//任务处理--请求参数
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;
        
        //初始化参数
       vm.nextProcessRadio = "";

    	function init(){
    		
    		if($state.current.name=='task_handle_audit'){//处理页面
    			vm.page="handleAudit";
    		}
    		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		}; 		
    		vm.getProcessUser = function(id){
    			return common.getUserById(id);
    		};
    		vm.getBasicDataDesc=function(str){//流转信息显示
    			return common.getBasicDataDesc(str);
    		};
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};

           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
           	
           	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	
           	//初始化审批流程
           	vm.processState_msFenBan=common.basicDataConfig().processState_msFenBan;
           	
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   				.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
   	   		vm.basicData.taskType=common.getBacicDataByIndectity(common.basicDataConfig().taskType);//任务类型
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoAuditList'){
        		init_todoAuditList();
        	}
        	if(vm.page=='handleAudit'){
        		init_handleAudit();
        	}
        }
        
        function init_todoAuditList(){
        	taskAuditSvc.grid(vm);
        	
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_handleAudit(){
        	//查询任务信息
        	taskAuditSvc.getTaskInfoById(vm);
        	//查询申报信息
        	taskAuditSvc.getShenBaoInfoById(vm);
        	//查询部门信息
        	taskAuditSvc.getDepts(vm);
        	//查询批复文件
        	taskAuditSvc.replyFileGird(vm);
        	//查询角色信息
        	taskAuditSvc.getRoles(vm);
        	//常用意见列表
        	taskAuditSvc.opinionGird(vm);
        	
        	taskAuditSvc.getOpinion(vm);
        	
        	vm.cal=function(){
        		if(vm.review.projectInvestSum != 0 && vm.review.authorize != 0 && vm.review.projectInvestSum != undefined && vm.review.authorize != undefined){
        			vm.cut = vm.review.projectInvestSum - vm.review.authorize;
            		vm.nuclear = Number((vm.cut/vm.review.projectInvestSum)*100).toFixed(2);
        		}else{
        			vm.cut = "";
            		vm.nuclear = "";
        		}
        		
        	};
        	
        	vm.saveReview=function(){
        		vm.taskAudit.reviewResult = true;
        		taskAuditSvc.saveReview(vm);
        	};
        	
        	vm.getBasicDataJD=function(approvalType){
        		if(approvalType != undefined){
        			vm.basicData.projectShenBaoStage=$linq(common.getBasicData())
    	   			.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.id==approvalType;}).toArray();
    	   			//获取项目阶段
            		return vm.basicData.projectShenBaoStage[0].description;
        		}else{
        			return "";
        		}
        		
        	};
        	
        
        	
        	//相关附件文件上传文件种类
	   		vm.relatedType=common.uploadFileTypeConfig().reviewResult;
        	
	   		vm.uploadSuccess_review=function(e){
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.review.attachmentDtos){
                                 vm.review.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.review.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.review.attachmentDtos){
	           			// 	 vm.review.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.review.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
	   		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

	   		//相关附件上传配置
	   		vm.uploadOptions_review={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
                    error:vm.uploadError,
                    success:vm.uploadSuccess_review,
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		//删除上传文件
	   		 vm.delFile_review=function(idx){
	   			 var file = vm.review.attachmentDtos[idx];
	   			 if(file){//删除上传文件的同时删除批复文号
	   				vm.review.attachmentDtos.splice(idx,1);
	   			 }
	         };
	   		
        	//打开评审结果模态框
        	vm.showReviewResult=function(){
        		
        		taskAuditSvc.getComission(vm);
        		
        		taskAuditSvc.getReviewResult(vm);
        		
        		vm.approvalEndDate = common.formatDate(new Date());
        		
        		vm.projectInvestSum = vm.model.shenBaoInfo.projectInvestSum;
        		
        		$('.reviewResult').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        	};
        	
        	//关闭评审资料模态框
        	vm.closeDatum=function(){
        		$('#datum').modal('hide');
        	};
        	//删除评审资料
        	vm.removeDatum=function(id){
        		 for (var i = 0; i < vm.proxy.datumDtos.length; i++) {
						if(vm.proxy.datumDtos[i].id == id){
							vm.proxy.datumDtos.splice(i,1);
						}
					}
        	};
        	
        	//增加评审资料
        	vm.saveDatum=function(id){
        		vm.proxy.datumDtos.push({dataName:vm.dataName,dataNumber:vm.dataNumber});
        		$('#datum').modal('hide');
        	};
        	
        	vm.openDatum=function(){
        		$('.datum').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        	};
        	
        	//保存委托书
        	vm.saveProxy=function(){
    			vm.taskAudit.proxy = true;

        		taskAuditSvc.saveProxy(vm);
        	};
        	
        	//查询委托书
        	vm.proxyOpen=function(){
        		
        		taskAuditSvc.getApproval(vm);
        		
        		taskAuditSvc.getComission(vm);
        		
        		$('.proxy').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        		
        		vm.nameAndTel = vm.model.shenBaoInfo.projectRepName+":"+vm.model.shenBaoInfo.projectRepMobile;
        		
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskAudit.operator){//获得部门人员
							vm.processRole =  vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		
        		vm.beginDate = common.formatDate(new Date());
        		
        		vm.approvalType = vm.model.shenBaoInfo.projectShenBaoStage;
        	};
        	
        	//打开评审报批模态框
        	vm.editApproval=function(){
        		
        		//查询审批单信息
        		taskAuditSvc.getApproval(vm);
        		
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskAudit.operator){//获得部门人员
							vm.processRole =  vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		
        		vm.approvalType = vm.model.shenBaoInfo.projectShenBaoStage;
        		vm.beginDate = common.formatDate(new Date());
        		
        		$('.approval').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        	};
        	
        	//保存审批单
        	vm.saveApproval=function(){
        		vm.taskAudit.approval = true;
        		taskAuditSvc.saveApproval(vm);
        	};
        	
        	//发文单选框
    		vm.Selection=function(id){
    			vm.draft.openType = id;
    		};
        	
        	//保存草稿纸
        	vm.saveDraft=function(){
        		taskAuditSvc.saveDraft(vm);
        	};
        
        	//拟稿纸模态框
        	vm.draftOpen=function(){
        		//查询发文拟稿
        		taskAuditSvc.getDraftIssued(vm);
        		//拟稿单位拟稿人
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskAudit.operator){//获得部门人员
						vm.userNameAndUnit =  vm.model.depts[i].name +'、'+ vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		$('.draft_issued').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        		
        		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
	   			.toArray();//获取秘密等级信息
        		vm.basicData.fileSet=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
	   			.toArray();//获取文件缓急信息
        		vm.basicData.documentType=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
	   			.toArray();//获取文件种类信息
        		vm.basicData.openType=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
	   			.toArray();//获取公开种类信息
        		vm.basicData.postingCategory=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
	   			.toArray();//获取发文种类信息
        		
        	};
        	
        	//意见下拉框
        	vm.opinion=function(){
        		taskAuditSvc.getOpinion(vm);
        	};
        	
        	//保存常用意见
        	vm.saveOpinion=function(){
        		//vm.model.opinion="";// 清空model重新查询
        		if(vm.processSuggestion != "" && vm.processSuggestion != undefined){
        			taskAuditSvc.saveOpinion(vm);
        		}
        	};
        	
        	vm.closeOpin=function(){
        		$('#opinionEdit').model('hide');
        	};
        	
        	//常用意见管理模态框
        	vm.showOpinion = function(){
        		$('.opinion').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        		 vm.opinionGrid.dataSource.read();
        	};
        	
        	//编辑意见
        	vm.editOpin=function(){
        		taskAuditSvc.editOpin(vm);
        	};
        	
        	//编辑模态框
        	vm.edit=function(id,opin){
        		$('.opinionEdit').modal({
                    backdrop: 'static',
                    keyboard:true
                });
        		vm.model.opinion = {"opinion":opin,"id":id};
        		
        	};
        	//删除意见
        	vm.remove=function(id){
        		taskAuditSvc.deleteOpin(vm,id);
        	};
        	
        	//切换常用意见
        	vm.changeOpin=function(){
        		vm.processSuggestion = vm.model.opinion;
        	};
        	
        	
        	 vm.del = function (id) {       	 
              	$('.confirmDialog').modal('hide');             	
              	taskAuditSvc.deleteOpin(vm,id);
            };
        	//批量删除意见
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
        	
        	//部门切换触发
        	vm.changeDept = function(){
        		for (var i = 0; i < vm.model.depts.length; i++) {
					if(vm.model.depts[i].id == vm.model.deptId){//获得部门人员
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长"){//默认选中科长为下一流程处理人
									vm.taskAudit.nextUser = vm.model.depts[i].userDtos[j].id;//下一处理人为当前部门角色是科长的人
								}
							}
						}
					}
				}
        	};
        	
        	//经办人员业务选择
        	
        	vm.clickedYW = function(str){
        		if(str == "yewu"){
        			vm.nextProcessRadioOfYW = "yewu";
        		}
        		
        		if(str == "pingshenbaopi"){
        			vm.nextProcessRadioOfYW = "pingshenbaopi";
        		}
        		if(str == "fawen"){
        			vm.nextProcessRadioOfYW = "fawen";
        		}
        		if(str == "keyuantuiwen"){
        			vm.nextProcessRadioOfYW = "keyuantuiwen";
        		}
        		if(str == "pingshenweituo"){
        			vm.nextProcessRadioOfYW = "pingshenweituo";
        		}
        		if(str == "fawennigao"){
        			vm.nextProcessRadioOfYW = "fawennigao";
        		}
        	};
        	
        	//下一处理环节
        	vm.clicked =function(str){
        		//部门承办
        		if(str == "bumen"){
        			vm.showDept = true;
        			vm.nextProcessRadio = "bumen";
        		}else {
        			vm.showDept = false;
        		}
        		
        		//退文办结
        		if(str == "tuiwenbanjie"){
        			vm.nextProcessRadio = "tuiwenbanjie";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		//退文
        		if(str == "tuiwen"){
        			vm.nextProcessRadio = "tuiwen";
        		}
        		
        		//办结
        		if(str == "banjie"){
        			vm.nextProcessRadio = "banjie";
        		}
        		
        		//退回重办
        		if(str == "tuihuiChongban"){
        			vm.nextProcessRadio = "tuihuiChongban";
        		}
        		
        		//经办人办理
        		if(str == "jingBanRenBanli"){
        			vm.nextProcessRadio = "jingBanRenBanli";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长" &&vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//科长选择当前科室的科员为下一流程处理人
									vm.model.depts[i].userDtos.splice(j,1);
									vm.users = vm.model.depts[i].userDtos;
								}
							}
						}
    				}
        			
        		}
        		
        		//科室办理--显示部门下拉选
        		if(str == "keshibanli"){
        			vm.nextProcessRadio = "keshibanli";
        		}
        		
        		//科员办理--显示当前部门的科员
        		if(str == "keyuanbanli"){
        			vm.nextProcessRadio = "keyuanbanli";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//科长选择当前科室的科员为下一流程处理人
									vm.users = vm.model.depts[i].userDtos;
								}
							}
						}
        			}
        		}
        		
        		//科长审核
        		if(str == "kezhangshenhe"){
        			vm.nextProcessRadio = "kezhangshenhe";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科员" &&vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//默认选择当前人员的科长
									for (var m = 0; m < vm.model.depts[i].userDtos.length; m++) {
										for (var n = 0; n < vm.model.depts[i].userDtos[m].roles.length; n++) {
											if(vm.model.depts[i].userDtos[m].roles[n].roleName == "科长"){
												vm.taskAudit.nextUser = vm.model.depts[i].userDtos[m].id;
											}
										}
									}
								}
							}
						}
        			}
        		}
        		
        		//退回经办人
        		if(str == "tuihuijingbanren" || str == "jingbanrensongshen" || str == "pingswancheng" || str == "jingBanRenBanli_juzhang"){
        			if(str == "tuihuijingbanren"){
        				vm.nextProcessRadio = "tuihuijingbanren";
        			}else if(str == "jingbanrensongshen"){
        				vm.nextProcessRadio = "jingbanrensongshen";
        			}else if(str == "pingswancheng"){
        				vm.nextProcessRadio = "pingswancheng";
        			}else if(str == "jingBanRenBanli_juzhang"){
        				vm.nextProcessRadio = "jingBanRenBanli_juzhang";
        			}
					vm.taskAudit.nextUser = vm.taskAudit.operator;
        		}
        		
        		//局领导审批
        		if(str == "julingdaoshenpi"){
        			vm.nextProcessRadio = "julingdaoshenpi";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "局领导"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//送审
        		if(str == "songshen"){
        			vm.nextProcessRadio = "songshen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "评审中心"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//人秘科核稿
        		if(str == "renmikehegao"){
        			vm.nextProcessRadio = "renmikehegao";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		//局领导复批
        		if(str == "julingdaofushen"){
        			vm.nextProcessRadio = "julingdaofushen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "局领导"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//办公室发文
        		if(str == "bangongshifawen"){
        			vm.nextProcessRadio = "bangongshifawen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		if(str == "fawendengji"){
        			vm.nextProcessRadio = "fawendengji";
        		}
        	};
        	
        	//选择人员为下一处理人
        	vm.selectUser = function(id){
        		vm.taskAudit.nextUser = id;
        		if(vm.nextProcessRadio == "tuihuijingbanren" ||vm.nextProcessRadio == "jingBanRenBanli" || vm.nextProcessRadio == "pingswancheng"){
            		vm.taskAudit.operator = id;
    			}
        	};
        	
        	function setNextProcess(vm){
    			var processState = vm.taskAudit.processState;//下一流程展示
    			if(processState ==  "processState_1"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_3"){
    				vm.taskAudit.processState = "processState_4";
    				vm.taskAudit.nextProcess = "processState_5";
    			}else if(processState == "processState_4"){
    				vm.taskAudit.processState = "processState_5";
    				vm.taskAudit.nextProcess = "processState_6";
    			}else if(processState == "processState_5"){
    				vm.taskAudit.processState = "processState_6";
    				vm.taskAudit.nextProcess = "processState_8";
    			}else if(processState == "processState_6"){
    				vm.taskAudit.processState = "processState_8";
    				vm.taskAudit.nextProcess = "processState_9";
    			}else if(processState == "processState_8"){
    				vm.taskAudit.processState = "processState_9";
    				vm.taskAudit.nextProcess = "processState_10";
    			}else if(processState == "processState_9"){
    				vm.taskAudit.processState = "processState_10";
    				vm.taskAudit.nextProcess = "processState_17";
    			}else if(processState == "processState_10"){
    				vm.taskAudit.processState = "processState_17";
    				vm.taskAudit.nextProcess = "processState_18";
    			}else if(processState == "processState_17"){
    				vm.taskAudit.processState = "processState_18";
    				vm.taskAudit.nextProcess = "processState_19";
    			}else if(processState == "processState_18"){
    				vm.taskAudit.processState = "processState_19";
    				vm.taskAudit.nextProcess = "processState_21";
    			}else if(processState == "processState_19"){
    				vm.taskAudit.processState = "processState_21";
    				vm.taskAudit.nextProcess = "processState_22";
    			}else if(processState == "processState_21"){
    				vm.taskAudit.processState = "processState_23";
    				vm.taskAudit.nextProcess = "";
    			}
    		}
        	
        	//送出
        	vm.handle = function(){
        		
        		vm.taskAudit.tuiwen = false;
        		common.initJqValidation();
        		var isValid = $('form').valid();
    	   		if (isValid) {
	        		if(vm.nextProcessRadio =="bumen"){//正常流程--部门审批
	        			if(vm.taskAudit.processState == "processState_4"){
	        				vm.taskAudit.processState = "processState_3";
	        				vm.taskAudit.nextProcess = "processState_4";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	    				
	    				vm.taskAudit.processRole ="";
	    			}else if(vm.nextProcessRadio =="tuiwen"){//退文
	    				vm.taskAudit.processState = "processState_15";
	    				vm.taskAudit.nextProcess = "processState_3";
	    				vm.taskAudit.processRole ="";
	    			}else if(vm.nextProcessRadio =="tuiwenbanjie"){//退文办结
	    				vm.taskAudit.processState = "processState_3";
	    				vm.taskAudit.nextUser = "";
	    				vm.taskAudit.nextProcess = "processState_22";
	    			}else if(vm.nextProcessRadio =="banjie"){//办结
	    				vm.taskAudit.processState = "processState_11";
	    				vm.taskAudit.nextProcess = "";
	    				vm.taskAudit.processRole ="";
	    			}else if(vm.nextProcessRadio == "tuihuiChongban"){//退回给秘书科
	    				vm.taskAudit.processState = "processState_4";
	    				vm.taskAudit.nextProcess = "processState_3";
	    				vm.taskAudit.processRole =getMiShuKRole("秘书科分办人员");
	    				vm.taskAudit.nextUser = "";
	        		}else if(vm.nextProcessRadio == "jingBanRenBanli"){//经办人办理--正常流程
	        			if(vm.taskAudit.processState != "processState_3"){
	        				vm.taskAudit.processState = "processState_3";
	        			}
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "keshibanli"){//科室办理--退回给所选科室的科长
	        			vm.taskAudit.processState = "processState_5";
	    				vm.taskAudit.nextProcess = "processState_4";
	    				
	        		}else if(vm.nextProcessRadio == "keyuanbanli"){//科员办理--退回给经办人所在科室的科员
	        			vm.taskAudit.processState = "processState_4";
	    				vm.taskAudit.nextProcess = "processState_5";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "kezhangshenhe"&&vm.nextProcessRadioOfYW == "pingshenbaopi"){//科长审核--正常流程
	        			if(vm.taskAudit.processState == "processState_6"){//退回经办人后重新送科长
	        				vm.taskAudit.processState = "processState_5";
		    				vm.taskAudit.nextProcess = "processState_6";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "julingdaoshenpi"){//局领导审批--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "jingBanRenBanli_juzhang"){//局领导审批--经办人办理
	        			vm.taskAudit.processState = "processState_4";
	    				vm.taskAudit.nextProcess = "processState_5";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "pingshentuihui"){//评审中心退回经办人
	        			vm.taskAudit.processState = "processState_8";
	    				vm.taskAudit.nextProcess = "processState_9";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "tuihuijingbanren"){//退回经办人
	        			vm.taskAudit.processState = vm.taskAudit.nextProcess;
	    				vm.taskAudit.nextProcess = "processState_5";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "jingbanrensongshen"){//经办人送审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "songshen"){//送审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "pingswancheng"){//评审完成--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "pingshenbaopi" && vm.nextProcessRadio == "kezhangshenhe"){//评审完成--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "fawen" && vm.nextProcessRadio == "kezhangshenhe"){//经办人发文拟稿
	        			if(vm.taskAudit.processState == "processState_4"){//第三步发文
	        				vm.taskAudit.processState = "processState_5";
	        			}
	        			if(vm.taskAudit.processState == "processState_10"){//第三步发文
	        				vm.taskAudit.processState = "processState_17";
	        			}
	    				vm.taskAudit.nextProcess = "processState_18";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "keyuantuiwen" && vm.nextProcessRadio == "kezhangshenhe"){//经办人退文
	        			vm.taskAudit.processState = "processState_5";
	    				vm.taskAudit.nextProcess = "processState_4";
	    				vm.taskAudit.processRole ="";
	    				vm.taskAudit.tuiwen = true;
	        		}else if(vm.nextProcessRadioOfYW == "pingshenweituo" && vm.nextProcessRadio == "kezhangshenhe"){//评审委托--科长审核
	        			vm.taskAudit.processState = "processState_9";
	    				vm.taskAudit.nextProcess = "processState_18";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "renmikehegao"){//评审完成--正常流程
	        			if(vm.taskAudit.processState != "processState_17"){
	        				vm.taskAudit.processState = "processState_18";
	        				vm.taskAudit.nextProcess = "processState_19";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	        			
	        			vm.taskAudit.nextUser ="";
	        		}else if(vm.nextProcessRadio == "julingdaofushen"){//局领导复审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "bangongshifawen"){//办公室发文--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.nextUser ="";
	        		}else if(vm.nextProcessRadio == "bangongshifawen"){//办公室发文--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.nextUser ="";
	        		}else if(vm.nextProcessRadio == "fawendengji"){//秘书科发文登记--正常流程
	        			vm.taskAudit.processState = "processState_21";
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.nextUser ="";
	    				vm.taskAudit.processRole ="";
	        		}
	        		
	        
	        		taskAuditSvc.handle(vm);
    	   		}
        	};
        	
        	//得到秘书科角色
        	function getMiShuKRole(role){
        		for (var i = 0; i < vm.model.roles.length; i++) {
        			if(vm.model.roles[i].roleName == role){
        				return vm.model.roles[i].id;
        			}
				}
        	}

        	//弹出申报详情模态框
        	vm.dialog_shenbaoInfo=function(){
        		$("#shenbaoInfo").modal({
                    backdrop: 'static',
                    keyboard:true
                });
        	};
        	//弹出申报信息复核模态款
        	vm.dialog_shenbaoInfoEdit=function(){
        		$("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard:true
                });
        	};
        	//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.projectTypes.indexOf(id);
	        	if(index == -1){
	        		vm.projectTypes.push(id);
		       	}else{
		       		vm.projectTypes.splice(index,1);
		       	}	        	
	        };
	      //文件上传成功
    	   vm.uploadSuccess=function(e){
   			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.shenBaoInfo.attachmentDtos){
                                 vm.model.shenBaoInfo.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.shenBaoInfo.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.shenBaoInfo.attachmentDtos){
	           			// 	 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
    	   };

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

	  		//选择上传文件验证文件大小
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
				var file = vm.model.shenBaoInfo.attachmentDtos[idx];
				if(file){//删除上传文件的同时删除批复文号
					var pifuType = file.type;
					vm.model.shenBaoInfo['pifu'+pifuType+'_wenhao'] = "";
					vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
				 }
			 };
			//展示批复文件选择模态框
	   		vm.choseDocument = function(e){
	   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
        	   $("#documentRecords").modal({
			        backdrop: 'static',
			        keyboard:true  			  
        	   });
        	   vm.replyFileGridOptions.dataSource.read();//批复文件列表数据刷新
	   		};
		   		
	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	if(fileName){
            		var file = common.stringToArray(fileName,",");
            		var number = file[0];
            		var name = file[1];
            		var url =file[2];
            		vm.model.shenBaoInfo['pifu'+vm.pifuType+'_wenhao'] = number;
            		if(vm.model.shenBaoInfo.attachmentDtos){
         				  vm.model.shenBaoInfo.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
         			 }else{
         				  vm.model.shenBaoInfo.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
         			 }
            	}
	        };
	       //批复文件列表模态框关闭
	        vm.dismissReplyFile=function(){
	        	$("#documentRecords").modal('hide');
	        };
	      //复核申报信息保存
	        vm.saveShenBaoInfo=function(){
	        	taskAuditSvc.saveShenBaoInfo(vm);
	        };

        }//end init_handleAudit
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('taskAuditSvc', taskAudit);

	taskAudit.$inject = [ '$http' ,'$location'];

	function taskAudit($http,$location) {
		var url_task = "/management/task";
		var url_taskAudit = "/management/task/audit";
		var url_shenbao = "/management/shenbao";
		var url_dept="/org";
		var url_back = "#/task/todo";
		var url_replyFile = "/management/replyFile";
		var url_role="/role";
		var url_opin="/opin";
		var url_users = "/user";
		var url_draft ="/management/draft";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		
		var service = {
			grid : grid,//待办任务列表
			getTaskInfoById:getTaskInfoById,//查询任务信息
			getShenBaoInfoById:getShenBaoInfoById,//查询申报信息
			getDepts:getDepts,//查询部门
			handle:handle,//送出
			replyFileGird:replyFileGird,//批复文件库列表
			saveShenBaoInfo:saveShenBaoInfo,//保存申报信息
			getRoles:getRoles,//查询角色信息
			saveOpinion:saveOpinion,//保存意见
			getOpinion:getOpinion,//获取意见
			opinionGird:opinionGird,//意见列表
			deleteOpin:deleteOpin,//删除意见
			editOpin:editOpin,//编辑意见
			getDraftIssued:getDraftIssued,//查询发文拟稿
			saveDraft:saveDraft,//保存发文信息
			saveApproval:saveApproval,//评审报批
			getApproval:getApproval,//查询评审报批
			getComission:getComission,//查询评审委托
			saveProxy:saveProxy,//保存委托书
			getReviewResult:getReviewResult,//查询评审结果
			saveReview:saveReview//保存评审结果
		};
		
		return service;
		
		//保存评审结果
		function saveReview(vm){
		
			vm.review.projectName = vm.model.shenBaoInfo.projectName;
			vm.review.constructionUnit = vm.model.shenBaoInfo.constructionUnit;
			vm.review.approvalEndDate = new Date();
			vm.review.receiptDate = new Date(vm.model.shenBaoInfo.createdDate);
			vm.review.unitName = vm.proxy.unitName;
			vm.review.approvalDate = vm.proxy.beginDate;
			//vm.review.projectInvestSum = vm.projectInvestSum;
			vm.review.nuclear = vm.nuclear;
			vm.review.cut = vm.cut;
			
			common.initJqValidation();
 			var isValid = $('#formResult').valid();
	   		if (isValid) {
			
				var httpOptions = {
						method : 'post',
						url : common.format(url_review + "/" +vm.taskAudit.id),
						data : vm.review
					};
				
				var httpSuccess = function success(response) {
					$('#reviewResult').modal('hide');
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
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
		}
		
		//查询评审结果
		function getReviewResult(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_review + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.review = response.data || {};
						if(vm.review == ""){
							vm.projectInvestSum = vm.model.shenBaoInfo.projectInvestSum;
						}else{
							vm.nuclear = vm.review.nuclear;
							vm.cut = vm.review.cut;
							vm.projectInvestSum = vm.review.projectInvestSum;
						}
						vm.review.beginDate = common.formatDate(vm.review.beginDate);
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
		
		function saveProxy(vm){
			vm.proxy.approvalType = vm.approvalType;
			vm.proxy.projectName = vm.model.shenBaoInfo.projectName;
			vm.proxy.unitName = vm.approval.unitName;
			vm.proxy.constructionUnit = vm.model.shenBaoInfo.constructionUnit;
			vm.proxy.processRole = vm.taskAudit.operator;
			vm.proxy.beginDate = new Date();
			vm.proxy.contacts = vm.nameAndTel;
			vm.proxy.capitalBaoSong = vm.approval.capitalBaoSong;
			vm.proxy.processSuggestion_JBR = vm.processSuggestion_JBR_WTS;
			common.initJqValidation();
 			var isValid = $('#formproxy').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_proxy + "/" +vm.taskAudit.id),
						data : vm.proxy
					};
				
				var httpSuccess = function success(response) {
					$('#proxy').modal('hide');
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
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
		}
		
		//查询审批委托书
		function getComission(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_proxy + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.proxy = response.data || {};
						vm.proxy.beginDate = common.formatDate(vm.proxy.beginDate);
						if(vm.approval.processSuggestion_JBR != vm.proxy.processSuggestion_JBR){
							vm.processSuggestion_JBR_WTS = vm.proxy.processSuggestion_JBR;
						}else{
							vm.processSuggestion_JBR_WTS = vm.approval.processSuggestion_JBR;
						}
						for (var i = 0; i < vm.model.depts.length; i++) {
							for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
								if(vm.model.depts[i].userDtos[j].id == vm.proxy.processRole){//获得部门人员
									vm.proxy.processRole =  vm.model.depts[i].userDtos[j].displayName;
								}
							}
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
		}
		
		
		//查询审批单
		function getApproval(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_approval + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.approval = response.data || {};
						vm.approval.beginDate = common.formatDate(vm.approval.beginDate);
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
		
		//保存审批单
		function saveApproval(vm){
			vm.approval.approvalType = vm.approvalType;
			vm.approval.projectName = vm.model.shenBaoInfo.projectName;
			vm.approval.constructionUnit = vm.model.shenBaoInfo.constructionUnit;
			vm.approval.processRole = vm.taskAudit.operator;
			vm.approval.beginDate = new Date();
			common.initJqValidation();
 			var isValid = $('#formApproval').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_approval + "/" +vm.taskAudit.id),
						data : vm.approval
					};
				
				var httpSuccess = function success(response) {
					$('#approval').modal('hide');
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
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
		}
		
		//拟稿意见
		function saveDraft(vm){
			vm.draft.projectName = vm.model.shenBaoInfo.projectName;
			vm.draft.unitName = vm.model.shenBaoInfo.constructionUnit;
			vm.draft.capitalTotal = vm.capitalTotal;
			vm.draft.userNameAndUnit = vm.userNameAndUnit;
			
			common.initJqValidation();
 			var isValid = $('#formDraft').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_draft + "/" +vm.taskAudit.id),
						data : vm.draft
					};
				
				var httpSuccess = function success(response) {
					$('#draft_issued').modal('hide');
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
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
		}
		
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data || {};
						vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
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
		
		//编辑意见
		function editOpin(vm){
			var httpOptions = {
	                method: 'post',
	                url:url_opin+'/editOpin',
	                data:vm.model.opinion          
	            };
	            
	            var httpSuccess = function success(response) {    
	            	vm.opinionGrid.dataSource.read();
	            	$('.opinionEdit').modal('hide');
	            };
	            
	            common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		//删除意见
		function deleteOpin(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'post',
                url:url_opin+'/deleteOpin',
                data:id              
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.opinionGrid.dataSource.read();
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

		/**
		 * 查询意见
		 */
		function getOpinion(vm){
			var httpOptions = {
					method : 'get',
					url : url_opin
			};
			
			var httpSuccess = function success(response){
				vm.model.opinionDtos = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 保存意见
		 */
		function saveOpinion(vm){
			
			vm.opinion = {"opinion":vm.processSuggestion};
			var httpOptions = {
					method : 'post',
					url : url_opin,
					data : vm.opinion
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
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
		 * 查询角色信息
		 */
		function getRoles(vm){
			var httpOptions = {
					method : 'get',
					url : url_role
				};
			
			var httpSuccess = function success(response) {
				vm.model.roles = response.data.value||{};
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		
		/**
		 * 保存申报信息
		 */
		function saveShenBaoInfo(vm){
			var httpOptions = {
					method : 'post',
					url : url_shenbao+'/updateShenbao',
					data:vm.model.shenBaoInfo
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
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
		 * 查询任务信息
		 */
		function getTaskInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskAudit + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.taskAudit = response.data.value[0] || {};
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
		 * 查询申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.relId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.shenBaoInfo = response.data.value[0] || {};
						//数据的展示处理
						//项目类型
						vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						//判断投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
		    	       		.toArray();
							//基础数据--行业归口
							 vm.basicData.projectIndustry=$linq(common.getBasicData())
			    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			    	       		.toArray();
							 vm.projectIndustryChange=function(){    		
				    	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
				    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
				    	       		.toArray();
			     			   };
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
		    	       		.toArray();
							//基础数据--行业归口
		        		   vm.basicData.projectIndustry=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
		    	       		.toArray();
						}
						//判断申报阶段
						if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
							vm.isProjectProposal=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
							vm.isKXXYJBG=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
							vm.isCBSJYGS=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_prePlanFee){//申报阶段为:规划设计前期费
							vm.isPrePlanFee=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_prePlanFee;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_newStratPlan){//申报阶段为:新开工计划
							vm.isNewStart=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_xuJianPlan){//申报阶段为:续建计划
							vm.isXuJian=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
							vm.isYearPlan = true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_junGong){//申报阶段为:竣工决算
							vm.isJunGong=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_junGong;
						}
						//时间的显示
						vm.model.shenBaoInfo.createdDate=common.formatDate(vm.model.shenBaoInfo.createdDate);//开工日期
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
						vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
						//资金计算显示
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys||0,vm.model.shenBaoInfo.capitalSCZ_gtzj||0,vm.model.shenBaoInfo.capitalSCZ_zxzj||0,
  			 						vm.model.shenBaoInfo.capitalQCZ_ggys||0,vm.model.shenBaoInfo.capitalQCZ_gtzj||0,
  			 						vm.model.shenBaoInfo.capitalSHTZ||0,vm.model.shenBaoInfo.capitalZYYS||0,vm.model.shenBaoInfo.capitalOther||0]);
				  		 };
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
		 * 查询部门
		 */
		function getDepts(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.depts = response.data.value||{};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 送出处理
		 */
		function handle(vm){
			vm.taskAudit.processSuggestion = vm.processSuggestion;
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
	   				
			var httpOptions = {
					method : 'post',
					url : url_task+"/"+vm.taskId,
					data : vm.taskAudit
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
		
		// begin#grid
		/**
		 * 意见列表
		 */
		function opinionGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_opin),						
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
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "opinion",
					title : "意见",
					width : 450,
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.opinion);

					}

				}
			];
			// End:column

			vm.opinionGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		// begin#grid
		/**
		 * 批复文件列表
		 */
		function replyFileGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_replyFile),						
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
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
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
					field : "name",
					title : "文件名",
					width : 450,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
					filterable : true
				}
			];
			// End:column

			vm.replyFileGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		
		/**
		 * 个人待办列表
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskAudit),
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
					$('#todoNumber_audit').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_auditOption = grid.getOptions();
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
						width:500,
						template:function(item){
							return common.format("<a href='#/task/handle_audit/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 300,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: vm.basicData.projectIndustry_ZF,
			                            dataTextField: "description",
			                            dataValueField: "id",
			                            filter: "startswith"
			                        });
			                    }
						}
					},
					 {
						field : "taskType",
						title : "任务类型",
						width : 120,						
						filterable : {
							ui: function(element){
		                        element.kendoDropDownList({
		                            valuePrimitive: true,
		                            dataSource: vm.basicData.taskType,
		                            dataTextField: "description",
		                            dataValueField: "id",
		                            filter: "startswith"
		                        });
		                    }
						},
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
			if(window.todo_auditOption && window.todo_auditOption !=''){
				vm.gridOptions = window.todo_auditOption;
			}else{
				vm.gridOptions = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true,
						scrollable:true
					};
			}
		}// end fun grid
	}	
})();;(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskPlanCtrl', taskPlan);

    taskPlan.$inject = ['$location','taskPlanSvc','$state','$scope','$sce','$rootScope']; 

    function taskPlan($location, taskPlanSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.search={};
    	vm.basicData={};
    	vm.page="todoPlanList";
    	vm.task ="";
    	//任务处理--请求参数
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;
        
 
    	function init(){
    		if($state.current.name=='task_handle_plan'){//处理页面
    			vm.page="handlePlan";
    		}
    		if($state.current.name=='task_plan'){//处理页面
    			vm.page="task_plan";
    		}
    		if($state.current.name=='task_planDetails'){//处理页面
    			vm.page="task_planDetails";
    		}
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		}; 		
    		vm.getProcessUser = function(id){
    			return common.getUserById(id);
    		};
    		vm.getBasicDataDesc=function(str){//流转信息显示
    			return common.getBasicDataDesc(str);
    		};
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};

           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
           	
           	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	
           	//初始化审批流程
           	vm.processState_msFenBan=common.basicDataConfig().processState_msFenBan;
           	
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   				.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
   	   		//查询申报信息
        	taskPlanSvc.getShenBaoInfoById(vm);
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoPlanList'){
        		init_todoPlanList();
        	}
        	if(vm.page=='handlePlan'){
        		init_handleAudit();
        	}
        	if(vm.page=='task_plan'){
        		init_task_plan();
        	}
        	if(vm.page=='task_planDetails'){
        		init_task_planDetails();
        	}
        }
        
        function init_task_planDetails(){
        	
        	taskPlanSvc.getTaskById(vm);
        	
        	//拟稿纸模态框
	       	vm.draftOpen=function(){
	       		//查询发文拟稿
	       		taskPlanSvc.getDraftIssued(vm);
	       		
	       		$('.draft_issued').modal({
	                   backdrop: 'static',
	                   keyboard:false
	               });
	       		
	       		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
		   			.toArray();//获取秘密等级信息
	       		vm.basicData.fileSet=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
		   			.toArray();//获取文件缓急信息
	       		vm.basicData.documentType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
		   			.toArray();//获取文件种类信息
	       		vm.basicData.openType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
		   			.toArray();//获取公开种类信息
	       		vm.basicData.postingCategory=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
		   			.toArray();//获取发文种类信息
	       		
	       	};
      	   
        }
        
        function init_task_plan(){
        	
	      	//拟稿纸模态框
	       	vm.draftOpen=function(){
	       		//查询发文拟稿
	       		taskPlanSvc.getDraftIssued(vm);
	       		
	       		$('.draft_issued').modal({
	                   backdrop: 'static',
	                   keyboard:false
	               });
	       		
	       		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
		   			.toArray();//获取秘密等级信息
	       		vm.basicData.fileSet=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
		   			.toArray();//获取文件缓急信息
	       		vm.basicData.documentType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
		   			.toArray();//获取文件种类信息
	       		vm.basicData.openType=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
		   			.toArray();//获取公开种类信息
	       		vm.basicData.postingCategory=$linq(common.getBasicData())
		   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
		   			.toArray();//获取发文种类信息
	       		
	       	};
      	   
	       	taskPlanSvc.complete_PlanGird(vm);
        }
        
        function init_todoPlanList(){
        	taskPlanSvc.grid_plan(vm);
        	
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions_plan.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_handleAudit(){
        	//查询任务信息
        	taskPlanSvc.getTaskInfoById(vm);
        	
        	//查询部门信息
        	taskPlanSvc.getDepts(vm);
        	//查询批复文件
        	taskPlanSvc.replyFileGird(vm);
        	//查询角色信息
        	taskPlanSvc.getRoles(vm);
        	//常用意见列表
        	taskPlanSvc.opinionGird(vm);
        	
        	taskPlanSvc.getOpinion(vm);
        	

        	//保存草稿纸
        	vm.saveDraft=function(){
        		taskPlanSvc.saveDraft(vm);
        	};
        
        	//拟稿纸模态框
        	vm.draftOpen=function(){
        		//查询发文拟稿
        		taskPlanSvc.getDraftIssued(vm);
        		//拟稿单位拟稿人
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskPlan.operator){//获得部门人员
						vm.userNameAndUnit =  vm.model.depts[i].name +'、'+ vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		$('.draft_issued').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		
        		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
	   			.toArray();//获取秘密等级信息
        		vm.basicData.fileSet=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
	   			.toArray();//获取文件缓急信息
        		vm.basicData.documentType=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
	   			.toArray();//获取文件种类信息
        		vm.basicData.openType=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
	   			.toArray();//获取公开种类信息
        		vm.basicData.postingCategory=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
	   			.toArray();//获取发文种类信息
        		
        	};
        	
        	//意见下拉框
        	vm.opinion=function(){
        		taskPlanSvc.getOpinion(vm);
        	};
        	
        	//保存常用意见
        	vm.saveOpinion=function(){
        		//vm.model.opinion="";// 清空model重新查询
        		if(vm.processSuggestion != "" && vm.processSuggestion != undefined){
        			taskPlanSvc.saveOpinion(vm);
        		}
        	};
        	
        	vm.closeOpin=function(){
        		$('#opinionEdit').model('hide');
        	};
        	
        	//常用意见管理模态框
        	vm.showOpinion = function(){
        		$('.opinion').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		 vm.opinionGrid.dataSource.read();
        	};
        	
        	//编辑意见
        	vm.editOpin=function(){
        		taskPlanSvc.editOpin(vm);
        	};
        	
        	//编辑模态框
        	vm.edit=function(id,opin){
        		$('.opinionEdit').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		vm.model.opinion = {"opinion":opin,"id":id};
        		
        	};
        	//删除意见
        	vm.remove=function(id){
        		taskPlanSvc.deleteOpin(vm,id);
        	};
        	
        	//切换常用意见
        	vm.changeOpin=function(){
        		vm.processSuggestion = vm.model.opinion;
        	};
        	
        	
        	 vm.del = function (id) {       	 
              	$('.confirmDialog').modal('hide');             	
              	taskPlanSvc.deleteOpin(vm,id);
            };
        	//批量删除意见
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
        	
        	//部门切换触发
        	vm.changeDept = function(){
        		for (var i = 0; i < vm.model.depts.length; i++) {
					if(vm.model.depts[i].id == vm.model.deptId){//获得部门人员
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长"){//默认选中科长为下一流程处理人
									vm.taskPlan.nextUser = vm.model.depts[i].userDtos[j].id;//下一处理人为当前部门角色是科长的人
								}
							}
						}
					}
				}
        	};
        	
        	//经办人员业务选择
        	
        	vm.clickedYW = function(str){
        		if(str == "yewu"){
        			vm.nextProcessRadioOfYW = "yewu";
        		}
        		
        		if(str == "pingshenbaopi"){
        			vm.nextProcessRadioOfYW = "pingshenbaopi";
        		}
        		if(str == "fawen"){
        			vm.nextProcessRadioOfYW = "fawen";
        		}
        		if(str == "keyuantuiwen"){
        			vm.nextProcessRadioOfYW = "keyuantuiwen";
        		}
        		if(str == "pingshenweituo"){
        			vm.nextProcessRadioOfYW = "pingshenweituo";
        		}
        		if(str == "fawennigao"){
        			vm.nextProcessRadioOfYW = "fawennigao";
        		}
        	};
        	
        	//下一处理环节
        	vm.clicked =function(str){
        		//部门承办
        		if(str == "bumen"){
        			vm.showDept = true;
        			vm.nextProcessRadio = "bumen";
        		}else {
        			vm.showDept = false;
        		}
        		
        		//退文办结
        		if(str == "tuiwenbanjie"){
        			vm.nextProcessRadio = "tuiwenbanjie";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskPlan.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		//退文
        		if(str == "tuiwen"){
        			vm.nextProcessRadio = "tuiwen";
        		}
        		
        		//办结
        		if(str == "banjie"){
        			vm.nextProcessRadio = "banjie";
        		}
        		
        		//退回重办
        		if(str == "tuihuiChongban"){
        			vm.nextProcessRadio = "tuihuiChongban";
        		}
        		
        		//经办人办理
        		if(str == "jingBanRenBanli"){
        			vm.nextProcessRadio = "jingBanRenBanli";
        			root:for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长" &&vm.model.depts[i].userDtos[j].id ==vm.taskPlan.nextUser){//科长选择当前科室的科员为下一流程处理人
									vm.model.depts[i].userDtos.splice(j,1);
									vm.users = vm.model.depts[i].userDtos;
									break root;
								}
							}
						}
    				}
        			
        		}
        		
        		//科室办理--显示部门下拉选
        		if(str == "keshibanli"){
        			vm.nextProcessRadio = "keshibanli";
        		}
        		
        		//科员办理--显示当前部门的科员
        		if(str == "keyuanbanli"){
        			vm.nextProcessRadio = "keyuanbanli";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].id ==vm.taskPlan.nextUser){//科长选择当前科室的科员为下一流程处理人
									vm.users = vm.model.depts[i].userDtos;
								}
							}
						}
        			}
        		}
        		
        		//科长审核
        		if(str == "kezhangshenhe"){
        			vm.nextProcessRadio = "kezhangshenhe";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科员" &&vm.model.depts[i].userDtos[j].id ==vm.taskPlan.nextUser){//默认选择当前人员的科长
									for (var m = 0; m < vm.model.depts[i].userDtos.length; m++) {
										for (var n = 0; n < vm.model.depts[i].userDtos[m].roles.length; n++) {
											if(vm.model.depts[i].userDtos[m].roles[n].roleName == "科长"){
												vm.taskPlan.nextUser = vm.model.depts[i].userDtos[m].id;
											}
										}
									}
								}
							}
						}
        			}
        		}
        		
        		//退回经办人
        		if(str == "tuihuijingbanren" || str == "jingbanrensongshen" || str == "pingswancheng" || str == "jingBanRenBanli_juzhang"){
        			if(str == "tuihuijingbanren"){
        				vm.nextProcessRadio = "tuihuijingbanren";
        			}else if(str == "jingbanrensongshen"){
        				vm.nextProcessRadio = "jingbanrensongshen";
        			}else if(str == "pingswancheng"){
        				vm.nextProcessRadio = "pingswancheng";
        			}else if(str == "jingBanRenBanli_juzhang"){
        				vm.nextProcessRadio = "jingBanRenBanli_juzhang";
        			}
					vm.taskPlan.nextUser = vm.taskPlan.operator;
        		}
        		
        		//局领导审批
        		if(str == "julingdaoshenpi"){
        			vm.nextProcessRadio = "julingdaoshenpi";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "局领导"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//人秘科核稿
        		if(str == "renmikehegao"){
        			vm.nextProcessRadio = "renmikehegao";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskPlan.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		//局领导复批
        		if(str == "julingdaofushen"){
        			vm.nextProcessRadio = "julingdaofushen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "局领导"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//办公室发文
        		if(str == "bangongshifawen"){
        			vm.nextProcessRadio = "bangongshifawen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskPlan.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		if(str == "fawendengji"){
        			vm.nextProcessRadio = "fawendengji";
        		}
        	};
        	
        	//选择人员为下一处理人
        	vm.selectUser = function(id){
        		vm.taskPlan.nextUser = id;
        		if(vm.nextProcessRadio == "tuihuijingbanren" ||vm.nextProcessRadio == "jingBanRenBanli" || vm.nextProcessRadio == "pingswancheng"){
            		vm.taskPlan.operator = id;
    			}
        	};
        	
        	function setNextProcess(vm){
    			var processState = vm.taskPlan.processState;//下一流程展示
    			if(processState ==  "processState_1"){
    				vm.taskPlan.processState = "processState_3";
    				vm.taskPlan.nextProcess = "processState_4";
    			}else if(processState == "processState_3"){
    				vm.taskPlan.processState = "processState_4";
    				vm.taskPlan.nextProcess = "processState_5";
    			}else if(processState == "processState_4"){
    				vm.taskPlan.processState = "processState_5";
    				vm.taskPlan.nextProcess = "processState_6";
    			}else if(processState == "processState_5"){
    				vm.taskPlan.processState = "processState_6";
    				vm.taskPlan.nextProcess = "processState_8";
    			}else if(processState == "processState_6"){
    				vm.taskPlan.processState = "processState_8";
    				vm.taskPlan.nextProcess = "processState_22";
    			}else if(processState == "processState_8"){
    				vm.taskPlan.processState = "processState_9";
    				vm.taskPlan.nextProcess = "processState_10";
    			}else if(processState == "processState_9"){
    				vm.taskPlan.processState = "processState_10";
    				vm.taskPlan.nextProcess = "processState_17";
    			}else if(processState == "processState_10"){
    				vm.taskPlan.processState = "processState_17";
    				vm.taskPlan.nextProcess = "processState_18";
    			}else if(processState == "processState_17"){
    				vm.taskPlan.processState = "processState_18";
    				vm.taskPlan.nextProcess = "processState_19";
    			}else if(processState == "processState_18"){
    				vm.taskPlan.processState = "processState_19";
    				vm.taskPlan.nextProcess = "processState_21";
    			}else if(processState == "processState_19"){
    				vm.taskPlan.processState = "processState_21";
    				vm.taskPlan.nextProcess = "processState_22";
    			}else if(processState == "processState_21"){
    				vm.taskPlan.processState = "processState_23";
    				vm.taskPlan.nextProcess = "";
    			}
    		}
        	
        	//送出
        	vm.handle = function(){
        		
        		vm.taskPlan.tuiwen = false;
        		common.initJqValidation();
        		var isValid = $('form').valid();
    	   		if (isValid) {
	        		if(vm.nextProcessRadio =="bumen"){//正常流程--部门审批
	        			if(vm.taskPlan.processState == "processState_4"){
	        				vm.taskPlan.processState = "processState_3";
	        				vm.taskPlan.nextProcess = "processState_4";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	    				
	    				vm.taskPlan.processRole ="";
	    			}else if(vm.nextProcessRadio =="tuiwen"){//退文
	    				vm.taskPlan.processState = "processState_15";
	    				vm.taskPlan.nextProcess = "processState_3";
	    				vm.taskPlan.processRole ="";
	    			}else if(vm.nextProcessRadio =="tuiwenbanjie"){//退文办结
	    				vm.taskPlan.processState = "processState_3";
	    				vm.taskPlan.nextUser = "";
	    				vm.taskPlan.nextProcess = "processState_22";
	    			}else if(vm.nextProcessRadio =="banjie"){//办结
	    				vm.taskPlan.processState = "processState_11";
	    				vm.taskPlan.nextProcess = "";
	    				vm.taskPlan.processRole ="";
	    			}else if(vm.nextProcessRadio == "tuihuiChongban"){//退回给秘书科
	    				vm.taskPlan.processState = "processState_4";
	    				vm.taskPlan.nextProcess = "processState_3";
	    				vm.taskPlan.processRole =getMiShuKRole("秘书科分办人员");
	    				vm.taskPlan.nextUser = "";
	        		}else if(vm.nextProcessRadio == "jingBanRenBanli"){//经办人办理--正常流程
	        			if(vm.taskPlan.processState != "processState_3"){
	        				vm.taskPlan.processState = "processState_3";
	        			}
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "keshibanli"){//科室办理--退回给所选科室的科长
	        			vm.taskPlan.processState = "processState_5";
	    				vm.taskPlan.nextProcess = "processState_4";
	    				
	        		}else if(vm.nextProcessRadio == "keyuanbanli"){//科员办理--退回给经办人所在科室的科员
	        			vm.taskPlan.processState = "processState_4";
	    				vm.taskPlan.nextProcess = "processState_5";
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "kezhangshenhe"&&vm.nextProcessRadioOfYW == "pingshenbaopi"){//科长审核--正常流程
	        			if(vm.taskPlan.processState == "processState_6"){//退回经办人后重新送科长
	        				vm.taskPlan.processState = "processState_5";
		    				vm.taskPlan.nextProcess = "processState_6";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "julingdaoshenpi"){//局领导审批--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "jingBanRenBanli_juzhang"){//局领导审批--经办人办理
	        			vm.taskPlan.processState = "processState_4";
	    				vm.taskPlan.nextProcess = "processState_5";
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "pingshentuihui"){//评审中心退回经办人
	        			vm.taskPlan.processState = "processState_8";
	    				vm.taskPlan.nextProcess = "processState_9";
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "tuihuijingbanren"){//退回经办人
	        			vm.taskPlan.processState = vm.taskPlan.nextProcess;
	    				vm.taskPlan.nextProcess = "processState_5";
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "jingbanrensongshen"){//经办人送审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "songshen"){//送审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "pingswancheng"){//评审完成--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "pingshenbaopi" && vm.nextProcessRadio == "kezhangshenhe"){//评审完成--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "fawen" && vm.nextProcessRadio == "kezhangshenhe"){//经办人发文拟稿
	        			vm.taskPlan.fawen = true;
	        			if(vm.taskPlan.processState == "processState_4"){//第三步发文
	        				vm.taskPlan.processState = "processState_5";
	        			}
	        			if(vm.taskPlan.processState == "processState_10"){//第三步发文
	        				vm.taskPlan.processState = "processState_17";
	        			}
	    				vm.taskPlan.nextProcess = "processState_18";
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "keyuantuiwen" && vm.nextProcessRadio == "kezhangshenhe"){//经办人退文
	        			vm.taskPlan.processState = "processState_5";
	    				vm.taskPlan.nextProcess = "processState_4";
	    				vm.taskPlan.processRole ="";
	    				vm.taskPlan.tuiwen = true;
	        		}else if(vm.nextProcessRadioOfYW == "pingshenweituo" && vm.nextProcessRadio == "kezhangshenhe"){//评审委托--科长审核
	        			vm.taskPlan.processState = "processState_9";
	    				vm.taskPlan.nextProcess = "processState_18";
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "renmikehegao"){//评审完成--正常流程
	        			if(vm.taskPlan.processState != "processState_17"){
	        				vm.taskPlan.processState = "processState_18";
	        				vm.taskPlan.nextProcess = "processState_19";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	        			
	        			vm.taskPlan.nextUser ="";
	        		}else if(vm.nextProcessRadio == "julingdaofushen"){//局领导复审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskPlan.processRole ="";
	        		}else if(vm.nextProcessRadio == "bangongshifawen"){//办公室发文--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskPlan.nextUser ="";
	        		}else if(vm.nextProcessRadio == "bangongshifawen"){//办公室发文--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskPlan.nextUser ="";
	        		}else if(vm.nextProcessRadio == "fawendengji"){//秘书科发文登记--正常流程
	        			vm.taskPlan.processState = "processState_21";
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskPlan.nextUser ="";
	    				vm.taskPlan.processRole ="";
	        		}
	        		
	        
	        		taskPlanSvc.handle(vm);
    	   		}
        	};
        	
        	//得到秘书科角色
        	function getMiShuKRole(role){
        		for (var i = 0; i < vm.model.roles.length; i++) {
        			if(vm.model.roles[i].roleName == role){
        				return vm.model.roles[i].id;
        			}
				}
        	}

        	//弹出申报详情模态框
        	vm.dialog_shenbaoInfo=function(){
        		$("#shenbaoInfo").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	//弹出申报信息复核模态款
        	vm.dialog_shenbaoInfoEdit=function(){
        		$("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.projectTypes.indexOf(id);
	        	if(index == -1){
	        		vm.projectTypes.push(id);
		       	}else{
		       		vm.projectTypes.splice(index,1);
		       	}	        	
	        };
	      //文件上传成功
    	   vm.uploadSuccess=function(e){
   			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.shenBaoInfo.attachmentDtos){
                                 vm.model.shenBaoInfo.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.shenBaoInfo.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.shenBaoInfo.attachmentDtos){
	           			// 	 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
    	   };

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

	  		//选择上传文件验证文件大小
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
                    error:vm.uploadError,
                    success:vm.uploadSuccess,
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
				var file = vm.model.shenBaoInfo.attachmentDtos[idx];
				if(file){//删除上传文件的同时删除批复文号
					var pifuType = file.type;
					vm.model.shenBaoInfo['pifu'+pifuType+'_wenhao'] = "";
					vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
				 }
			 };
			//展示批复文件选择模态框
	   		vm.choseDocument = function(e){
	   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
        	   $("#documentRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.replyFileGridOptions.dataSource.read();//批复文件列表数据刷新
	   		};
		   		
	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	if(fileName){
            		var file = common.stringToArray(fileName,",");
            		var number = file[0];
            		var name = file[1];
            		var url =file[2];
            		vm.model.shenBaoInfo['pifu'+vm.pifuType+'_wenhao'] = number;
            		if(vm.model.shenBaoInfo.attachmentDtos){
         				  vm.model.shenBaoInfo.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
         			 }else{
         				  vm.model.shenBaoInfo.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
         			 }
            	}
	        };
	       //批复文件列表模态框关闭
	        vm.dismissReplyFile=function(){
	        	$("#documentRecords").modal('hide');
	        };
	      //复核申报信息保存
	        vm.saveShenBaoInfo=function(){
	        	taskPlanSvc.saveShenBaoInfo(vm);
	        };

        }//end init_handleAudit
    }
})();
;(function() {
	'use strict';

	angular.module('app').factory('taskPlanSvc', taskPlan);

	taskPlan.$inject = [ '$http' ,'$location'];

	function taskPlan($http,$location) {
		var url_task = "/management/task";
		var url_taskPlan = "/management/task/plan";
		var url_shenbao = "/management/shenbao";
		var url_dept="/org";
		var url_back = "#/task/todo";
		var url_replyFile = "/management/replyFile";
		var url_role="/role";
		var url_opin="/opin";
		var url_users = "/user";
		var url_draft ="/management/draft";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		var url_taskRecord_plan = "/management/taskRecord/plan";
		
		var service = {
			grid_plan : grid_plan,//待办任务列表
			getTaskInfoById:getTaskInfoById,//查询任务信息
			getShenBaoInfoById:getShenBaoInfoById,//查询申报信息
			getDepts:getDepts,//查询部门
			handle:handle,//送出
			replyFileGird:replyFileGird,//批复文件库列表
			saveShenBaoInfo:saveShenBaoInfo,//保存申报信息
			getRoles:getRoles,//查询角色信息
			saveOpinion:saveOpinion,//保存意见
			getOpinion:getOpinion,//获取意见
			opinionGird:opinionGird,//意见列表
			deleteOpin:deleteOpin,//删除意见
			editOpin:editOpin,//编辑意见
			saveDraft:saveDraft,
			getDraftIssued:getDraftIssued,
			complete_PlanGird:complete_PlanGird,
			getTaskById:getTaskById
		};
		
		return service;
		
		//拟稿意见
		function saveDraft(vm){
			vm.draft.projectName = vm.model.shenBaoInfo.projectName;
			vm.draft.unitName = vm.model.shenBaoInfo.constructionUnit;
			vm.draft.capitalTotal = vm.capitalTotal;
			vm.draft.userNameAndUnit = vm.userNameAndUnit;
			
			common.initJqValidation();
 			var isValid = $('#formDraft').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_draft + "/" +vm.taskPlan.id),
						data : vm.draft
					};
				
				var httpSuccess = function success(response) {
					$('#draft_issued').modal('hide');
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
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
		}
		
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "/" +vm.task.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data || {};
						vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
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
		//编辑意见
		function editOpin(vm){
			var httpOptions = {
	                method: 'post',
	                url:url_opin+'/editOpin',
	                data:vm.model.opinion          
	            };
	            
	            var httpSuccess = function success(response) {    
	            	vm.opinionGrid.dataSource.read();
	            	$('.opinionEdit').modal('hide');
	            };
	            
	            common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		//删除意见
		function deleteOpin(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'post',
                url:url_opin+'/deleteOpin',
                data:id              
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.opinionGrid.dataSource.read();
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

		/**
		 * 查询意见
		 */
		function getOpinion(vm){
			var httpOptions = {
					method : 'get',
					url : url_opin
			};
			
			var httpSuccess = function success(response){
				vm.model.opinionDtos = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 保存意见
		 */
		function saveOpinion(vm){
			
			vm.opinion = {"opinion":vm.processSuggestion};
			var httpOptions = {
					method : 'post',
					url : url_opin,
					data : vm.opinion
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
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
		 * 查询角色信息
		 */
		function getRoles(vm){
			var httpOptions = {
					method : 'get',
					url : url_role
				};
			
			var httpSuccess = function success(response) {
				vm.model.roles = response.data.value||{};
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		
		/**
		 * 保存申报信息
		 */
		function saveShenBaoInfo(vm){
			var httpOptions = {
					method : 'post',
					url : url_shenbao+'/updateShenbao',
					data:vm.model.shenBaoInfo
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
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
		 * 查询任务信息
		 */
		function getTaskById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_task + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.task = response.data.value[0] || {};
						if(vm.task){
							vm.task.taskTypeDesc=common.getBasicDataDesc(vm.task.taskType);
							if(vm.task.isComplete){//如果任务为已完成
								vm.isComplete=true;
							}
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
		}
		
		/**
		 * 查询任务信息
		 */
		function getTaskInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskPlan + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.taskPlan = response.data.value[0] || {};
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
		 * 查询申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.relId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.shenBaoInfo = response.data.value[0] || {};
						//数据的展示处理
						//项目类型
						vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						//判断投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
		    	       		.toArray();
							//基础数据--行业归口
							 vm.basicData.projectIndustry=$linq(common.getBasicData())
			    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			    	       		.toArray();
							 vm.projectIndustryChange=function(){    		
				    	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
				    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
				    	       		.toArray();
			     			   };
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
		    	       		.toArray();
							//基础数据--行业归口
		        		   vm.basicData.projectIndustry=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
		    	       		.toArray();
						}
						//判断申报阶段
						if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
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
						//时间的显示
						vm.model.shenBaoInfo.createdDate=common.formatDate(vm.model.shenBaoInfo.createdDate);//开工日期
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
						vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
						//资金计算显示
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys||0,vm.model.shenBaoInfo.capitalSCZ_gtzj||0,vm.model.shenBaoInfo.capitalSCZ_zxzj||0,
  			 						vm.model.shenBaoInfo.capitalQCZ_ggys||0,vm.model.shenBaoInfo.capitalQCZ_gtzj||0,
  			 						vm.model.shenBaoInfo.capitalSHTZ||0,vm.model.shenBaoInfo.capitalZYYS||0,vm.model.shenBaoInfo.capitalOther||0]);
				  		 };
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
		 * 查询部门
		 */
		function getDepts(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.depts = response.data.value||{};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 送出处理
		 */
		function handle(vm){
			vm.taskPlan.processSuggestion = vm.processSuggestion;
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
	   				
			var httpOptions = {
					method : 'post',
					url : url_task+"/"+vm.taskId,
					data : vm.taskPlan
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
		
		// begin#grid
		/**
		 * 意见列表
		 */
		function opinionGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_opin),						
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
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "opinion",
					title : "意见",
					width : 450,
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.opinion);

					}

				}
			];
			// End:column

			vm.opinionGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		// begin#grid
		/**
		 * 批复文件列表
		 */
		function replyFileGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_replyFile),						
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
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
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
					field : "name",
					title : "文件名",
					width : 450,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
					filterable : true
				}
			];
			// End:column

			vm.replyFileGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		/**
		 * 个人已办--计划类
		 */
		function complete_PlanGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord_plan),
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
				change: function(e) {//当数据发生变化时
				    var filters = dataSource.filter();//获取所有的过滤条件
				    vm.filters = filters;
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
							return common.format("<a href='#/task/plan_details/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
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

			vm.gridOptions_complete_plan = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		/**
		 * 个人待办列表--计划类
		 */
		function grid_plan(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskPlan),
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
					$('#todoNumber_plan').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_planOption = grid.getOptions();
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
							return common.format("<a href='#/task/handle_plan/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
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
			                            dataSource: vm.basicData.projectIndustry_ZF,
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
			
			if(window.todo_planOption && window.todo_planOption !=''){
				vm.gridOptions_plan = window.todo_planOption;
			}else{
				vm.gridOptions_plan = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true
					};
			}
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
    	vm.packageType={};
        vm.id=$state.params.id;
        vm.investmentType=$state.params.projectInvestmentType;
        vm.stage=$state.params.stage;
    	vm.page="shenbaoInfoList";//默认为申报信息列表页面
    	vm.planYear=2018;
        
    	function init(){
    		if($state.current.name=='yearPlan_shenbaoInfoEdit'){//申报信息新增页面
    			vm.page='shenbaoInfoAdd';
    		}
    		if($state.current.name=='yearPlan_shenbaoInfoEdit' && vm.id){//申报信息编辑页面
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
        	//刷新基础数据
        	window.global_basicData = null;
           	//条件查询、编辑--基础数据
           	vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	
	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
      	   	vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段 	   		
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.projectIndustryAll=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
   	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
   	   			.toArray();//政府投资项目行业
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
   	   			.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//建设单位信息
   	   		vm.basicData.roles=common.getRoles();//角色
   	   		vm.basicData.users=[];
   	   		vm.basicData.packageType=common.getBacicDataByIndectity(common.basicDataConfig().packageType);//打包类型
   	   		
   	   		vm.searchIndustryChange=function(){
   	   			vm.searchIndustryIsZF = false;
   	   			vm.searchIndustryIsSH = false;
   	   			if(vm.searchIndustryFather == common.basicDataConfig().projectIndustry_ZF){
   	   				vm.searchIndustryIsZF = true;
   	   			}else if(vm.searchIndustryFather == common.basicDataConfig().projectIndustry_SH){
   	   				vm.searchIndustryIsSH = true;
   	   			}
   	   		};
   	   		
//   	   		vm.searchRoleChange=function(){
//   	   			vm.searchUser = false;
//   	   			vm.basicData.users=vm.basicData.users.splice(0,vm.basicData.users.length);
//   	   			if(vm.search.role != ''){
//   	   				vm.search.roleJSON=eval('(' + vm.search.role + ')');//将json字符串转换为json对象
//   					vm.basicData.users=vm.search.roleJSON.userDtos;//获取角色用户
//   	   				vm.searchUser = true;
//   	   			}
//   	   		};
    	}
    	init();    	
    	activate();
        function activate() {        	
        	if(vm.page=='shenbaoInfoList'){
        		init_shenbaoInfoList();
        	}
        	if(vm.page=='shenbaoInfoAdd'){
        		vm.shenBaoInfoAdd = true;
        		init_shenbaoInfoEdit();
        		
        	}
        	if(vm.page=='shenbaoInfoEdit'){
        		vm.shenBaoInfoEdit = true;
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
     			  filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear,10)});
     		   }
     		   if(vm.search.constructionUnit !=null && vm.search.constructionUnit !=''){//查询条件--建设单位名称
     			  filters.push({field:'constructionUnit',operator:'contains',value:vm.search.constructionUnit});
     		   }
     		   if(vm.search.auditState !=null && vm.search.auditState !=''){//查询条件--审核状态
     			  filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
     		   }
     		   if(vm.search.projectConstrChar !=null && vm.search.projectConstrChar !=''){//查询条件--建设性质
     			  filters.push({field:'projectConstrChar',operator:'eq',value:vm.search.projectConstrChar});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  if(vm.search.receiver !=null && vm.search.receiver !=''){//查询条件--签收人
     			  if(vm.search.receiver == "me"){
     				 filters.push({field:'receiver',operator:'eq',value:window.profile_userId});
     			  }else if(vm.search.receiver == "other"){
     				 filters.push({field:'receiver',operator:'ne',value:window.profile_userId});
     			  }else if(vm.search.receiver == "all"){}
     		   }
     		  if(vm.search.packageType !=null && vm.search.packageType !=''){//查询条件--打包类型
     			 filters.push({field:'packageType',operator:'eq',value:vm.search.packageType});
     		  }
     		  vm.gridOptions.dataSource.filter(filters);
    		};
    		//清空查询条件
    		vm.filterClear=function(){
    			location.reload();
    		};
    		//申报详情模态框
    		vm.dialog_shenbaoInfo = function(id){
    			vm.id = id;
    			yearPlanSvc.getShenBaoInfoById(vm);
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
    		//新增年度计划项目信息按钮
    		vm.addShenBaoInfo=function(){
    			var projectInvestmentType=common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资类型
    			var stage=common.basicDataConfig().projectShenBaoStage_nextYearPlan;//默认申报阶段为下一年度计划
    			//跳转到编辑页面
    			$location.path("/yearPlan/shenbaoInfoEdit//"+projectInvestmentType+"/"+stage);
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
	 	
	 		//如果是新增下一年度计划信息--禁止点击Tab切换
	 		  if(vm.shenBaoInfoAdd){
	 			 vm.isShenBaoInfoAdd=true;//审核按钮不能点击
	 			 $("#tab1").attr("disabled","true");
		 		  $("#tab2").attr("disabled","true");
		 		  $("#tab3").attr("disabled","true");
		 		  $("#tab4").attr("disabled","true");
	 		  }
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
    	
    	yearPlanSvc.getShenBaoInfoById(vm);
    	
    	//项目所属单位发生变化
    	vm.unitNameChange=function(){
    		yearPlanSvc.getUserUnit(vm);
    	};
    	
   		//获取项目类型， 多选
   		vm.updateSelection = function(id){
   			if(vm.projectTypes.constructor == String){
   				vm.projectTypes=common.stringToArray(vm.projectTypes);
   			}
        	var index = vm.projectTypes.indexOf(id);
        	if(index == -1){
        		vm.projectTypes.push(id);
	       	}else{
	       		vm.projectTypes.splice(index,1);
	       	}	        	
        };
        
        //申报年份发生变化时触发
        vm.changeYear = function(){
  		   vm.planYear = parseInt(vm.model.shenBaoInfo.planYear,10);
  	    };
        
        //展示批复文件选择模态框
   		vm.choseDocument = function(e){
   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
     	   $("#documentRecords").modal({
		        backdrop: 'static',
		        keyboard:true  			  
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
        	if(fileName){
        		var file = common.stringToArray(fileName,",");
        		var number = file[0];
        		var name = file[1];
        		var url =file[2];
        		vm.model.shenBaoInfo['pifu'+vm.pifuType+'_wenhao'] = number;
        		if(vm.model.shenBaoInfo.attachmentDtos){
     				  vm.model.shenBaoInfo.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
     			 }else{
     				  vm.model.shenBaoInfo.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
     			 }
        	}
        };
     	  
   		//文件上传
 	   vm.uploadSuccess=function(e){
			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
           	 if(e.XMLHttpRequest.status==200){
                 angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                     $scope.$apply(function() {
                         if(vm.model.shenBaoInfo.attachmentDtos){
                             vm.model.shenBaoInfo.attachmentDtos.push({
                                 name: fileObj.originalFilename,
                                 url: fileObj.randomName,
                                 type: type
                             });
                         } else {
                             vm.model.shenBaoInfo.attachmentDtos = [{
                                 name: fileObj.originalFilename,
                                 url: fileObj.randomName,
                                 type: type
                             }];
                         }
                     });
                 })
           		 // var fileName=e.XMLHttpRequest.response;
           		 // $scope.$apply(function(){
           			//  if(vm.model.shenBaoInfo.attachmentDtos){
           			// 	 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
           			//  }else{
           			// 	 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
           			//  }
           		 // });
           	 }
   		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
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
            error:vm.uploadError,
            success:vm.uploadSuccess,
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
            error:vm.uploadError,
            success:vm.uploadSuccess,
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
   			var file = vm.model.shenBaoInfo.attachmentDtos[idx];
  			 if(file){//删除上传文件的同时删除批复文号
  				var pifuType = file.type;
  				vm.model.shenBaoInfo['pifu'+pifuType+'_wenhao'] = "";
  				vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
  			 }
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
      	//添加建设单位
 		vm.addUnit=function(){
 			if(vm.constructionUnits.constructor == String){
 				vm.constructionUnits=common.stringToArray(vm.constructionUnits);
 			}
 			vm.constructionUnits.push('');
 			if(vm.constructionUnits.length >1){
				vm.canDelete = true;
			}
 		};
     	//删除建设单位
	   vm.deleteUnit=function(idx){
		   if(vm.canDelete){
			   if(vm.constructionUnits.constructor == String){
	 				vm.constructionUnits=common.stringToArray(vm.constructionUnits);
	 			}
			   vm.constructionUnits.splice(idx,1);
				if(vm.constructionUnits.length <=1){
					vm.canDelete = false;
				}
			}
	   };
	   //打包类型改变事件
	   vm.packageTypeChange=function(){
		   vm.isOtherPackageType=false;
		   if(vm.model.shenBaoInfo.packageType == 'other'){
			   vm.isOtherPackageType = true;
		   }
	   };
	   //打包类型新增其他保存
	   vm.savePackageType=function(){ 
		  yearPlanSvc.savePackageType(vm);
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
     		vm.model.shenBaoInfo.auditState=common.basicDataConfig().auditState_noAudit;//后台修改保存申报信息之后默认为未审核状态
     		yearPlanSvc.updateShenBaoInfo(vm);
     	};
     	//更新审核状态
     	vm.updateAuditState=function(auditState){
     		vm.isAudit = true;//用于设置跳转到列表页面
     		vm.model.shenBaoInfo.auditState = auditState;
     		if(auditState == common.basicDataConfig().auditState_auditPass){//如果审核通过
     			vm.model.shenBaoInfo.isIncludLibrary = true;
     		}
     		yearPlanSvc.updateShenBaoInfo(vm);
     	};
     	//确认创建
     	vm.create=function(){
     		yearPlanSvc.createShenBaoInfo(vm);
     	};
     	
    }//end#init_shenbaoInfoEdit
    	
    	//init_planList
    	function init_planList(){
    		yearPlanSvc.grid_planList(vm);
    		//删除计划
    		vm.deletePlan=function(id){
    			common.confirm({
    				vm:vm,
    				msg:"确认要删除数据吗？",
    				fn:function(){
    					$('.confirmDialog').modal('hide');
    					yearPlanSvc.plan_delete(vm,id);
    				}
    			});
    		};
    		//批量删除计划
    		vm.deletePlans=function(){
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}  
                    var idStr=ids.join(',');
                    vm.deletePlan(idStr);
                }   
    		};
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
    		//添加计划查询绑定回车键按下事件
    		$("#addPlanSearchBtn").keydown(function(){
    			vm.search();
    		});
    		//添加计划筛选
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_qianShou});//默认条件--申报信息的状态为签收状态   
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			   filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		   if(vm.search.planYear !=null && vm.search.planYear !=''){//查询条件--计划年度
     			  filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear,10)});
     		   }
     		   if(vm.search.constructionUnit !=null && vm.search.constructionUnit !=''){//查询条件--建设单位名称
     			  filters.push({field:'constructionUnit',operator:'contains',value:vm.search.constructionUnit});
     		   }
     		  if(vm.search.auditState !=null && vm.search.auditState !=''){//查询条件--审批状态
     			  filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
     		   }
     		   if(vm.search.projectConstrChar !=null && vm.search.projectConstrChar !=''){//查询条件--建设性质
     			  filters.push({field:'projectConstrChar',operator:'eq',value:vm.search.projectConstrChar});
     		   }
     		   if(vm.search.packageType !=null && vm.search.packageType !=''){//查询条件--打包类型
     			   filters.push({field:'packageType',operator:'eq',value:vm.search.packageType});
     		   }
     		  vm.addPlanGridOptions.dataSource.filter(filters);
    		};
    		//清空筛选条件
    		vm.filterClear=function(){
    			//清空人员设置的过滤条件
    			vm.search.projectName = '';
    			vm.search.projectIndustry = '';
    			vm.search.planYear = '';
    			vm.search.constructionUnit = '';
    			vm.search.auditState = '';
    			vm.search.projectConstrChar = '';
    			vm.search.packageType = '';
    			//设置列表过滤项为默认的
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_qianShou});//默认条件--申报信息的状态为签收状态  
				vm.addPlanGridOptions.dataSource.filter(filters);
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
    	    //导出印刷版Excel
	    	vm.exportExcelForYS=function(){
	    		yearPlanSvc.exportExcelForYS(vm);
	    	};
	    	//列表拖拽排序
	    	 $scope.$on("kendoRendered", function (event) {
	             var gridInstance = vm.planGrid;        
	             gridInstance.table.kendoSortable({
                     filter: ">tbody >tr",
                     hint: $.noop,
                     cursor: "move",
                     placeholder: function(element) {
                         return element.clone().addClass("k-state-hover").css("opacity", 0.65);
                     },
                     container: "#planGird tbody",
                     change: function(e) {
                         var skip = gridInstance.dataSource.skip()||0,
                             oldIndex = e.oldIndex + skip,
                             newIndex = e.newIndex + skip,
                             data = gridInstance.dataSource.data(),
                             dataItem = gridInstance.dataSource.getByUid(e.item.data("uid"));
                         gridInstance.dataSource.remove(dataItem);
                         gridInstance.dataSource.insert(newIndex, dataItem);
                     }
                 });
	         });
    	}//init_planBZ   	    	    	   	
    } //yearPlan
})();
;(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http','$location'];

	function yearPlan($http,$location) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_userUnitInfo = "/management/userUnit";
		var url_planList="/management/yearPlan";
		var url_planCapital="/management/yearPlanCapital";
		var url_back_planList="#/yearPlan/planList";
		var url_document="/management/replyFile";
		var url_back_shenbaoInfoList="/yearPlan/shenbaoInfoList";
		var url_exportExcel="/common/exportExcel";
		var url_basicData="/management/basicData";
		var url_updateBasicData = "/management/updateBasicData";
		
		var service = {
			grid_shenbaoInfoList : grid_shenbaoInfoList,//申报项目列表
			updateShenBaoInfoState:updateShenBaoInfoState,//更新申报信息的状态
			addProjectToLibrary:addProjectToLibrary,//项目纳入项目库
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			createShenBaoInfo:createShenBaoInfo,//创建申报信息
			updateProject:updateProject,//更新项目基本信息
			grid_planList:grid_planList,//年度计划列表
			plan_create:plan_create,//创建年度计划
			plan_update:plan_update,//更新年度计划
			plan_delete:plan_delete,//删除年度计划
			getPlanById:getPlanById,//根据年度计划id查找计划信息
			grid_yearPlan_shenbaoInfoList:grid_yearPlan_shenbaoInfoList,//年度计划编制信息列表
			grid_yearPlan_addShenbaoInfoList:grid_yearPlan_addShenbaoInfoList,//年度计划编制新增项目申报列表
			addShenBaoInfoconfirm:addShenBaoInfoconfirm,//年度计划新增项目申报			
			getShenBaoInfoById:getShenBaoInfoById,//根据申报id查找申报信息
			getYearPlanCapitalById:getYearPlanCapitalById,//根据申报id查找年度计划编制信息
			updateYearPlanCapital:updateYearPlanCapital,//更新年度计划编制信息	
			removeYearPlanCapital:removeYearPlanCapital,//移除申报项目
			documentRecordsGird:documentRecordsGird,//批复文件列表
			getUserUnit:getUserUnit,//获取用户单位信息
			exportExcelForYS:exportExcelForYS,//导出印刷版Excel
			savePackageType:savePackageType//保存打包类型
		};
		
		/**
		 * 保存打包类型
		 */
		function savePackageType(vm){
			//目的：获取当前打包类型最大id值
			var idNum = [];
			var index = 0;
			//获取当前打包类型id尾数集合（因为只为一级目录，所以直接获取）
			for(var i=0;i<vm.basicData.packageType.length;i++){
				var id = vm.basicData.packageType[i].id;
				var idSplit = id.split("_");
				idNum[index+i] = parseInt(idSplit[idSplit.length-1],10);//获取所有子级id最后的一组数字									
			}
			//获取数组中的最大值
			var idNumMax = Math.max.apply(null, idNum);
			//替换掉最后的数值
			var oldId = vm.basicData.packageType[0].id;
			var oldIdSplit = oldId.split("_");
			 oldIdSplit[oldIdSplit.length-1] = idNumMax+1;//将最后的一个元素的值变更为最大值+1
			var newId = oldIdSplit.join("_");
			vm.packageType.id=newId;//最后获取到新增类型的id
			vm.packageType.pId=vm.basicData.packageType[0].pId;
			vm.packageType.identity=vm.basicData.packageType[0].identity;
			vm.packageType.canEdit=vm.basicData.packageType[0].canEdit;
			
			//保存新增的打包类型
			var httpOptions = {
					method : 'post',
					url :url_basicData,
					data:vm.packageType
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.basicData.packageType.push(vm.packageType);//添加用于显示
						vm.model.shenBaoInfo.packageType = vm.packageType.id;//赋值					
						//关闭输入框
						vm.isOtherPackageType = false;
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
		 * 导出印刷版Excel
		 */
		function exportExcelForYS(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_exportExcel+"?planId={0}",vm.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"导出成功！",
							fn:function(){
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
		
		//begin#updateShenBaoInfo 更新申报信息
		function updateShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//处理项目类型、建设单位多选问题
				vm.model.shenBaoInfo.projectType=common.arrayToString(vm.projectTypes,',');
				vm.model.shenBaoInfo.constructionUnit = common.arrayToString(vm.constructionUnits,',');
				//安排资金计算
				vm.model.shenBaoInfo.yearInvestApproval=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastTwoYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear || 0);
				//开工时间&竣工时间的处理
				vm.model.shenBaoInfo.beginDate = (vm.model.shenBaoInfo.beginDate != '')?vm.model.shenBaoInfo.beginDate:null;
				vm.model.shenBaoInfo.endDate = (vm.model.shenBaoInfo.endDate != '')?vm.model.shenBaoInfo.endDate:null;
				var httpOptions = {
						method : 'post',
						url : common.format(url_shenbaoInfoList+'/updateShenbao'),
						data:vm.model.shenBaoInfo
					};
			
				var httpSuccess = function success(response) {
					common.alert({
						vm:vm,
						msg:"操作成功！",
						fn:function(){
							$('.alertDialog').modal('hide');
							$('.modal-backdrop').remove();
							vm.isSubmit = false;
							if(vm.isAudit){//如果是审核
								$location.path(url_back_shenbaoInfoList);
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
			}else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		//end#updateShenBaoInfo
		
		//begin#createShenBaoInfo 创建申报信息
		function createShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//处理项目类型、建设单位多选问题
				vm.model.shenBaoInfo.projectType=common.arrayToString(vm.projectTypes,',');
				vm.model.shenBaoInfo.constructionUnit = common.arrayToString(vm.constructionUnits,',');
				//申请资金计算
				vm.model.shenBaoInfo.applyYearInvest = common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear || 0]);
				vm.model.shenBaoInfo.applyYearInvest_LastYear = common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear || 0]);
				vm.model.shenBaoInfo.applyYearInvest_LastTwoYear = common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear || 0]);
				//安排资金计算
				vm.model.shenBaoInfo.yearInvestApproval = common.getSum([vm.model.shenBaoInfo.capitalAP_ggys_TheYear || 0,vm.model.shenBaoInfo.capitalAP_gtzj_TheYear || 0]);
				vm.model.shenBaoInfo.yearInvestApproval_lastYear = common.getSum([vm.model.shenBaoInfo.capitalAP_ggys_LastYear || 0,vm.model.shenBaoInfo.capitalAP_gtzj_LastYear || 0]);
				vm.model.shenBaoInfo.yearInvestApproval_lastTwoYear = common.getSum([vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear || 0,vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear || 0]);
				//开工时间&竣工时间的处理
				vm.model.shenBaoInfo.beginDate = (vm.model.shenBaoInfo.beginDate != '')?vm.model.shenBaoInfo.beginDate:null;
				vm.model.shenBaoInfo.endDate = (vm.model.shenBaoInfo.endDate != '')?vm.model.shenBaoInfo.endDate:null;
				var httpOptions = {
						method : 'post',
						url : url_shenbaoInfoList,
						data:vm.model.shenBaoInfo
					};
			
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"操作成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									vm.isSubmit = false;
									$location.path(url_back_shenbaoInfoList);
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
			}else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		//end#createShenBaoInfo
		
		//begin#getUserUnit
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnitInfo+"?$filter=id eq '{0}'",vm.model.shenBaoInfo.unitName)
				};
			
			var httpSuccess = function success(response) {
				//初始化项目单位信息
				vm.model.shenBaoInfo.shenBaoUnitInfoDto = response.data.value[0]||{};
				if(vm.model.shenBaoInfo.shenBaoUnitInfoDto){
					//初始化建设单位信息
					vm.constructionUnits.splice(0,vm.constructionUnits.length);//清空数组
					vm.constructionUnits.push(vm.model.shenBaoInfo.shenBaoUnitInfoDto.unitName);//添加默认的单位名称
				}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		//end#getUserUnit
		
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
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
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
					field : "name",
					title : "文件名",
					width : 550,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
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
			//处理项目类型多选、建设单位问题
			vm.model.shenBaoInfo.projectType=common.arrayToString(vm.projectTypes,',');
			vm.model.shenBaoInfo.constructionUnit=common.arrayToString(vm.constructionUnits,',');
			
			var httpOptions = {
					method : 'post',
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
		 *更新申报信息的状态 
		 */
		function updateShenBaoInfoState(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbaoInfoList+"/updateState"),
					data:vm.model
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"操作成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								vm.grid.dataSource.read();
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
					method : 'post',
					url : url_planCapital,
					data:vm.model.capital
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						getPlanById(vm);//查询计划--更新页面数据
						$('#capitalSum_'+vm.currentCapitalId).val(vm.model.capital.capitalSum);
						vm.isPopOver = false;
						vm.planGridOptions.dataSource.read();
					}
				});
				
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
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbaoInfoList + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value[0]||{};
				if(vm.shenBaoInfoEdit){//如果是编辑页面
					//年度计划申报年份处理
					vm.planYear = vm.model.shenBaoInfo.planYear;
				}
				if(vm.shenBaoInfoAdd){//如果是新增页面
					//初始化相关数据
		    		vm.model.shenBaoInfo.projectInvestmentType = vm.investmentType;//投资类型
		     		vm.model.shenBaoInfo.projectShenBaoStage = vm.stage;//申报阶段
		    		//初始化申报年份（三年滚动）
					var date = new Date();
					vm.planYear = vm.model.shenBaoInfo.planYear = parseInt(date.getFullYear()+1,10);
				}
				//没有打包类型时默认打包类型为单列项目
				vm.model.shenBaoInfo.packageType=vm.model.shenBaoInfo.packageType || common.basicDataConfig().packageType_danLie;
				//项目类型、建设单位的显示
				vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,',');
				vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
				if(vm.constructionUnits.length >1){//如果建设单位有多个则可以删除
					vm.canDelete = true;
				}else{
					vm.canDelete = false;
				}
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
				vm.model.shenBaoInfo.apInvestSum=common.toMoney(vm.model.shenBaoInfo.apInvestSum);//累计安排投资
				vm.model.shenBaoInfo.capitalAP_ggys_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_TheYear);
				vm.model.shenBaoInfo.capitalAP_gtzj_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear);
				vm.model.shenBaoInfo.capitalAP_qita=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita);
				
				vm.model.shenBaoInfo.capitalAP_gtzj_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear);
				vm.model.shenBaoInfo.capitalAP_ggys_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastYear);
				vm.model.shenBaoInfo.capitalAP_qita_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastYear);
				
				vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear);
				
			
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
					method : 'post',
					url : common.format(url_planList+"/addCapital/{0}",vm.id,ids),
					data:ids
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
				pageSize : 10,
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll_shenBaoList' type='checkbox'  class='checkbox'/>",
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }

					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format('<a href="#/projectDetails/{0}/{1}" >{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						width:300,
						filterable : false,
						headerAttributes: {
						      "class": "table-header-cell",
						      style: "text-align: center;vertical-align: middle;",
						      rowspan:2
						    }
					},					
					{
						field : "functionSubjects",
						title : "功能科目",
						width:80,
						filterable : false,
						headerAttributes: {
						      "class": "table-header-cell",
						      style: "text-align: center;vertical-align: middle;"
						    }
					},
					{
						field : "econClassSubjects",
						title : "经济分类科目",
						width:100,
						filterable : false,
						headerAttributes: {
						      "class": "table-header-cell",
						      style: "text-align: center;vertical-align: middle;"
						    }
					},
					{
						field : "projectIndustry",
						title : "行业领域",
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						width:100,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 80,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectConstrChar",
						title : "建设性质",						
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						width : 80,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "beginDate",
						title : "开工/竣工时间",
						width : 120,
						template:function(item){
							return common.format(
									(common.formatDate(item.beginDate)?common.formatDate(item.beginDate):'')+"~\n"+
									(common.formatDate(item.endDate)?common.formatDate(item.endDate):''));
						},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectGuiMo",
						title : "建设规模及主要建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.projectGuiMo || '');},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width:120,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectInvestAccuSum",
						title : "累计完成投资（万元）",
						width:120,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "apInvestSum",
						title : "累计安排资金（万元）",
						width:120,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "yearConstructionContent",
						width:200,
						title:vm.planYear+"年度建设内容",
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContent || ''); },
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						title: vm.planYear+"年资金来源及需求(万元)",
                        columns: [
                        	{
        						field : "capitalSCZ_ggys_TheYear",
        						title : "公共预算",
        						width:100,
        						filterable : false,
        						headerAttributes: {
        					      "class": "table-header-cell",
        					       style: "text-align: center;"
        					    }
        					},
        					{
        						field : "capitalSCZ_gtzj_TheYear",
        						title : "国土基金",
        						width:100,
        						filterable : false,
        						headerAttributes: {
        					      "class": "table-header-cell",
        					       style: "text-align: center;"
        					    }
        					},
        					{
        						field : "capitalSCZ_qita",
        						title : "其他",
        						width:100,
        						filterable : false,
        						headerAttributes: {
        					      "class": "table-header-cell",
        					       style: "text-align: center;"
        					    }
        					}
                        ],
                        headerAttributes: {
  					      "class": "table-header-cell",
  					       style: "text-align: center;vertical-align: middle;"
  					    }
					},
					{
						field : "yearInvestApproval",
						title : "安排资金合计",
						template :function(item){					
							return common.format($('#input').html(),item.id,item.yearInvestApproval || 0);
						},
						width:130,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						title : "安排资金（万元）",
						columns: [
							{
								field : "capitalAP_ggys_TheYear",
								title : "公共预算",
								width:130,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "capitalAP_gtzj_TheYear",
								title : "国土基金",
								width:130,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							}
						],
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "yearConstructionContentLastYear",
						title : vm.planYear+1+"年度建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastYear|| ''); },
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						title: vm.planYear+1+"年资金来源及需求(万元)",
						columns: [
							{
								field : "capitalSCZ_ggys_LastYear",
								title : "公共预算",
								width:100,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "capitalSCZ_gtzj_LastYear",
								title : "国土基金",
								width:100,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "capitalSCZ_qita_LastYear",
								title : "其他",
								width:100,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							}
						],
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "yearConstructionContentLastTwoYear",
						title : vm.planYear+2+"年度建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastTwoYear|| '');},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
                        title: vm.planYear+2+"年资金来源及需求(万元)",
                        columns: [
                        	{
                        		field: "capitalSCZ_ggys_LastTwoYear",
                        		title: "公共预算",
                        		width: 100,
                        		filterable : false,
                        		headerAttributes: {
          					      "class": "table-header-cell",
          					       style: "text-align: center;vertical-align: middle;"
          					    }
	                        },
	                        {
	                            field: "capitalSCZ_gtzj_LastTwoYear",
	                            title: "国土基金",
	                            width: 100,
	                            filterable : false,
                        		headerAttributes: {
          					      "class": "table-header-cell",
          					       style: "text-align: center;vertical-align: middle;"
          					    }
	                        },
	                        {
	                            field: "capitalSCZ_qita_LastTwoYear",
	                            title: "其他",
                            	width: 100,
                            	filterable : false,
                        		headerAttributes: {
          					      "class": "table-header-cell",
          					       style: "text-align: center;vertical-align: middle;"
          					    }
	                        }
	                    ],
	                    headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					
					{
						field : "yearConstructionContentShenBao",
						title : "备注",
						width : 150,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:10px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentShenBao|| ''); },
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					}

			];
			// End:column
			
			var excelExport = function(e) {
					var data = vm.planGrid.dataSource.data();
					var sheet = e.workbook.sheets[0];
					var template = this.columns[8].template;
					
					for(var j=0;j<data.length;j++){
						var timeFormat = template(data[j]);
						var row = sheet.rows[j+2];
						row.cells[4].value = vm.getBasicDataDesc(row.cells[4].value);
						row.cells[5].value = vm.getBasicDataDesc(row.cells[5].value);
						row.cells[6].value = vm.getBasicDataDesc(row.cells[6].value);
						row.cells[7].value = timeFormat;
					}
				  };
				  
			vm.planGridOptions = {
				excel: {
		                fileName: "年度计划编制.xlsx"
		            	},
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				scrollable:true,
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
					field : "projectIndustry",
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
						width : 80,
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width:300,
						filterable : true
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
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
			                        dataSource: vm.basicData.projectConstrChar,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						}
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						width : 120,
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource:vm.basicData.projectIndustry_ZF,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
						}
					},
					{
						field : "auditState",
						title : "审批状态",
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						width : 100,
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource:vm.basicData.auditState,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
						}
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width : 120,
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
				resizable : true,
				sortable:true,
				scrollable:true
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
					method : 'post',
					url : url_planList+'/updateYearPlan',
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
		
		/**
		 * 删除年度计划
		 */
		function plan_delete(vm,id){
			vm.isSubmit = true;
			
			var httpOptions = {
					method : 'post',
					url : url_planList+'/deleteYearPlan',
					data : id
				};
				
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功!",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									vm.gridOptions.dataSource.read();//列表数据刷新
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
					width : 200,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,"vm.deletePlan('" + item.id + "')");
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
				resizable : true,
				sortable:true,
				scrollable:true
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
					field : "projectIndustry",
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
				}],
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.yearPlanListOptions = grid.getOptions();
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
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.id,item.projectName);
						},
						width:200,
						filterable : true,
						attributes: {
					      style: "font-size: 14.5px"
					    },
					    headerAttributes: {
					      style: "text-align:center;font-size: 14.5px"
					    }
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
						filterable : true,
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 105,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 105,
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
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
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
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
		                },
		                attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 100,
						filterable : false,
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "auditState",
						title : "审核状态",
						width : 100,
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().auditState),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
//					{
//						field : "createdDate",
//						title : "创建日期",
//						width : 180,
//						filterable : false,
//						template:function(item){
//							return common.formatDateTime(item.createdDate);
//							}
//					},
					{
						filed:"",
						title:"操作",
						width:150,
						template:function(item){
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					}
			];
			// End:column
			var excelExport = function(e) {
				var data = e.data;
			    var sheet = e.workbook.sheets[0];

			    for (var i = 1; i < sheet.rows.length; i++) {
			      var row = sheet.rows[i];
			      row.cells[2].value = common.getBasicDataDesc(row.cells[2].value);//建设性质
			      row.cells[3].value = common.getBasicDataDesc(row.cells[3].value);//项目类别
			      row.cells[4].value = common.getBasicDataDesc(row.cells[4].value);//项目分类
				  row.cells[6].value = common.getBasicDataDesc(row.cells[6].value);//审核状态
				  row.cells[7].value = common.formatDateTime(row.cells[7].value);//创建日期
			    }
			  };

			  if(window.yearPlanListOptions !=null && window.yearPlanListOptions !=''){
				  vm.gridOptions = window.yearPlanListOptions;
			  }else{
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
						resizable : true,
						sortable:true,
						scrollable:true
					};
			  }
		}// end fun grid_shenbaoInfoList
	}
})();