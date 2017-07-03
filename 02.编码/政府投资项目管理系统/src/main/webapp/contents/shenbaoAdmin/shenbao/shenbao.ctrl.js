(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('shenbaoCtrl', shenbao);

    shenbao.$inject = ['$location','shenbaoSvc','$state','$scope']; 

    function shenbao($location, shenbaoSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;        
        vm.id=$state.params.id;
        vm.stage=$state.params.stage;
        vm.model={}; 
        vm.basicData={};  
        vm.page='list';
        vm.title='申报信息录入';
        $scope.animationsEnabled = true;
        vm.init=function(){
        	if($state.current.name=='shenbao_edit'){//申报信息
    			vm.page='edit';
    		}
        	if($state.current.name=='shenbao_records'){//申报信息记录
        		vm.page='records';
        	}
        	if($state.current.name=='shenbao_record'){//申报信息详情
        		vm.page='record';
        		$(".modal-backdrop").remove();//去除模态框跳转页面之后遗留背景色
        	}
        	if($state.current.name=='shenbao_record_edit'){//申报信息编辑
        		vm.page='record_edit';
        	}
        	vm.getBasicDataDesc = function(Str){
        		return common.getBasicDataDesc(Str);
        	};
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
    	   vm.shenbaoBtn=function(id,name){
	           	vm.projectId = id;
	           	vm.projectName=name;//绑定项目名称用于模态框显示
	           	vm.projectShenBaoStage='';//清空下拉选选中的值
	           	vm.isConfirm = false;
	           	//获取申报阶段基础数据用于模态框
	           	vm.basicData.projectStage=$linq(common.getBasicData())
		   		.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.pId==common.basicDataConfig().projectShenBaoStage;})
		   		.toArray();
	   	   		//展示模态框
	           	 $('#myModal').modal('show');
           };
           
    	   //点击模态框的确认按钮
           vm.confirm = function(){
           	$(".modal-backdrop").remove(); //去掉模态框背面的阴影
           	location.href = "#/shenbao/"+vm.projectId+"/"+vm.projectShenBaoStage;
           };    	   
           
           //点击列表中的申报记录按钮
           vm.checkShenBaoRecords = function(projectNumber){
        	   //展示模态框
        	   $("#shenBaoRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.projectNumber = projectNumber;
           }
           
         //根据项目代码查询项目的申报记录 	  
    	   shenbaoSvc.projectShenBaoRecordsGird(vm);
        }//end#page_list
       
       function page_edit(){
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
    	   
    	   //获取基础数据
    	   	//项目阶段
    	   	vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);    	  
	   		//项目类型
	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);	   		
	   		//行业归口
	   		vm.basicData.projectIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);
	   		vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		};
	       	//投资类型
	   		vm.basicData.projectInvestmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
	   		//项目类别
	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);
	   		//项目建设性质
	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);	   		
	   		//单位性质
	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);	   		
	   		//行政区划街道
	   		vm.basicData.area_Street=$linq(common.getBasicData()).where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;}).toArray();	   			   		
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
    	   //删除上传文件
  		 vm.delFile=function(idx){
          	 vm.model.attachmentDtos.splice(idx,1);
  		 };
  		 if(vm.page=='edit'){
  			//获取项目信息
  	  		 shenbaoSvc.getProjectById(vm); 
  		 }  		 
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