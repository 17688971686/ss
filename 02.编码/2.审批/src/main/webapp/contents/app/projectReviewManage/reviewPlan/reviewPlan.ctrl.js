(function () {
    'use strict';

    angular
        .module('app')
        .controller('reviewPlanCtrl', reviewPlan);

    reviewPlan.$inject = ['$location','reviewPlanSvc']; 

    function reviewPlan($location, reviewPlanSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '评审安排列表';
        
        activate();
        function activate() {
            reviewPlanSvc.grid(vm);
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
