(function () {
    'use strict';

    angular
        .module('app')
        .controller('taskAuditCtrl', taskAudit);

    taskAudit.$inject = ['$location','taskAuditSvc','$state','$scope','$sce','$rootScope']; 

    function taskAudit($location, taskAuditSvc,$state,$scope,$sce,$rootScope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.search={};
    	vm.basicData={};
    	vm.page="todoAuditList";
    	
    	//任务处理--请求参数
    	vm.taskType=$state.params.taskType;
        vm.taskId=$state.params.taskId;
        vm.relId=$state.params.relId;
        
        //初始化参数
       vm.nextProcessRadio = "";

    	function init(){
    		
    		if($state.current.name=='task_handle_audit'){//处理页面
    			vm.page="handleAudit";
    		}
    		
    		vm.formatDate=function(str){
    			return common.formatDate(str);
    		}; 		
    		vm.getProcessUser = function(id){
    			return common.getUserById(id);
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
           	
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
    	}
    	   	
    	activate();
        function activate() {        	
        	init(); 
        	if(vm.page=='todoAuditList'){
        		init_todoAuditList();
        	}
        	if(vm.page=='handleAudit'){
        		init_handleAudit();
        	}
        }
        
        function init_todoAuditList(){
        	taskAuditSvc.grid(vm);
        	//查询
        	vm.search=function(){
        		var filters = [];
				filters.push({field:'isComplete',operator:'eq',value:false});//默认条件--没有完成的任务 
				if(vm.search.title !=null && vm.search.title !=''){//查询条件--标题
	     			   filters.push({field:'title',operator:'contains',value:vm.search.title});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--任务建设单位
     			   filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  vm.gridOptions.dataSource.filter(filters);
        	};
        	//清空筛选条件
        	vm.filterClear=function(){
        		location.reload();
        	};
        }//end init_todoList
        
        function init_handleAudit(){
        	//查询任务信息
        	taskAuditSvc.getTaskInfoById(vm);
        	//查询申报信息
        	taskAuditSvc.getShenBaoInfoById(vm);
        	//查询部门信息
        	taskAuditSvc.getDepts(vm);
        	
        	//根据部门id查询部门人员
        	vm.changed = function(id){
        		for (var i = 0; i < vm.model.depts.length; i++) {
					if(vm.model.depts[i].id == id){//获得部门人员
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长"){//默认选中科长为下一流程处理人
									vm.taskAudit.nextUser = vm.model.depts[i].userDtos[j].id;//下一处理人为当前部门角色是科长的人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;//下一角色为科长
								}
							}
						}
					}
				}
        	}
        	
        	//流转信息
        	vm.getBasicData=function(str){
        			return common.getBasicDataDesc(str);
    		};
        	
        	//下一处理环节
        	vm.clicked =function(str){
        		//部门承办
        		if(str == "bumen"){
        			vm.showDept = true;
        			vm.nextProcessRadio = "bumen";
        		}else {
        			vm.showDept = false;
        		}
        		
        		//退文办结
        		if(str == "banjie"){
        			vm.nextProcessRadio = "banjie";
        		}else {
        			
        		}
        		
        		//退文
        		if(str == "tuiwen"){
        			vm.nextProcessRadio = "tuiwen";
        		}else{
        			
        		}
        	}
        	
        	function setNextUser(vm){
    			var processState = vm.taskAudit.processState;//下一流程展示
    			if(processState ==  "processState_1"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_3"){
    				vm.taskAudit.processState = "processState_4";
    				vm.taskAudit.nextProcess = "processState_5";
    			}else if(processState == "processState_4"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_5"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_6"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_7"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_8"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_9"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_10"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_17"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_18"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_19"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_20"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_21"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}else if(processState == "processState_22"){
    				vm.taskAudit.processState = "processState_3";
    				vm.taskAudit.nextProcess = "processState_4";
    			}
    			
    		}
    		
        	
        	//送出
        	vm.handle = function(){
        		if(vm.nextProcessRadio =="bumen"){//正常流程
    				setNextUser(vm);//设置当前流程状态&&下一流程状态
    			}else if(vm.nextProcessRadio =="tuiwen"){
    				vm.taskAudit.processState = "processState_15";
    				vm.taskAudit.nextProcess = "processState_3";
    				vm.taskAudit.processRole ="";
    			}
    			
        		taskAuditSvc.handle(vm);
        	}
        	
        }//end init_handleAudit
    }
})();
