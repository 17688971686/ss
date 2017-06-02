(function () {
    'use strict';

    angular
        .module('app')
        .controller('userUnitManagementCtrl', userUnitManagement);

    userUnitManagement.$inject = ['$location','userUnitManagementSvc']; 

    function userUnitManagement($location, userUnitManagementSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '用户单位列表';
        
        /**
         * 删除单个单位
         */
        vm.del = function (id) {        	        	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                  	userUnitManagementSvc.deleteUnit(vm,id);
                 }
             })
        }
        
        /**
         * 删除多个单位
         */
        vm.dels = function () {     
        	var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'
                	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.del(idStr);
            }   
       }
        
        activate();
        function activate() {
        	userUnitManagementSvc.grid(vm);
        }
    }
})();
