(function () {
    'use strict';

    angular
        .module('app')
        .controller('unitManagementCtrl', unitManagement);

    unitManagement.$inject = ['$location','unitManagementSvc']; 

    function unitManagement($location, unitManagementSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '单位列表';
        
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
                  	unitManagementSvc.deleteUnit(vm,id);
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
        	unitManagementSvc.grid(vm);
        }
    }
})();
