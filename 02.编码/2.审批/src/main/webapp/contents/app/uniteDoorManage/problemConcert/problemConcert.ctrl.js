(function () {
    'use strict';

    angular
        .module('app')
        .controller('problemConcertCtrl', problemConcert);

    problemConcert.$inject = ['$location','problemConcertSvc']; 

    function problemConcert($location, problemConcertSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '问题协调列表';
        
        activate();
        function activate() {
            problemConcertSvc.grid(vm);
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
