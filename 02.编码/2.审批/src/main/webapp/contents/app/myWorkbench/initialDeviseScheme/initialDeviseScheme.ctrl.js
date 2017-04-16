(function () {
    'use strict';

    angular
        .module('app')
        .controller('initialDeviseSchemeCtrl', initialDeviseScheme);

    initialDeviseScheme.$inject = ['$location','initialDeviseSchemeSvc']; 

    function initialDeviseScheme($location, initialDeviseSchemeSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '初步设计方案列表';
        
        
        //项目编辑页面的切换代码
        vm.tabActive=1;
        vm.tab=function(tabActive){
          vm.tabActive=tabActive;          
        }
        
        
        //项目删除
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
        
        activate();
        function activate() {
            initialDeviseSchemeSvc.grid(vm);
        }
    }
})();
