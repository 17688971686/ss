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
        
        activate();
        function activate() {
            policySvc.grid(vm);
        }
        
        //政策法规的删除
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
