(function () {
    'use strict';

    angular
        .module('app')
        .controller('mediationManagementCtrl', mediationManagement);

    mediationManagement.$inject = ['$location','mediationManagementSvc','$state','$scope']; 

    function mediationManagement($location, mediationManagementSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.model={}; 
    	vm.basicData={};
    	vm.model.display = false;
    	vm.id=$state.params.id;
    	vm.init=function(){
         	var routeName=$state.current.name;  
         	switch (routeName) {
 			case "mediationUnitList":
 				vm.page="mediationUnitList";
 				break;
 			case "mediationUnitChange":
 				if(vm.id){
 					vm.page="mediationUnitUpdate";
 				}else{
 					vm.page="mediationUnitCreate";
 				}break;
 			case "mediationUnitDetails":
 				vm.page="mediationUnitDetails";
 			} ;
         	vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};
         };//end init 
         
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='mediationUnitList'){
        		vm.title="中介单位列表" ;
        		page_mediationUnitList();
        	} 
        	if(vm.page=='mediationUnitUpdate'){
        		vm.title="中介单位编辑" ;
        		page_mediationUnitUpdate();
        	} 
        	if(vm.page=='mediationUnitCreate'){
        		vm.title="中介单位新增" ;
        		page_mediationUnitCreate();
        	} 
        	if(vm.page=='mediationUnitDetails'){
        		vm.title="中介单位信息查看" ;
        		page_mediationUnitDetails();
        	} 
        }
        function page_mediationUnitDetails(){
        	mediationManagementSvc.geMediationUnitById(vm);
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        }
        function page_mediationUnitList(){
        	mediationManagementSvc.unitGrid(vm);
        	vm.delMediationUnit = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	mediationManagementSvc.delMediationUnit(vm,id);
                         }
                     });
                };
             vm.delMediationUnits = function () {     
                	var selectIds = common.getKendoCheckId('.grid');
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
                        vm.delMediationUnit(idStr);
                    }   
               };
        	
        }
        function page_mediationUnitUpdate(){
        	mediationManagementSvc.geMediationUnitById(vm);
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.updateMediationUnit=function(){
        		mediationManagementSvc.updateMediationUnit(vm);
        	}
        }
        function page_mediationUnitCreate(){
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.createMediationUnit=function (){
        		mediationManagementSvc.createMediationUnit(vm);
        	}
        }
        
        function page_mediationManagementList(){
        	mediationManagementSvc.softwarGrid(vm);
        	vm.del = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	mediationManagementSvc.del(vm,id);
                         }
                     });
                };
             vm.dels = function () {     
                	var selectIds = common.getKendoCheckId('.grid');
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
                        vm.del(idStr);
                    }   
               };
        }
      
       
    }
})();
