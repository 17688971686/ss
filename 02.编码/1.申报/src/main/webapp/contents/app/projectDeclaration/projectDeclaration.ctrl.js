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
        vm.titleFillInfo = '项目月报填报信息录入';
        
        
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
         * 用於項目信息編輯頁面中的tab切換
         */
        vm.tabActive=2;
        vm.tab = function(tabActive){
          vm.tabActive=tabActive;
        }
        
        /**
         * 用於添加新項目申報
         */
        vm.projectName = "";
        vm.declarationStage="";
        vm.goFillDeclarationInfo = function(vm){
        	location.href = "#/projectDeclarationInfoFill";
        }
        
        
			
        
        activate();
        function activate() {
        	projectDeclarationSvc.grid(vm);
        }
    }
})();