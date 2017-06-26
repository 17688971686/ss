(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('projectCtrl', project);

    project.$inject = ['$location','projectSvc','$state','$scope']; 

    function project($location, projectSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = "新增项目";
        vm.id=$state.params.id;
        vm.model={};        
        vm.page='list';
        vm.init=function(){
        	if($state.current.name=='projectEdit'){
    			vm.page='create';
    		}
    		if(vm.id){
    			vm.page='update';
    		}
    		if($state.current.name=='project_projectInfo'){
            	vm.page='projectInfo';
            }
        }
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='create'){
        		//新增
        		page_create();        		
        	}
        	if(vm.page=='update'){
        		//编辑
        		page_create(); 
        		page_update();        		
        	}
        	if(vm.page=='projectInfo'){
        		//查询项目信息
        		page_projectInfo();
        	}
        }
        
       function page_list(){      
    	   projectSvc.grid(vm);
        }//end#page_list
       
       function page_create(){
    	   	//设置单位信息
    	   	projectSvc.getUserUnit(vm);
	   		//begin#基础数据
	   		vm.basicData={};    
	   		//项目阶段
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);
	   		//项目类型
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);
	   		//项目类别
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);
	   		//项目分类
	   		vm.basicData.projectClassify=common.getBacicDataByIndectity(common.basicDataConfig().projectClassify);
	   		//功能分类科目
	   		vm.basicData.projectFunctionClassify=common.getBacicDataByIndectity(common.basicDataConfig().projectFunctionClassify);
	   		//政府经济分类科目
	   		vm.basicData.projectGoverEconClassify=common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
	   		//资金其他来源类型
	   		vm.basicData.capitalOther=common.getBacicDataByIndectity(common.basicDataConfig().capitalOtherType);
	   		//行业归口
	   		vm.basicData.projectIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);	   		   			   		
	   		vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		}	   		 	   			   					
	   		//end#基础数据
	   		
	   		//批复文件上传
	   		vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];

	   		vm.uploadSuccess=function(e){
	    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
		           	 if(e.XMLHttpRequest.status==200){
		           		 var fileName=e.XMLHttpRequest.response;
		           		 $scope.$apply(function(){
		           			 if(vm.model.attachmentDtos){
		           				 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
		           			 }else{
		           				 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
		           			 }                			           			
		           		 });
		           	 }
	   		}
	   		 vm.delFile=function(idx){
	           	 vm.model.attachmentDtos.splice(idx,1);
	            }
	   		 
	   		 vm.capitalTotal=function(){
	   			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
	   			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
	   			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
	   			 		+ (parseFloat(vm.model.capitalOther)||0) ;
	   		 }
		        
	   		 vm.create = function () {    			 
	   		     projectSvc.createProject(vm);    		     
	   		 }
       }//end#page_create
       
       function page_update(){
    	   vm.title = "编辑项目";
    	   projectSvc.getProjectById(vm);
   		//更新项目
   		vm.update = function(){
   			projectSvc.updateProject(vm);
   		}   	   		
       }//end#page_update
       
       function page_projectInfo(){
    	   projectSvc.getUserUnit(vm);
    	   projectSvc.getProjectById(vm);
       }//end#page_projectInfo
		
              
    }
})();