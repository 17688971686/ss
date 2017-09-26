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
           	
           	//初始化审批流程
           	vm.processState_msFenBan=common.basicDataConfig().processState_msFenBan;
           	
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
   	   		vm.basicData.taskType=common.getBacicDataByIndectity(common.basicDataConfig().taskType);//任务类型
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
        	//查询批复文件
        	taskAuditSvc.replyFileGird(vm);
        	//查询角色信息
        	taskAuditSvc.getRoles(vm);
        	//常用意见列表
        	taskAuditSvc.opinionGird(vm);
        	
        	taskAuditSvc.getOpinion(vm);
        	
        	vm.cal=function(){
        		if(vm.review.projectInvestSum != 0 && vm.review.authorize != 0 && vm.review.projectInvestSum != undefined && vm.review.authorize != undefined){
        			vm.cut = vm.review.projectInvestSum - vm.review.authorize;
            		vm.nuclear = Number((vm.cut/vm.review.projectInvestSum)*100).toFixed(2);
        		}else{
        			vm.cut = "";
            		vm.nuclear = "";
        		}
        		
        	};
        	
        	vm.saveReview=function(){
        		vm.taskAudit.reviewResult = true;
        		taskAuditSvc.saveReview(vm);
        	};
        	
        	vm.getBasicDataJD=function(approvalType){
        		if(approvalType != undefined){
        			vm.basicData.projectShenBaoStage=$linq(common.getBasicData())
    	   			.where(function(x){return x.identity==common.basicDataConfig().projectShenBaoStage&&x.id==approvalType;}).toArray();
    	   			//获取项目阶段
            		return vm.basicData.projectShenBaoStage[0].description;
        		}else{
        			return "";
        		}
        		
        	};
        	
        
        	
        	//相关附件文件上传文件种类
	   		vm.relatedType=common.uploadFileTypeConfig().reviewResult;
        	
	   		vm.uploadSuccess_review=function(e){
    			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.review.attachmentDtos){
	           				 vm.review.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.review.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
	   		};
	   		
	   		//相关附件上传配置
	   		vm.uploadOptions_review={
	   				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
	   				error:vm.uploadSuccess_review,	   				
	   				localization:{select:'上传文件'},
	   				showFileList:false,
	   				multiple:true,
	   				validation: {
	   	                maxFileSize: common.basicDataConfig().uploadSize
	   	            },
	   	            select:vm.onSelect
	   		};
	   		//删除上传文件
	   		 vm.delFile_review=function(idx){
	   			 var file = vm.review.attachmentDtos[idx];
	   			 if(file){//删除上传文件的同时删除批复文号
	   				vm.review.attachmentDtos.splice(idx,1);
	   			 }
	         };
	   		
        	//打开评审结果模态框
        	vm.showReviewResult=function(){
        		
        		taskAuditSvc.getComission(vm);
        		
        		taskAuditSvc.getReviewResult(vm);
        		
        		vm.approvalEndDate = common.formatDate(new Date());
        		
        		vm.projectInvestSum = vm.model.shenBaoInfo.projectInvestSum;
        		
        		$('.reviewResult').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	
        	//关闭评审资料模态框
        	vm.closeDatum=function(){
        		$('#datum').modal('hide');
        	};
        	//删除评审资料
        	vm.removeDatum=function(id){
        		 for (var i = 0; i < vm.proxy.datumDtos.length; i++) {
						if(vm.proxy.datumDtos[i].id == id){
							vm.proxy.datumDtos.splice(i,1);
						}
					}
        	};
        	
        	//增加评审资料
        	vm.saveDatum=function(id){
        		vm.proxy.datumDtos.push({dataName:vm.dataName,dataNumber:vm.dataNumber});
        		$('#datum').modal('hide');
        	};
        	
        	vm.openDatum=function(){
        		$('.datum').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	
        	//保存委托书
        	vm.saveProxy=function(){
    			vm.taskAudit.proxy = true;

        		taskAuditSvc.saveProxy(vm);
        	};
        	
        	//查询委托书
        	vm.proxyOpen=function(){
        		
        		taskAuditSvc.getApproval(vm);
        		
        		taskAuditSvc.getComission(vm);
        		
        		$('.proxy').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		
        		vm.nameAndTel = vm.model.shenBaoInfo.projectRepName+":"+vm.model.shenBaoInfo.projectRepMobile;
        		
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskAudit.operator){//获得部门人员
							vm.processRole =  vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		
        		vm.beginDate = common.formatDate(new Date());
        		
        		vm.approvalType = vm.model.shenBaoInfo.projectShenBaoStage;
        	};
        	
        	//打开评审报批模态框
        	vm.editApproval=function(){
        		
        		//查询审批单信息
        		taskAuditSvc.getApproval(vm);
        		
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskAudit.operator){//获得部门人员
							vm.processRole =  vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		
        		vm.approvalType = vm.model.shenBaoInfo.projectShenBaoStage;
        		vm.beginDate = common.formatDate(new Date());
        		
        		$('.approval').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        	};
        	
        	//保存审批单
        	vm.saveApproval=function(){
        		vm.taskAudit.approval = true;
        		taskAuditSvc.saveApproval(vm);
        	};
        	
        	//发文单选框
    		vm.Selection=function(id){
    			vm.draft.openType = id;
    		};
        	
        	//保存草稿纸
        	vm.saveDraft=function(){
        		taskAuditSvc.saveDraft(vm);
        	};
        
        	//拟稿纸模态框
        	vm.draftOpen=function(){
        		//查询发文拟稿
        		taskAuditSvc.getDraftIssued(vm);
        		//拟稿单位拟稿人
        		for (var i = 0; i < vm.model.depts.length; i++) {
					for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
						if(vm.model.depts[i].userDtos[j].id == vm.taskAudit.operator){//获得部门人员
						vm.userNameAndUnit =  vm.model.depts[i].name +'、'+ vm.model.depts[i].userDtos[j].displayName;
						}
					}
				}
        		$('.draft_issued').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		
        		vm.basicData.hecretHierarchy=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().hecretHierarchy&&x.pId==common.basicDataConfig().hecretHierarchy;})
	   			.toArray();//获取秘密等级信息
        		vm.basicData.fileSet=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().fileSet&&x.pId==common.basicDataConfig().fileSet;})
	   			.toArray();//获取文件缓急信息
        		vm.basicData.documentType=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().documentType&&x.pId==common.basicDataConfig().documentType;})
	   			.toArray();//获取文件种类信息
        		vm.basicData.openType=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().openType&&x.pId==common.basicDataConfig().openType;})
	   			.toArray();//获取公开种类信息
        		vm.basicData.postingCategory=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().postingCategory&&x.pId==common.basicDataConfig().postingCategory;})
	   			.toArray();//获取发文种类信息
        		
        	};
        	
        	//意见下拉框
