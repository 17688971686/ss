(function () {
    'use strict';

    angular
        .module('app')
        .controller('prePlanPreFeeCtrl', prePlanPreFee);

    prePlanPreFee.$inject = ['$location','prePlanPreFeeSvc']; 

    function prePlanPreFee($location, prePlanPreFeeSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	prePlanPreFeeSvc.grid(vm);
        }
    }
})();