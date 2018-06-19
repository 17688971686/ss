(function () {
    'use strict';

    angular
        .module('appSupervision')
        .controller('handleFeedbackCtrl', handleFeedback);

    handleFeedback.$inject = ['$location','handleFeedbackSvc','$state','$scope']; 

    function handleFeedback($location,handleFeedbackSvc,$state,$scope) {
    	var vm = this;
    	vm.shenbaoInfoId=$state.params.shenbaoInfoId;
    	vm.projectId=$state.params.projectId;
    	vm.processInstanceId=$state.params.processInstanceId;
    	vm.attachmentDtos = [];
    	vm.projectInfo = {};
    	
    	vm.feedback = function(){
    		handleFeedbackSvc.feedback(vm);
    	}
    	
		vm.checkLength = function(obj,max,id){
 			common.checkLength(obj,max,id);
      	};
      	
      	handleFeedbackSvc.getCurrentTaskKey(vm,vm.processInstanceId);
      	
        //审批的附件类型
		vm.approvalAttsType = common.uploadFileTypeConfig().approvalAttsType;
		
		handleFeedbackSvc.getApprovalAtts(vm,vm.projectId);
/****************************************************************上传附件 begin**********************************************************************************************************/ 
    	//相关附件文件上传文件种类
   		vm.uploadSuccess_feedback=function(e){
			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
           	 if(e.XMLHttpRequest.status==200){
           		 var fileName=e.XMLHttpRequest.response;
           		 $scope.$apply(function(){
           			 if(vm.attachmentDtos){
           				vm.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
           			 }else{
           				vm.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
           			 }                			           			
           		 });
           	 }
   		};
   		
   		//相关附件上传配置
   		vm.uploadOptions_feedback={
			async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
			error:vm.uploadSuccess_feedback,	   				
			localization:{select:'上传文件'},
			showFileList:false,
			multiple:true,
			validation: {
                maxFileSize: common.basicDataConfig().uploadSize
            },
            select:vm.onSelect
   		};
   		
   		//删除上传文件
		vm.delFile_feedback=function(idx){
			var file = vm.attachmentDtos[idx];
			if(file){
			   vm.attachmentDtos.splice(idx,1);
			}
	    };  	
         
	    //选择上传文件验证文件大小
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
		
/****************************************************************上传附件 end**********************************************************************************************************/ 
    }
})();
