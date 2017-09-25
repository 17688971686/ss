(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('shenbaoCtrl', shenbao);

    shenbao.$inject = ['$location','shenbaoSvc','$state','$scope','$sce']; 

    function shenbao($location, shenbaoSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
        var vm = this;        
        vm.id=$state.params.id;//获取url上面的id参数
        vm.investmentType=$state.params.projectInvestmentType;//获取url上面的项目投资类型参数
        vm.stage=$state.params.stage;//获取url上面的申报阶段参数
        vm.model={}; 
        vm.basicData={};
        vm.search={};
        vm.sysConfig={};
        vm.page='list';
        vm.title='申报信息录入';
        $scope.animationsEnabled = true;

        vm.init=function(){
        	if($state.current.name=='shenbao_edit'){//申报信息填写
    			vm.page='edit';
    		}
        	if($state.current.name=='shenbao_records'){//所有的申报信息记录
        		vm.page='records';
        	}
        	if($state.current.name=='shenbao_record'){//单条申报信息详情
        		vm.page='record';
        		$(".modal-backdrop").remove();//去除模态框跳转页面之后遗留背景色
        	}
        	if($state.current.name=='shenbao_record_edit'){//申报信息编辑
        		vm.page='record_edit';
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
        	
        	vm.getUnitName=function(unitId){
        		return common.getUnitName(unitId);
        	};
       	
        	//全选框选择
        	$(document).on('click', '#checkboxAll_projectShenBaoRecords', function () {
                var isSelected = $(this).is(':checked');
                $('.shenBaoRecordsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	
        	//用于查询、申报--基础数据
    		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段用于模态框
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
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
	   				.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
   	   		
	   	  	vm.deleteShenBaoInfo = function(id){//删除申报信息
	   	  		//获取当前页面的url
	   	  		var url = $location.url();
	   	  		if(url == "/shenbao_records"){//如果是申报记录列表页面
	   	  			vm.isRecordsDelete = true;
	   	  		}else if(url == "/shenbao"){//如果是项目申报记录列表模态框页面
	   	  			$("#shenBaoRecords").modal('hide');//列表申报记录模态框关闭
	   	  			$(".modal-backdrop").remove();//去除模态框背景色
	   	  		}
	   	  		common.confirm({
	   	  			vm:vm,
	   	  			msg:"确认要删除此申报信息吗？",
	   	  			fn:function(){
	   	  				$('.confirmDialog').modal('hide');  
	   	  				$(".modal-backdrop").remove();
	   	  				shenbaoSvc.deleteShenBaoInfo(vm,id);
	   	  			}
	   	  		});
	   	   	};
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){//项目信息列表页
        		page_list();
        	}
        	if(vm.page=='edit'){//项目申报填报页
        		page_edit();        		
        	}
        	if(vm.page=='records'){//申报记录列表页
        		page_records();
        	}
        	if(vm.page=='record'){//申报信息详情页
        		page_record();
        	}
        	if(vm.page=='record_edit'){//申报信息编辑页
        		vm.isRecordEdit = true;
        		vm.title = "申报信息编辑";
        		page_edit();
        		page_record();
        	}
        }
        
       function page_list(){
    	   //获取项目列表
    	   shenbaoSvc.grid(vm);
    	 //条件查询
    	   vm.search=function(){
    		   var filters = [];
    		   filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--查询最新版本的项目
    		   
    		   if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
    			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
    		   }
    		   if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
    			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
    		   }
    		   if(vm.search.isIncludLibrary !=null && vm.search.isIncludLibrary !=null){//查询条件--是否纳入项目酷
    			   if(vm.search.isIncludLibrary == "true"){
    				   filters.push({field:'isIncludLibrary',operator:'eq',value:true}); 
    			   }else if(vm.search.isIncludLibrary == "false"){
    				   filters.push({field:'isIncludLibrary',operator:'eq',value:false}); 
    			   }
    		   }
    		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--项目所属单位
       			  filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
       		   }
    		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业类型
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
    	   
    	   //点击列表中的申报按钮
    	   vm.shenbaoBtn=function(id,projectInvestmentType,name){
    		   //查询申报端口状态
    		   shenbaoSvc.getShenBaoPortState(vm,id,projectInvestmentType,name);
    	   };

         //模态框中申报阶段下拉选发生变化时
           vm.changeShenBaoStage =function(){
        	   vm.massage = '';
        	   shenbaoSvc.getShenBaoInfoByProjectId(vm);//查询项目申报记录验证是否已有申报
           };
    	   //点击模态框的确认按钮
           vm.confirm = function(){
        	   $('#myModal').modal('hide');
           	   $(".modal-backdrop").remove(); //去掉模态框背面的阴影
           	   location.href = "#/shenbao/"+vm.projectId+"/"+vm.projectInvestmentType+"/"+vm.projectShenBaoStage;         
           };    	   
           //点击列表中的申报记录按钮
           vm.checkShenBaoRecords = function(projectNumber){
        	  //展示模态框
        	   $("#shenBaoRecords").modal({
			        backdrop: 'static',
			        keyboard:true
        	   });
        	   vm.projectNumber = projectNumber;
        	 //根据项目代码查询项目的申报记录 	  
        	   vm.gridOptions_shenBaoRecords.dataSource.filter({
					field:'projectNumber',
					operator:'eq',
					value:vm.projectNumber
				});
        	   vm.gridOptions_shenBaoRecords.dataSource.read();
           };
           shenbaoSvc.projectShenBaoRecordsGird(vm);
           
           //删除申报记录
           vm.deleteShenBaoInfo=function(id){
        	   if(confirm("确认要删除数据吗？")){
        		   shenbaoSvc.deleteShenBaoInfo(vm,id);  
        	   }       	   
           };
           //批量删除申报记录
           vm.deleteShenBaoInfos=function(){
        	   var selectIds = common.getKendoCheckId('.shenBaoRecordsGrid');
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
                   vm.deleteShenBaoInfo(idStr);
               }    
           }
        }//end#page_list
       
       function page_edit(){
    	   //页面初始化
    	   var init_page=function(){
    		   vm.isProjectProposal=vm.stage==common.basicDataConfig().projectShenBaoStage_projectProposal;//申报阶段为:项目建议书
    		   vm.isKXXYJBG=vm.stage==common.basicDataConfig().projectShenBaoStage_KXXYJBG;//申报阶段为:可行性研究报告
    		   vm.isCBSJYGS=vm.stage==common.basicDataConfig().projectShenBaoStage_CBSJYGS;//申报阶段为:初步设计与概算
    		   vm.isPrePlanFee=vm.stage==common.basicDataConfig().projectShenBaoStage_prePlanFee;//申报阶段为:规划设计前期费
    		   vm.isNewStart=vm.stage==common.basicDataConfig().projectShenBaoStage_newStratPlan;//申报阶段为:新开工计划
    		   vm.isXuJian=vm.stage==common.basicDataConfig().projectShenBaoStage_xuJianPlan;//申报阶段为:续建计划
    		   vm.isYearPlan=vm.stage==common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为:下一年度计划
    		   vm.isJunGong=vm.stage==common.basicDataConfig().projectShenBaoStage_junGong;//申报阶段为:竣工决算
    		   vm.isCapitalApplyReport=vm.stage==common.basicDataConfig().projectShenBaoStage_capitalApplyReport;//申报阶段为:资金申请报告
    		   
    		   //vm.isQianQi=vm.stage==common.basicDataConfig().projectShenBaoStage_qianQi;//申报阶段为:前期计划

    		   //申报材料初始化
    		   if(vm.isProjectProposal){//项目建议书上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
    		   }
    		   if(vm.isKXXYJBG){//可行性研究报告上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
    		   }
    		   if(vm.isCBSJYGS){//初步设计与概算上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
    		   }
    		   if(vm.isPrePlanFee){//规划设计前期费
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_prePlanFee;
    		   }
    		   if(vm.isNewStart){//新开工计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart; 
    		   }
    		   if(vm.isXuJian){//续建计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
    		   }
    		   if(vm.isYearPlan){//下一年度计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
    		   }
    		   if(vm.isJunGong){//竣工决算上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_junGong;
    		   }
    		   if(vm.isCapitalApplyReport){//资金申请报告上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_capitalApplyReport;
    		   }
    		   
//    		   if(vm.isQianQi){//前期计划上传文件类型
//    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_qianQi;
//    		   }

    		   //初始化tab--禁止点击Tab切换
    		   $("#tab1").attr("disabled","true");
    		   $("#tab2").attr("disabled","true");
    		   $("#tab3").attr("disabled","true");
    		   
    		   $("#tab4").attr("disabled","true");//下一年度计划单独页面
    		   $("#tab5").attr("disabled","true");//竣工决算单独页面
    		   $("#tab6").attr("disabled","true");//资金申请报告单独页面
    	   };
    	   //初始化基础数据
    	   var init_basicData = function(){
    		   if(vm.investmentType == common.basicDataConfig().projectInvestmentType_ZF){//如果为政府投资
        		   vm.isZFInvestment = true; 
      			 	//基础数据--项目分类
        		   vm.basicData.projectClassify=$linq(common.getBasicData())
    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
    	       		.toArray();
        		   //基础数据--行业归口
        		   vm.basicData.projectIndustry=$linq(common.getBasicData())
    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
    	       		.toArray();
        	   }else if(vm.investmentType == common.basicDataConfig().projectInvestmentType_SH){//如果为社会投资
        		   vm.isSHInvestment = true;
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
        	   }
    	   };
    	   
    	   init_page();
    	   init_basicData();
    	  //申报年份发生变化时触发
    	   vm.changeYear = function(){
    		   vm.planYear = parseInt(vm.model.planYear);
    	   };
    	   
    	   if(vm.page=='edit'){//如果为申报信息填报
   	  		 shenbaoSvc.getProjectById(vm);
   		 	}	
    	   
	   		//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.model.projectType.indexOf(id);
	        	if(index == -1){
	        		vm.model.projectType.push(id);
		       	}else{
		       		vm.model.projectType.splice(index,1);
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
	   		shenbaoSvc.documentRecordsGird(vm);//查询批复文件
	   		
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
    	  
	   		//文件上传
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
  		 	 
  		 //tab切换(上一步)
  		 vm.tabReturn = function(tabId){
    			var activeTab = $("#tab"+tabId);
				vm.tabStrip.activateTab(activeTab);
     		};
  		
  		 //tab切换(下一步)
  		 vm.tabChange = function(tabId){
     			//验证表单
     			common.initJqValidation();
    			var isValid = $('form').valid();
    			var activeTab = $("#tab"+tabId);
    			if(isValid){//通过则跳转到下一页面
    				vm.tabStrip.activateTab(activeTab);
    			}
     		};
     	//添加建设单位
 		vm.addUnit=function(){
 			if(vm.model.constructionUnit.constructor == String){
 				vm.model.constructionUnit = common.stringToArray(vm.model.constructionUnit);
 			}
 			vm.model.constructionUnit.push('');
 			if(vm.model.constructionUnit.length >1){
				vm.canDelete = true;
			}
 		};
     	//删除建设单位
	   vm.deleteUnit=function(idx){
		   if(vm.canDelete){
				vm.model.constructionUnit.splice(idx,1);
				if(vm.model.constructionUnit.length <=1){
					vm.canDelete = false;
				}
			}
	   };
     	   
  		 //确认提交
    	vm.submit = function(){
    		shenbaoSvc.createShenBaoInfo(vm);
    	};             
    }//end#page_edit
       
       function page_records(){
    	   shenbaoSvc.recordsGird(vm);
    	   //条件查询
    	   vm.search=function(){
    		   var filters = [];
    		   if(vm.search.projectName !=null && vm.search.projectName !=''){
    			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
    		   }
    		   if(vm.search.projectShenBaoStage !=null && vm.search.projectShenBaoStage !=''){
    			   filters.push({field:'projectShenBaoStage',operator:'eq',value:vm.search.projectShenBaoStage});
    		   }
    		   if(vm.search.planYear !=null && vm.search.planYear !=''){
    			   filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear)});
    		   }
    		   if(vm.search.constructionUnit !=null && vm.search.constructionUnit !=''){
    			   filters.push({field:'constructionUnit',operator:'contains',value:vm.search.constructionUnit});
    		   }
    		   if(vm.search.processState !=null && vm.search.processState !=''){
    			   filters.push({field:'processState',operator:'eq',value:vm.search.processState});
    		   }
    		   if(vm.search.auditState !=null && vm.search.auditState !=''){
    			   filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
    		   }
    		   vm.gridOptions_records.dataSource.filter(filters);
    	   };
       }//end#page_records
       
       function page_record(){
    	   shenbaoSvc.getShenBaoInfoById(vm);//获取申报信息
    	   $(".modal-backdrop").remove();

    	   vm.update = function(){
    		   shenbaoSvc.updateShenBaoInfo(vm);
    	   };
       }//end#page_record
   }
})();