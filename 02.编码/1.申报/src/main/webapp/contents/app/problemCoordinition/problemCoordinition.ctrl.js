(function () {
    'use strict';

    angular
        .module('app')
        .controller('problemCoordinitionCtrl', problemCoordinition);

    problemCoordinition.$inject = ['$location','problemCoordinitionSvc']; 

    function problemCoordinition($location, problemCoordinitionSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '问题协调列表';
        
      //问题协调数据编辑
        vm.edit = function(id){
        	//alert("这是问题协调数据编辑触发："+id); //--测试用 
        	//跳转到问题协调数据编辑页面
        	location.href = "#/problemInfoEdit/"+id;
        }
        //问题协调数据删除
        vm.del = function(id){
        	//alert("这是问题协调数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	problemCoordinitionSvc.deleteProblemCoordinition(vm,id);  //此处的方法没有写
                   }
               })
        }
        
        activate();
        function activate() {
        	problemCoordinitionSvc.grid(vm);
        }
    }
})();