(function(){
	'use strict';
	angular.module('app').controller('listCtrl',list);
	
	list.$inject = ['$location','$state','listSvc'];
	
	function list($location,$state,listSvc){
		var vm = this;
		vm.type= $state.params.type;
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
        	
        };//end init
		
		
		activate();
		function activate () {
			vm.init();
			listSvc.getData(vm);
		}
	}
})();