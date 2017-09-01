(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskCtrl', task);

    task.$inject = ['$location','taskSvc','$state','$scope','$sce','$rootScope']; 

    function task($location, taskSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;        
    	vm.page="todoList";
    	vm.model.taskRecord = {};
    	vm.keyuan="";
    	vm.isKeshi = true;
    	vm.tuiwen = false;
    	vm.isChecked = true;

    	function init(){   		
    		if($state.current.name=='task_todo'){//待办列表
    			vm.page='todoList';
    		}
    		if($state.current.name=='task_handle'){//任务处理
    			vm.page='handle';
    		}
    		if($state.current.name=='task_complete'){//已办列表
    			vm.page='complete';
    		}
    		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    		
//    		vm.getBasicDataFive = function(name){
//    			for (var i = 0; i < vm.model.depts.length; i++) {
//					var depts = vm.model.depts[i];
//					for (var j = 0; j < depts.userDtos.length; j++) {
//						if(depts.userDtos[j].displayName == name){
//							for (var k = 0; k < depts.userDtos[j].roles.length; k++) {
//								//if(vm.model.taskRecord.processState == "processState_5"){
//									if(depts.userDtos[j].roles[k].roleName =="科员"){
//										return common.getBasicDataDesc("processState_5");
//									}else if(depts.userDtos[j].roles[k].roleName =="科长"){
//										return common.getBasicDataDesc("processState_4");
//									}else if(depts.userDtos[j].roles[k].roleName =="秘书科分办人员"){
//										return common.getBasicDataDesc("processState_3");
//									}
//							}
//						}
//					}
//				  }
//    		}
    		
    		vm.getBasicData=function(str){
    			var strNext='';
        		if(str == "processState_1"){
        				 strNext ="processState_1";
          		   }else if(str == "processState_4"){
          			 strNext ="processState_3";
          		   }else if(str == "processState_5"){
          			 strNext ="processState_4";
          		   }else if(str == "processState_6"){
          			 strNext ="processState_5";
          		   }else if(str == "processState_7"){
          			 strNext ="processState_6";
          		   }else if(str == "processState_8"){
          			 strNext ="processState_7";
          		   }else if(str == "processState_9"){
          			 strNext ="processState_8";
          		   }else if(str == "processState_10"){
          			 strNext ="processState_9";
          		   }else if(str == "processState_17"){
          			 strNext ="processState_10";
          		   }else if(str == "processState_18"){
          			 strNext ="processState_17";
          		   }else if(str == "processState_19"){
          			 strNext ="processState_18";
          		   }else if(str == "processState_20"){
          			 strNext ="processState_19";
          		   }else if(str == "processState_21"){
          			 strNext ="processState_20";
          		   }else if(str == "processState_22"){
          			 strNext ="processState_21";
          		   }else if(str == "processState_23"){
          			 strNext ="processState_22";
          		   }
        			return common.getBasicDataDesc(strNext);
    		};
    		
    		vm.getBasicDataDesc=function(str){//流转信息显示
    			return common.getBasicDataDesc(str);
    		};
    		vm.checkLength = function(obj,max,id){
      			 common.checkLength(obj,max,id);
           	};

           	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
           	
           	vm.callBack=function(){
           		window.history.back(-1);
           	};
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoList'){
        		init_todoList();
        	}
        	if(vm.page=='handle'){
        		init_handle();
        	}
        	if(vm.page=='complete'){
        		init_completeList();
        	}
        }
        
        function init_todoList(){
        	taskSvc.grid(vm);
        }//end init_todoList
        
        function init_completeList(){
        	taskSvc.completeGird(vm);
        }//end init_completeList
        
        
    	function init_handle(){
//    		if(vm.task.processState =="processState_8"){
//    			vm.isKeshi = false;
//    		}
    		vm.miShuFenBan = true;
    	   vm.processState_qianShou=common.basicDataConfig().processState_qianShou;
    	   vm.processState_tuiWen=common.basicDataConfig().processState_tuiWen;
    	   vm.processState_banJie=common.basicDataConfig().processState_banJie;
    	   //vm.processState_next = common.basicDataConfig().processState_next;

    	   taskSvc.getTaskById(vm);//查询任务信息
    	   taskSvc.getDept(vm);
    	   
    	   if(vm.taskType == common.basicDataConfig().taskType_yearPlan){//如果为下一年度计划申报
    		   vm.isYearPlan = true;
    		   taskSvc.getShenBaoInfoById(vm);//查询申报信息
    		   vm.model.taskRecord.processSuggestion = "符合申报";//设置默认为符合申报
    	   }else if(vm.taskType == common.basicDataConfig().taskType_monthReport){//如果为月报
    		   vm.isMonthReport = true;
    		   taskSvc.getMonthReportById(vm);//查询月报信息
    	   }
    	   
    	   vm.dialog_shenbaoInfo=function(){
    		   $('#shenbaoInfo').modal({
                   backdrop: 'static',
                   keyboard:false
               });
			   //初始化tab
	     	   vm.tabStripOptions={
	     			//TODO
	     	   };
    	   };
    	   

    	   vm.changed=function(id){
    		   vm.id = id;
    		   taskSvc.getDeptUsers(vm);
    	   };
    	   function getUsers(processState){
    		   
    	   }
    	   //选择下一处理环节
    	   vm.clicked = function(str){
    		   vm.isChecked = false;
    		   if(str != ""){
    			   vm.keyuan = str;
    		   }
    		   var obj = $("#nextState").is(":checked");
    		   //如果是科员分办
    		   if(obj == true || str == "keyuan"){
    			   vm.tuiwen = false;
    			   vm.isChecked = false;
    			   vm.isKeshi = true;
    			   //获取当前科室成员
    			   if(vm.task.processState =="processState_4"|| vm.task.processState =="processState_5"){
    				   for (var i = 0; i < vm.model.depts.length; i++) {
						var depts = vm.model.depts[i];
						for (var j = 0; j < depts.userDtos.length; j++) {
							if(depts.userDtos[j].displayName == vm.task.nextUser){
								vm.model.deptUsers = depts.userDtos;
							}
						}
					  }
    			   }else if(vm.task.processState =="processState_6" || vm.task.processState =="processState_7" || vm.task.processState =="processState_19" || vm.task.processState =="processState_20"){
    				   for (var i = 0; i < vm.model.depts.length; i++) {
    					   if(vm.model.depts[i].name =="局领导"){
    						   vm.model.deptUsers = vm.model.depts[i].userDtos;
    					   }
    				   }
    			   }else if(vm.task.processState =="processState_9"){
    				   for (var i = 0; i < vm.model.depts.length; i++) {
    					   if(vm.model.depts[i].name =="评审中心"){
    						   vm.model.deptUsers = vm.model.depts[i].userDtos;
    					   }
    				   }
    			   }else if(vm.task.processState =="processState_18"  || vm.task.processState =="processState_21"){
    				   for (var i = 0; i < vm.model.depts.length; i++) {
    					   if(vm.model.depts[i].name =="秘书科"){
    						   vm.model.deptUsers = vm.model.depts[i].userDtos;
    					   }
    				   }
    			   }
    			//如果是科室分办
    		   }else if(str == "keshi"){
    			   vm.isChecked = true;
    			   vm.isKeshi = false;
    			   vm.tuiwen = false;
    			   
    		   }else if(str == vm.processState_tuiWen){
    			   vm.isChecked = true;
    			   vm.isKeshi = true;
    			   vm.tuiwen = true;
    		   }else{
    			   vm.isChecked = true;
    		   }
    		   
    	   }
    	   
    	   //提交审批--进入下一流程
    	   function nextSelection(){
    		   var processState = vm.task.processState;
    		   if(processState == "processState_1"){
    			   vm.model.taskRecord.processState ="processState_4";
    		   }else if(processState == "processState_4"){
    			   vm.model.taskRecord.processState ="processState_5";
    		   }else if(processState == "processState_5"){
    			   vm.model.taskRecord.processState ="processState_6";
    		   }else if(processState == "processState_6"){
    			   vm.model.taskRecord.processState ="processState_7";
    		   }else if(processState == "processState_7"){
    			   vm.model.taskRecord.processState ="processState_8";
    		   }else if(processState == "processState_8"){
    			   vm.model.taskRecord.processState ="processState_9";
    		   }else if(processState == "processState_9"){
    			   vm.model.taskRecord.processState ="processState_10";
    		   }else if(processState == "processState_10"){
    			   vm.model.taskRecord.processState ="processState_17";
    		   }else if(processState == "processState_17"){
    			   vm.model.taskRecord.processState ="processState_18";
    		   }else if(processState == "processState_18"){
    			   vm.model.taskRecord.processState ="processState_19";
    		   }else if(processState == "processState_19"){
    			   vm.model.taskRecord.processState ="processState_20";
    		   }else if(processState == "processState_20"){
    			   vm.model.taskRecord.processState ="processState_21";
    		   }else if(processState == "processState_21"){
    			   vm.model.taskRecord.processState ="processState_22";
    		   }else if(processState == "processState_22"){
    			   vm.model.taskRecord.processState ="processState_23";
    		   }
    	   }
    	   
    	   //处理操作
    	   vm.handle=function(str){
//    		   var obj = $("#nextState").is(":checked");
//    		   if(obj == true){
//    			 
//    		   }else{
//    			   alert("请选着下一处理环节！");
//    			   return;
//    		   }
//    		   
    		   common.initJqValidation();
   			   var isValid = $('form').valid();
	   			if (isValid) {
	   				
	   				//秘书分办--选科室
	   				//科员分办--选择科室
	   				//默认科长
	   				if(vm.task.processState =="processState_1" || vm.task.processState =="processState_5" &&  vm.isKeshi == false){
	   					if(vm.tuiwen == false){
	   						for (var i = 0; i < vm.model.deptUsers.length; i++) {//默认选中科长
		    					var user = vm.model.deptUsers[i];
		    					for (var j = 0; j < user.roles.length; j++) {
		    						 if(user.roles[j].roleName == "科长"){
		    							 vm.nextUser = user.displayName;
		    						 }
		    					}
		    				}
	   					}
	     			   
	     		   }
	   				nextSelection();
	   				
	   				//如果是科员分办--流程不往下走
	   				if(vm.keyuan == "keyuan"){
	   					vm.model.taskRecord.processState = "processState_5";
	   				}
	   				//科室分办--重选科室--回到科长分办流程
	   				if(vm.keyuan == "keshi"){
	   					vm.model.taskRecord.processState = "processState_4";
	   				}
	   				//退文
	   				if(str == vm.processState_tuiWen){
	   					vm.model.taskRecord.processState = "processState_15";
	   				}
	   				//办结
	   				if(str == vm.processState_banJie){
	   					vm.model.taskRecord.processState = "processState_11";
	   				}
	   				//下一年度--签收
	   				if(str == vm.processState_qianShou){
	   					vm.model.taskRecord.processState = "processState_2";
	   				}
	   				vm.isSubmit = true;
	     		    taskSvc.handle(vm);
	   			}
    	   };    		
    	}//init_handle
    }
})();
