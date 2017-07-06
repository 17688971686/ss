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
    	vm.model={};
    	vm.basicData={};
        vm.id=$state.params.id;
        vm.projectInvestmentType=$state.params.projectInvestmentType;
    	vm.page="list";
    	function init(){    		
    		if($state.current.name=='projectEdit'){
    			vm.page='create';
    		}
    		if(vm.id){
    			vm.page='update';
    		}
    		if($state.current.name=='projectDetails'){
    			vm.page='details';
    		}
    		
    		vm.getBasicDataDesc = function(Str){
    			return common.getBasicDataDesc(Str);
    		};
    	}
    	init();    	
    	activate();
        function activate() {
        	        	
        	if(vm.page=='list'){
        		init_list();
        	}
        	if(vm.page=='create'){
        		//初始化CheckBox
        		vm.model.projectType =[];
        		init_create();
        	}
        	if(vm.page=='update'){
        		init_create();
        		init_update();
        	}
        	if(vm.page=='details'){
        		init_details();
        	}
        }
    	
    	function init_list(){
    		projectSvc.grid(vm);
    		
    		//基础数据--项目投资类型用于新增项目模态框
     	   vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
     	   //点击新增项目弹出模态框
     	   vm.addProject = function(){
     		  $("#myModal_add").modal({
 			        backdrop: 'static',
 			        keyboard:false  			  
     		  });
     	   }
     	   //点击模态框确认按钮跳转不同的信息录入页面
     	   vm.confirmInvestmentType=function(){
     		   $(".modal-backdrop").remove();
     		   $location.path("/projectEdit//"+vm.model.projectInvestmentType);
     	   };
    		
    		vm.isMonthReport=function(id,isMonthReport){
    			vm.model.isMonthReport = isMonthReport;
    			vm.model.id=id;
    			//弹出模态框
    			$("#myModal_edit").modal({
                    backdrop: 'static',
                    keyboard:false
                });   			
    		};
    		
    		//更新项目是否填报状态
    		vm.updateIsMonthReport = function(){
    			projectSvc.updateIsMonthReport(vm);
    		}; 
    		
    		vm.del = function (id) {
                common.confirm({
               	 vm:vm,
               	 title:"",
               	 msg:"确认删除数据吗？",
               	 fn:function () { 
               		$('.confirmDialog').modal('hide');
                    projectSvc.deleteProject(vm,id);
                    }
                });
           };//del
    		
    		vm.dels = function(){
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
           };//dels         
    	}//init_list
    	
    	function init_create(){
    		vm.model.projectInvestmentType = vm.projectInvestmentType;//项目投资类型用于数据收集
     	   if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
     		   //基础数据--项目分类
     		  vm.basicData.projectClassify=$linq(common.getBasicData())
 	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
 	       		.toArray();
     		  //基础数据--行业归口
     		  vm.basicData.projectIndustry=$linq(common.getBasicData())
 	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
 	       		.toArray();
  			  vm.isZFInvestment = true; 			  
  		   }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
  			  //基础数据--项目分类
  			  vm.basicData.projectClassify=$linq(common.getBasicData())
 	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
 	       		.toArray();
  			  //基础数据--行业归口
  			 vm.basicData.projectIndustry=$linq(common.getBasicData())
 	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
 	       		.toArray();
  			 
  			vm.projectIndustryChange=function(){    		
 	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
 	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
 	       		.toArray();
 	   		};
  			  vm.isSHInvestment = true;
  		   }
    		//获取当前所有的用户单位信息
    		projectSvc.getUserUnits(vm);
    		
    		//begin#基础数据	   		    	   		
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.capitalOther=common.getBacicDataByIndectity(common.basicDataConfig().capitalOtherType);//资金其他来源类型
	   		vm.basicData.area_Street=$linq(common.getBasicData())
			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
			.toArray();//获取街道信息
	   		
	   		//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.model.projectType.indexOf(id);
	        	if(index == -1){
	        		vm.model.projectType.push(id);
		       	}else{
		       		vm.model.projectType.splice(index,1);
		       	}	        	
	        };
    		//end#基础数据
    		
    		//批复文件上传
    		vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
    		//相关附件文件上传文件种类
    		vm.relatedType=[['XMJYSPF','项目建议书批复文件'],['KXXYJBGPF','可行性研究报告批复文件'],['ZGSPFTZ','总概算批复及调整文件'],
				['HYJY','会议纪要'],['GHYJ','规划依据'],['SJXGT','设计效果图'],
				['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']];
	   		
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
			 		+ (parseFloat(vm.model.capitalOther)||0) ;
    	   };
	        
    	   vm.create = function () {
    		   vm.model.projectType =vm.model.projectType.join(",");
    		    projectSvc.createProject(vm);    		     
    		};    		     		     			    		 
    	}//init_create
    	
    	function init_update(){
    		vm.title = "编辑项目";
    		//获取项目信息
    		projectSvc.getProjectById(vm);
    		//更新项目
    		vm.update = function(){
    			vm.model.projectType =vm.model.projectType.join(",");
    			projectSvc.updateProject(vm);
    		};  	   		
    	}//init_update
    	
    	function init_details(){
    		projectSvc.getProjectById(vm);
    		
    		if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
   			  vm.isZFInvestment = true; 			  
   		   	}else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			  
   			  vm.isSHInvestment = true;
   		   	}
    		//相关附件文件上传文件种类
    		vm.relatedType=[['XMJYSPF','项目建议书批复文件'],['KXXYJBGPF','可行性研究报告批复文件'],['ZGSPFTZ','总概算批复及调整文件'],
				['HYJY','会议纪要'],['GHYJ','规划依据'],['SJXGT','设计效果图'],
				['XMQWT','项目区位图'],['XCTP','现场图片'],['QT','其他']];   		
    	}
    }
})();
