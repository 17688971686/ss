(function () {
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

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(0)").addClass("focus");
        $(".menu li a").click(function(){
            $(".menu li a").removeClass("focus");
        	$(this).addClass("focus");
		});


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
	  	   vm.getProcessStateDesc=function(str){
				return common.getProcessStateDesc(str);
				};
	  			
	  		//任务类型--申报阶段
	   	   vm.taskType_yearPlan=common.basicDataConfig().taskType_yearPlan;//下一年度计划
	   	   vm.taskType_JYS=common.basicDataConfig().taskType_JYS;//建议书
	   	   vm.taskType_KXXYJBG=common.basicDataConfig().taskType_KXXYJBG;//可行性研究报告
	   	   vm.taskType_CBSJYGS=common.basicDataConfig().taskType_CBSJYGS;//初步概算与设计
	   	   vm.taskType_qianQi=common.basicDataConfig().taskType_qianQi;//前期计划
	   	   vm.taskType_newStart=common.basicDataConfig().taskType_newStart;//新开工计划
	   	   vm.taskType_xuJian=common.basicDataConfig().taskType_xuJian;//徐建计划
	   	   vm.taskType_junGongJueSuan=common.basicDataConfig().taskType_junGongJueSuan;//竣工决算
	   	   vm.taskType_ZJSQBG=common.basicDataConfig().taskType_ZJSQBG;//资金申请报告
	   	   vm.taskType_JH=common.basicDataConfig().taskType_JH;//计划下达
	   	   vm.taskType_shenBao=[vm.taskType_JYS,vm.taskType_KXXYJBG,vm.taskType_CBSJYGS,
	   		   					vm.taskType_qianQi,vm.taskType_newStart,vm.taskType_xuJian,
	   		   					vm.taskType_junGongJueSuan,vm.taskType_yearPlan,vm.taskType_ZJSQBG,
	   		   					vm.taskType_JH];
	   	   //任务类型--月报	   	   
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
