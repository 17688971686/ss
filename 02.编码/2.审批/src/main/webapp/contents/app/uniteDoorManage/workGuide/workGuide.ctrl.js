(function () {
    'use strict';

    angular
        .module('app')
        .controller('workGuideCtrl', workGuide);

    workGuide.$inject = ['$location','workGuideSvc']; 

    function workGuide($location, workGuideSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '办事指南列表';
        
        activate();
        function activate() {
            workGuideSvc.grid(vm);
        }
        
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
