(function () {
    'use strict';

    angular
        .module('app')
        .controller('planProjectCtrl', planProject);

    planProject.$inject = ['$location','planProjectSvc']; 

    function planProject($location, planProjectSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '年度计划项目库列表';
        
        //查看项目库页面的切换
        vm.tabActive=1;
        vm.tab=function(tabActive){
          vm.tabActive=tabActive;          
        }
        
        
        activate();
        function activate() {
            planProjectSvc.grid(vm);
        }
        
        vm.fun = function(id){
        	alert("000");
        }
    }
})();
