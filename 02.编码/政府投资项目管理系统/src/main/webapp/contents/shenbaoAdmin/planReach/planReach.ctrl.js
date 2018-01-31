(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('planReachCtrl', planReach);

    planReach.$inject = ['$location','planReachSvc','$state','$scope','$sce']; 

    function planReach($location, planReachSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
        var vm = this;
        var routeName = $state.current.name;
        vm.basicData={};vm.model={};vm.projectNumber='';vm.unqualifiedNum=false;
        
        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function(){
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
        
        function init(){
        	if(routeName == 'planReach'){
        		vm.page = 'list';
        	}
        	
        	vm.formatNumber=function(number){
        		number=(number==''||number==undefined||number==null?0:parseFloat(number));
        		return number;
        	};
        	
        	vm.checkNumber=function(compared,compare){
        		var unqualifiedNum=false;
        		if(compare>compared){
        			unqualifiedNum=true;
        		}
        		return unqualifiedNum;
        	};
        	
        	//全选框选择
        	$(document).on('click', '#checkboxAll_planReachRecords', function () {
                var isSelected = $(this).is(':checked');
                $('.shenBaoRecordsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);
        	vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);
        	vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
        }//end fun init
        
        function list(){
        	planReachSvc.getHasIncludYearPlan(vm);
        	planReachSvc.getNotIncludYearPlan(vm);
        	planReachSvc.planReachRecords(vm);
        	
        	//检查已纳入年度计划的计划下达申请资金
        	vm.checkNum_ggys=function(id,compared){
        		vm.unqualifiedNum_ggys=false;
        		vm.unqualifiedNum_ggys=vm.checkNumber(compared,vm.formatNumber($("#ggys_"+id).val()));
        		vm.checkPlanReachNum();
        	};
        	vm.checkNum_gtzj=function(id,compared){
        		vm.unqualifiedNum_gtzj=false;
        		vm.unqualifiedNum_gtzj=vm.checkNumber(compared,vm.formatNumber($("#gtzj_"+id).val()));
        		vm.checkPlanReachNum();
        	};
        	vm.checkPlanReachNum=function(){
        		vm.unqualifiedNum = false;
        		vm.unqualifiedNum = vm.unqualifiedNum_ggys || vm.unqualifiedNum_gtzj;
        		if(vm.unqualifiedNum){
        			common.alert({
        				vm:vm,
        				msg:'申请资金大于安排资金，请重新输入！'
        			});
        		}
        	};
        	//已纳入年度计划的计划下达确认
        	vm.confirmPlanReach=function(id){
        		vm.model.sqPlanReach_ggys=vm.formatNumber($("#ggys_"+id).val());
        		vm.model.sqPlanReach_gtzj=vm.formatNumber($("#gtzj_"+id).val());
        		planReachSvc.comfirmPlanReach(vm,id);
        	};
        	//查看审批结果
        	vm.showPlanReachGrid=function(projectNumber){
        		//展示模态框
         	   $("#shenBaoRecords").modal({
 			        backdrop: 'static',
 			        keyboard:true
         	   });
         	   vm.projectNumber = projectNumber;
         	   //根据项目代码查询项目的申报记录 	  
         	   vm.gridOptions_shenBaoRecords.dataSource.filter([{
         		   	field:'projectNumber',
					operator:'eq',
					value:vm.projectNumber
         	   },{
         		   	field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_jihuaxiada
         	   }]);
        	};
        	//未纳入年度计划的计划下达申报记录
        	vm.checkPlanReachDetails=function(projectNumber){
        		vm.projectNumber = projectNumber;
        		 $("#shenBaoRecords").modal({
 			        backdrop: 'static',
 			        keyboard:true
         	   });
        		//根据项目代码查询项目的申报记录  
          	   vm.gridOptions_shenBaoRecords.dataSource.filter([
          		   {
          			 field:'projectNumber',
          			 operator:'eq',
          			 value:vm.projectNumber
          		   },
          		   {
          			 field:'projectShenBaoStage',
          			 operator:'eq',
          			 value:common.basicDataConfig().projectShenBaoStage_jihuaxiada  
          		   }
          	   ]);
        	}; 
          	   
          	   //删除计划下达
          	   vm.deletePlanReach=function(id){
          		   planReachSvc.deletePlanReach(vm,id);
          	   };
          	   //批量删除计划下达
          	   vm.deletePlanReachs=function(){
          		 var selectIds = common.getKendoCheckId('.shenBaoRecordsGrid');
                 if (selectIds.length == 0) {
                 	common.alert({
                 		vm:vm,
                 		msg:'请选择数据!'
                 	});	
                 } else {
                 	var ids=[];
                     for (var i = 0; i < selectIds.length; i++) {
                     	ids.push(selectIds[i].value);
     				}  
                     var idStr=ids.join(',');
                     vm.deletePlanReach(idStr);
                 }
          	   };
        }//end fun list
        
        active();
        function active(){
        	init();
        	if(vm.page == 'list'){
        		list();
        	}
        }//end fun active
    }
})();