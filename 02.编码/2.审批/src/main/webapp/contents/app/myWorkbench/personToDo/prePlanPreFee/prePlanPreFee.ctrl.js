(function () {
    'use strict';

    angular
        .module('app')
        .controller('prePlanPreFeeCtrl', prePlanPreFee);

    prePlanPreFee.$inject = ['$location','prePlanPreFeeSvc']; 

    function prePlanPreFee($location, prePlanPreFeeSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '前期计划前期费列表';
        
      //前期计划前期费数据编辑
        vm.edit = function(id){
        	alert("这是前期计划前期费数据编辑触发："+id); //--测试用 
        	//跳转到项目数据编辑页面
        	location.href = "#/projectInfoEdit/"+id;
        }
        //前期计划前期费数据删除
        vm.del = function(id){
        	alert("这是前期计划前期费数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	prePlanPreFeeSvc.deletePrePlanPreFee(vm,id);  //此处的方法没有写
                   }
               })
        }
       
        activate();
        function activate() {
        	prePlanPreFeeSvc.grid(vm);
        }
    }
})();