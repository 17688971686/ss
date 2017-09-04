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
        vm.basicData={};
        vm.search={};
        vm.page='list';
        vm.init=function(){
        	vm.projectId = $state.params.projectId;
            vm.month = $state.params.month;
            vm.year=$state.params.year;
            vm.processState=$state.params.processState;
            if(vm.projectId){
            	vm.page='selectMonth';
            }
            if(vm.month){
            	vm.page='fillReport';
            }
            
            vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
            };
            
          //用于查询--基础数据
	   		vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
	   		vm.basicData.projectInvestmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//投资类型
        };
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		//列表页
        		page_list();
        	}
        	if(vm.page=='selectMonth'){
        		page_selectMonth();        		
        	}
        	
        	if(vm.page=='fillReport'){//如果填报信息
        		//查询基础数据
        		page_fillReport();        		
        	}  
        }
        
       function page_list(){      
    	   projectMonthReportSvc.grid(vm);
    	   
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
    		   
			  vm.gridOptions.dataSource.filter(filters);
    		  vm.gridOptions.dataSource.read(); 
   		};
        }//end page_list
        
       function page_selectMonth(){
        	projectMonthReportSvc.getProjectById(vm);//获取项目的基本信息
        	
        	 var date=new Date();
        	 vm.submitYear=date.getFullYear();
        	 vm.submitYearMonth={};
        	 vm.tuiwenYearMonth={};
        	 vm.monthRow1=['一月','二月','三月','四月','五月','六月'];
        	 vm.monthRow2=['七月','八月','九月','十月','十一月','十二月'];
        	 //当填报年份发生变化时触发
        	 vm.setMonthSelected=function(){
        		//将月份暂时全部设为未填状态
        		 for (var i =1; i <= 12; i++) {
            		 vm.submitYearMonth['m'+i]=false;
            		 vm.tuiwenYearMonth['m'+i]=false;
    			}
        		
        		//获取项目当前年份现有月报
        		 var monthReports=$linq(vm.model.projectInfo.monthReportDtos)
     		 		.where(function(x){return x.submitYear==vm.submitYear;});
        		//设置按钮状态
        		 monthReports.foreach(function(x){
        			 if(x.processState != null){//有状态则代表已有填写月报
        				 if(x.processState == common.basicDataConfig().processState_tuiWen){//如果为退文状态
        					 vm.tuiwenYearMonth['m'+x.submitMonth]=true;
        				 }else{//如果为其他状态
        					 vm.submitYearMonth['m'+x.submitMonth]=true;
        				 }
        			 }
        		 });
        	 };
        	 //月份按钮被触发
        	 vm.fillReport = function(month){
        		//跳转到月报信息填写页面
               	location.href = "#/projectMonthReportInfoFill/"+vm.projectId+"/"+vm.submitYear+"/"+month;	
			};
        }//end page_selectMonth
        
        function page_fillReport(){ 
        	//begin#init
        	vm.model.monthReport={};
        	
        	//begin#下拉选择年份
     	   vm.years=[];
     	   vm.currentYear=(new Date()).getFullYear();     	   
     	   vm.years.push(vm.currentYear);
     	   for(var i=1;i<=5;i++){
     		   vm.years.push(vm.currentYear+i);
     		   vm.years.push(vm.currentYear-i);
     	   }
     	  vm.years=vm.years.sort();
     	  //end#下拉选择年份
     	  
     	  vm.model.monthReport.proposalsYear=vm.currentYear;
     	  vm.model.monthReport.reportYear=vm.currentYear;
     	  vm.model.monthReport.allEstimateYear=vm.currentYear;
     	  
     	 projectMonthReportSvc.getProjectById(vm);
     	 
     	   //begin#提交月报
     	  vm.submit = function(){
          	projectMonthReportSvc.submitMonthReport(vm);
          };
     	  
     	  //begin#ng-include load后触发
     	 vm.page_fillReport_init=function(){
     		 
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
     	 };//end init_page_fillReport
     	 
     	
   		
   		
     	 
     	//begin#删除文件
         vm.delFile=function(idx){
        	 vm.model.monthReport.attachmentDtos.splice(idx,1);
         };
                 
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
     	 //begin#基础数据
     	 //批复类型
     	vm.basicData_approvalType=common.getBacicDataByIndectity(common.basicDataConfig().approvalType);
     	//项目进度
     	vm.basicData_projectProgress=common.getBacicDataByIndectity(common.basicDataConfig().projectProgress);
     		    	
     	//begin#上传类型
     	vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];    	
      }//page_fillReport
    }
})();