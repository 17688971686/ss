(function () {
    'use strict';

    angular
        .module('app')
        .controller('planFormationCtrl', planFormation);

    planFormation.$inject = ['$location','planFormationSvc']; 

    function planFormation($location, planFormationSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '年度计划编制列表';
        
        //年度计划编制
        vm.projectInfoEdit = function(id){
        	location.href = "#/projectFormation/"+id;
        }
        
        activate();
        function activate() {
            planFormationSvc.grid(vm);
        }
    }
})();
