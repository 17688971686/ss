(function () {
    'use strict';

    angular
        .module('app')
        .controller('sysConfigCtrl', sysConfig);

    sysConfig.$inject = ['$location','sysConfigSvc','$state','$scope']; 

    function sysConfig($location, sysConfigSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.model.config=[];
    	vm.model={};
    	vm.userList={};
    	vm.model.checkedButton = [];
    	vm.model.checked = false;
    	activate();
    	
        function activate() {        	
        	init_getAllTask();
        	init_getAllUser();
        	init()
        }
        
		function init(){
			sysConfigSvc.init(vm);	
			for (var int = 0; int < vm.model.taskList.length; int++) {
				
				vm.model.checkedButton[int] = true;
			
		}
				}
        
        /**
		 * 系统配置：查询所有username
		 * @return usernameList
		 */
        function init_getAllUser(){
        	sysConfigSvc.getAllUser(vm);
        }
        
        /**
		 * 系统配置：查询所有task
		 * @return taskList
		 */
        function init_getAllTask(){
        	sysConfigSvc.getAllTask(vm);
        }
        
        /**
		 * 系统配置：更新task签收人
		 * @return taskList
		 */
        vm.create = function(){
        	sysConfigSvc.createTaskUser(vm);
        }
        
        vm.checked = function(index){
        	for (var int = 0; int < vm.model.checkedButton.length; int++) {
				if(index == int)
					vm.model.checkedButton[int] = false;
			}
        }
    }    
})();
