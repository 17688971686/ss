(function () {
    'use strict';

    angular
        .module('app')
        .controller('suggestFeedbackCtrl', suggestFeedback);

    suggestFeedback.$inject = ['$location','suggestFeedbackSvc']; 

    function suggestFeedback($location, suggestFeedbackSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '建议反馈列表';
        
        activate();
        function activate() {
            suggestFeedbackSvc.grid(vm);
        }
        
        //建议反馈编辑
        vm.projectInfoEdit = function(id){
        	location.herf = "#/suggestEdit/"+id;
        }
        
        //建议反馈详情页面
        vm.projectInfoDetails = function(id){
        	location.href = "#/suggestDetails/"+id;
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
