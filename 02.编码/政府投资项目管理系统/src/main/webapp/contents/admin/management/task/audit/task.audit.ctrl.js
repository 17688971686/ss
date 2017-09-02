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
           	
           	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	
           	//初始化基础数据
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
				.toArray();//政府投资行业
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
           	vm.basicData.projectShenBaoStage=common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
   	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	型   			   			       		   		
   	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
   	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
   	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
   	   		vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
   	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
   	   		vm.basicData.area_Street=$linq(common.getBasicData())
	   				.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
	   				.toArray(); //行政区划街道
   	   		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
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
        	
        	//查询角色信息
        	taskAuditSvc.getRoles(vm);
        	
        	//根据部门id查询部门人员
        	vm.changed = function(id){
        		for (var i = 0; i < vm.model.depts.length; i++) {
					if(vm.model.depts[i].id == id){//获得部门人员
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长"){//默认选中科长为下一流程处理人
									vm.taskAudit.nextUser = vm.model.depts[i].userDtos[j].id;//下一处理人为当前部门角色是科长的人
									//vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;//下一角色为科长
								}
							}
						}
					}
				}
        	}
        	
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
        		if(str == "tuiwenbanjie"){
        			vm.nextProcessRadio = "tuiwenbanjie";
        		}
        		
        		//退文
        		if(str == "tuiwen"){
        			vm.nextProcessRadio = "tuiwen";
        		}
        		
        		//办结
        		if(str == "banjie"){
        			vm.nextProcessRadio = "banjie";
        		}
        		
        		//退回重办
        		if(str == "tuihuiChongban"){
        			vm.nextProcessRadio = "tuihuiChongban";
        		}
        		
        		//经办人办理
        		if(str == "jingBanRenBanli"){
        			vm.nextProcessRadio = "jingBanRenBanli";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					
    						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
    							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
    								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长" &&vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//默认选中科长为下一流程处理人
    									vm.users = vm.model.depts[i].userDtos;
    									//vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;//下一角色为科长
    								}
    							}
    						}
    				
    				}
        			
        		}
        	}
        	
        	vm.selectUser = function(id){
        		vm.taskAudit.nextUser = id;
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
    				vm.taskAudit.processState = "processState_5";
    				vm.taskAudit.nextProcess = "processState_6";
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
        		if(vm.nextProcessRadio =="bumen"){//正常流程--部门审批
    				setNextUser(vm);//设置当前流程状态&&下一流程状态
    				vm.taskAudit.processRole ="";
    			}else if(vm.nextProcessRadio =="tuiwen"){//退文
    				vm.taskAudit.processState = "processState_15";
    				vm.taskAudit.nextProcess = "processState_3";
    				vm.taskAudit.processRole ="";
    			}else if(vm.nextProcessRadio =="tuiwenbanjie"){//退文办结
    				vm.taskAudit.processState = "processState_24";
    				vm.taskAudit.nextProcess = "";
    				vm.taskAudit.processRole ="";
    			}else if(vm.nextProcessRadio =="banjie"){//办结
    				vm.taskAudit.processState = "processState_11";
    				vm.taskAudit.nextProcess = "";
    				vm.taskAudit.processRole ="";
    			}else if(vm.nextProcessRadio == "tuihuiChongban"){//退回给秘书科
    				vm.taskAudit.processState = "processState_1";
    				vm.taskAudit.nextProcess = "processState_3";
    				vm.taskAudit.processRole =getMiShuKRole("秘书科分办人员");
    				vm.taskAudit.nextUser = "";
        		}else if(vm.nextProcessRadio == "jingBanRenBanli"){//经办人办理
        			vm.taskAudit.processState = "processState_5";
    				vm.taskAudit.nextProcess = "processState_6";
        		}
        		
    			
        		taskAuditSvc.handle(vm);
        	}
        	
        	
        	function getMiShuKRole(role){
        		for (var i = 0; i < vm.model.roles.length; i++) {
        			if(vm.model.roles[i].roleName == role){
        				return vm.model.roles[i].id;
        			}
				}
        	}

        	//查询批复文件
        	taskAuditSvc.replyFileGird(vm);
        	//弹出申报详情模态框
        	vm.dialog_shenbaoInfo=function(){
        		$("#shenbaoInfo").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	//弹出申报信息复核模态款
        	vm.dialog_shenbaoInfoEdit=function(){
        		$("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	//获取项目类型， 多选
	   		vm.updateSelection = function(id){
	        	var index = vm.projectTypes.indexOf(id);
	        	if(index == -1){
	        		vm.projectTypes.push(id);
		       	}else{
		       		vm.projectTypes.splice(index,1);
		       	}	        	
	        };
	      //文件上传成功
    	   vm.uploadSuccess=function(e){
   			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.model.shenBaoInfo.attachmentDtos){
	           				 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
    	   };
	  		//选择上传文件验证文件大小
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
				var file = vm.model.shenBaoInfo.attachmentDtos[idx];
				if(file){//删除上传文件的同时删除批复文号
					var pifuType = file.type;
					vm.model.shenBaoInfo['pifu'+pifuType+'_wenhao'] = "";
					vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
				 }
			 };
			//展示批复文件选择模态框
	   		vm.choseDocument = function(e){
	   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
        	   $("#documentRecords").modal({
			        backdrop: 'static',
			        keyboard:false  			  
        	   });
        	   vm.replyFileGridOptions.dataSource.read();//批复文件列表数据刷新
	   		};
		   		
	   		//批复文件选择模态框确认
	   		vm.pifuChoseConfirm = function(){
	   			//关闭模态框
	   			$("#documentRecords").modal('hide');
	   			//获取选择框中的信息
	   			var select = common.getKendoCheckId('.grid');
            	var fileName = select[0].value;
            	if(fileName){
            		var file = common.stringToArray(fileName,",");
            		var number = file[0];
            		var name = file[1];
            		var url =file[2];
            		vm.model.shenBaoInfo['pifu'+vm.pifuType+'_wenhao'] = number;
            		if(vm.model.shenBaoInfo.attachmentDtos){
         				  vm.model.shenBaoInfo.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
         			 }else{
         				  vm.model.shenBaoInfo.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
         			 }
            	}
	        };
	       //批复文件列表模态框关闭
	        vm.dismissReplyFile=function(){
	        	$("#documentRecords").modal('hide');
	        };
	      //复核申报信息保存
	        vm.saveShenBaoInfo=function(){
	        	taskAuditSvc.saveShenBaoInfo(vm);
	        };

        }//end init_handleAudit
    }
})();
