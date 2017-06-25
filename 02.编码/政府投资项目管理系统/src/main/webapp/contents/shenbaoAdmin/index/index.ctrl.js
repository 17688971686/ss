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
        
        if($state.current.name=='task_records'){
        	vm.page='recordList';
        }
        
        
       function init(){
    	   
    	   
       }
       vm.formatDate=function(str){
  			return common.formatDate(str);
  			}
   	   vm.getBasicDataDesc=function(str){
  			return common.getBasicDataDesc(str);
  			}
   	   if(vm.page == 'recordList'){
   		   init_taskRecord();
   	   }
   	   indexSvc.getTaskRecords(vm);
   	   indexSvc.getUnitShenBaoInfos(vm);
       
        activate();
        function activate() {
        	init();
        }
    }
})();
