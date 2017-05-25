(function () {
    'use strict';

    angular
        .module('app')
        .controller('unitManagementEditCtrl', unitManagement);

    unitManagement.$inject = ['$location','unitManagementSvc','$state']; 

    function unitManagement($location, unitManagementSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '添加单位';       
        
        
        vm.init = function(){
        	vm.id = $state.params.id;
        	vm.basicData = {};
        	if (vm.id) {
                vm.isUpdate = true;
                vm.title = '更新单位';
            }
        }
        
        
        vm.create = function () {
        	unitManagementSvc.createUnit(vm);
        };
        vm.update = function () {
        	unitManagementSvc.updateUnit(vm);
        };      

        activate();
        function activate() {
        	
        	vm.init();
        	if (vm.isUpdate) {
        		unitManagementSvc.getUnitById(vm);        		
        	}
        	//获取基础数据
        	unitManagementSvc.getBasicData(vm,"unitProperty");//获取单位性质
        	unitManagementSvc.getBasicData(vm,"division");//获取行政区划
        	unitManagementSvc.getBasicData(vm,"qualifiyLevel");//获取资质等级
        }
    }
})();
