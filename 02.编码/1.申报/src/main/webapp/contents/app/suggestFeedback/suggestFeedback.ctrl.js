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
        
      //建议反馈数据编辑
        vm.edit = function(id){
        	//alert("这是建议反馈数据编辑触发："+id); //--测试用 
        	//跳转到建议反馈数据编辑页面
        	location.href = "#/suggestInfoEdit/"+id;
        }
      //建议反馈数据详情查看
        vm.look = function(id){
        	//跳转到数据详情页面
        	location.href = "#/suggestInfoLook/"+id;
        }
        //建议反馈数据删除
        vm.del = function(id){
        	//alert("这是建议反馈数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	suggestFeedbackSvc.deleteSuggestFeedback(vm,id);  //此处的方法没有写
                   }
               })
        }
        
        activate();
        function activate() {
        	suggestFeedbackSvc.grid(vm);
        }
    }
})();