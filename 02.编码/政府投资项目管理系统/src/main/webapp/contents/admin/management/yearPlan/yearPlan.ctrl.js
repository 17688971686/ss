(function () {
    'use strict';

    angular
        .module('app')
        .controller('yearPlanCtrl', yearPlan);

    yearPlan.$inject = ['$location','yearPlanSvc','$state','$scope','$sce']; 

    function yearPlan($location, yearPlanSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.model={};
        vm.id=$state.params.id;        
    	vm.page="shenbaoInfoList";
    	function init(){    		
    		if($state.current.name=='yearPlan_planList'){
    			vm.page='planList'
    		}
    		if($state.current.name=='yearPlan_planEdit'){
    			vm.page='plan_create';
    		}
    		if($state.current.name=='yearPlan_planEdit'&&vm.id){
    			vm.page='plan_update';
    		}
    		if($state.current.name=='yearPlan_planBZ'){
    			vm.page='planBZ';
    		}
    		
    	}
    	init();    	
    	activate();
        function activate() {        	
        	if(vm.page=='shenbaoInfoList'){
        		init_shenbaoInfoList();
        	}
        	if(vm.page=='planList'){
        		init_planList();
        	}
        	if(vm.page=='plan_create'){
        		init_planCreate();
        	}
        	if(vm.page=='plan_update'){
        		vm.isPlanEdit=true;
        		init_planUpadte();
        	}
        	if(vm.page=='planBZ'){
        		init_planBZ();
        	}
        }
    	
    	function init_shenbaoInfoList(){
    		yearPlanSvc.grid_shenbaoInfoList(vm);
    		vm.dialog_shenbaoInfo = function(id){
    			yearPlanSvc.getShenBaoInfoById(vm,id);
    			$('#shenbaoInfo').modal({
                    backdrop: 'static',
                    keyboard:false
                });
    			//初始化tab
          	   vm.tabStripOptions={
          			//TODO
          	   };
    		}
    		
    	}//init_planList
    	function init_planList(){
    		yearPlanSvc.grid_planList(vm);
    	}//init_planBZList    
    	
    	function init_planCreate(){
    		vm.create=function(){    		
    			yearPlanSvc.plan_create(vm)
    		};
    	}//init_planBZList 
    	
    	function init_planUpadte(){
    		yearPlanSvc.getPlanById(vm);
    		vm.update=function(){
    			yearPlanSvc.plan_update(vm);
    		}
    	}//init_planUpadte
    	
    	function init_planBZ(){    		
    		vm.dialog_addPlan=function(){
    			 $('#addPlanList').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
    			 
    		}
    		vm.dialogConfirmSubmit=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	return;
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');                  
                    $('#addPlanList').modal('toggle');//关闭模态框
                    yearPlanSvc.addShenBaoInfoconfirm(vm,idStr);
                   
                }   
    		}
    		 vm.popOver=function(e,id){
    			 //根据申报信息id查询出年度计划编制
    			 yearPlanSvc.getYearPlanCapitalByShenBaoId(vm,id);
    	    	   vm.isPopOver=true;
    	    	   var minClick=$(document).height()-50-230;
    	    	   if(e.pageY>minClick){
    	    		   e.pageY=minClick;
    	    	   }
    	    	   vm.popStyle={    	    			  
    	    			   left:e.pageX+'px',
    	    			   top:e.pageY+'px',
    	    	   };  
    	       }
    		 vm.updateCapital = function(){
    			 yearPlanSvc.updateYearPlanCapital(vm);
    		 }

    		yearPlanSvc.getPlanById(vm);//查询年度计划信息
    		yearPlanSvc.grid_yearPlan_shenbaoInfoList(vm);//查询年度计划编制申报的信息列表
    		yearPlanSvc.grid_yearPlan_addShenbaoInfoList(vm);//查询所有的申报信息列表  		
    	}
    }
})();
