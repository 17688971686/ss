(function () {
    'use strict';

    angular
        .module('app')
        .controller('userUnitManagementEditCtrl', userUnitManagement);

    userUnitManagement.$inject = ['$location','userUnitManagementSvc','$state']; 

    function userUnitManagement($location, userUnitManagementSvc,$state) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '添加用户单位';       
        
        
        vm.init = function(){
        	vm.id = $state.params.id;
        	vm.basicData = {};
        	if (vm.id) {
                vm.isUpdate = true;
                vm.title = '更新用户单位';
            }
        }
        //begin#基础数据
     	vm.basicData_unitProperty=$linq(common.getBasicData())
		  .where(function(x){return x.identity=='unitProperty'&&x.pId=='unitProperty';})
		  .toArray();
     	
     	vm.basicData_division=$linq(common.getBasicData())
		  .where(function(x){return x.identity=='division'&&x.pId=='division';})
		  .toArray();
     	//end#基础数据
        
        vm.create = function () {
        	userUnitManagementSvc.createUserUnit(vm);
        };
        vm.update = function () {
        	userUnitManagementSvc.updateUnit(vm);
        };      

        activate();
        function activate() {        	
        	vm.init();
        	if (vm.isUpdate) {
        		userUnitManagementSvc.getUnitById(vm);        		
        	}
        }
    }
})();
