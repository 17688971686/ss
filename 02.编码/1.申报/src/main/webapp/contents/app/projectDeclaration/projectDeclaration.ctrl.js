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
        	//暂时模拟
        	location.href = "#/projectDeclarationInfoEdit_prePlan/"+id;
        	//TODO 根据项目id查询出项目的申报阶段 
        	
        	//根据申报阶段弹出对应的编辑页面
        	/*if(model.declarationStage == "前期计划（前期费）"){
        		location.href = "#/projectDeclarationInfoEdit_prePlan/"+model;
        	}else if(model.declarationStage == "规划设计前期费"){
        		location.href = "#/projectDeclarationInfoEdit_planDesign/"+model;
        	}else if(model.declarationStage == "新开工计划"){
        		location.href = "#/projectDeclarationInfoEdit_newStratPlan/"+model;
        	}else if(model.declarationStage == "续建计划"){
        		location.href = "#/projectDeclarationInfoEdit_constructionPlan/"+model;
        	}else if(model.declarationStage == "下一年度计划"){
        		location.href = "#/projectDeclarationInfoEdit_nextYearPlan/"+model;
        	}else if(model.declarationStage == "年度计划调整"){
        		location.href = "#/projectDeclarationInfoEdit_yearPlanAdjust/"+model;
        	}else if(model.declarationStage == "委托审计"){
        		location.href = "#/projectDeclarationInfoEdit_entrustAudit/"+model;
        	}else if(model.declarationStage == "审计决算资金"){
        		location.href = "#/projectDeclarationInfoEdit_auditAccountFunds/"+model;
        	}*/
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
        	if(vm.declarationStage == "前期计划（前期费）"){
        		location.href = "#/projectDeclarationInfoFill_prePlan";
        	}else if(vm.declarationStage == "规划设计前期费"){
        		location.href = "#/projectDeclarationInfoFill_planDesign";
        	}else if(vm.declarationStage == "新开工计划"){
        		location.href = "#/projectDeclarationInfoFill_newStratPlan";
        	}else if(vm.declarationStage == "续建计划"){
        		location.href = "#/projectDeclarationInfoFill_constructionPlan";
        	}else if(vm.declarationStage == "下一年度计划"){
        		location.href = "#/projectDeclarationInfoFill_nextYearPlan";
        	}else if(vm.declarationStage == "年度计划调整"){
        		location.href = "#/projectDeclarationInfoFill_yearPlanAdjust";
        	}else if(vm.declarationStage == "委托审计"){
        		location.href = "#/projectDeclarationInfoFill_entrustAudit";
        	}else if(vm.declarationStage == "审计决算资金"){
        		location.href = "#/projectDeclarationInfoFill_auditAccountFunds";
        	}
        	
        }
        
        activate();
        function activate() {
        	projectDeclarationSvc.grid(vm);
        }
    }
})();