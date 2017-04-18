(function () {
    'use strict';

    angular
        .module('app')
        .controller('entrustAuditCtrl', entrustAudit);

    entrustAudit.$inject = ['$location','entrustAuditSvc']; 

    function entrustAudit($location, entrustAuditSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '委托审计列表';
        
      //委托审计数据编辑
        vm.edit = function(id){
        	//alert("这是委托审计数据编辑触发："+id); //--测试用 
        	//跳转到委托审计数据编辑页面
        	location.href = "#/projectInfoEdit/"+id;
        }
        //委托审计数据删除
        vm.del = function(id){
        	//alert("这是委托审计数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	entrustAuditSvc.deleteEntrustAudit(vm,id);  //此处的方法没有写
                   }
               })
        }
       
        activate();
        function activate() {
        	entrustAuditSvc.grid(vm);
        }
    }
})();