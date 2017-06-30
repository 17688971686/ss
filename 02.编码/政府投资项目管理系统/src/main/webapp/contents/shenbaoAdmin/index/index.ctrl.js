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
        
        //任务流程列表
        if($state.current.name=='task_records'){
        	vm.page='recordList';
        }
        if($state.current.name=='accountPwd'){
        	vm.page='changePwd';
        }
                
       function init(){       	          
	       vm.formatDate=function(str){
	  			return common.formatDate(str);
	  			};
	       vm.formatDateTime=function(str){
	  			return common.formatDateTime(str);
	  			};
	   	   vm.getBasicDataDesc=function(str){
	  			return common.getBasicDataDesc(str);
	  			};
	   	  vm.changePwd = function(){
        	 indexSvc.changePwd(vm);         
	   	  		};
	   	   vm.taskType_yearPlan=common.basicDataConfig().taskType_yearPlan;
	   	   vm.taskType_monthReport=common.basicDataConfig().taskType_monthReport;	   	   
	   	   if(vm.page == 'recordList'){
	   		   init_taskRecord();
	   	   }
	   	   if(vm.page=='index'){
	   		indexSvc.getTaskRecords(vm);//获取最新动态
		   	   indexSvc.getUnitShenBaoInfos(vm);//获取单位申报信息 
	   	   }	   	   
       }
       
       function init_taskRecord(){
    	   indexSvc.taskRecordList(vm);
       }
              
        activate();
        function activate() {
        	init();
        }
    }
})();
