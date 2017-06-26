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
        
        vm.basicData_unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);        	
        vm.basicData_area_Street=$linq(common.getBasicData())
								.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
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