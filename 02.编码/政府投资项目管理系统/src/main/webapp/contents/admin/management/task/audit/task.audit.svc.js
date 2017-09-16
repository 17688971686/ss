(function() {
	'use strict';

	angular.module('app').factory('taskAuditSvc', taskAudit);

	taskAudit.$inject = [ '$http' ,'$location'];

	function taskAudit($http,$location) {
		var url_task = "/management/task";
		var url_taskAudit = "/management/task/audit";
		var url_shenbao = "/management/shenbao";
		var url_dept="/org";
		var url_back = "#/task/todo";
		var url_replyFile = "/management/replyFile";
		var url_role="/role";
		var url_opin="/opin";
		var url_users = "/user";
		var url_draft ="/management/draft";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		
		var service = {
			grid : grid,//待办任务列表
			getTaskInfoById:getTaskInfoById,//查询任务信息
			getShenBaoInfoById:getShenBaoInfoById,//查询申报信息
			getDepts:getDepts,//查询部门
			handle:handle,//送出
			replyFileGird:replyFileGird,//批复文件库列表
			saveShenBaoInfo:saveShenBaoInfo,//保存申报信息
			getRoles:getRoles,//查询角色信息
			saveOpinion:saveOpinion,//保存意见
			getOpinion:getOpinion,//获取意见
			opinionGird:opinionGird,//意见列表
			deleteOpin:deleteOpin,//删除意见
			editOpin:editOpin,//编辑意见
			getDraftIssued:getDraftIssued,//查询发文拟稿
			saveDraft:saveDraft,//保存发文信息
			saveApproval:saveApproval,//评审报批
			getApproval:getApproval,//查询评审报批
			getComission:getComission,//查询评审委托
			saveProxy:saveProxy,//保存委托书
			getReviewResult:getReviewResult,//查询评审结果
			saveReview:saveReview//保存评审结果
		};
		
		return service;
		
		//保存评审结果
		function saveReview(vm){
		
			vm.review.projectName = vm.model.shenBaoInfo.projectName;
			vm.review.constructionUnit = vm.model.shenBaoInfo.constructionUnit;
			vm.review.approvalEndDate = new Date();
			vm.review.receiptDate = new Date(vm.model.shenBaoInfo.createdDate);
			vm.review.approvalDate = vm.proxy.beginDate;
			//vm.review.projectInvestSum = vm.projectInvestSum;
			vm.review.nuclear = vm.nuclear;
			vm.review.cut = vm.cut;
			
			
				var httpOptions = {
						method : 'post',
						url : common.format(url_review + "/" +vm.taskAudit.id),
						data : vm.review
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}
					});
				};
					
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		};
		
		//查询评审结果
		function getReviewResult(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_review + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.review = response.data || {};
						if(vm.review == ""){
							vm.projectInvestSum = vm.model.shenBaoInfo.projectInvestSum;
						}else{
							vm.nuclear = vm.review.nuclear;
							vm.cut = vm.review.cut;
							vm.projectInvestSum = vm.review.projectInvestSum;
						}
						vm.review.beginDate = common.formatDate(vm.review.beginDate);
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		function saveProxy(vm){
			vm.proxy.approvalType = vm.approvalType;
			vm.proxy.projectName = vm.model.shenBaoInfo.projectName;
			vm.proxy.constructionUnit = vm.model.shenBaoInfo.constructionUnit;
			vm.proxy.processRole = vm.taskAudit.operator;
			vm.proxy.beginDate = new Date();
			vm.proxy.contacts = vm.nameAndTel;
			vm.proxy.capitalBaoSong = vm.approval.capitalBaoSong;
			vm.proxy.processSuggestion_JBR = vm.processSuggestion_JBR_WTS;
//			common.initJqValidation();
// 			var isValid = $('#formProxy').valid();
//	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_proxy + "/" +vm.taskAudit.id),
						data : vm.proxy
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}
					});
				};
					
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
	   		//};
		};
		
		//查询审批委托书
		function getComission(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_proxy + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.proxy = response.data || {};
						vm.proxy.beginDate = common.formatDate(vm.proxy.beginDate);
						if(vm.approval.processSuggestion_JBR != vm.proxy.processSuggestion_JBR){
							vm.processSuggestion_JBR_WTS = vm.proxy.processSuggestion_JBR;
						}else{
							vm.processSuggestion_JBR_WTS = vm.approval.processSuggestion_JBR;
						}
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		};
		
		
		//查询审批单
		function getApproval(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_approval + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.approval = response.data || {};
						vm.approval.beginDate = common.formatDate(vm.approval.beginDate);
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		};
		
		//保存审批单
		function saveApproval(vm){
			vm.approval.approvalType = vm.approvalType;
			vm.approval.projectName = vm.model.shenBaoInfo.projectName;
			vm.approval.constructionUnit = vm.model.shenBaoInfo.constructionUnit;
			vm.approval.processRole = vm.taskAudit.operator;
			vm.approval.beginDate = new Date();
			common.initJqValidation();
 			var isValid = $('#formApproval').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_approval + "/" +vm.taskAudit.id),
						data : vm.approval
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}
					});
				};
					
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
	   		};
		};
		
		function saveDraft(vm){
			vm.draft.projectName = vm.model.shenBaoInfo.projectName;
			vm.draft.unitName = vm.model.shenBaoInfo.constructionUnit;
			vm.draft.capitalTotal = vm.capitalTotal;
			vm.draft.userNameAndUnit = vm.userNameAndUnit;
			
			common.initJqValidation();
 			var isValid = $('#formDraft').valid();
	   		if (isValid) {
				var httpOptions = {
						method : 'post',
						url : common.format(url_draft + "/" +vm.taskAudit.id),
						data : vm.draft
					};
				
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"保存成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}
					});
				};
					
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
	   		};
		};
		
		function getDraftIssued(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_draft + "/" +vm.taskAudit.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.draft = response.data || {};
						vm.draft.draftDate=common.formatDate(vm.draft.draftDate);//开工日期
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		};
		
		//编辑意见
		function editOpin(vm){
			var httpOptions = {
	                method: 'put',
	                url:url_opin,
	                data:vm.model.opinion          
	            };
	            
	            var httpSuccess = function success(response) {    
	            	vm.opinionGrid.dataSource.read();
	            	$('.opinionEdit').modal('hide');
	            };
	            
	            common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		//删除意见
		function deleteOpin(vm,id) {
            vm.isSubmit = true;
            
            var httpOptions = {
                method: 'delete',
                url:url_opin,
                data:id              
            };
            
            var httpSuccess = function success(response) {               
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.opinionGrid.dataSource.read();
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        };// end fun deleteorg	

		/**
		 * 查询意见
		 */
		function getOpinion(vm){
			var httpOptions = {
					method : 'get',
					url : url_opin
			};
			
			var httpSuccess = function success(response){
				vm.model.opinionDtos = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		};
		
		/**
		 * 保存意见
		 */
		function saveOpinion(vm){
			
			vm.opinion = {"opinion":vm.processSuggestion};
			var httpOptions = {
					method : 'post',
					url : url_opin,
					data : vm.opinion
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		};
		
		/**
		 * 查询角色信息
		 */
		function getRoles(vm){
			var httpOptions = {
					method : 'get',
					url : url_role
				};
			
			var httpSuccess = function success(response) {
				vm.model.roles = response.data.value||{};
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		
		/**
		 * 保存申报信息
		 */
		function saveShenBaoInfo(vm){
			var httpOptions = {
					method : 'put',
					url : url_shenbao,
					data:vm.model.shenBaoInfo
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"保存成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
							}
						});
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 * 查询任务信息
		 */
		function getTaskInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_taskAudit + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.taskAudit = response.data.value[0] || {};
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 * 查询申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.relId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.shenBaoInfo = response.data.value[0] || {};
						//数据的展示处理
						//项目类型
						vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						//判断投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
		    	       		.toArray();
							//基础数据--行业归口
							 vm.basicData.projectIndustry=$linq(common.getBasicData())
			    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			    	       		.toArray();
							 vm.projectIndustryChange=function(){    		
				    	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
				    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
				    	       		.toArray();
			     			   };
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
							//基础数据--项目分类
							vm.basicData.projectClassify=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
		    	       		.toArray();
							//基础数据--行业归口
		        		   vm.basicData.projectIndustry=$linq(common.getBasicData())
		    	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
		    	       		.toArray();
						}
						//判断申报阶段
						if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
							vm.isProjectProposal=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
							vm.isKXXYJBG=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
							vm.isCBSJYGS=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}
						//时间的显示
						vm.model.shenBaoInfo.createdDate=common.formatDate(vm.model.shenBaoInfo.createdDate);//开工日期
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
						vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
						//资金计算显示
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys||0,vm.model.shenBaoInfo.capitalSCZ_gtzj||0,vm.model.shenBaoInfo.capitalSCZ_zxzj||0,
  			 						vm.model.shenBaoInfo.capitalQCZ_ggys||0,vm.model.shenBaoInfo.capitalQCZ_gtzj||0,
  			 						vm.model.shenBaoInfo.capitalSHTZ||0,vm.model.shenBaoInfo.capitalZYYS||0,vm.model.shenBaoInfo.capitalOther||0]);
				  		 };
					}
				});
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		/**
		 * 查询部门
		 */
		function getDepts(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.depts = response.data.value||{};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 送出处理
		 */
		function handle(vm){
			vm.taskAudit.processSuggestion = vm.processSuggestion;
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
	   				
			var httpOptions = {
					method : 'put',
					url : url_task+"/"+vm.taskId,
					data : vm.taskAudit
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back;
								}
							});
						}
					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});		
	   		}
		}
		
		// begin#grid
		/**
		 * 意见列表
		 */
		function opinionGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_opin),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "opinion",
					title : "意见",
					width : 450,
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.opinion);

					}

				}
			];
			// End:column

			vm.opinionGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		// begin#grid
		/**
		 * 批复文件列表
		 */
		function replyFileGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_replyFile),						
				schema : common.kendoGridConfig().schema({
					id : "id"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
					},
					filterable : false,
					width : 40,
					title : ""
				},
				{
					field : "number",
					title : "文号",
					width:180,
					
					filterable : true
				},
				{
					field : "name",
					title : "文件名",
					width : 450,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
					filterable : true
				}
			];
			// End:column

			vm.replyFileGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		
		}
		
		
		/**
		 * 个人待办列表
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskAudit),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:{
					field:'isComplete',
					operator:'eq',
					value:false
				},
				requestEnd:function(e){						
					$('#todoNumber_audit').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_auditOption = grid.getOptions();
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "title",
						title : "标题",						
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/handle_audit/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 400,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 200,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							 ui: function(element){
			                        element.kendoDropDownList({
			                            valuePrimitive: true,
			                            dataSource: vm.basicData.projectIndustry_ZF,
			                            dataTextField: "description",
			                            dataValueField: "id"
			                        });
			                    }
						}
					},
					 {
						field : "taskType",
						title : "任务类型",
						width : 180,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.taskType);
						}
					},
					{
						field : "",
						title : "创建日期",
						width : 180,
						template : function(item) {
							return kendo.toString(new Date(item.createdDate),"yyyy/MM/dd HH:mm:ss");
						}

					}

			];
			// End:column
			
			if(window.todo_auditOption && window.todo_auditOption !=''){
				vm.gridOptions = window.todo_auditOption;
			}else{
				vm.gridOptions = {
						dataSource : common.gridDataSource(dataSource),
						filterable : common.kendoGridConfig().filterable,
						pageable : common.kendoGridConfig().pageable,
						noRecords : common.kendoGridConfig().noRecordMessage,
						columns : columns,
						resizable : true
					};
			}
		}// end fun grid
	}	
})();