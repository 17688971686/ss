(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectFormationCtrl', projectFormation);

    projectFormation.$inject = ['$location','projectFormationSvc']; 

    function projectFormation($location, projectFormationSvc) {
        /* jshint validthis:true */
    	var vm = this;
      
        
    	//添加计划列表的切换
        vm.tabActive=1;
        vm.tab=function(tabActive){
          vm.tabActive=tabActive;
          /*console.log(vm.tabActive);
          if(vm.tabActive == 1){
        	  vm.grid(vm,"noPlanArrangeProject");
          }else if(vm.tabActive == 2){
        	  vm.grid(vm,"manualAddProject");
          }else{
        	  vm.grid(vm,"noAdoptAuditProject");
          }*/
        }
    	
        activate();
        function activate() {
            projectFormationSvc.grid(vm,"noPlanArrangeProject");
            projectFormationSvc.grid(vm,"manualAddProject");
            projectFormationSvc.grid(vm,"noAdoptAuditProject");
            
            
            
        }
        
        //投资计划的删除
        vm.planDel = function(id){
        	common.confirm({
        		vm:vm,
        		title:"温馨提示",
        		msg:"确定删除这些数据吗?",
        		fn:function(){
        			$('.confirmDialog').modal('hide');
        			//DOTO
        		}
        	});
        	//获取被选中的项目id
          /*  var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {//如果没有选择
                common.alert({
                    vm:vm,
                    title:"温馨提示",
                    msg:'请选择需要删除的数据'                  
                  });
              }else {
                var ids=[];
                  for (var i = 0; i < selectIds.length; i++) {
                    ids.push(selectIds[i].value);
                  }  
                  var idStr=ids.join(',');
                  
                  
              	} */
        	}
        
        
    }
})();
