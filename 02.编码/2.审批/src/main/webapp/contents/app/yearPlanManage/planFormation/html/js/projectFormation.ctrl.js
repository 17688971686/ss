(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectFormationCtrl', projectFormation);

    projectFormation.$inject = ['$location','projectFormationSvc']; 

    function projectFormation($location, projectFormationSvc) {
        /* jshint validthis:true */
    	var vm = this;
      
        
    	//查看项目库页面的切换
        vm.tabActive=1;
        vm.tab=function(tabActive){
          vm.tabActive=tabActive;          
        }
    	
        activate();
        function activate() {
            projectFormationSvc.grid(vm);
        }
        
        //投资计划的删除
        vm.planDel = function(id){
        	common.confirm({
        		vm:vm,
        		title:"温馨提示",
        		msg:"确定删除这些数据吗?",
        		fn:function(){
        			$('.confirmDialog').modal('hide');
        			//DOTO
        		}
        	});
        }
        
        
    }
})();