//        	vm.opinion=function(){
//        		taskAuditSvc.getOpinion(vm);
//        	};
        	
        	//保存常用意见
        	vm.saveOpinion=function(){
        		//vm.model.opinion="";// 清空model重新查询
        		if(vm.processSuggestion != "" && vm.processSuggestion != undefined){
        			taskAuditSvc.saveOpinion(vm);
        		}
        	};
        	
        	vm.closeOpin=function(){
        		$('#opinionEdit').model('hide');
        	};
        	
        	//常用意见管理模态框
        	vm.showOpinion = function(){
        		$('.opinion').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		 vm.opinionGrid.dataSource.read();
        	};
        	
        	//编辑意见
        	vm.editOpin=function(){
        		taskAuditSvc.editOpin(vm);
        	};
        	
        	//编辑模态框
        	vm.edit=function(id,opin){
        		$('.opinionEdit').modal({
                    backdrop: 'static',
                    keyboard:false
                });
        		vm.model.opinion = {"opinion":opin,"id":id};
        		
        	};
        	//删除意见
        	vm.remove=function(id){
        		taskAuditSvc.deleteOpin(vm,id);
        	};
        	
        	//切换常用意见
        	vm.changeOpin=function(){
        		vm.processSuggestion = vm.model.opinion;
        	};
        	
        	
        	 vm.del = function (id) {       	 
              	$('.confirmDialog').modal('hide');             	
              	taskAuditSvc.deleteOpin(vm,id);
            };
        	//批量删除意见
        	vm.dels = function () {     
             	var selectIds = common.getKendoCheckId('.grid');
                 if (selectIds.length == 0) {
                 	common.alert({
                     	vm:vm,
                     	msg:'请选择数据'               	
                     });
                 } else {
                 	var ids=[];
                     for (var i = 0; i < selectIds.length; i++) {
                     	ids.push(selectIds[i].value);
     				}  
                     var idStr=ids.join(',');
                     vm.del(idStr);
                 } 
            };
        	
        	//部门切换触发
        	vm.changeDept = function(){
        		for (var i = 0; i < vm.model.depts.length; i++) {
					if(vm.model.depts[i].id == vm.model.deptId){//获得部门人员
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长"){//默认选中科长为下一流程处理人
									vm.taskAudit.nextUser = vm.model.depts[i].userDtos[j].id;//下一处理人为当前部门角色是科长的人
								}
							}
						}
					}
				}
        	};
        	
        	//经办人员业务选择
        	
        	vm.clickedYW = function(str){
        		if(str == "yewu"){
        			vm.nextProcessRadioOfYW = "yewu";
        		}
        		
        		if(str == "pingshenbaopi"){
        			vm.nextProcessRadioOfYW = "pingshenbaopi";
        		}
        		if(str == "fawen"){
        			vm.nextProcessRadioOfYW = "fawen";
        		}
        		if(str == "keyuantuiwen"){
        			vm.nextProcessRadioOfYW = "keyuantuiwen";
        		}
        		if(str == "pingshenweituo"){
        			vm.nextProcessRadioOfYW = "pingshenweituo";
        		}
        		if(str == "fawennigao"){
        			vm.nextProcessRadioOfYW = "fawennigao";
        		}
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
        		if(str == "tuiwenbanjie"){
        			vm.nextProcessRadio = "tuiwenbanjie";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
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
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科长" &&vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//科长选择当前科室的科员为下一流程处理人
									vm.model.depts[i].userDtos.splice(j,1);
									vm.users = vm.model.depts[i].userDtos;
								}
							}
						}
    				}
        			
        		}
        		
        		//科室办理--显示部门下拉选
        		if(str == "keshibanli"){
        			vm.nextProcessRadio = "keshibanli";
        		}
        		
        		//科员办理--显示当前部门的科员
        		if(str == "keyuanbanli"){
        			vm.nextProcessRadio = "keyuanbanli";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//科长选择当前科室的科员为下一流程处理人
									vm.users = vm.model.depts[i].userDtos;
								}
							}
						}
        			}
        		}
        		
        		//科长审核
        		if(str == "kezhangshenhe"){
        			vm.nextProcessRadio = "kezhangshenhe";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "科员" &&vm.model.depts[i].userDtos[j].id ==vm.taskAudit.nextUser){//默认选择当前人员的科长
									for (var m = 0; m < vm.model.depts[i].userDtos.length; m++) {
										for (var n = 0; n < vm.model.depts[i].userDtos[m].roles.length; n++) {
											if(vm.model.depts[i].userDtos[m].roles[n].roleName == "科长"){
												vm.taskAudit.nextUser = vm.model.depts[i].userDtos[m].id;
											}
										}
									}
								}
							}
						}
        			}
        		}
        		
        		//退回经办人
        		if(str == "tuihuijingbanren" || str == "jingbanrensongshen" || str == "pingswancheng" || str == "jingBanRenBanli_juzhang"){
        			if(str == "tuihuijingbanren"){
        				vm.nextProcessRadio = "tuihuijingbanren";
        			}else if(str == "jingbanrensongshen"){
        				vm.nextProcessRadio = "jingbanrensongshen";
        			}else if(str == "pingswancheng"){
        				vm.nextProcessRadio = "pingswancheng";
        			}else if(str == "jingBanRenBanli_juzhang"){
        				vm.nextProcessRadio = "jingBanRenBanli_juzhang";
        			}
					vm.taskAudit.nextUser = vm.taskAudit.operator;
        		}
        		
        		//局领导审批
        		if(str == "julingdaoshenpi"){
        			vm.nextProcessRadio = "julingdaoshenpi";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "局领导"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//送审
        		if(str == "songshen"){
        			vm.nextProcessRadio = "songshen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "评审中心"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//人秘科核稿
        		if(str == "renmikehegao"){
        			vm.nextProcessRadio = "renmikehegao";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		//局领导复批
        		if(str == "julingdaofushen"){
        			vm.nextProcessRadio = "julingdaofushen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
    					if(vm.model.depts[i].name == "局领导"){//获得部门人员
    						vm.users = vm.model.depts[i].userDtos;
    					}
    				}
        		}
        		
        		//办公室发文
        		if(str == "bangongshifawen"){
        			vm.nextProcessRadio = "bangongshifawen";
        			for (var i = 0; i < vm.model.depts.length; i++) {
						for (var j = 0; j < vm.model.depts[i].userDtos.length; j++) {//循环人员
							for (var k = 0; k < vm.model.depts[i].userDtos[j].roles.length; k++) {//循环角色
								if(vm.model.depts[i].userDtos[j].roles[k].roleName == "人秘科发文人员"){//默认选中人秘科发文人员为下一流程处理人
									vm.taskAudit.processRole = vm.model.depts[i].userDtos[j].roles[k].id;
								}
							}
						}
    				}
        		}
        		
        		if(str == "fawendengji"){
        			vm.nextProcessRadio = "fawendengji";
        		}
        	};
        	
        	//选择人员为下一处理人
        	vm.selectUser = function(id){
        		vm.taskAudit.nextUser = id;
        		if(vm.nextProcessRadio == "tuihuijingbanren" ||vm.nextProcessRadio == "jingBanRenBanli" || vm.nextProcessRadio == "pingswancheng"){
            		vm.taskAudit.operator = id;
    			}
        	};
        	
        	function setNextProcess(vm){
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
    				vm.taskAudit.processState = "processState_6";
    				vm.taskAudit.nextProcess = "processState_8";
    			}else if(processState == "processState_6"){
    				vm.taskAudit.processState = "processState_8";
    				vm.taskAudit.nextProcess = "processState_9";
    			}else if(processState == "processState_8"){
    				vm.taskAudit.processState = "processState_9";
    				vm.taskAudit.nextProcess = "processState_10";
    			}else if(processState == "processState_9"){
    				vm.taskAudit.processState = "processState_10";
    				vm.taskAudit.nextProcess = "processState_17";
    			}else if(processState == "processState_10"){
    				vm.taskAudit.processState = "processState_17";
    				vm.taskAudit.nextProcess = "processState_18";
    			}else if(processState == "processState_17"){
    				vm.taskAudit.processState = "processState_18";
    				vm.taskAudit.nextProcess = "processState_19";
    			}else if(processState == "processState_18"){
    				vm.taskAudit.processState = "processState_19";
    				vm.taskAudit.nextProcess = "processState_21";
    			}else if(processState == "processState_19"){
    				vm.taskAudit.processState = "processState_21";
    				vm.taskAudit.nextProcess = "processState_22";
    			}else if(processState == "processState_21"){
    				vm.taskAudit.processState = "processState_23";
    				vm.taskAudit.nextProcess = "";
    			}
    		}
        	
        	//送出
        	vm.handle = function(){
        		
        		vm.taskAudit.tuiwen = false;
        		common.initJqValidation();
        		var isValid = $('form').valid();
    	   		if (isValid) {
	        		if(vm.nextProcessRadio =="bumen"){//正常流程--部门审批
	        			if(vm.taskAudit.processState == "processState_4"){
	        				vm.taskAudit.processState = "processState_3";
	        				vm.taskAudit.nextProcess = "processState_4";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	    				
	    				vm.taskAudit.processRole ="";
	    			}else if(vm.nextProcessRadio =="tuiwen"){//退文
	    				vm.taskAudit.processState = "processState_15";
	    				vm.taskAudit.nextProcess = "processState_3";
	    				vm.taskAudit.processRole ="";
	    			}else if(vm.nextProcessRadio =="tuiwenbanjie"){//退文办结
	    				vm.taskAudit.processState = "processState_3";
	    				vm.taskAudit.nextUser = "";
	    				vm.taskAudit.nextProcess = "processState_22";
	    			}else if(vm.nextProcessRadio =="banjie"){//办结
	    				vm.taskAudit.processState = "processState_11";
	    				vm.taskAudit.nextProcess = "";
	    				vm.taskAudit.processRole ="";
	    			}else if(vm.nextProcessRadio == "tuihuiChongban"){//退回给秘书科
	    				vm.taskAudit.processState = "processState_4";
	    				vm.taskAudit.nextProcess = "processState_3";
	    				vm.taskAudit.processRole =getMiShuKRole("秘书科分办人员");
	    				vm.taskAudit.nextUser = "";
	        		}else if(vm.nextProcessRadio == "jingBanRenBanli"){//经办人办理--正常流程
	        			if(vm.taskAudit.processState != "processState_3"){
	        				vm.taskAudit.processState = "processState_3";
	        			}
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "keshibanli"){//科室办理--退回给所选科室的科长
	        			vm.taskAudit.processState = "processState_5";
	    				vm.taskAudit.nextProcess = "processState_4";
	    				
	        		}else if(vm.nextProcessRadio == "keyuanbanli"){//科员办理--退回给经办人所在科室的科员
	        			vm.taskAudit.processState = "processState_4";
	    				vm.taskAudit.nextProcess = "processState_5";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "kezhangshenhe"&&vm.nextProcessRadioOfYW == "pingshenbaopi"){//科长审核--正常流程
	        			if(vm.taskAudit.processState == "processState_6"){//退回经办人后重新送科长
	        				vm.taskAudit.processState = "processState_5";
		    				vm.taskAudit.nextProcess = "processState_6";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "julingdaoshenpi"){//局领导审批--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "jingBanRenBanli_juzhang"){//局领导审批--经办人办理
	        			vm.taskAudit.processState = "processState_4";
	    				vm.taskAudit.nextProcess = "processState_5";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "pingshentuihui"){//评审中心退回经办人
	        			vm.taskAudit.processState = "processState_8";
	    				vm.taskAudit.nextProcess = "processState_9";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "tuihuijingbanren"){//退回经办人
	        			vm.taskAudit.processState = vm.taskAudit.nextProcess;
	    				vm.taskAudit.nextProcess = "processState_5";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "jingbanrensongshen"){//经办人送审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "songshen"){//送审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "pingswancheng"){//评审完成--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "pingshenbaopi" && vm.nextProcessRadio == "kezhangshenhe"){//评审完成--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "fawen" && vm.nextProcessRadio == "kezhangshenhe"){//经办人发文拟稿
	        			if(vm.taskAudit.processState == "processState_4"){//第三步发文
	        				vm.taskAudit.processState = "processState_5";
	        			}
	        			if(vm.taskAudit.processState == "processState_10"){//第三步发文
	        				vm.taskAudit.processState = "processState_17";
	        			}
	    				vm.taskAudit.nextProcess = "processState_18";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadioOfYW == "keyuantuiwen" && vm.nextProcessRadio == "kezhangshenhe"){//经办人退文
	        			vm.taskAudit.processState = "processState_5";
	    				vm.taskAudit.nextProcess = "processState_4";
	    				vm.taskAudit.processRole ="";
	    				vm.taskAudit.tuiwen = true;
	        		}else if(vm.nextProcessRadioOfYW == "pingshenweituo" && vm.nextProcessRadio == "kezhangshenhe"){//评审委托--科长审核
	        			vm.taskAudit.processState = "processState_9";
	    				vm.taskAudit.nextProcess = "processState_18";
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "renmikehegao"){//评审完成--正常流程
	        			if(vm.taskAudit.processState != "processState_17"){
	        				vm.taskAudit.processState = "processState_18";
	        				vm.taskAudit.nextProcess = "processState_19";
	        			}else{
	        				setNextProcess(vm);//设置当前流程状态&&下一流程状态
	        			}
	        			
	        			vm.taskAudit.nextUser ="";
	        		}else if(vm.nextProcessRadio == "julingdaofushen"){//局领导复审--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.processRole ="";
	        		}else if(vm.nextProcessRadio == "bangongshifawen"){//办公室发文--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.nextUser ="";
	        		}else if(vm.nextProcessRadio == "bangongshifawen"){//办公室发文--正常流程
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.nextUser ="";
	        		}else if(vm.nextProcessRadio == "fawendengji"){//秘书科发文登记--正常流程
	        			vm.taskAudit.processState = "processState_21";
	        			setNextProcess(vm);//设置当前流程状态&&下一流程状态
	    				vm.taskAudit.nextUser ="";
	    				vm.taskAudit.processRole ="";
	        		}
	        		
	        
	        		taskAuditSvc.handle(vm);
    	   		}
        	};
        	
        	//得到秘书科角色
        	function getMiShuKRole(role){
        		for (var i = 0; i < vm.model.roles.length; i++) {
        			if(vm.model.roles[i].roleName == role){
        				return vm.model.roles[i].id;
        			}
				}
        	}

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
