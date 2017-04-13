(function () {
    'use strict';

    angular
        .module('app')
        .controller('planPreFeeCtrl', planPreFee);

    planPreFee.$inject = ['$location','planPreFeeSvc']; 

    function planPreFee($location, planPreFeeSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	planPreFeeSvc.grid(vm);
        }
    }
})();