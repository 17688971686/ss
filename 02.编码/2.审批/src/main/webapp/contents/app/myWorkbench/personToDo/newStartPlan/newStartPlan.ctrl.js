(function () {
    'use strict';

    angular
        .module('app')
        .controller('newStartPlanCtrl', newStartPlan);

    newStartPlan.$inject = ['$location','newStartPlanSvc']; 

    function newStartPlan($location, newStartPlanSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '新开工计划列表';
        
      //新开工计划数据编辑
        vm.edit = function(id){
        	//alert("这是新开工计划数据编辑触发："+id); //--测试用 
        	//跳转到新开工计划数据编辑页面
        	location.href = "#/projectInfoEdit/"+id;
        }
        //新开工计划数据删除
        vm.del = function(id){
        	//alert("这是新开工计划数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	newStartPlanSvc.deleteNewStartPlan(vm,id);  //此处的方法没有写
                   }
               })
        }
       
        activate();
        function activate() {
        	newStartPlanSvc.grid(vm);
        }
    }
})();