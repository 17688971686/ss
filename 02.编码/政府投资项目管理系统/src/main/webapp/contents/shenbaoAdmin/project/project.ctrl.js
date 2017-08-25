(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('projectCtrl', project);

    project.$inject = ['$location','projectSvc','$state','$scope','$sce']; 

    function project($location, projectSvc,$state,$scope,$sce) {
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
        	if($state.current.name=='projectEdit'){//新增项目信息页面
    			vm.page='create';
    		}
    		if(vm.id){//编辑项目信息页面
    			vm.page='update';
    		}
    		if($state.current.name=='project_projectInfo'){//项目详情页面
            	vm.page='projectInfo';
            }

    		vm.getBasicDataDesc = function(str){
    			return common.getBasicDataDesc(str);
    		};
    		
    		vm.checkLength = function(obj,max,id){
    			 common.checkLength(obj,max,id);
    		};
    		
    		vm.html=function(val){
    			return $sce.trustAsHtml(val);
    		};
    		//用于查询、新增、编辑--基础数据初始化
    		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
    		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
	   		vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();//获取街道信息
	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){//列表页
        		page_list();
        	}
        	if(vm.page=='create'){//新增
        		//初始化CheckBox
        		vm.model.projectType =[];
        		page_create();        		
        	}
        	if(vm.page=='update'){//编辑
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
    	   //条件查询
    	   vm.search=function(){
    		   var filters = [];
    		   filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--查询最新版本的项目
    		   if(vm.search.projectName !=null && vm.search.projectName !=''){
    			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
    		   }
    		   if(vm.search.projectStage !=null && vm.search.projectStage !=''){
    			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
    		   }
    		   if(vm.search.isIncludLibrary !=null && vm.search.isIncludLibrary !=null){
    			   if(vm.search.isIncludLibrary == "true"){
    				   filters.push({field:'isIncludLibrary',operator:'eq',value:true}); 
    			   }else if(vm.search.isIncludLibrary == "false"){
    				   filters.push({field:'isIncludLibrary',operator:'eq',value:false}); 
    			   }
    		   }
    		   if(vm.search.unitName !=null && vm.search.unitName !=''){
      			  filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
      		   }
    		   vm.gridOptions.dataSource.filter(filters);
    	   };
        }//end#page_list
       
       function page_create(){
    	   //新建项目相关数据初始化
    	   vm.model.projectInvestmentType = vm.projectInvestmentType;//项目投资类型用于数据收集
			//资金处理没有就显示为0
			vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
			vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
			vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
			vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
			vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
			vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
			vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
			vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算
			vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
			vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
			//资金来源计算
	   		 vm.capitalTotal=function(){
	   			 return common.getSum([
	   					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
	   					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
	   					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
	   					 vm.model.capitalOther||0]);
	   		 };
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
    	   
    	   	//设置项目所属单位信息
    	   	projectSvc.getUserUnit(vm);
	   			   		
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
	   		vm.relatedType=common.uploadFileTypeConfig().projectEdit;

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
            	if(fileName){
            		var file = common.stringToArray(fileName,",");
            		var number = file[0];
            		var name = file[1];
            		var url =file[2];
            		vm.model['pifu'+vm.pifuType+'_wenhao'] = number;
            		if(vm.model.attachmentDtos){
         				  vm.model.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
         			 }else{
         				  vm.model.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
         			 }
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
	   		//删除上传文件
	   		 vm.delFile=function(idx){
	   			 var file = vm.model.attachmentDtos[idx];
	   			 if(file){//删除上传文件的同时删除批复文号
	   				var pifuType = file.type;
	   				vm.model['pifu'+pifuType+'_wenhao'] = "";
	   				vm.model.attachmentDtos.splice(idx,1);
	   			 }
	         };
		     //创建  
	   		 vm.create = function () {
	   		     projectSvc.createProject(vm);	   		     
	   		 };
       }//end#page_create
       
       function page_update(){
    	   	vm.title = "编辑项目";
    	   	projectSvc.getProjectById(vm);
   		
	   		vm.update = function(){
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
    	 //资金来源计算
   		 vm.capitalTotal=function(){
   			 return common.getSum([
   					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
   					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
   					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
   					 vm.model.capitalOther||0]);
   		 };
    	 //相关附件文件上传文件种类
    	   vm.relatedType=common.uploadFileTypeConfig().projectEdit;
       }//end#page_projectInfo
		
    }
})();