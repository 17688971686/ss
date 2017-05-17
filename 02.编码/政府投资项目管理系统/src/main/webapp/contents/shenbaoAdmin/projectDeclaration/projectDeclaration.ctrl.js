(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectDeclarationCtrl', projectDeclaration);

    projectDeclaration.$inject = ['$location','projectDeclarationSvc']; 

    function projectDeclaration($location, projectDeclarationSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目列表';
        vm.titleDeclarationEdit = '项目申报信息编辑页面';
        vm.titleDeclarationAdd = '项目申报信息新增页面';
        
       
        
        
        vm.del = function(id){
        	//alert("这是项目申报信息列表删除："+id);  //--测试用
        	common.confirm({
             	 vm:vm,
             	 title:"",
             	 msg:"确认删除数据吗？",
             	 fn:function () {
                   	$('.confirmDialog').modal('hide');             	
                   	projectDeclarationSvc.deleteProjectDeclaration(vm,id);  //此处的方法没有写
                  }
              })
        }
        /**
         * 用於項目列表中信息編輯（不同的申報階段對應不同的頁面）
         */
        
        vm.edit = function(id){
        	//alert("项目申报编辑："+id); //--测试用
        	//暂时模拟
        	//location.href = "#/projectDeclarationInfoEdit_prePlan/"+id;
        	//TODO 根据项目id查询出项目的申报阶段 
        	
        	projectDeclarationSvc.queryById(vm,id);        	
        }
        vm.goToLook = function(id){
        	alert(id);
        }
        
        /**
         * 用於項目信息編輯頁面中的tab切換
         */
        vm.tabActive=2;
        vm.tab = function(tabActive){
          vm.tabActive=tabActive;
        }
        
        /**
         * 用於添加新項目申報(不同的选项（申报阶段）对应不同的填写页面)
         */
        vm.goFillDeclarationInfo = function(){
        	$(".modal-backdrop").remove(); //去掉背面的阴影  
        	if(vm.declarationStage == "0001"){
        		vm.declarationStage = "前期计划（前期费）";        	
        		location.href = common.format("#/projectDeclarationAdd/prePlan?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0002"){
        		vm.declarationStage = "规划设计前期费";
        		location.href = common.format("#/projectDeclarationAdd/planDesign?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0003"){
        		vm.declarationStage = "新开工计划";
        		location.href = common.format("#/projectDeclarationAdd/newStratPlan?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0004"){
        		vm.declarationStage = "续建计划";
        		location.href = common.format("#/projectDeclarationAdd/constructionPlan?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0007"){
        		vm.declarationStage = "下一年度计划";
        		location.href = common.format("#/projectDeclarationAdd/nextYearPlan?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0008"){
        		vm.declarationStage = "年度调整计划";
        		location.href = common.format("#/projectDeclarationAdd/yearPlanAdjust?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0005"){
        		vm.declarationStage = "委托审计";
        		location.href = common.format("#/projectDeclarationAdd/entrustAudit?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}else if(vm.declarationStage == "0006"){
        		vm.declarationStage = "审计决算资金";
        		location.href = common.format("#/projectDeclarationAdd/auditAccountFunds?declarationStage={0}&projectName={1}",vm.declarationStage,vm.projectName);
        	}
        	
        }
        
        activate();
        function activate() {
        	vm.declarationStage=decodeURI(common.getQuerystring('declarationStage'));//对申报的阶段进行解码
        	vm.projectName=decodeURI(common.getQuerystring('projectName'));//对传递的项目名称进行解码
        	
        	projectDeclarationSvc.grid(vm);
        }
    }
})();