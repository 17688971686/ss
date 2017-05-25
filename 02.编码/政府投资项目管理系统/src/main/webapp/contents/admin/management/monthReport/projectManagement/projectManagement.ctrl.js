(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectManagementCtrl', projectManagement);

    projectManagement.$inject = ['$location','projectManagementSvc']; 

    function projectManagement($location, projectManagementSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '项目列表';
        
        /**
         * 删除项目
         * @param id 项目代码
         */
        vm.del = function (id) {
            common.confirm({
           	 vm:vm,
           	 title:"",
           	 msg:"确认删除数据吗？",
           	 fn:function () { 
           		$('.confirmDialog').modal('hide');
                projectManagementSvc.deleteProject(vm,id);
                }
            })
       }
        
        /**
         * 批量删除项目
         */
        vm.dels = function(){
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
        	projectManagementSvc.grid(vm);
        }
    }
})();
