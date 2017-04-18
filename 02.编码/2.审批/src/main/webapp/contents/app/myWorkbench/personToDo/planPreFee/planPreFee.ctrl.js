(function () {
    'use strict';

    angular
        .module('app')
        .controller('planPreFeeCtrl', planPreFee);

    planPreFee.$inject = ['$location','planPreFeeSvc']; 

    function planPreFee($location, planPreFeeSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '规划前期费列表';
        
      //规划前期费数据删除
        vm.del = function(id){
        	//alert("这是规划前期费数据删除触发："+id); //--测试用 
        	common.confirm({
              	 vm:vm,
              	 title:"",
              	 msg:"确认删除数据吗？",
              	 fn:function () {
                    	$('.confirmDialog').modal('hide');             	
                    	planPreFeeSvc.deletePlanPreFee(vm,id);  //此处的方法没有写
                   }
               })
        }
        
       
        activate();
        function activate() {
        	planPreFeeSvc.grid(vm);
        }
    }
})();