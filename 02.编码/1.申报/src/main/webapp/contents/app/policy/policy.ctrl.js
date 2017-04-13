(function () {
    'use strict';

    angular
        .module('app')
        .controller('policyCtrl', policy);

    policy.$inject = ['$location','policySvc']; 

    function policy($location, policySvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '政策法规列表';
        

        vm.del = function (id) {        	
        	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    policySvc.deletepolicy(vm,id);
                 }
             })
        }
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
            policySvc.grid(vm);
        }
    }
})();
