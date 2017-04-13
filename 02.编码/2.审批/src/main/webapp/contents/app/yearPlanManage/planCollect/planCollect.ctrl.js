(function () {
    'use strict';

    angular
        .module('app')
        .controller('planCollectCtrl', planCollect);

    planCollect.$inject = ['$location','planCollectSvc']; 

    function planCollect($location, planCollectSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '年度计划汇总列表';
        
 
       
        activate();
        function activate() {
            planCollectSvc.grid(vm);
        }
    }
})();
