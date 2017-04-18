(function () {
    'use strict';

    angular
        .module('app')
        .controller('auditAccountFundsCtrl', auditAccountFunds);

    auditAccountFunds.$inject = ['$location','auditAccountFundsSvc']; 

    function auditAccountFunds($location, auditAccountFundsSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '审计决算资金列表';
        
      //审计决算资金数据编辑
        vm.edit = function(id){
        	//alert("这是审计决算资金数据编辑触发："+id); //--测试用 
        	//跳转到审计决算资金数据编辑页面
        	location.href = "#/projectInfoEdit/"+id;
        }
        //审计决算资金数据删除
        vm.del = function(id){
        	//alert("这是审计决算资金数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	auditAccountFundsSvc.deleteAuditAccountFunds(vm,id);  //此处的方法没有写
                   }
               })
        }
       
        activate();
        function activate() {
        	auditAccountFundsSvc.grid(vm);
        }
    }
})();