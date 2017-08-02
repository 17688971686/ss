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
        		$(".modal-backdrop").remove();//去除模态框跳转页面之后遗留背景色
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
        	
        	//全选框选择
        	$(document).on('click', '#checkboxAll_shenBaoRecords', function () {
                var isSelected = $(this).is(':checked');
                $('.shenBaoRecordsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='edit'){
        		//编辑
        		page_edit();        		
        	}
        	if(vm.page=='records'){
        		//申报记录
        		page_records();
        	}
        	if(vm.page=='record'){
        		//申报信息详情
        		page_record();
        	}
        	if(vm.page=='record_edit'){
        		//申报信息编辑
        		vm.isRecordEdit = true;
        		vm.title = "申报信息编辑";
        		page_edit();
        		page_record();
        	}
        }
        
       function page_list(){
    	   //获取项目列表
    	   shenbaoSvc.grid(vm);
    	   
    	   //点击列表中的申报按钮
    	   vm.shenbaoBtn=function(id,projectInvestmentType,name){
	           	vm.projectId = id;//绑定项目id用于url
	           	vm.projectInvestmentType=projectInvestmentType;//绑定项目投资类型用于url
	           	vm.projectName=name;//绑定项目名称用于模态框显示
	           	vm.projectShenBaoStage='';//清空下拉选选中的值
	           	//基础数据--申报阶段用于模态框
	           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);
	   	   		//展示模态框
	           	 $('#myModal').modal('show');
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
			        keyboard:false  			  
        	   });
        	   vm.projectNumber = projectNumber;
        	 //根据项目代码查询项目的申报记录 	  
        	   vm.gridOptions_shenBaoRecords.dataSource.filter({
					field:'projectNumber',
					operator:'eq',
					value:vm.projectNumber
				});
        	   vm.gridOptions_shenBaoRecords.dataSource.read();
        	   //定义退文状态
        	   vm.processState = common.basicDataConfig().processState_tuiWen;
           };
           shenbaoSvc.projectShenBaoRecordsGird(vm);     
        }//end#page_list
       
       function page_edit(){
    	   //页面初始化
    	   var init_page=function(){
    		   vm.isYearPlan=vm.stage==common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为:下一年度计划
    		   vm.isProjectProposal=vm.stage==common.basicDataConfig().projectShenBaoStage_projectProposal;//申报阶段为:项目建议书
    		   vm.isKXXYJBG=vm.stage==common.basicDataConfig().projectShenBaoStage_KXXYJBG;//申报阶段为:可行性研究报告
    		   vm.isCBSJYGS=vm.stage==common.basicDataConfig().projectShenBaoStage_CBSJYGS;//申报阶段为:初步设计与概算
    		   vm.isQianQi=vm.stage==common.basicDataConfig().projectShenBaoStage_qianQi;//申报阶段为:前期计划
    		   vm.isNewStart=vm.stage==common.basicDataConfig().projectShenBaoStage_newStart;//申报阶段为:新开工计划
    		   vm.isXuJian=vm.stage==common.basicDataConfig().projectShenBaoStage_xuJian;//申报阶段为:续建计划
    		   
    		   //申报材料初始化
    		   if(vm.isYearPlan){//下一年度计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
    		   }
    		   if(vm.isProjectProposal){//项目建议书上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
    		   }
    		   if(vm.isKXXYJBG){//可行性研究报告上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
    		   }
    		   if(vm.isCBSJYGS){//初步设计与概算上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
    		   }
    		   if(vm.isQianQi){//前期计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_qianQi;
    		   }
    		   if(vm.isNewStart){//新开工计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart; 
    		   }
    		   if(vm.isXuJian){//续建计划上传文件类型
    			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
    		   }
    		   
    		   
    		   //初始化tab--禁止点击Tab切换
    		   $("#tab1").attr("disabled","true");
    		   $("#tab2").attr("disabled","true");
    		   $("#tab3").attr("disabled","true");
    		   $("#tab4").attr("disabled","true");
    		   $("#tab5").attr("disabled","true");
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
       	   		vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段 	   		
       	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	   			   			       		   		
       	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
       	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
       	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质	   		
       	   		//行政区划街道
       	   		vm.basicData.area_Street=$linq(common.getBasicData())
   	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
   	   				.toArray();   			   		
       	   		//资金其他来源类型
       	   		vm.basicData.capitalOther=common.getBacicDataByIndectity(common.basicDataConfig().capitalOtherType);
    	   };
    	   
    	   init_page();
    	   init_basicData();
    	   
    	   if(vm.page=='edit'){
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
            	
   			    if(vm.model.attachmentDtos){
   				  vm.model.attachmentDtos.push({name:fileName,url:fileName,type:vm.pifuType});
   			    }else{
   				  vm.model.attachmentDtos=[{name:fileName,url:fileName,type:vm.pifuType}];
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
          	 vm.model.attachmentDtos.splice(idx,1);
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
  		
  		 //确认提交
    	vm.submit = function(){
    		shenbaoSvc.createShenBaoInfo(vm);
    	};             
    }//end#page_edit
       
       function page_records(){
    	   shenbaoSvc.recordsGird(vm);
       }//end#page_records
       
       function page_record(){
    	   shenbaoSvc.getShenBaoInfoById(vm);//获取申报信息
    
    	   vm.update = function(){
    		   shenbaoSvc.updateShenBaoInfo(vm);
    	   };
       }//end#page_record
   }
})();