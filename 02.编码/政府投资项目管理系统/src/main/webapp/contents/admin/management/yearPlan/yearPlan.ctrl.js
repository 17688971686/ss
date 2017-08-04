(function () {
    'use strict';

    angular
        .module('app')
        .controller('yearPlanCtrl', yearPlan);

    yearPlan.$inject = ['$location','yearPlanSvc','$state','$scope','$sce']; 

    function yearPlan($location, yearPlanSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.model={};
    	vm.basicData={};
    	vm.title='申报信息编辑';
        vm.id=$state.params.id;       
        vm.investmentType=$state.params.projectInvestmentType;//获取url上面的项目投资类型参数
        vm.stage=$state.params.stage;//获取url上面的申报阶段参数
    	vm.page="shenbaoInfoList";
    	function init(){    		
    		if($state.current.name=='yearPlan_planList'){
    			vm.page='planList';
    		}
    		if($state.current.name=='yearPlan_planEdit'){
    			vm.page='plan_create';
    		}
    		if($state.current.name=='yearPlan_planEdit'&&vm.id){
    			vm.page='plan_update';
    		}
    		if($state.current.name=='yearPlan_planBZ'){
    			vm.page='planBZ';
    		}
    		if($state.current.name=='yearPlan_record_edit'){
    			vm.page='edit';
    		}
    		
    		
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};
    		
    	}
    	init();    	
    	activate();
        function activate() {        	
        	if(vm.page=='shenbaoInfoList'){
        		init_shenbaoInfoList();
        	}
        	if(vm.page=='planList'){
        		init_planList();
        	}
        	if(vm.page=='plan_create'){
        		init_planCreate();
        	}
        	if(vm.page=='plan_update'){
        		vm.isPlanEdit=true;
        		init_planUpadte();
        	}
        	if(vm.page=='planBZ'){
        		init_planBZ();
        	}
        	if(vm.page=='edit'){
        		init_edit();
        	}
        }
        
        function init_edit(){
        	
        	yearPlanSvc.getShenBaoByid(vm);
        	
        	 //禁止点击Tab切换
 		   document.getElementById("tab1").setAttribute("disabled","disabled");
 		   document.getElementById("tab2").setAttribute("disabled","disabled");
 		   document.getElementById("tab3").setAttribute("disabled","disabled");
 		   document.getElementById("tab4").setAttribute("disabled","disabled");
     	   //判断tab显示
     	   var init_tab_show=function(){
     		   vm.isYearPlan=vm.stage==common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为下一年度计划
     		   if(vm.isYearPlan){
     			   //初始化项目材料清单
     			   vm.materialsType=[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],
 	   					['TTJH','历年政府投资计划下大文件(*)'],['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],
 	   					['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']];
     			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
     		   }
     	   };
     	   init_tab_show();
        	
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
 		  //获取基础数据    	   	
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
	   		yearPlanSvc.documentRecordsGird(vm);//查询批复文件
	   		
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
		 //确认更新
		vm.update = function(){
 		   yearPlanSvc.updateShenBaoInfo(vm);
 	   };      
      }
    	
    	function init_shenbaoInfoList(){
    		yearPlanSvc.grid_shenbaoInfoList(vm);
    		vm.dialog_shenbaoInfo = function(id){
    			yearPlanSvc.getShenBaoInfoById(vm,id);
    			$('#shenbaoInfo').modal({
                    backdrop: 'static',
                    keyboard:false
                });
    			//初始化tab
          	   vm.tabStripOptions={
          			//TODO
          	   };
    		};
    		
    	}//init_planList
    	function init_planList(){
    		yearPlanSvc.grid_planList(vm);
    	}//init_planBZList    
    	
    	function init_planCreate(){
    		vm.create=function(){    		
    			yearPlanSvc.plan_create(vm);
    		};
    	}//init_planBZList 
    	
    	function init_planUpadte(){
    		yearPlanSvc.getPlanById(vm);
    		vm.update=function(){
    			yearPlanSvc.plan_update(vm);
    		};
    	}//init_planUpadte
    	
    	function init_planBZ(){   		
    		yearPlanSvc.grid_yearPlan_shenbaoInfoList(vm);//查询年度计划编制中的申报信息列表
    		yearPlanSvc.grid_yearPlan_addShenbaoInfoList(vm);//查询所有的可添加的申报信息列表 
    		
    		//添加项目计划弹出模态框
    		vm.dialog_addPlan=function(){
    			 $('#addPlanList').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
    		};
    		//年度筛选
    		vm.search=function(){
    			vm.addPlanGridOptions.dataSource.filter([
    				{field:"projectShenBaoStage",operator:"eq",value:common.basicDataConfig().projectShenBaoStage_nextYearPlan},
    				{field:"processState",operator:"eq",value:common.basicDataConfig().processState_qianShou},
    				{field:"planYear",operator:"eq",value:parseInt(vm.planYearSearch,10)}
    			]);
    			vm.addPlanGridOptions.dataSource.read();
    		};
    		//模态框点击确认
    		vm.dialogConfirmSubmit=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	return;
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');                  
                    $('#addPlanList').modal('toggle');//关闭模态框
                    yearPlanSvc.addShenBaoInfoconfirm(vm,idStr);//添加申报信息到计划中                  
                }   
    		};
    		//编制计划中的申报信息
    		 vm.popOver=function(e,id){
    			 //根据申报信息id查询出年度计划编制
    			 vm.currentCapitalId=id;
    			 yearPlanSvc.getYearPlanCapitalById(vm,id);
    			 //编制信息输入显示
    	    	   vm.isPopOver=true;
    	    	   var minClick=$(document).height()-50-230;
    	    	   if(e.pageY>minClick){
    	    		   e.pageY=minClick;
    	    	   }
    	    	   vm.popStyle={    	    			  
    	    			   left:e.pageX+'px',
    	    			   top:e.pageY+'px'
    	    	   };  
    	       };//popOver
    	     //更新编制信息  
    		 vm.updateCapital = function(){
    			 yearPlanSvc.updateYearPlanCapital(vm);
    		 };
    		 //移除计划中的申报信息
    		 vm.removeYearPlanCapital=function(){
    	    		var selectIds = common.getKendoCheckId('.yearPlanCapitalGrid');
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
    	                yearPlanSvc.removeYearPlanCapital(vm,idStr);
    	            }
    	    	};//removeYearPlanCapital   			
    	}//init_planBZ   	    	    	   	
    } //yearPlan
})();
