(function () {
    'use strict';

    angular
        .module('app')
        .controller('deptInfoMaintainCtrl', deptInfoMaintain);

    deptInfoMaintain.$inject = ['$location','deptInfoMaintainSvc']; 

    function deptInfoMaintain($location, deptInfoMaintainSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={
        		unitProperty:"",
        		divisionId:""
        };
        
        vm.basicData_unitProperty=$linq(common.getBasicData())
        							.where(function(x){return x.identity=='unitProperty'&&x.pId=='unitProperty';})
        							.toArray();
        
        vm.basicData_area_Street=$linq(common.getBasicData())
								.where(function(x){return x.identity=='area'&&x.pId=='area_1';})
								.toArray();
        
        vm.submit=function(){
        	deptInfoMaintainSvc.save(vm);
        }
        activate();
        function activate() {
        	deptInfoMaintainSvc.getDeptInfo(vm);
        }
    }
})();