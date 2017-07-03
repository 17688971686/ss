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
        vm.id=$state.params.id;//请求中的id参数
        vm.projectInvestmentType=$state.params.projectInvestmentType;//请求中的projectInvestmentType参数
        vm.model={};
        vm.basicData={};
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

    		vm.getBasicDataDesc = function(str){
    			return common.getBasicDataDesc(str);
    		}   		
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='create'){
        		//初始化CheckBox
        		vm.model.projectType =[];
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
    	   //加载单位项目信息列表
    	   projectSvc.grid(vm);
    	   //基础数据--项目投资类型
    	   vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
    	   //点击新增项目弹出模态框
    	   vm.addProject = function(){
    		  $("#myModal").modal({
			        backdrop: 'static',
			        keyboard:false  			  
    		  });
    	   }
    	   //点击模态框确认按钮跳转不同的信息录入页面
    	   vm.confirmInvestmentType=function(){
    		   $(".modal-backdrop").remove();
    		   $location.path("/projectEdit//"+vm.model.projectInvestmentType);
    	   }
        }//end#page_list
       
       function page_create(){
    	   vm.model.projectInvestmentType = vm.projectInvestmentType;//项目投资类型用于数据收集
    	   if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
    		   //基础数据项目分类
    		  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
	       		.toArray();
 			  vm.isZFInvestment = true; 			  
 		   }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
 			  //基础数据项目分类
 			  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
	       		.toArray();
 			  vm.isSHInvestment = true;
 		   }
    	   	//设置单位信息
    	   	projectSvc.getUserUnit(vm);
	   		//begin#基础数据	   		    	   		
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.projectFunctionClassify=common.getBacicDataByIndectity(common.basicDataConfig().projectFunctionClassify);//功能分类科目
	   		vm.basicData.projectGoverEconClassify=common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);//政府经济分类科目	   		
	   		vm.basicData.capitalOther=common.getBacicDataByIndectity(common.basicDataConfig().capitalOtherType);//资金其他来源类型	   		
	   		vm.basicData.projectIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//行业归口
	   		vm.basicData_area_Street=$linq(common.getBasicData())
			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
			.toArray();//获取街道信息
	   		
	   		vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		}
	   		//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.model.projectType.indexOf(id);
	        	if(index == -1){
	        		vm.model.projectType.push(id);
		       	}else{
		       		vm.model.projectType.splice(index,1);
		       	}	        	
	        }
	   		//end#基础数据
	   		
	   		//批复文件上传
	   		vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
	   		//相关附件文件上传文件种类
	   		vm.relatedType=[['QQGZJH','前期工作计划文件'],['HYJY','会议纪要']];

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
	   		};
	   		 vm.delFile=function(idx){
	           	 vm.model.attachmentDtos.splice(idx,1);
	            };
	   		 
	   		 vm.capitalTotal=function(){
	   			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
	   			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
	   			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
	   			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
	   			 		+ (parseFloat(vm.model.capitalZYYS)||0 )
	   			 		+ (parseFloat(vm.model.capitalOther)||0) ;
	   		 };
		        
	   		 vm.create = function () {    	
	   			vm.model.projectType =vm.model.projectType.join(",");
	   		     projectSvc.createProject(vm); 
	   		     
	   		 };
       }//end#page_create
       
       function page_update(){
    	   vm.title = "编辑项目";
    	   projectSvc.getProjectById(vm);
   		//更新项目
   		vm.update = function(){
   			vm.model.projectType =vm.model.projectType.join(",");
   			projectSvc.updateProject(vm);
   		};   	   		
       }//end#page_update
       
       function page_projectInfo(){
    	   projectSvc.getProjectById(vm);
    	   if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
    		   //基础数据项目分类
    		  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
	       		.toArray();
 			  vm.isZFInvestment = true; 			  
 		   }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
 			  //基础数据项目分类
 			  vm.basicData.projectClassify=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
	       		.toArray();
 			  vm.isSHInvestment = true;
 		   }
    	 //相关附件文件上传文件种类
	   		vm.relatedType=[['QQGZJH','前期工作计划文件'],['HYJY','会议纪要']];
       }//end#page_projectInfo
		
    }
})();