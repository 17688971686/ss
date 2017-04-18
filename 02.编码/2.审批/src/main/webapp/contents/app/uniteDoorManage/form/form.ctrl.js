(function () {
    'use strict';

    angular
        .module('app')
        .controller('formCtrl', form);

    form.$inject = ['$location','formSvc']; 

    function form($location, formSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '常用表格列表';
        
        activate();
        function activate() {
            formSvc.grid(vm);
        }
        
        
        //常用表格的删除
        vm.projectInfoDel = function(id){
        	common.confirm({
        		vm:vm,
        		title:"温馨提示",
        		msg:"确定删除这一条数据吗?",
        		fn:function(){
        			$('.confirmDialog').modal('hide');
        			//DOTO
        		}
        	});
        }
    }
})();
