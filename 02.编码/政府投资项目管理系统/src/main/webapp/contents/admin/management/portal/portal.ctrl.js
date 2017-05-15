(function () {
    'use strict';

    angular
        .module('app')
        .controller('portalCtrl', portal);

    portal.$inject = ['$location','portalSvc','$state']; 

    function portal($location, portalSvc,$state) {
        /* jshint validthis:true */
    	var vm = this;
        var initTitle=function(){
        	var type=$state.params.type;
        	switch (type) {
			case "1":
				vm.title="通知公告";
				break;
			case "2":
				vm.title="政策法规";
				break;
			case "3":
				vm.title="办事指南";
				break;
			case "4":
				vm.title="常用表格";
				break;
			
			}
        }
        

        vm.del = function (id) {        	
        	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    portalSvc.deleteportal(vm,id);
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
            portalSvc.grid(vm);
        }
    }
})();
