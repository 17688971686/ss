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
 				break;
 			case "serviceEvaluation":
 				vm.page="serviceEvaluation"; 
 				break;
 			case "submitReviewEvaluation":
 				vm.page="submitReviewEvaluation"; 
 				
 			}
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
        	if(vm.page=='serviceEvaluation'){
        		vm.title="服务质量评价" ;
        		page_serviceEvaluation();
        	}
        	if(vm.page=='submitReviewEvaluation'){
        		vm.title="送审文件质量评价" ;
        		page_submitReviewEvaluation();
        	}
        }
        function page_submitReviewEvaluation(){
        	vm.submitReviewEvaluation=function(){
        		 mediationManagementSvc.updateAssistReview(vm);
        	};
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.basicData.rating=common.getBacicDataByIndectity(common.basicDataConfig().serviceRating);
       	    vm.delFile=function(index,i){
     		     var file = vm.model.submitReviewEvaluationDtos[index].attachmentDtos[i];
     		     console.log(file);
 	   			 if(file){
 	   				vm.model.submitReviewEvaluationDtos[index].attachmentDtos.splice(i,1);
 	   			 }
     	   };
     	//文件选择触发验证文件大小
  		vm.onSelect=function(e){
	   			$.each(e.files, function (index, value) {
	   	            if(value.size > common.basicDataConfig().uploadSize){
	   	            	$scope.$apply(function(){
	   		   				common.alert({
	   			        		vm : vm,
	   							msg : "上传文件过大！"
	   			            });               			           			
	   	          		 });
	   	            }
	   	            
	   	        });
	   		};
     	 vm.uploadSuccess=function(e){
 			var index=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 console.log(index);
	           			 if(vm.model.submitReviewEvaluationDtos[index].attachmentDtos){
	           				 vm.model.submitReviewEvaluationDtos[index].attachmentDtos.push({name:fileName.split('_')[2],url:fileName});
	           			 }else{
	           				 vm.model.submitReviewEvaluationDtos[index].attachmentDtos=[];
	           				 vm.model.submitReviewEvaluationDtos[index].attachmentDtos=[{name:fileName.split('_')[2],url:fileName}];
	           			 }   
	           		 });
	           	 }
		};
		vm.uploadOptions={
  				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
  				error: vm.uploadSuccess,   				
  				localization:{select:'上传文件'},
  				showFileList:false,
  				multiple:true,
  				validation: {
  	                maxFileSize: common.basicDataConfig().uploadSize
  	            },
  	            select:vm.onSelect
  		};
        }
        function page_serviceEvaluation(){
        	vm.submitServiceEvaluation=function(){
        		 mediationManagementSvc.updateAssistReview(vm);
        	};
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.basicData.rating=common.getBacicDataByIndectity(common.basicDataConfig().serviceRating);
        	 vm.delFile=function(index,i){
      		     var file = vm.model.serviceEvaluationDtos[index].attachmentDtos[i];
      		     console.log(file);
  	   			 if(file){
  	   				vm.model.serviceEvaluationDtos[index].attachmentDtos.splice(i,1);
  	   			 }
      	   };
      	//文件选择触发验证文件大小
   		vm.onSelect=function(e){
	   			$.each(e.files, function (index, value) {
	   	            if(value.size > common.basicDataConfig().uploadSize){
	   	            	$scope.$apply(function(){
	   		   				common.alert({
	   			        		vm : vm,
	   							msg : "上传文件过大！"
	   			            });               			           			
	   	          		 });
	   	            }
	   	            
	   	        });
	   		};
      	 vm.uploadSuccess=function(e){
  			var index=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 console.log(index);
	           			 if(vm.model.serviceEvaluationDtos[index].attachmentDtos){
	           				 vm.model.serviceEvaluationDtos[index].attachmentDtos.push({name:fileName.split('_')[2],url:fileName});
	           			 }else{
	           				 vm.model.serviceEvaluationDtos[index].attachmentDtos=[];
	           				 vm.model.serviceEvaluationDtos[index].attachmentDtos=[{name:fileName.split('_')[2],url:fileName}];
	           			 }   
	           		 });
	           	 }
 		};
 		vm.uploadOptions={
   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
   				error: vm.uploadSuccess,   				
   				localization:{select:'上传文件'},
   				showFileList:false,
   				multiple:true,
   				validation: {
   	                maxFileSize: common.basicDataConfig().uploadSize
   	            },
   	            select:vm.onSelect
   		};
        	
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
            };
       	vm.choiceMediationUnit=function(){
      		 $('.myDialog1').modal({
                   backdrop: 'static',
                   keyboard:false
               });
      	    };
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
               	 var strs= []; //定义一数组 
                	 strs=str.split(","); //字符分割 
                	 vm.model.projectDto.id=strs[0];
                	 vm.model.projectDto.projectName=strs[1];
                	 $('.myDialog').modal('hide');
                }
           
         };
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
        	   
           };
       	 //移除选择项目
           vm.removeProject=function(){
            	 vm.model.projectDto={};            
                 };
       	//移除选择专家
       	 vm.removeMediationUnit=function(i){
          	 vm.model.mediationUnitDtos.splice(i,1);
           };
       	vm.createAssistReview=function(){
       		mediationManagementSvc.createAssistReview(vm);
       	};
        }
        
        function page_assistReviewUpdate(){
        	mediationManagementSvc.getAssistReviewById(vm);
        	vm.choiceProject=function(){
             	 $('.myDialog').modal({
                      backdrop: 'static',
                      keyboard:false
                  });
             };
        	vm.choiceMediationUnit=function(){
       		 $('.myDialog1').modal({
                    backdrop: 'static',
                    keyboard:false
                });
       	    };
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
                	 var strs= []; //定义一数组 
                 	 strs=str.split(","); //字符分割 
                 	 vm.model.projectDto.id=strs[0];
                 	 vm.model.projectDto.projectName=strs[1];
                 	 $('.myDialog').modal('hide');
                 }
            
          };
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
         	   
            };
        	 //移除选择项目
            vm.removeProject=function(){
             	 vm.model.projectDto={};            
                  }; 
        	//移除选择专家
        	 vm.removeMediationUnit=function(i){
        		 vm.model.mediationUnitDtos.splice(i,1);
            };
        	 vm.updateAssistReview=function(){
        		 mediationManagementSvc.updateOnlyAssistReview(vm);
        	 };
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
        	};
        }
        function page_mediationUnitCreate(){
        	vm.basicData.credentialsType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.createMediationUnit=function (){
        		mediationManagementSvc.createMediationUnit(vm);
        	};
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
