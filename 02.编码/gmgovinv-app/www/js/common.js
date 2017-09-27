(function(){
	
	var common = {
		buildFilter:buildFilter,
		arrayToString:arrayToString,
		basicDataConfig:basicDataConfig,
		format:format//字符串格式化
	};
	
	
	/**
	 * build odata query
	 * */
	function buildFilter(oDataItems){
		if(!oDataItems||!oDataItems instanceof Array){
			return '';
		}
		
		var $fileter = [];
		for(var i = 0;i<oDataItems.length;i++){
			var item = oDataItems[i];
			var filterStr = item.name + ' '+item.operator;
			var dataType = item.dataType;
			if(dataType&&(dataType == 'int'||dataType == 'boolean')){
				filterStr += ' '+item.value;
			}else{
				filterStr += " '"+item.value+"'";
			}
			$fileter.push(filterStr);
		}
		return $fileter.join(' and ');
		
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
    		taskType_shenBao:"taskType_4",//任务状态-申报端口
    		taskType_JYS:"taskType_5",//项目建议书
    		taskType_KXXYJBG:"taskType_6",//可行性研究报告
    		taskType_CBSJYGS:"taskType_7",//初步概算与设计
    		taskType_qianQi:"taskType_8",//前期
    		taskType_newStart:"taskType_9",//新开工
    		taskType_xuJian:"taskType_10",//续建
    		
    		auditState:"auditState",//审核状态
    		auditState_noAudit:"auditState_1",//审核状态-未审核
    		auditState_auditPass:"auditState_2",//审核状态-审核通过
    		auditState_auditNotPass:"auditState_3",//审核状态-审核不通过
    			
    		management:"管理员",
    			
    	    credentialsType:"credentialsType",
    	    serviceRating:"serviceRating"
    		
    		
    	};
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
	window.common = common;
	
})();
