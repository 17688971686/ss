(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('projectMonthReportCtrl', projectMonthReport);

    projectMonthReport.$inject = ['$location','projectMonthReportSvc','$state','$scope']; 

    function projectMonthReport($location, projectMonthReportSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;        
        vm.title = '项目列表';
        vm.titleFillSelect = '月报填报月份选择';
        vm.titleFillInfo = '项目月报填报信息录入';
        
        
        vm.page='list';
        vm.init=function(){
        	vm.projectId = $state.params.id;
            vm.projectName = $state.params.name;
            vm.month = $state.params.month;
            vm.projectBuildStage=$state.params.projectBuildStage;
            if(vm.projectId){
            	vm.page='selectMonth';
            }
            if(vm.month){
            	vm.page='fillReport';
            }
        }
        
        vm.page_list=function(){        	 
            vm.fill = function (projectId,projectName,projectBuildStage) {              
           	 	//跳转到填报月报的月份选择页面
            	location.href = "#/projectMonthReportFill/"+projectId+"/"+projectName+"/"+projectBuildStage;        	
           }
        }
        
        vm.page_selectMonth=function(){
        	 vm.fillReport = function(month){
             	//跳转到月报信息填写页面
             	location.href = "#/projectMonthReportInfoFill/"+vm.projectId+"/"+vm.projectName+"/"+vm.projectBuildStage+"/"+month;
             }                
        }
        
        vm.page_fillReport=function(){        	       
        	vm.basicData={};
        	vm.upload_files=[];
     	   vm.isJueSuan=vm.projectBuildStage=='projectBuildStage_03';
     	   vm.years=[];
     	   vm.currentYear=(new Date()).getFullYear();
     	   
     	   vm.years.push(vm.currentYear);
     	   for(var i=1;i<=5;i++){
     		   vm.years.push(vm.currentYear+i);
     		   vm.years.push(vm.currentYear-i);
     	   }
     	   vm.years=vm.years.sort();
     	  
     	   
     	   
     	  vm.submit = function(){
          	projectMonthReportSvc.submitMonthReport(vm);
          }
     	  
     	 vm.page_fillReport_init=function(){
         	//upload
         	$("#files").kendoUpload({
                 async: {
                     saveUrl: "/common/save",
                     removeUrl: "/common/remove",
                     autoUpload: true
                 },
                 showFileList:false,
                 select:function(e){
                	 console.log("select:");
                	 console.log(e);
                 },
                 success:function(e){
                 	
                 },
                 error:function(e){
                	 console.log("error:");
                	 console.log(e);
                	 if(e.XMLHttpRequest.status==200){
                		 var fileName=e.XMLHttpRequest.response;
                		 $scope.$apply(function(){
                			 if(vm.model.attachments){
                				 vm.model.attachments.push({name:fileName.split('_')[2],url:fileName});
                			 }else{
                				 vm.model.attachments=[{name:fileName.split('_')[2],url:fileName}];
                			 }                			           			
                		 });
                		 
                	 }
                 },
                 localization: {
                     select: "上传文件"
                 }
             });
         	
         	//日期
         	$("#prePlanReplyDate,\
        			#proposalsReplyDate,\
        			#allEstimateReplyDate,\
        			#actuallyDate,\
        			#feaStyRepoReplyDate,\
        			#firstAccountReportSendAuditDate,\
        			#firstAccountReportAuditDate,\
        			#newestAccountReportSendAuditDate,\
        			#newestAccountReportAuditDate,\
        			#newestAccountReportAuditDate,\
        			#accountReportSendAuditDate,\
        			#completeAccountAuditDate").kendoDatePicker({
        		culture : "zh-CN", /* 设置本地化，即设置时间显示为中文 （私有设置）*/
        		format : "yyyy-MM-dd"/* 设置时间的输出格式 */
        	});
     	 }//end init_page_fillReport
     	 
     	
         vm.delFile=function(idx){
        	 vm.model.attachments.splice(idx,1);
         }
         
     	 
        
         
     	vm.createProblem=function(){
        	if(vm.model.monthReportProblems){
        		vm.model.monthReportProblems.push({problemIntroduction:'',solutionsAndSuggest:''});
        	}else{
        		vm.model.monthReportProblems=[{problemIntroduction:'',solutionsAndSuggest:''}];
        	}
        }
     	 vm.deleteProblem = function(idx){
     		vm.model.monthReportProblems.splice(idx,1);        	
          }
      }//page_fillReport
        
       
        
                
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		vm.page_list();
            	projectMonthReportSvc.grid(vm);
        	}
        	if(vm.page=='selectMonth'){
        		vm.page_selectMonth();
        	}
        	
        	if(vm.page=='fillReport'){//如果填报信息
        		//查询基础数据
        		vm.page_fillReport();
        		projectMonthReportSvc.getBasicData(vm,'approvalType');
        		projectMonthReportSvc.getBasicData(vm,'projectProgress');
        		projectMonthReportSvc.getMonthReportInfo(vm);//查询月报信息 
        		
        	}
        	
        
        }
    }
})();