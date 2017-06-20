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
	   		vm.basicData.projectStage=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectStage'&&x.pId=='projectStage';})
	   		.toArray();
	   		//项目类型
	   		vm.basicData.projectType=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectType'&&x.pId=='projectType';})
	   		.toArray();
	   		//项目类别
	   		vm.basicData.projectCategory=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectCategory'&&x.pId=='projectCategory';})
	   		.toArray();
	   		//行业归口
	   		vm.basicData.projectIndustry=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectIndustry'&&x.pId=='projectIndustry';})
	   		.toArray();    		
	   		
	   		vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity=='projectIndustry'&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		}
	   		//投资类型
	   		vm.basicData.projectInvestmentType=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectInvestmentType'&&x.pId=='projectInvestmentType';})
	   		.toArray(); 
	   		//项目分类
	   		vm.basicData.projectClassify=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectClassify'&&x.pId=='projectClassify';})
	   		.toArray();
	   		//资金其他来源类型
	   		vm.basicData.capitalOther=$linq(common.getBasicData())
 			.where(function(x){return x.identity=='capitalOtherType'&&x.pId=='capitalOtherType';})
 			.toArray();
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
    	   projectSvc.getProjectById(vm);
       }//end#page_projectInfo
		
              
    }
})();