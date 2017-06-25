(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', index);

    index.$inject = ['$location','indexSvc']; 

    function index($location , indexSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};
        
       function init(){
    	   vm.formatDate=function(str){
   			return common.formatDate(str);
   			}
    	   vm.getBasicDataDesc=function(str){
   			return common.getBasicDataDesc(str);
   		}
    	   indexSvc.getTaskRecords(vm);
    	   indexSvc.getUnitShenBaoInfos(vm);
    	   
       }
       
        activate();
        function activate() {
        	init();
        }
    }
})();
