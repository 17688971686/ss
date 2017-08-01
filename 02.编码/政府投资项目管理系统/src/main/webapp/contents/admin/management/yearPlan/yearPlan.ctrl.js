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
    			vm.page='planList';
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
    		
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};
    		
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
    		};
    		
    	}//init_planList
    	function init_planList(){
    		yearPlanSvc.grid_planList(vm);
    	}//init_planBZList    
    	
    	function init_planCreate(){
    		vm.create=function(){    		
    			yearPlanSvc.plan_create(vm);
    		};
    	}//init_planBZList 
    	
    	function init_planUpadte(){
    		yearPlanSvc.getPlanById(vm);
    		vm.update=function(){
    			yearPlanSvc.plan_update(vm);
    		};
    	}//init_planUpadte
    	
    	function init_planBZ(){   		
    		yearPlanSvc.grid_yearPlan_shenbaoInfoList(vm);//查询年度计划编制中的申报信息列表
    		yearPlanSvc.grid_yearPlan_addShenbaoInfoList(vm);//查询所有的可添加的申报信息列表 
    		
    		//添加项目计划弹出模态框
    		vm.dialog_addPlan=function(){
    			 $('#addPlanList').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
    		};
    		//年度筛选
    		vm.search=function(){
    			vm.addPlanGridOptions.dataSource.filter([
    				{field:"projectShenBaoStage",operator:"eq",value:common.basicDataConfig().projectShenBaoStage_nextYearPlan},
    				{field:"processState",operator:"eq",value:common.basicDataConfig().processState_qianShou},
    				{field:"planYear",operator:"eq",value:parseInt(vm.planYearSearch)}
    			]);
    			vm.addPlanGridOptions.dataSource.read();
    		};
    		//模态框点击确认
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
                    yearPlanSvc.addShenBaoInfoconfirm(vm,idStr);//添加申报信息到计划中                  
                }   
    		};
    		//编制计划中的申报信息
    		 vm.popOver=function(e,id){
    			 //根据申报信息id查询出年度计划编制
    			 vm.currentCapitalId=id;
    			 yearPlanSvc.getYearPlanCapitalById(vm,id);
    			 //编制信息输入显示
    	    	   vm.isPopOver=true;
    	    	   var minClick=$(document).height()-50-230;
    	    	   if(e.pageY>minClick){
    	    		   e.pageY=minClick;
    	    	   }
    	    	   vm.popStyle={    	    			  
    	    			   left:e.pageX+'px',
    	    			   top:e.pageY+'px'
    	    	   };  
    	       };//popOver
    	     //更新编制信息  
    		 vm.updateCapital = function(id){
    			 yearPlanSvc.updateYearPlanCapital(vm);
    		 };
    		 //移除计划中的申报信息
    		 vm.removeYearPlanCapital=function(){
    	    		var selectIds = common.getKendoCheckId('.yearPlanCapitalGrid');
    	            if (selectIds.length == 0) {
    	            	common.alert({
    	                	vm:vm,
    	                	msg:'请选择数据'              	
    	                });
    	            } else {
    	            	var ids=[];
    	                for (var i = 0; i < selectIds.length; i++) {
    	                	ids.push(selectIds[i].value);
    					}
    	                var idStr=ids.join(',');  
    	                yearPlanSvc.removeYearPlanCapital(vm,idStr);
    	            }
    	    	};//removeYearPlanCapital   			
    	}//init_planBZ   	    	    	   	
    } //yearPlan
})();
