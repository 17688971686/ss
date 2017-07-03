(function(){
	'use strict';
	angular.module('app').controller('detailsCtrl',details);
	
	details.$inject = ['$location','$state','detailsSvc'];
	
	function details($location,$state,detailsSvc){
		var vm = this;
		var id = $state.params.id;
		vm.type=$state.params.type;
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
			detailsSvc.getById(vm,id);
			vm.init();
		}
	}
})();