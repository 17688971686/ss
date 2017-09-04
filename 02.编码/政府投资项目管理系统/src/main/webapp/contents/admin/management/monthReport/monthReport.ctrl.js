(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.projectId=$state.params.projectId;
		vm.year=$state.params.year;
		vm.month=$state.params.month;
		vm.search={};
    	vm.model={};
    	vm.basicData={};
    	vm.page='list';
    	vm.model.display = false;
    	
        vm.init=function(){
        	if($state.current.name=='monthReport_details'){
        		vm.page='details';
        	}else if($state.current.name=='monthReportChange'){
        		vm.page='changeDetails';
        	}
        	
        	vm.getBasicDataDesc = function(Str){
        		return common.getBasicDataDesc(Str);
        	};
        	
        	vm.checkLength = function(obj,max,id){
     			 common.checkLength(obj,max,id);
          	};
          	
          	//用于查询--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectInvestmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//投资类型
        };//end init
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		page_list();
        	}
        	if(vm.page=='details'){  
        		page_details();
        	}
        	if(vm.page=='changeDetails'){
        		page_details();
        	}
            
        }
        
        function page_list(){
        	monthReportSvc.grid(vm);
        	//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
				filters.push({field:'isMonthReport',operator:'eq',value:true});//默认条件--需要填报月报 
				
				 
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   	if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
     			   filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
     		   	}
     		   if(vm.search.projectInvestmentType !=null && vm.search.projectInvestmentType !=''){//查询条件--投资类型
     			   filters.push({field:'projectInvestmentType',operator:'eq',value:vm.search.projectInvestmentType});
     		   	}
     		   	if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   	}
     		   
 			  vm.gridOptions.dataSource.filter(filters);
     		  vm.gridOptions.dataSource.read(); 
    		};
        }
        
        function page_details(){
        	monthReportSvc.getProjectById(vm);
        	//begin#基础数据
        	vm.model.isReportExist = false;
        	//begin#创建问题和删除问题
         	vm.createProblem=function(){
            	if(vm.model.monthReport.monthReportProblemDtos){
            		vm.model.monthReport.monthReportProblemDtos.push({problemIntroduction:'',solutionsAndSuggest:''});
            	}else{
            		vm.model.monthReport.monthReportProblemDtos=[{problemIntroduction:'',solutionsAndSuggest:''}];
            	}
            };
         	
         	vm.deleteProblem = function(idx){
         		vm.model.monthReport.monthReportProblemDtos.splice(idx,1);        	
            };


          //begin#ng-include load后触发
    		 vm.uploadSuccess=function(e){
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
   	           	 if(e.XMLHttpRequest.status==200){
   	           		 var fileName=e.XMLHttpRequest.response;
   	           		 $scope.$apply(function(){
   	           			 if(vm.model.monthReport.attachmentDtos){
   	           				 vm.model.monthReport.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
   	           			 }else{
   	           				 vm.model.monthReport.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
   	           			 }                			           			
   	           		 });
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
        	
            //begin#删除文件
            vm.delFile=function(idx){
           	 vm.model.monthReport.attachmentDtos.splice(idx,1);
            };
        	//批复类型
         	vm.basicData_approvalType=$linq(common.getBasicData())
    		  .where(function(x){return x.identity=='approvalType'&&x.pId=='approvalType';})
    		  .toArray();
         	//项目进度
         	vm.basicData_projectProgress=$linq(common.getBasicData())
    		  .where(function(x){return x.identity=='projectProgress'&&x.pId=='projectProgress';})
    		  .toArray();
        	//begin#上传类型
         	vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
        	
        	  //begin#提交月报
       	  	vm.submit = function(){
       	  		monthReportSvc.submitMonthReport(vm);
            };
            
            //begin#月报修改
            vm.change = function(){
            	location.href="#/monthReportChange/"+vm.projectId+"/"+vm.year+"/"+vm.month;
            };
            //begin#月报原数据
            vm.befor = function(){
            	vm.model.display = true;
            	monthReportSvc.getProjectById(vm);
            };
            
            vm.back = function(vm){
            	location.href="#/monthReport";
            };
        }
    }
})();
