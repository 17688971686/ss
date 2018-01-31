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
    	vm.model={};
    	vm.basicData={};
      
    	function init(){
    		if(routeName == 'statisticalAnalysis'){
    			vm.page = 'index';
    		}
    		if(routeName == 'statisticalAnalysis_edit'){
    			vm.page = 'edit';
    		}
    		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
    		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
    		vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//项目申报阶段
    		vm.basicData.userUnit=common.getUserUnits();//建设单位信息
    		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	   			.toArray();//政府投资项目行业
    		vm.basicData.approvalStage=[common.basicDataConfig().projectShenBaoStage_projectProposal,common.basicDataConfig().projectShenBaoStage_KXXYJBG,
    									common.basicDataConfig().projectShenBaoStage_CBSJYGS,common.basicDataConfig().projectShenBaoStage_capitalApplyReport];
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
        }//end fun index
        
        function edit(){
        	vm.model.industry=[],vm.model.unit=[],vm.model.stage=[],vm.model.category=[];
        	//项目阶段选择框点击事件
        	vm.selectProjectStage=function(id){
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
        	}
        	if(vm.what=='isApprovalCustom'){
        		vm.isApprovalCustom=true;
        		vm.title="审批类自定义条件类";
        		
        		vm.exportExcelForApprovalByCustom=function(){
        			statisticalAnalysisSvc.exportExcelForApprovalByCustom(vm);
        		};
        	}
        	/******计划类******/
        	if(vm.what == 'isPlanFixed'){
        		vm.isPlanFixed=true;
        		vm.title="计划类固定模板类";
        		var now = new Date();
        		vm.pifuDate=now.getFullYear();//初始化
        	}
        	if(vm.what == 'isPlanCustom'){
        		vm.isPlanCustom=true;
        		vm.title="计划类自定义类";
        		
        		vm.exportExcelForPlanByCustom=function(){
        			statisticalAnalysisSvc.exportExcelForPlanByCustom(vm);
        		};
        	}
        	/******项目总库******/
        	if(vm.what == 'isProjectFixed'){
        		vm.isProjectFixed=true;
        		vm.title="项目总库固定模板类";
        		vm.isIncludLibrary="true";//初始化
        	}
        	if(vm.what == 'isProjectCustom'){
        		vm.isProjectCustom=true;
        		vm.title="项目总库自定义条件类";
        		
        		vm.exportExcelForProjectByCustom=function(){
        			statisticalAnalysisSvc.exportExcelForProjectByCustom(vm);
        		};
        	}
        };
    }
})();
