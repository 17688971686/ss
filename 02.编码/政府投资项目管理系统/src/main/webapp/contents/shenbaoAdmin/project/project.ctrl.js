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

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(2)").addClass("focus");
        $(".menu li a").click(function(){
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
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
    	 	
    		//资金来源计算（政投）
			vm.capitalTotal=function(){
				return common.getSum([
					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
					 vm.model.capitalOther||0]);
			};
			

    		//用于查询、新增、编辑--基础数据初始化
    		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
    		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
	   		vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   			.toArray();//获取街道信息
	   		vm.basicData.projectIndustryAll=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
   	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
   	   			.toArray();//政府投资项目行业
   	   		vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
   	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
   	   			.toArray();//社会投资项目行业
	   	   	vm.basicData.projectClassify_ZF=$linq(common.getBasicData())
	  			.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
	  			.toArray();//政府投资项目分类
	  		vm.basicData.projectClassify_SH=$linq(common.getBasicData())
	  			.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
	  			.toArray();//社会投资项目分类
	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位

	   		//国民经济行业分类
	   		vm.basicData.nationalIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
	   		vm.nationalIndustryChange=function(){    		
	       		vm.basicData.nationalIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectGoverEconClassify&&x.pId==vm.model.nationalIndustryParent;})
	       		.toArray();
	   		}
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
    	   projectSvc.getUserUnit(vm);
    	   //加载单位项目信息列表
//    	   projectSvc.grid(vm);
    	   //点击新增项目弹出模态框
    	   vm.addProject = function(){
    		  // $("#myModal").modal({
			   //      backdrop: 'static',
			   //      keyboard:true
    		  // });
    		  vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目
               $location.path("/projectEdit//"+vm.model.projectInvestmentType);
    	   };
    	   //点击模态框确认按钮跳转不同的信息录入页面
    	   // vm.confirmInvestmentType=function(){
    		   // $(".modal-backdrop").remove();

    	   // };
    	   //条件查询
    	   vm.search=function(){
    		   var filters = [];
    		   filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--查询最新版本的项目
    		   
    		   if(vm.search.projectName !=null && vm.search.projectName !=''){
    			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
    		   }
    		   if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
    			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
    		   }
    		   if(vm.search.isIncludLibrary !=null && vm.search.isIncludLibrary !=null){//查询条件--是否已纳入项目库
    			   if(vm.search.isIncludLibrary == "true"){
    				   filters.push({field:'isIncludLibrary',operator:'eq',value:true}); 
    			   }else if(vm.search.isIncludLibrary == "false"){
    				   filters.push({field:'isIncludLibrary',operator:'eq',value:false}); 
    			   }
    		   }
    		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--项目所属单位
      			  filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
      		   }
    		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
       			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
       		   }
    		   if(vm.search.projectInvestmentType !=null && vm.search.projectInvestmentType !=''){//查询条件--项目投资类型
    			   filters.push({field:'projectInvestmentType',operator:'eq',value:vm.search.projectInvestmentType});
    		   }
    		   
    		   vm.gridOptions.dataSource.filter(filters);
    	   };
    	 //条件查询--项目行业父级发生变化
    	   vm.searchIndustryFatherChange=function(){
  	   			vm.searchIndustryIsZF = false;
  	   			vm.searchIndustryIsSH = false;
  	   			vm.searchIndustryChild=false;
  	   			if(vm.searchIndustryFather == common.basicDataConfig().projectIndustry_ZF){
  	   				vm.searchIndustryIsZF = true;
  	   			}else if(vm.searchIndustryFather == common.basicDataConfig().projectIndustry_SH){
  	   				vm.searchIndustryIsSH = true;
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
    	 //删除项目
    		vm.projectDelete=function(id){
    			common.confirm({
    				vm:vm,
    				msg:"确认要删除数据吗？",
    				fn:function(){
    					$('.confirmDialog').modal('hide');
    					projectSvc.deleteProject(vm,id);
    				}
    			});
    		};
    	//批量删除项目
    		vm.projectDeletes=function(){
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}  
                    var idStr=ids.join(',');
                    vm.projectDelete(idStr);
                }   
    		};
        }//end#page_list
       
       function page_create(){
    	   //新建项目相关数据初始化
    	   vm.model.projectInvestmentType = vm.projectInvestmentType;//项目投资类型用于数据收集
			
    	   if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
				vm.isZFInvestment = true;
				vm.basicData.projectClassify=vm.basicData.projectClassify_ZF; //基础数据--项目分类
				vm.basicData.projectIndustry=vm.basicData.projectIndustry_ZF; //基础数据--行业归口
				vm.relatedType=common.uploadFileTypeConfig().projectEdit;//相关附件文件上传文件种类
 		   }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
 			  vm.isSHInvestment = true;
 			  vm.basicData.projectIndustry=vm.basicData.projectIndustry_SH;//基础数据--行业归口
 			 //项目行业发生变化
 			  vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
	       			.toArray();
 			  };
 			//投资去处计算（社投）
				vm.investTotal=function(){
					vm.model.projectInvestSum=common.getSum([vm.model.landPrice||0,vm.model.equipmentInvestment||0,
						 	vm.model.buidSafeInvestment||0,vm.model.capitalOther||0]);
					return vm.model.projectInvestSum;
				 };
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
	   		vm.uploadType=[['JYS', '立项文件'],['KXXYJBG','可行性研究报告批复'],['CBSJYGS','初步设计与概算批复'],['ZJSQBG','资金申请报告批复']];
	   		
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
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.model.attachmentDtos){
                                 vm.model.attachmentDtos.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.model.attachmentDtos = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.model.attachmentDtos){
	           			// 	 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
	   		};

           vm.uploadError = function(e) {
               common.alert({
                   vm : vm,
                   msg : e.XMLHttpRequest.response.message
               });
           }
	   		
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
	   		
	   		//批复文件上传配置
	   		vm.uploadOptions_pifu={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
					success:vm.uploadSuccess,
					error:vm.uploadError,
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
					success:vm.uploadSuccess,
					error:vm.uploadError,
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
	   			 if(vm.userUnit.unitName == "" || vm.userUnit.unitName == undefined){
	   				common.alert({
						vm : vm,
						msg : "未绑定用户建设单位，请绑定后提交！",
						fn : function() {
							vm.isSubmit = false;
							$('.alertDialog').modal('hide');
							vm.gridOptions.dataSource.read();
						}
					});
	   			 }else{
                     // if(vm.model.attachmentDtos == undefined || vm.model.attachmentDtos.length == 0){
                     //
                     //     common.confirm({
                     //         vm : vm,
                     //         msg : "确认不上传批复文件吗？",
                     //         fn : function() {
                     //             $('.confirmDialog').modal('hide');
                     //             $(".modal-backdrop").remove();
                     //             projectSvc.createProject(vm);
                     //         }
                     //     });
                     // }
                     projectSvc.createProject(vm);

	   			 }
	   		         
	   		 };
	   		 //暂存
	   		vm.temporary=function(){
	   			vm.isTemporary = true;
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
       }//end#page_projectInfo
    }
})();