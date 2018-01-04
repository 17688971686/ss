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
    	
    	vm.roles = {};
    	
        function activate() {        	
        	init();
        }
        
		function init(){
			
			//sysConfigSvc.getRoles(vm);
			
			sysConfigSvc.getSysConfigs(vm);	
			
			//修改按钮
			vm.checked = function(index){
				//设置修改按钮隐藏、下拉选显示
	        };
		
			//系统配置：更新
			 vm.create = function(){
				 sysConfigSvc.editSysConfigs(vm);
	        };
	        
	        vm.getConfigName = function(configName){
	        	
		        return $linq(common.getBasicData())
		   			   .where(function(x){return x.identity==common.basicDataConfig().taskType&&x.id==configName;})
		   			   .toArray()[0].description;//获取秘密等级信息	
	        };
	        
	        vm.getConfigValue = function(enable){
	        	if(enable == true){
	        		return "是";
	        	}else{
	        		return "否";
	        	}
	        };
	        
		}
    }    
})();
