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
        vm.search={};
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
    		};
    		
    		vm.checkLength = function(obj,max,id){
    			 common.checkLength(obj,max,id);
    		};
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
    		  vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目
    	   };
    	   //点击模态框确认按钮跳转不同的信息录入页面
    	   vm.confirmInvestmentType=function(){
    		   $(".modal-backdrop").remove();
    		   $location.path("/projectEdit//"+vm.model.projectInvestmentType);
    	   };
    	   //项目名称过滤查询
    	   vm.search=function(){
    		   var hasProjectName = vm.search.projectName !=null && !vm.search.projectName=='';
    		   var hasIsIncludLibrary = vm.search.isIncludLibrary !=null && !vm.search.isIncludLibrary=='';
    		   if(hasProjectName && hasIsIncludLibrary){
    			   if(vm.search.isIncludLibrary != 'all'){
    				   vm.gridOptions.dataSource.filter([
            			   {field:'isLatestVersion',operator:'eq',value:true},
            			   {field:'projectName',operator:'contains',value:vm.search.projectName},
            			   {field:'isIncludLibrary',operator:'eq',value:vm.search.isIncludLibrary}
            		   ]); 
    			   }else{
    				   vm.gridOptions.dataSource.filter([
            			   {field:'isLatestVersion',operator:'eq',value:true},
            			   {field:'projectName',operator:'contains',value:vm.search.projectName}
            		   ]);  
    			   }
    		   }else if(hasProjectName && !hasIsIncludLibrary){
    			   vm.gridOptions.dataSource.filter([
        			   {field:'isLatestVersion',operator:'eq',value:true},
        			   {field:'projectName',operator:'contains',value:vm.search.projectName}
        		   ]);  
    		   }else if(!hasProjectName && hasIsIncludLibrary){
    			   if(vm.search.isIncludLibrary != 'all'){
    				   vm.gridOptions.dataSource.filter([
            			   {field:'isLatestVersion',operator:'eq',value:true},
            			   {field:'isIncludLibrary',operator:'eq',value:vm.search.isIncludLibrary}
            		   ]);   
    			   }
    		   }  		  
    		   vm.gridOptions.dataSource.read();
    	   }
        }//end#page_list
       
       function page_create(){
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
    	   
    	   	//设置单位信息
    	   	projectSvc.getUserUnit(vm);
    	   	
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
	   		vm.uploadType=[['JYS','项目建议书批复'],['KXXYJBG','可行性研究报告批复'],['CBSJYGS','初步设计与概算批复']];
	   		//相关附件文件上传文件种类
	   		vm.relatedType=[['XMJYSPF','项目建议书文本'],['KXXYJBGPF','可行性研究报告文本'],['ZGSPFTZ','总概算及调整文本'],
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
	   		
	   		//展示批复文件选择模态框
	   		vm.choseDocument = function(e){
	   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
        	   $("#documentRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
	   		};
	   		projectSvc.documentRecordsGird(vm);//查询批复文件
	   		
	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			$(".modal-backdrop").remove();
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	
   			    if(vm.model.attachmentDtos){
   				  vm.model.attachmentDtos.push({name:fileName,url:fileName,type:vm.pifuType});
   			    }else{
   				  vm.model.attachmentDtos=[{name:fileName,url:fileName,type:vm.pifuType}];
   			    }    			          		
	        };
	   		
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
	   		//批复文件上传配置
	   		vm.uploadOptions_pifu={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:false,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		//相关附件上传配置
	   		vm.uploadOptions={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
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
   		
	   		vm.update = function(){
	   			vm.model.projectType =vm.model.projectType.join(",");
	   			projectSvc.updateProject(vm);
	   		};   	   		
       }//end#page_update
       
       function page_projectInfo(){
    	   $(".modal-backdrop").remove();
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
       }//end#page_projectInfo
		
    }
})();