(function () {
    'use strict';

    angular
        .module('app')
        .controller('constructionPlanCtrl', constructionPlan);

    constructionPlan.$inject = ['$location','constructionPlanSvc']; 

    function constructionPlan($location, constructionPlanSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '续建计划列表';
        
      //续建计划数据编辑
        vm.edit = function(id){
        	//alert("这是续建工计划数据编辑触发："+id); //--测试用 
        	//跳转到续建计划数据编辑页面
        	location.href = "#/projectInfoEdit/"+id;
        }
        //续建计划数据删除
        vm.del = function(id){
        	//alert("这是续建计划数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	constructionPlanSvc.deleteConstructionPlan(vm,id);  //此处的方法没有写
                   }
               })
        }
       
        activate();
        function activate() {
        	constructionPlanSvc.grid(vm);
        }
    }
})();