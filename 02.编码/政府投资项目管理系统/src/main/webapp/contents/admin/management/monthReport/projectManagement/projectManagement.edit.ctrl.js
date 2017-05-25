(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectManagementEditCtrl', projectManagement);

    projectManagement.$inject = ['$location','projectManagementSvc','$state','$scope']; 

    function projectManagement($location, projectManagementSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};
        vm.title = '添加项目';
        vm.isuserExist=false;
        vm.id = $state.params.id;
        vm.basicData = {};
        
      
    	
        if (vm.id) {
            vm.isUpdate = true;
            vm.title = '更新项目';
        }
        
        vm.capitalTotal=function(){        
        	return parseInt(vm.model.capitalShiCaiZheng||0)
        			+parseInt(vm.model.capitalQuCaiZheng||0) 
        			+parseInt(vm.model.capitalSheHuiTouZi||0) 
        			+parseInt(vm.model.capitalGuoTuZiJin||0) 
        			+parseInt(vm.model.capitalSheHuiTouZi||0) 
        			+parseInt(vm.model.capitalZhuanXiangZiJin||0) 
        			+parseInt(vm.model.capitalShengBu||0) 
        			+parseInt(vm.model.capitalZiChou||0) 
        			+parseInt(vm.model.capitalZhengFuTongChou||0) 
        			+parseInt(vm.model.capitalJiaoYuFuJia||0) 
        			+parseInt(vm.model.capitalOther||0) 
        			;     	
        }
        vm.capitalTotal2=function(){        
        	return parseInt(vm.model.capital2ShiCaiZheng||0)
        			+parseInt(vm.model.capital2QuCaiZheng||0) 
        			+parseInt(vm.model.capital2SheHuiTouZi||0) 
        			+parseInt(vm.model.capital2GuoTuZiJin||0) 
        			+parseInt(vm.model.capital2SheHuiTouZi||0) 
        			+parseInt(vm.model.capital2ZhuanXiangZiJin||0) 
        			+parseInt(vm.model.capital2ShengBu||0) 
        			+parseInt(vm.model.capital2ZiChou||0) 
        			+parseInt(vm.model.capital2ZhengFuTongChou||0) 
        			+parseInt(vm.model.capital2JiaoYuFuJia||0) 
        			+parseInt(vm.model.capital2Other||0) 
        			;     	
        }
        vm.capitalTotal3=function(){        
        	return parseInt(vm.model.capital3ShiCaiZheng||0)
        			+parseInt(vm.model.capital3QuCaiZheng||0) 
        			+parseInt(vm.model.capital3SheHuiTouZi||0) 
        			+parseInt(vm.model.capital3GuoTuZiJin||0) 
        			+parseInt(vm.model.capital3SheHuiTouZi||0) 
        			+parseInt(vm.model.capital3ZhuanXiangZiJin||0) 
        			+parseInt(vm.model.capital3ShengBu||0) 
        			+parseInt(vm.model.capital3ZiChou||0) 
        			+parseInt(vm.model.capital3ZhengFuTongChou||0) 
        			+parseInt(vm.model.capital3JiaoYuFuJia||0) 
        			+parseInt(vm.model.capital3Other||0) 
        			;     	
        }
        vm.page_edit_init=function(){
               	  
        	vm.upload_files=[]; 
          	$("#files").kendoUpload({
                  async: {
                      saveUrl: "/common/save",
                      removeUrl: "/common/remove",
                      autoUpload: true
                  },
                  showFileList:false,
                  select:function(e){
                 	 console.log("select:");
                 	 console.log(e);
                  },
                  success:function(e){
                  	
                  },
                  error:function(e){
                 	 console.log("error:");
                 	 console.log(e);
                 	 if(e.XMLHttpRequest.status==200){
                 		 var fileName=e.XMLHttpRequest.response;
                 		 $scope.$apply(function(){
                 			 if(vm.model.attachmentDtos){
                 				 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName});
                 			 }else{
                 				 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName}];
                 			 }                			           			
                 		 });
                 		 
                 	 }
                  },
                  localization: {
                      select: "上传文件"
                  }
              });
          	
          	vm.delFile=function(idx){
           	 vm.model.attachments.splice(idx,1);
            }
        }
        
        vm.update = function(){
        	projectManagementSvc.updateProjectInfo(vm);
        }
        
        vm.create = function(){
        	projectManagementSvc.createProjectInfo(vm);
        }
         
        vm.createMateria=function(){
        	if(vm.model.attachmentDtos){
        		vm.model.attachmentDtos.push({type:'',isUpload:'',name:'',modifiedDate:'',solutionsAndSuggest:''});
        	}else{
        		vm.model.attachmentDtos=[{type:'',isUpload:'',name:'',modifiedDate:'',solutionsAndSuggest:''}];
        	}
        }
        
	 	 vm.deleteMateria = function(idx){
	 		vm.model.attachmentDtos.splice(idx,1);        	
	      }
      
        
        activate();
        function activate() {
        	
        	
        	projectManagementSvc.getBasicData(vm,"projectInvestmentType");//获取投资类型
        	projectManagementSvc.getBasicData(vm,"projectStage");//获取项目阶段
        	projectManagementSvc.getBasicData(vm,"projectIndustry");//获取行业归口
        	projectManagementSvc.getBasicData(vm,"projectClassifiy");//获取项目分类
        	projectManagementSvc.getBasicData(vm,"projectType");//获取项目类型
        	projectManagementSvc.getBasicData(vm,"projectStatus");//获取项目状态
        	projectManagementSvc.getBasicData(vm,"projectConstrChar");//获取项目建设性质
        	projectManagementSvc.getBasicData(vm,"unitProperty");//获取单位性质
        	projectManagementSvc.getBasicData(vm,"qualifiyLevel");//获取单位资质等级
        	
        	setTimeout(() => {
        		if (vm.isUpdate) {//更新项目
            		projectManagementSvc.getProjectInfoById(vm);
                } 
			}, 2000);
        	
        	
        }
    }
})();
