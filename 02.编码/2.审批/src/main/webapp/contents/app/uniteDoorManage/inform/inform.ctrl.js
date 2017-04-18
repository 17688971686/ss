(function () {
    'use strict';

    angular
        .module('app')
        .controller('informCtrl', inform);

    inform.$inject = ['$location','informSvc']; 

    function inform($location, informSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '通知公告列表';
        

        activate();
        function activate() {
            informSvc.grid(vm);
        }
        
        //通知公告的删除
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
