(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('projectMonthReportCtrl', projectMonthReport);

    projectMonthReport.$inject = ['$location','projectMonthReportSvc','$state','$scope']; 

    function projectMonthReport($location, projectMonthReportSvc,$state,$scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.model={};        
        vm.page='list';
        vm.init=function(){
        	vm.projectId = $state.params.projectId;
            vm.month = $state.params.month;
            vm.year=$state.params.year;
            if(vm.projectId){
            	vm.page='selectMonth';
            }
            if(vm.month){
            	vm.page='fillReport';
            }
        }
        
        vm.page_list=function(){        	 
            
        }
        
        vm.page_selectMonth=function(){
        	 vm.fillReport = function(month){
             	//跳转到月报信息填写页面
             	location.href = "#/projectMonthReportInfoFill/"+vm.projectId+"/"+vm.submitYear+"/"+month;
             } 
        	 var date=new Date()
        	 vm.submitYear=date.getFullYear();
        	 vm.submitYearMonth={};
        	 vm.monthRow1=['一月','二月','三月','四月','五月','六月'];
        	 vm.monthRow2=['七月','八月','九月','十月','十一月','十二月'];
        	 
        	 vm.setMonthSelected=function(){ 
        		 for (var i =1; i <= 12; i++) {
            		 vm.submitYearMonth['m'+i]=false;	
    			}
        		 var monthExist=$linq(vm.model.projectInfo.monthReportDtos)
        		 	.where(function(x){return x.submitYear==vm.submitYear;})
					.select(function(x){return x.submitMonth;});
        		 
					monthExist.foreach(function(x){		
						vm.submitYearMonth['m'+x]=true;						
					});
					
        	 }
        }
        
        vm.page_fillReport=function(){  
           
        	//begin#下拉选择年份
     	   vm.years=[];
     	   vm.currentYear=(new Date()).getFullYear();     	   
     	   vm.years.push(vm.currentYear);
     	   for(var i=1;i<=5;i++){
     		   vm.years.push(vm.currentYear+i);
     		   vm.years.push(vm.currentYear-i);
     	   }
     	   vm.years=vm.years.sort();
     	  //begin#日期处理
       	 vm.date=function(dateStr){
       		return new Date(dateStr);
       	 }
     	   //begin#提交月报
     	  vm.submit = function(){
          	projectMonthReportSvc.submitMonthReport(vm);
          }
     	  
     	  //begin#ng-include load后触发
     	 vm.page_fillReport_init=function(){
     		 
     		 vm.uploadSuccess=function(e){
     			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.model.attachmentsDto){
	           				 vm.model.attachmentsDto.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.model.attachmentsDto=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           		 console.log(vm.model.attachmentsDto);
	           	 }
     		 }
         	
         	
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
         	
         	
         	projectMonthReportSvc.getProjectInfo(vm);
         	
     	 }//end init_page_fillReport
     	 
     	//begin#删除文件
         vm.delFile=function(idx){
        	 vm.model.attachmentsDto.splice(idx,1);
         }
         
     	 
        
       //begin#创建问题和删除问题
     	vm.createProblem=function(){
        	if(vm.model.monthReportProblemsDto){
        		vm.model.monthReportProblemsDto.push({problemIntroduction:'',solutionsAndSuggest:''});
        	}else{
        		vm.model.monthReportProblemsDto=[{problemIntroduction:'',solutionsAndSuggest:''}];
        	}
        }
     	
     	 vm.deleteProblem = function(idx){
     		vm.model.monthReportProblemsDto.splice(idx,1);        	
          }
     	 //begin#基础数据
     	vm.basicData_approvalType=$linq(common.getBasicData())
		  .where(function(x){return x.identity=='approvalType';})
		  .toArray();
     	
     	vm.basicData_projectProgress=$linq(common.getBasicData())
		  .where(function(x){return x.identity=='projectProgress';})
		  .toArray();
     	
     	//begin#上传类型
     	vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
     	
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
        		projectMonthReportSvc.getProjectInfo(vm);
        	}
        	
        	if(vm.page=='fillReport'){//如果填报信息
        		//查询基础数据
        		vm.page_fillReport();
        		        		
        		
        		//projectMonthReportSvc.getBasicData(vm,'approvalType');
        		//projectMonthReportSvc.getBasicData(vm,'projectProgress');
        		//projectMonthReportSvc.getMonthReportInfo(vm);//查询月报信息 
        		
        	}
        	
        
        }
    }
})();