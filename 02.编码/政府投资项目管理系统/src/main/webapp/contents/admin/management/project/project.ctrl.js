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
    	vm.search={};
    	vm.model={};
    	vm.basicData={};
        vm.id=$state.params.id;
        vm.projectInvestmentType=$state.params.projectInvestmentType;
    	vm.page="list";
    	function init(){
    		if($state.current.name=='project'){
    			vm.isZFInvestment = true;
    		}
    		if($state.current.name=='project_SH'){
    			vm.isSHInvestment = true;
    		}
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
    		
    		vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
    		};
    		
    		vm.html = function(val){
    			return $sce.trustAsHtml(val);
    		};
    		
    		//用于查询、编辑、新增--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
	   		vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
	   		vm.basicData.projectIndustryAll=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
   	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
   	   			.toArray();//政府投资项目行业
   	   		vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
   	   			.toArray();//社会投资项目行业
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();//获取街道信息
	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	       		.toArray();//政府投资项目行业
	   		vm.basicData.userUnit=common.getUserUnits();
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
    		if(vm.isZFInvestment){
    			projectSvc.grid(vm);
    		}
    		if(vm.isSHInvestment){
    			projectSvc.grid_SH(vm);
    		}
    		projectSvc.grid(vm);
    		//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				if(vm.isZFInvestment){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--政府投资项目 
					filters.push({field:'isIncludLibrary',operator:'eq',value:true});//默认条件--项目纳入项目库  
				}
				if(vm.isSHInvestment){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_SH});//默认条件--政府投资项目 
				}
				 
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
     			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
     		   }
     		   if(vm.search.isMonthReport !=null && vm.search.isMonthReport !=''){
     			   if(vm.search.isMonthReport == "true"){
     				  filters.push({field:'isMonthReport',operator:'eq',value:true});
     			   }else if(vm.search.isMonthReport == "false"){
     				  filters.push({field:'isMonthReport',operator:'eq',value:false});
     			   }
     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){
     			  filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		   
     		   if(vm.isZFInvestment){
     			  vm.gridOptions.dataSource.filter(filters);
     		   }else if(vm.isSHInvestment){
     			  vm.gridOptions_SH.dataSource.filter(filters);
     		   }

    		};
    		//条件查询--项目行业子集发生变化
   	   	   vm.searchIndustryChildChange=function(){
   	   		vm.searchIndustryChild=false;
   	   		if(vm.search.projectIndustryChild !=null && vm.search.projectIndustryChild !=''){
   	   		vm.basicData.projectIndustryChild_SH=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.search.projectIndustryChild;})
   	   			.toArray();//社会投资项目行业子集
   	   		vm.searchIndustryChild=true;
   	   		}
   	   	   };
	   	  //清空查询条件
	   		vm.filterClear=function(){
	   			location.reload();
	   		};
    		
     	   //点击新增项目弹出模态框
     	   vm.addProject = function(){
     		  $("#myModal_add").modal({
 			        backdrop: 'static',
 			        keyboard:false  			  
     		  });
     	   };
     	   //点击模态框确认按钮跳转不同的信息录入页面
     	   vm.confirmInvestmentType=function(){
     		   $(".modal-backdrop").remove();
     		   $location.path("/projectEdit//"+vm.model.projectInvestmentType);
     	   };
     	  vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目
    		
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
  			 //资金来源计算
  	 		 vm.capitalTotal=function(){
  	 			 return common.getSum([
  	 					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
  	 					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
  	 					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
  	 					 vm.model.capitalOther||0]);
  	 		 };
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
  			//投资去处计算（社投）
   	   		 vm.investTotal=function(){
   	   			 vm.model.projectInvestSum=common.getSum([vm.model.landPrice||0,vm.model.equipmentInvestment||0,
 	   				 	 vm.model.buidSafeInvestment||0,vm.model.capitalOther||0]);
   	   			 return vm.model.projectInvestSum;
   	   		 };
  		   }
    		//获取当前所有的用户单位信息
    		projectSvc.getUserUnits(vm);
    		
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
   				        keyboard:true		  
   	        	   });
   	        	   vm.gridOptions_documentRecords.dataSource.read();//批复文件列表数据刷新
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
    		   var file = vm.model.attachmentDtos[idx];
	   			 if(file){//删除上传文件的同时删除批复文号
	   				var pifuType = file.type;
	   				vm.model['pifu'+pifuType+'_wenhao'] = "";
	   				vm.model.attachmentDtos.splice(idx,1);
	   			 }
    	   };
	        
    	   vm.create = function () {
    		    projectSvc.createProject(vm);    		     
    		};    		     		     			    		 
    	}//init_create
    	
    	function init_update(){
    		vm.title = "编辑项目";
    		//获取项目信息
    		projectSvc.getProjectById(vm);
    		//更新项目
    		vm.update = function(){
    			projectSvc.updateProject(vm);
    		};  	   		
    	}//init_update
    	
    	function init_details(){
    		projectSvc.getProjectById(vm);
    		
    		if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
   			  vm.isZFInvestment = true;
   			  //相关附件文件上传文件种类
   			  vm.relatedType=common.uploadFileTypeConfig().projectEdit; 
   		   	}else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			  
   			  vm.isSHInvestment = true;
   			 //相关附件文件上传文件种类
   			  vm.relatedType=common.uploadFileTypeConfig().projectEdit_SH; 
   		   	}
    		//相关附件文件上传文件种类
    		vm.relatedType=common.uploadFileTypeConfig().projectEdit;   		
    	}
    }
})();
