(function () {
    'use strict';

    angular
        .module('app')
        .controller('nextYearPlanCtrl', nextYearPlan);

    nextYearPlan.$inject = ['$location','nextYearPlanSvc']; 

    function nextYearPlan($location, nextYearPlanSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '下一年年度计划列表';
        
      //下一年年度计划数据编辑
        vm.edit = function(id){
        	//alert("这是下一年年度计划数据编辑触发："+id); //--测试用 
        	//跳转到下一年年度计划数据编辑页面
        	location.href = "#/projectInfoEdit/"+id;
        }
        //下一年年度计划数据删除
        vm.del = function(id){
        	//alert("这是下一年年度计划数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	nextYearPlanSvc.deleteNextYearPlan(vm,id);  //此处的方法没有写
                   }
               })
        }

       
        activate();
        function activate() {
        	nextYearPlanSvc.grid(vm);
        }
    }
})();