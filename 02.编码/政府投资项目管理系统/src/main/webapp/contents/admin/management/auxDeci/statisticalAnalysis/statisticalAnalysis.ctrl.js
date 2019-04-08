(function () {
    'use strict';

    angular
        .module('app')
        .controller('statisticalAnalysisCtrl', statisticalAnalysis);

    statisticalAnalysis.$inject = ['$location','statisticalAnalysisSvc','$state','$scope']; 

    function statisticalAnalysis($location, statisticalAnalysisSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	var routeName = $state.current.name;
    	vm.what = $state.params.what;
    	vm.type = $state.params.type;
    	vm.parameter = $state.params.parameter;
    	vm.model={};
    	vm.basicData={};
      
    	function init(){
    		if(routeName == 'statisticalAnalysis'){
    			vm.page = 'index';
    		}
    		if(routeName == 'statisticalAnalysis_edit'){
    			vm.page = 'edit';
    		}
    		if(routeName == 'statisticalAnalysis_show'){
    			vm.page = 'show';
    		}
    		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
    		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
    		vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//项目申报阶段
    		vm.basicData.userUnit=common.getUserUnits();//建设单位信息
    		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	   			.toArray();//政府投资项目行业
    		vm.basicData.approvalStage=[
                common.basicDataConfig().projectShenBaoStage_KXXYJBG,
                common.basicDataConfig().projectShenBaoStage_CBSJYGS,
                common.basicDataConfig().projectShenBaoStage_capitalApplyReport,
                common.basicDataConfig().projectShenBaoStage_nextYearPlan,
                common.basicDataConfig().projectShenBaoStage_soucijihuaxiada];
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    	}//end fun init
        
  
        activate();
        function activate() {
        	init();
        	if(vm.page == 'index'){
        		index();
        	}
        	if(vm.page == 'edit'){
        		edit();
        	}
        	if(vm.page == 'show'){
        		show();
        	}
        }
        
        function init_chart(){
        	vm.projectByHYChart = echarts.init(document.getElementById('projectByHY'));
        	vm.projectInvestSourceChart = echarts.init(document.getElementById('projectInvestSource'));
        	vm.yearPlanByHYChart = echarts.init(document.getElementById('yearPlanByHY'));
        	vm.yearPlanInvestSourceChart = echarts.init(document.getElementById('yearPlanInvestSource'));
        	
        	vm.projectByHYChart.showLoading({text : "图表数据正在努力加载..."});
        	vm.projectInvestSourceChart.showLoading({text : "图表数据正在努力加载..."});
        	vm.yearPlanByHYChart.showLoading({text : "图表数据正在努力加载..."});
        	vm.yearPlanInvestSourceChart.showLoading({text : "图表数据正在努力加载..."});
        	
        	var app ={};
        	app.config = {
        	    rotate: 90,
        	    align: 'left',
        	    verticalAlign: 'middle',
        	    position: 'insideBottom',
        	    distance: 15
        	};

        	var labelOption = {
        	    normal: {
        	        show: true,
        	        position: app.config.position,
        	        distance: app.config.distance,
        	        align: app.config.align,
        	        verticalAlign: app.config.verticalAlign,
        	        rotate: app.config.rotate,
        	        formatter: '{c}  {name|{a}}',
        	        fontSize: 16,
        	        rich: {
        	            name: {
        	                textBorderColor: '#fff'
        	            }
        	        }
        	    }
        	};
        	//项目库项目投资行业分布图
        	vm.projectByHYChart.setOption({
        		color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        		title:{
        			text:'项目库项目投资行业分布图',
        			x:'center',
        			y:'top'
        		},
        		tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    legend: {
			    	x:'center',
			    	y:'bottom',
			        data: ["总投资","累计下达"]
			    },
			    toolbox: {
			        show: true,
			        feature: {
			        	dataView : {show: true, readOnly: false},
		                magicType : {
		                    show: true,
		                    type: ['line', 'bar']
		                },
		                restore : {show: true},
		                saveAsImage : {show: true}
			        }
			    },
			    calculable: true,
			    xAxis: {
			        name: '行业',
			        axisLabel: {  
	                    interval: 0,
	                    formatter:function(value){ 
	                        var ret = "";//拼接加\n返回的类目项  
	                        var maxLength = 2;//每项显示文字个数  
	                        var valLength = value.length;//X轴类目项的文字个数  
	                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
	                        if (rowN > 1)//如果类目项的文字大于3,  
	                        {  
	                            for (var i = 0; i < rowN; i++) {  
	                                var temp = "";//每次截取的字符串  
	                                var start = i * maxLength;//开始截取的位置  
	                                var end = start + maxLength;//结束截取的位置  
	                                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
	                                temp = value.substring(start, end) + "\n";  
	                                ret += temp; //凭借最终的字符串  
	                            }  
	                            return ret;  
	                        }  
	                        else {  
	                            return value;  
	                        }  
	                    }
			        },
			        data:[]
			    },
			    yAxis: {
			    	name:'资金/万元',
			    	type: 'value'
			    },
			    series: [
			        {
		                name: '总投资',
		                type: 'bar',
		                barGap: 0,
		                //label: labelOption,
		                data: []
			        },
			        {
		                name: '累计下达',
		                type: 'bar',
		                barGap: 0,
		                //label: labelOption,
		                data: []
			        } 
			    ]
        	});
        	//项目库项目投资来源分布图
        	vm.projectInvestSourceChart.setOption({
			    title: {//标题 
	                text: '项目库项目投资来源分布图',
	                subtext:'单位：万元',
	                x: 'center',
	                y:'top'
	    		  },
	    		 tooltip: {
	    		        trigger: 'item',
	    		        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    		    },
    		    legend: {
    		        orient: 'vertical',
    		        x: 'right',
    		        y:'bottom',
    		        data:['市财政-公共预算','市财政-国土资金','市财政-专项资金','市财政-公共预算','市财政-国土资金','中央预算','社会投资','其他']
    		    },
                 series: [
                     {
                         name: '投资来源',
                         type: 'pie',//此属性代表的是图形的样式为饼状
                         roseType: 'angle',//此属性将图形显示成南丁格尔图（有半径区分）
                         center: ['50%', '60%'],//这个属性是指图形所在位置
 		                 radius: ['5%', '60%'],//这个属性是指图形所占div区域为60%，空心圆占5%
                         itemStyle: {//此属性是给图形添加阴影、透明度、颜色、边框颜色、边框宽度
                             normal: {//此属性是指常态下的图形阴影
                            	 textStyle: {
 		                            color: '#FA8072'
 		                        }
                             },
                             emphasis: {//此属性是指鼠标 hover 时候的高亮阴影样式
                                 shadowBlur: 200,
                                 shadowColor: 'rgba(255, 255, 255, 255)',
                                 textStyle:{
    		                           color:'rgba(30,20,200,100)'
    		                       }
                             }

                         },
                         label: {//每个系列分别设置，每个系列的文本设置
                             normal: {//此属性是指常态下的文本设置
                                 textStyle: {
                                	 color: '#FA8072'
                                 }
                             },
                             emphasis:{//此属性是指鼠标 hover 时候高亮文本设置
                                textStyle:{
                                    color:'rgba(30,20,200,100)'
                                }
                             }
                         },
                         labelLine: {//每个系列分别设置，每个系列引导线的颜色设置
                             normal: {//此属性是指常态下的引导线的颜色设置
                                 lineStyle: {
                                	 color: '#FA8072'
                                 }
                             },
                             emphasis:{//此属性是指鼠标 hover 时候高亮引导线的颜色设置
                                 lineStyle:{
                                	 color:'rgba(30,20,200,100)',
                                 }
                             }
                         },
                         data: []
                     }
                 ]
        	});
        	//年度计划项目统计分析
        	vm.yearPlanByHYChart.setOption({
        		color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        		title:{
        			text:'年度计划项目投资行业分布图',
        			x:'center',
        			y:'top'
        		},
        		tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    legend: {
			    	x:'center',
			    	y:'bottom',
			        data: ["总投资","累计下达","安排资金"]
			    },
			    toolbox: {
			        show: true,
			        feature: {
			        	dataView : {show: true, readOnly: false},
		                magicType : {
		                    show: true,
		                    type: ['line', 'bar']
		                },
		                restore : {show: true},
		                saveAsImage : {show: true}
			        }
			    },
			    calculable: true,
			    xAxis: {
			        name: '行业',
			        axisLabel: {  
	                    interval: 0,
	                    formatter:function(value){ 
	                        var ret = "";//拼接加\n返回的类目项  
	                        var maxLength = 2;//每项显示文字个数  
	                        var valLength = value.length;//X轴类目项的文字个数  
	                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
	                        if (rowN > 1)//如果类目项的文字大于3,  
	                        {  
	                            for (var i = 0; i < rowN; i++) {  
	                                var temp = "";//每次截取的字符串  
	                                var start = i * maxLength;//开始截取的位置  
	                                var end = start + maxLength;//结束截取的位置  
	                                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
	                                temp = value.substring(start, end) + "\n";  
	                                ret += temp; //凭借最终的字符串  
	                            }  
	                            return ret;  
	                        }  
	                        else {  
	                            return value;  
	                        }  
	                    }
			        },
			        data:[]
			    },
			    yAxis: {
			    	name:'资金/万元',
			    	type: 'value'
			    },
			    series: [
			        {
		                name: '总投资',
		                type: 'bar',
		                barGap: 0,
		                //label: labelOption,
		                data: []
			        },
			        {
		                name: '累计下达',
		                type: 'bar',
		                barGap: 0,
		                //label: labelOption,
		                data: []
			        },
			        {
		                name: '安排资金',
		                type: 'bar',
		                barGap: 0,
		                //label: labelOption,
		                data: []
			        }
			    ]
        	});
        	//年度计划项目投资来源分布图
        	vm.yearPlanInvestSourceChart.setOption({
			    title: {//标题 
	                text: '年度计划项目投资来源分布图',
	                subtext:'单位：万元',
	                x: 'center',
	                y:'top'
	    		  },
	    		 tooltip: {
	    		        trigger: 'item',
	    		        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    		    },
    		    legend: {
    		        orient: 'vertical',
    		        x: 'right',
    		        y:'bottom',
    		        data:['市财政-公共预算','市财政-国土资金','市财政-专项资金','市财政-公共预算','市财政-国土资金','中央预算','社会投资','其他']
    		    },
                 series: [
                     {
                         name: '投资来源',
                         type: 'pie',//此属性代表的是图形的样式为饼状
                         roseType: 'angle',//此属性将图形显示成南丁格尔图（有半径区分）
                         center: ['50%', '60%'],//这个属性是指图形所在位置
 		                 radius: ['5%', '60%'],//这个属性是指图形所占div区域为60%，空心圆占5%
                         itemStyle: {//此属性是给图形添加阴影、透明度、颜色、边框颜色、边框宽度
                             normal: {//此属性是指常态下的图形阴影
                            	 textStyle: {
 		                            color: '#FA8072'
 		                        }
                             },
                             emphasis: {//此属性是指鼠标 hover 时候的高亮阴影样式
                                 shadowBlur: 200,
                                 shadowColor: 'rgba(255, 255, 255, 255)',
                                 textStyle:{
    		                           color:'rgba(30,20,200,100)'
    		                       }
                             }

                         },
                         label: {//每个系列分别设置，每个系列的文本设置
                             normal: {//此属性是指常态下的文本设置
                                 textStyle: {
                                	 color: '#FA8072'
                                 }
                             },
                             emphasis:{//此属性是指鼠标 hover 时候高亮文本设置
                                textStyle:{
                                    color:'rgba(30,20,200,100)'
                                }
                             }
                         },
                         labelLine: {//每个系列分别设置，每个系列引导线的颜色设置
                             normal: {//此属性是指常态下的引导线的颜色设置
                                 lineStyle: {
                                	 color: '#FA8072'
                                 }
                             },
                             emphasis:{//此属性是指鼠标 hover 时候高亮引导线的颜色设置
                                 lineStyle:{
                                	 color:'rgba(30,20,200,100)',
                                 }
                             }
                         },
                         data: []
                     }
                 ]
        	});
        }//end fun init_chart
        
        function init_data(){
        	statisticalAnalysisSvc.getprojectByHYData(vm);
        	statisticalAnalysisSvc.getprojectInvestSourceData(vm);
        	statisticalAnalysisSvc.getyearPlanByHYData(vm);
        	statisticalAnalysisSvc.getyearPlanInvestSourceData(vm);
        }//end fun init_data
        
        function index(){
        	//init_chart();
        	//init_data();
        	vm.showApprovalFixedTemplate=function(){
        		location.href="#/statisticalAnalysis_edit/isApprovalFixed";
        	};
        	
        	vm.showApprovalCustomTemplate=function(){
        		location.href="#/statisticalAnalysis_edit/isApprovalCustom";
        	};
        	
        	vm.showPlanFixedTemplate=function(){
        		location.href="#/statisticalAnalysis_edit/isPlanFixed";
        	};
        	
        	vm.showPlanCustomTemplate=function(){
        		location.href="#/statisticalAnalysis_edit/isPlanCustom";
        	};
        	
        	vm.showProjectFixedTemplate=function(){
        		location.href="#/statisticalAnalysis_edit/isProjectFixed";
        	};
        	
        	vm.showProjectCustomTemplate=function(){
        		location.href="#/statisticalAnalysis_edit/isProjectCustom";
        	};

            vm.showMoneyFixedTemplate=function () {
                location.href="#/statisticalAnalysis_edit/isMoneyFixed";
            };
        }//end fun index
        
        function edit(){
        	vm.model.industry=[],vm.model.unit=[],vm.model.stage=[],vm.model.projectStage=[],vm.model.category=[];
        	//项目阶段选择框点击事件
        	vm.selectProjectStage=function(id){
    			var indexStage = vm.model.projectStage.indexOf(id);
	        	if(indexStage == -1){
	        		vm.model.projectStage.push(id);
		       	}else{
		       		vm.model.projectStage.splice(index,1);
		       	}
    		};
            //项目阶段选择框点击事件
            vm.selectShenBaoStage=function(id){
                var indexStage = vm.model.stage.indexOf(id);
                if(indexStage == -1){
                    vm.model.stage.push(id);
                }else{
                    vm.model.stage.splice(index,1);
                }
            };
    		//项目类别选择框点击事件
    		vm.selectProjectCategory=function(id){
    			var indexCategory = vm.model.category.indexOf(id);
	        	if(indexCategory == -1){
	        		vm.model.category.push(id);
		       	}else{
		       		vm.model.category.splice(index,1);
		       	}
    		};
    		//项目单位选择框点击事件
    		vm.selectProjectUnit=function(id){
    			var indexUnit = vm.model.unit.indexOf(id);
	        	if(indexUnit == -1){
	        		vm.model.unit.push(id);
		       	}else{
		       		vm.model.unit.splice(index,1);
		       	}
    		};
    		//项目行业选择框点击事件
    		vm.selectProjectIdustry=function(id){
    			var indexIndustry = vm.model.industry.indexOf(id);
	        	if(indexIndustry == -1){
	        		vm.model.industry.push(id);
		       	}else{
		       		vm.model.industry.splice(index,1);
		       	}
    		};
    		
    		/******审批类******/
        	if(vm.what=='isApprovalFixed'){
        		vm.isApprovalFixed=true;
        		vm.title="审批类固定模板类";
        		var now = new Date();
        		vm.pifuDate=now.getFullYear();//初始化
        		
        		vm.showApprovalFixed=function(type,planYear){
        			//跳转页面
        			$state.go('statisticalAnalysis_show',{what: vm.what,type:type,parameter:planYear});
        		};
        	}
        	if(vm.what=='isApprovalCustom'){
        		vm.isApprovalCustom=true;
        		vm.title="审批类自定义条件类";
        		
        		vm.showApprovalCustomData=function(){
        			//批复时间(没有填写、填写之后删除、结束时间小于开始时间(有验证))
        			vm.model.pifuDateBegin=vm.pifuDateBegin==undefined?"":vm.pifuDateBegin.toString();
        			vm.model.pifuDateEnd=vm.pifuDateEnd==undefined?"":vm.pifuDateEnd.toString();
        			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
        			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
        			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
        			//项目名称
        			vm.model.projectName=vm.model.projectName==undefined?"":vm.model.projectName.toString();
        			//多选
        			vm.model.industry=vm.model.industry.length>0?vm.model.industry:"";
        			vm.model.stage=vm.model.stage.length>0?vm.model.stage:"";
        			vm.model.unit=vm.model.unit.length>0?vm.model.unit:"";
        			var queryParams=[];
        			queryParams.push(vm.model);//查询参数的封装
        			//跳转页面
        			$state.go('statisticalAnalysis_show',{what: vm.what,parameter:queryParams});
        		};
        	}
        	/******计划类******/
        	if(vm.what == 'isPlanFixed'){
        		vm.isPlanFixed=true;
        		vm.title="计划类固定模板类";
        		var now = new Date();
        		vm.pifuDate=now.getFullYear();//初始化
        		
        		vm.showPlanFixed=function(type,planYear){
        			//跳转页面
        			$state.go('statisticalAnalysis_show',{what: vm.what,type:type,parameter:planYear});
        		};
        	}
        	if(vm.what == 'isPlanCustom'){
        		vm.isPlanCustom=true;
        		vm.title="计划类自定义类";
        		
        		vm.showPlanCustomData=function(){
        			//计划下达时间(没有填写、填写之后删除、结束时间小于开始时间(有验证))
        			vm.model.planYearBegin=vm.planYearBegin==undefined?"":vm.planYearBegin.toString();
        			vm.model.planYearEnd=vm.planYearEnd==undefined?"":vm.planYearEnd.toString();
        			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
        			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
        			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
        			//下达资金范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
        			vm.model.projectApPlanReachSumBegin=vm.projectApPlanReachSumBegin==undefined?"":vm.projectApPlanReachSumBegin.toString();
        			vm.model.projectApPlanReachSumEnd=vm.projectApPlanReachSumEnd==undefined?"":vm.projectApPlanReachSumEnd.toString();
        			//项目名称
        			vm.model.projectName=vm.model.projectName==undefined?"":vm.model.projectName.toString();
        			//多选
        			vm.model.industry=vm.model.industry.length>0?vm.model.industry:"";
        			vm.model.stage=vm.model.stage.length>0?vm.model.stage:"";
        			vm.model.unit=vm.model.unit.length>0?vm.model.unit:"";
        			var queryParams=[];
        			queryParams.push(vm.model);//查询参数的封装
        			//跳转页面
        			$state.go('statisticalAnalysis_show',{what: vm.what,parameter:queryParams});
        		};
        	}
        	/******项目总库******/
        	if(vm.what == 'isProjectFixed'){
        		vm.isProjectFixed=true;
        		vm.title="项目总库固定模板类";
        		vm.isIncludLibrary="true";//初始化
        		
        		vm.showProjectFixed=function(type,isIncludLibrary){
        			//跳转页面
        			$state.go('statisticalAnalysis_show',{what: vm.what,type:type,parameter:isIncludLibrary});
        		};
        	}
        	if(vm.what == 'isProjectCustom'){
        		vm.isProjectCustom=true;
        		vm.title="项目总库自定义条件类";
        		
        		vm.showProjectCustomData=function(){
        			//总投资范围（没有填写、填写之后删除、结束范围小于开始范围（有验证））
        			vm.model.projectInvestSumBegin=vm.projectInvestSumBegin==undefined?"":vm.projectInvestSumBegin.toString();
        			vm.model.projectInvestSumEnd=vm.projectInvestSumEnd==undefined?"":vm.projectInvestSumEnd.toString();
        			//项目名称
        			vm.model.projectName=vm.model.projectName==undefined?"":vm.model.projectName.toString();
        			//多选
        			vm.model.industry=vm.model.industry.length>0?vm.model.industry:"";
        			vm.model.category=vm.model.category.length>0?vm.model.category:"";
        			vm.model.stage=vm.model.stage.length>0?vm.model.stage:"";
        			vm.model.unit=vm.model.unit.length>0?vm.model.unit:"";
        			var queryParams=[];
        			queryParams.push(vm.model);//查询参数的封装
        			//跳转页面
        			$state.go('statisticalAnalysis_show',{what: vm.what,parameter:queryParams});
        		};
        	}

            /******项目资金******/
            if(vm.what == 'isMoneyFixed'){
                vm.isMoneyFixed=true;
                vm.title="项目资金统计";
                vm.isIncludLibrary="true";//初始化

                vm.showMoneyFixed=function(type,isIncludLibrary){
                    //项目名称
                    vm.model.projectName=vm.model.projectName==undefined?"":vm.model.projectName.toString();
                    //是否纳入项目库
					vm.model.isIncludLibrary = isIncludLibrary;
                    //多选
                    vm.model.stage=vm.model.stage.length>0?vm.model.stage:"";
                    vm.model.projectStage=vm.model.projectStage.length>0?vm.model.projectStage:"";
                    vm.model.unit=vm.model.unit.length>0?vm.model.unit:"";
                    vm.model.industry=vm.model.industry.length>0?vm.model.industry:"";
                    vm.model.category=vm.model.category.length>0?vm.model.category:"";
                    var queryParams=[];
                    queryParams.push(vm.model);//查询参数的封装
                    //跳转页面
                    $state.go('statisticalAnalysis_show',{what: vm.what,type:type,parameter:queryParams});
                };
            }

        }//end fun edit
        
        function show(){
        	var nowDate=new Date();
        	vm.nowDate = nowDate.getFullYear()+"年"+(nowDate.getMonth()+1)+"月"+nowDate.getDate()+"日";
        	//打印
        	vm.print=function(){
        		var id;
        		switch(vm.what){
	        		case 'isProjectFixed':
	        			id=vm.type=='unit'?'isProjectFixedByUnitShow':
	        				vm.type=='category'?'isProjectFixedByCategoryShow':
	        					vm.type=='industry'?'isProjectFixedByIndustryShow':
	        						vm.type=='stage'?'isProjectFixedByStageShow':null;
	    				break;
	    			case 'isPlanFixed':
	    				id=vm.type=='industry'?'isPlanFixedByIndustryShow':
	    					vm.type=='unit'?'isPlanFixedByUnitShow':
	    						vm.type=='plan'?'isPlanFixedByPlanShow':null;
	    				break;
	    			case 'isApprovalFixed':
	    				id=vm.type=='industry'?'isApprovalFixedByIndustryShow':
	    					vm.type=='unit'?'isApprovalFixedByUnitShow':
	    						vm.type=='approval'?'isApprovalFixedByApprovalShow':null;
	    				break;
					case 'isMoneyFixed':
						id="isMoneyFixedShow";
						break;
	    			case 'isApprovalCustom':
	    				id="isApprovalCustomShow";
	    				break;
	    			case 'isPlanCustom':
	    				id="isPlanCustomShow";
	    				break;
	    			case 'isProjectCustom':
	    				id="isProjectCustomShow";
	    				break;
	    			default:
						break;
        		};
        		$("#"+id).printThis({
          	        debug: false,
          	        importCSS: true,       // import page CSS
          	      	importStyle: true,    // import style tags
          	        printContainer: true,
          	        removeInline: false,
          	        printDelay: 333,
          	        header: null,
          	        formValues: true
          	      });
        	};
        	//下载
        	vm.save=function(){
        		switch(vm.what){
        			case 'isProjectFixed':
        				location.href=common.format("/management/auxDeci/statisticalAnalysis/exportExcelForProject?classDesc={0}&isIncludLibrary={1}",vm.type,vm.parameter);
        				break;
        			case 'isPlanFixed':
        				location.href=common.format("/management/auxDeci/statisticalAnalysis/exportExcelForPlan?classDesc={0}&planYear={1}",vm.type,vm.parameter);
        				break;
        			case 'isApprovalFixed':
        				location.href=common.format("/management/auxDeci/statisticalAnalysis/exportExcelForApproval?classDesc={0}&approvalYear={1}",vm.type,vm.parameter);
        				break;
                    case 'isMoneyFixed':
                        statisticalAnalysisSvc.exportExcelForMoneyByCondition(vm);
                        break;
        			case 'isApprovalCustom':
            			statisticalAnalysisSvc.exportExcelForApprovalByCustom(vm);
            			break;
        			case 'isPlanCustom':
        				statisticalAnalysisSvc.exportExcelForPlanByCustom(vm);
        				break;
        			case 'isProjectCustom':
        				statisticalAnalysisSvc.exportExcelForProjectByCustom(vm);
        				break;
    				default:break;
        		};
        	};
        	//post请求下载文件
    		/**
    		 * options：{
    		 * 	url：请求地址
    		 *  method：请求方法
    		 *  data：请求数据
    		 * }
    		 */
    		vm.postDownLoadFile = function (options) {
    		    var config = $.extend(true, { method: 'post' }, options);
    		    var $iframe = $('<iframe id="down-file-iframe" />');
    		    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    		    $form.attr('action', config.url);
    		    for (var key in config.data) {
    		        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    		    }
    		    $iframe.append($form);
    		    $(document.body).append($iframe);
    		    $form[0].submit();
    		    $iframe.remove();
    		}
        	switch (vm.what){
        		case 'isApprovalFixed':
        			vm.title='审批类固定模板类';
        			vm.isApprovalFixedShow=true;
        			statisticalAnalysisSvc.getApprovalFixedData(vm);
        			
        			switch (vm.type){
	        			case 'industry':
	        				vm.subTitle='按项目行业分类统计数据展示';
	        				vm.isApprovalFixedByIndustryShow=true;
	        				break;
	        			case 'unit':
	        				vm.subTitle='按申报单位分类统计数据展示';
        					vm.isApprovalFixedByUnitShow=true;
	        				break;
	        			case 'approval':
	        				vm.subTitle='按审批阶段分类统计数据展示';
    						vm.isApprovalFixedByApprovalShow=true;
	        				break;
	        			default:
	    					break;
        			};
        			break;
        		case 'isPlanFixed':
        			vm.title='计划类固定模板类';
        			vm.isPlanFixedShow=true;
        			statisticalAnalysisSvc.getPlanFixedData(vm);
        			switch(vm.type){
	        			case 'industry':
	        				vm.subTitle='按项目单位分类统计数据展示';
	        				vm.isPlanFixedByIndustryShow=true;
	        				break;
	        			case 'unit':
	        				vm.subTitle='按项目单位分类统计数据展示';
	        				vm.isPlanFixedByUnitShow=true;
	        				break;
	        			case 'plan':
	        				vm.subTitle='按计划类型分类统计数据展示';
	        				vm.isPlanFixedByPlanShow=true;
	        				break;
	        			default:
	    					break;
        			};
        			break;
        		case 'isProjectFixed':
					vm.title='项目总库固定模板类';
					vm.isProjectFixedShow=true;
					if(vm.parameter=='true'){
		        		vm.fileTitle='已纳入项目库';
		        	}else if(vm.parameter=='false'){
		        		vm.fileTitle='未纳入项目库';
		        	}
					statisticalAnalysisSvc.getProjectFixedData(vm);
					switch(vm.type){
						case 'unit':
							vm.subTitle='按项目单位分类统计数据展示';
							vm.isProjectFixedByUnitShow=true;
							break;
						case 'category':
							vm.subTitle='按项目类别分类统计数据展示';
        					vm.isProjectFixedByCategoryShow=true;
        					break;
        				case 'industry':
        					vm.subTitle='按项目行业分类统计数据展示';
        					vm.isProjectFixedByIndustryShow=true;
        					break;
        				case 'stage':
        					vm.subTitle='按项目阶段分类统计数据展示';
        					vm.isProjectFixedByStageShow=true;
        					break;
						default:
	    					break;	
					};
					break;
				case 'isMoneyFixed':
                    vm.title='项目资金统计';
                    vm.isMoneyFixedShow=true;
                    vm.model = vm.parameter[0];

                    if(vm.model.isIncludLibrary == 'true'){
                        vm.fileTitle='已纳入项目库';
                    }else if(vm.model.isIncludLibrary == 'false'){
                        vm.fileTitle='未纳入项目库';
                    }
                    vm.subTitle='项目资金统计数据展示';
                    statisticalAnalysisSvc.getMoneyFixedData(vm);
					break;
				case 'isProjectCustom':
					vm.title='项目总库自定义条件类';
					vm.subTitle='数据展示';
					vm.isProjectCustomShow=true;
					vm.model=vm.parameter[0];
					statisticalAnalysisSvc.getProjectCustomData(vm);
					break;
				case 'isApprovalCustom':
					vm.title='审批类自定义条件';
					vm.subTitle='数据展示';
					vm.isApprovalCustomShow=true;
					vm.model=vm.parameter[0];
					statisticalAnalysisSvc.getApprovalCustomData(vm);
					break;
				case 'isPlanCustom':
					vm.title='计划类自定义条件';
					vm.subTitle='数据展示';
					vm.isPlanCustomShow=true;
					vm.model=vm.parameter[0];
					statisticalAnalysisSvc.getPlanCustomData(vm);
					break;
				default:
					break;
        	};
        }//end fun show
    }
})();
