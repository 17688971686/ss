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
        vm.page="index";
                       
       function init(){
    	   //任务流程列表
           if($state.current.name=='task_records'){
           	vm.page='recordList';
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
        	if(vm.page == 'recordList'){
        		page_taskRecord();
 	   	   	}
        	if(vm.page == 'changePwd'){
        		page_changePwd();
        	}
        }
        
       function page_index(){
    	   indexSvc.getTaskRecords(vm);//获取最新动态
		   indexSvc.getUnitShenBaoInfos(vm);//获取单位申报信息
       }
       
       function page_taskRecord(){
    	   indexSvc.taskRecordList(vm);//获取当前用户的动态
       }
       
       function page_changePwd(){
    	   indexSvc.changePwd(vm);//修改密码
       }
    }
})();
