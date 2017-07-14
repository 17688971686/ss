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
    	vm.model={};    
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
        };//end init
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		monthReportSvc.grid(vm);
        	}
        	if(vm.page=='details'){  
        		page_details();
        	}
        	if(vm.page=='changeDetails'){
        		page_details();
        	}
            
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
            }
        }
    }
})();
