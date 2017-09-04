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
    	vm.model.projectDto={};
    	vm.model.mediationUnitDtos=[];
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
 				break;
 			case "assistReviewList":
 				vm.page="assistReviewList";
 				break;
 			case "assistReviewChange":
 				if(vm.id){
 					vm.page="assistReviewUpdate";
 				}else{
 					vm.page="assistReviewCreate";
 				}break; 
 			case "assistReviewDetails":
 				vm.page="assistReviewDetails";
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
        	if(vm.page=='assistReviewList'){
        		vm.title="协审活动列表" ;
        		page_assistReviewList();
        	} 
        	if(vm.page=='assistReviewUpdate'){
        		vm.title="协审活动编辑" ;
        		page_assistReviewUpdate();
        	} 
        	if(vm.page=='assistReviewCreate'){
        		vm.title="协审活动新增" ;
        		page_assistReviewCreate();
        	} 
        	if(vm.page=='assistReviewDetails'){
        		vm.title="协审活动详情" ;
        		page_assistReviewDetails();
        	}
        }
        function page_assistReviewDetails(){
        	mediationManagementSvc.getAssistReviewById(vm);
        }
        function page_assistReviewCreate(){
        	vm.choiceProject=function(){
            	 $('.myDialog').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
            }
       	vm.choiceMediationUnit=function(){
      		 $('.myDialog1').modal({
                   backdrop: 'static',
                   keyboard:false
               });
      	    }
       	mediationManagementSvc.mediationUnitGrid(vm);
       	mediationManagementSvc.projectGrid(vm);
       	//提交选择项目
           vm.choiceProjectSubmit=function(){
           	var str=$('input:radio[name="radio"]:checked').val();
           	 if (str==""||str==null) {
                	/*common.alert({
                    	vm:vm,
                    	msg:'请选择数据'
                    	
                    });*/
                } else {
               	 var strs= new Array(); //定义一数组 
                	 strs=str.split(","); //字符分割 
                	 vm.model.projectDto.id=strs[0];
                	 vm.model.projectDto.projectName=strs[1];
                	 $('.myDialog').modal('hide');
                }
           
         }
       	 //提交选择专家
       	vm.choiceAssistReviewSubmit=function(){
        	   if(vm.model.mediationUnitDtos.length>0){
        		   vm.model.mediationUnitDtos=[];
        	   }
        	   $('input[type="checkbox"][name="mediationUnit"]:checked').each(
                       function(i) {
                           var strs=[]; //定义一数组 
	                    	strs=$(this).val().split(","); //字符分割 
	                    	vm.model.mediationUnitDtos.push({id:strs[0],mediationUnitName:strs[1]});
	                    	$('.myDialog1').modal('hide');
                       }
                   );
        	   
           }
       	 //移除选择项目
           vm.removeProject=function(){
            	 vm.model.projectDto={};            
                 } 
       	//移除选择专家
       	 vm.removeMediationUnit=function(i){
          	 vm.model.mediationUnitDtos.splice(i,1);
           } 
       	vm.createAssistReview=function(){
       		mediationManagementSvc.createAssistReview(vm);
       	}
        }
        
        function page_assistReviewUpdate(){
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.choiceProject=function(){
             	 $('.myDialog').modal({
                      backdrop: 'static',
                      keyboard:false
                  });
             }
        	vm.choiceMediationUnit=function(){
       		 $('.myDialog1').modal({
                    backdrop: 'static',
                    keyboard:false
                });
       	    }
        	mediationManagementSvc.mediationUnitGrid(vm);
        	mediationManagementSvc.projectGrid(vm);
        	//提交选择项目
            vm.choiceProjectSubmit=function(){
            	var str=$('input:radio[name="radio"]:checked').val();
            	 if (str==""||str==null) {
                 	/*common.alert({
                     	vm:vm,
                     	msg:'请选择数据'
                     	
                     });*/
                 } else {
                	 var strs= new Array(); //定义一数组 
                 	 strs=str.split(","); //字符分割 
                 	 vm.model.projectDto.id=strs[0];
                 	 vm.model.projectDto.projectName=strs[1];
                 	 $('.myDialog').modal('hide');
                 }
            
          }
        	 //提交选择专家
        	vm.choiceAssistReviewSubmit=function(){
         	   if(vm.model.mediationUnitDtos.length>0){
         		   vm.model.mediationUnitDtos=[];
         	   }
         	   $('input[type="checkbox"][name="mediationUnit"]:checked').each(
                        function(i) {
                            var strs=[]; //定义一数组 
 	                    	strs=$(this).val().split(","); //字符分割 
 	                    	vm.model.mediationUnitDtos.push({id:strs[0],mediationUnitName:strs[1]});
 	                    	$('.myDialog1').modal('hide');
                        }
                    );
         	   
            }
        	 //移除选择项目
            vm.removeProject=function(){
             	 vm.model.projectDto={};            
                  } 
        	//移除选择专家
        	 vm.removeMediationUnit=function(i){
           	 vm.model.mediationUnitDtos.splice(i,1);
            } 
        	 vm.updateAssistReview=function(){
        		 mediationManagementSvc.updateAssistReview(vm);
        	 }
        }
        function page_assistReviewList(){
        	mediationManagementSvc.assistReviewGrid(vm);
        	vm.delAssistReview = function (id) {        	 
                common.confirm({
                    	 vm:vm,
                    	 title:"",
                    	 msg:"确认删除数据吗？",
                    	 fn:function () {
                          	$('.confirmDialog').modal('hide');             	
                          	mediationManagementSvc.delAssistReview(vm,id);
                         }
                     });
                };
             vm.delAssistReviews = function () {     
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
                        vm.delAssistReview(idStr);
                    }   
               };
        	
        	
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
