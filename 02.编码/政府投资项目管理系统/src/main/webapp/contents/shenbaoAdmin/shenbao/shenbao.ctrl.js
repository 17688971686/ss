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
        	if($state.current.name=='shenbao_edit'){
    			vm.page='edit';
    		}
        	if($state.current.name=='shenbao_records'){
        		vm.page='records';
        	}
        	if($state.current.name=='shenbao_record'){
        		vm.page='record';
        	}
        	if($state.current.name=='shenbao_record_edit'){
        		vm.page='record_edit';
        	}
        }
        
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
        		page_edit();
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
    	   
    	   vm.shenbaoBtn=function(id,name){
           	vm.projectId = id;
           	vm.projectName=name;
           	//获取申报阶段基础数据用于模态框
           	vm.basicData.projectStage=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectShenBaoStage'&&x.pId=='projectShenBaoStage';})
	   		.toArray();
   	   		//展示模态框
           	 $('#myModal').modal('show'); 
           }
           
           vm.confirm = function(){  
           	$(".modal-backdrop").remove(); //去掉模态框背面的阴影
           	location.href = "#/shenbao/"+vm.projectId+"/"+vm.projectShenBaoStage;
           }
    	   shenbaoSvc.grid(vm);
        }//end#page_list
       
       function page_edit(){ 
    	   //初始化tab
    	   vm.tabStripOptions={
    			//TODO
    	   };
    	   //判断tab显示
    	   var init_tab_show=function(){
    		   vm.isYearPlan=vm.stage=='projectShenBaoStage_7';//申报阶段为下一年度计划
    		   if(vm.isYearPlan){
    			   vm.materialsType=[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],
	   					['TTJH','历年政府投资计划下大文件(*)'],['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],
	   					['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']];
    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
    		   }
    	   }
    	   init_tab_show();
    	   
    	   //获取基础数据
    	   	//项目阶段
	   		vm.basicData.projectStage=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectStage'&&x.pId=='projectStage';})
	   		.toArray();
	   		//项目类型
	   		vm.basicData.projectType=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectType'&&x.pId=='projectType';})
	   		.toArray();
	   		//行业归口
	   		vm.basicData.projectIndustry=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectIndustry'&&x.pId=='projectIndustry';})
	   		.toArray();
	   		vm.projectIndustryChange=function(){    		
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       		.where(function(x){return x.identity=='projectIndustry'&&x.pId==vm.model.projectIndustryParent;})
	       		.toArray();
	   		}
	       	//投资类型
	   		vm.basicData.projectInvestmentType=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectInvestmentType'&&x.pId=='projectInvestmentType';})
	   		.toArray(); 
	   		//项目分类
	   		vm.basicData.projectClassify=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectClassify'&&x.pId=='projectClassify';})
	   		.toArray();
	   		//项目类别
	   		vm.basicData.projectCategory=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectCategory'&&x.pId=='projectCategory';})
	   		.toArray();
	   		//项目建设性质
	   		vm.basicData.projectConstrChar=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='projectConstrChar'&&x.pId=='projectConstrChar';})
	   		.toArray();
	   		
	   		//单位性质
	   		vm.basicData.unitProperty=$linq(common.getBasicData())
	   		.where(function(x){return x.identity=='unitProperty'&&x.pId=='unitProperty';})
	   		.toArray();
	   		//行政区划街道
	   		vm.basicData.area_Street=$linq(common.getBasicData())
	 			.where(function(x){return x.identity=='area'&&x.pId=='area_1';})
	 			.toArray();
	   		//资金其他来源类型
	   		vm.basicData.capitalOther=$linq(common.getBasicData())
 			.where(function(x){return x.identity=='capitalOtherType'&&x.pId=='capitalOtherType';})
 			.toArray();
    	  
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
  		}
  		 vm.delFile=function(idx){
          	 vm.model.attachmentDtos.splice(idx,1);
  		 }
  		 if(vm.page=='edit'){
  			//获取项目信息
  	  		 shenbaoSvc.getProjectById(vm); 
  		 }  		 
  		 //tab切换
  		 vm.tabChange = function(tabId){
     			var activeTab = $("#tab"+tabId);
     			$("#tabStrip").kendoTabStrip().data("kendoTabStrip").activateTab(activeTab);
     		} 
  		 //确认提交
    	vm.submit = function(){
    		shenbaoSvc.createShenBaoInfo(vm);
    	}               
    }//end#page_edit
       
       function page_records(){
    	   shenbaoSvc.recordsGird(vm);
       }//page_records
       
       function page_record(){
    	   shenbaoSvc.getShenBaoInfoById(vm);
    	   vm.update = function(){
    		   shenbaoSvc.updateShenBaoInfo(vm);
    	   }
       }
   }
})();