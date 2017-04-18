(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectProposalCtrl', projectProposal);

    projectProposal.$inject = ['$location','projectProposalSvc']; 

    function projectProposal($location, projectProposalSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '项目建议书列表';
        
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
            projectProposalSvc.grid(vm);
        }
    }
})();
