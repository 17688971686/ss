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
	   	   vm.taskType_JYS = common.basicDataConfig().taskType_JYS;
	   	   vm.taskType_KXXYJBG=common.basicDataConfig().taskType_KXXYJBG;
	   	   vm.taskType_CBSJYGS = common.basicDataConfig().taskType_CBSJYGS;
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
