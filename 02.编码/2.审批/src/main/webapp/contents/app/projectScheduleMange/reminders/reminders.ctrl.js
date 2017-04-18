(function () {
    'use strict';

    angular
        .module('app')
        .controller('remindersCtrl', reminders);

    reminders.$inject = ['$location','remindersSvc']; 

    function reminders($location, remindersSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目催办列表';
        
        vm.cancleReminders = function(id){
        	//alert("这是项目取消催办："+id);  //--测试用
        	common.confirm({
             	 vm:vm,
             	 title:"",
             	 msg:"确认取消催办吗？",
             	 fn:function () {
                   	$('.confirmDialog').modal('hide');             	
                   	remindersSvc.cancleReminders(vm,id);  //此处的方法没有写
                  }
              })
        }
           
        activate();
        function activate() {
        	remindersSvc.grid(vm);
        }
    }
})();