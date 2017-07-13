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
    	vm.model.checkedButton = [];
    	activate();
    	
        function activate() {        	
        	init_getAllTask();
        	init_getAllUser();
        	init();
        }
        
		/**
		 * 初始化任务签收人
		 */
		function init(){
			sysConfigSvc.getSysConfigs(vm);	
			for (var i = 0; i < vm.model.taskList.length; i++) {
				vm.model.checkedButton[i] = true;
			}
			
			//修改按钮
			vm.checked = function(index){
				//设置修改按钮隐藏、下拉选显示
	        	for (var i = 0; i < vm.model.checkedButton.length; i++) {
					if(index == i)
						vm.model.checkedButton[i] = false;
				}
	        };
			//下拉选发生变化
			 vm.userChange = function(index,userName){
				 vm.model.taskList[index].taskUser = userName;
				 //设置确认按钮可操作
				 vm.hasChange = true
			 };
			//系统配置：更新
			 vm.create = function(){
	        	sysConfigSvc.createTaskUser(vm);
	        };
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
        
    }    
})();
