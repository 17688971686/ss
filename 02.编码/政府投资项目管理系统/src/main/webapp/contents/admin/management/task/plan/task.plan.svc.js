(function() {
	'use strict';

	angular.module('app').factory('taskPlanSvc', taskPlan);

	taskPlan.$inject = [ '$http' ,'$location'];

	function taskPlan($http,$location) {
		var url_task = "/management/task";
		var url_taskPlan = "/management/task/plan";
		var url_shenbao = "/management/shenbao";
		var url_dept="/org";
		var url_back = "#/task/todo_plan";
		var url_replyFile = "/management/replyFile";
		var url_opin="/opin";
		var url_users = "/user";
		var url_approval ="/management/approval";
		var url_proxy = "/management/proxy";
		var url_review = "/management/review";
		var url_taskRecord_plan = "/management/taskRecord/plan";
		
		var service = {
			grid_plan : grid_plan,//待办任务列表
			getTaskInfoById:getTaskInfoById,//查询任务信息
			getShenBaoInfoById:getShenBaoInfoById,//查询申报信息
			getDeptByName:getDeptByName,//查询部门
			handle:handle,//送出
			replyFileGird:replyFileGird,//批复文件库列表
			saveShenBaoInfo:saveShenBaoInfo,//保存申报信息
			saveOpinion:saveOpinion,//保存意见
			getOpinion:getOpinion,//获取意见
			opinionGird:opinionGird,//意见列表
			deleteOpin:deleteOpin,//删除意见
			editOpin:editOpin,//编辑意见
			savePlanReach:savePlanReach,//保存下达计划
			complete_PlanGird:complete_PlanGird
		};
		
		return service;
		
		/**
		 * 保存下达计划
		 */
		function savePlanReach(vm){
			common.initJqValidation();
 			var isValid = $('#planReachEdit').valid();
	   		if (isValid) {
	   			//处理数据
	   			vm.model.shenBaoInfo.sqPlanReach_ggys=vm.apPlanReach_ggys;
   				vm.model.shenBaoInfo.sqPlanReach_gtzj=vm.apPlanReach_gtzj;
   				
				var httpOptions = {
					method : 'put',
					url : url_shenbao,
					data : vm.model.shenBaoInfo
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
		}
		
		
		/**
		 * 编辑保存常用意见
		 */
		function editOpin(vm){
			var httpOptions = {
	                method: 'put',
	                url:url_opin,
	                data:vm.model.opinion          
	            };
	            
            var httpSuccess = function success(response) { 
            	common.requestSuccess({
            		vm:vm,
            		response:response,
            		fn:function(){
            			$('.opinionEdit').modal('hide');
            			vm.opinionGrid.dataSource.read();
            			getOpinion(vm);
            		}
            	});
            };
	            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun editOpin
		
		/**
		 * 删除常用意见
		 */
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
	                    getOpinion(vm);
	                }					
				});
            };
            
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun deleteOpin	

		/**
		 * 查询意见
		 */
		function getOpinion(vm){
			var httpOptions = {
					method : 'get',
					url : url_opin
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.opinionDtos = response.data.value||{};
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
		 * 保存意见
		 */
		function saveOpinion(vm){
			vm.opinion = {"opinion":vm.taskRecord.processSuggestion};
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
								getOpinion(vm);
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
					url : common.format(url_task + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.taskPlan = response.data.value[0] || {};
						if(vm.taskPlan.thisProcess==common.basicDataConfig().processStage_qianshou){//签收阶段
							vm.isShowBtn=true;
							getDeptByName(vm,"投资科");//初始化下一流程处理人为投资科科长处理
						}
						if(vm.taskPlan.thisProcess==common.basicDataConfig().processStage_kzshenhe){//科长审核阶段
							vm.isProcessStage_kzshenhe=true;
							getDeptByName(vm,"投资科");//获取投资科下的科员
							vm.taskRecord.nextProcess=common.basicDataConfig().processStage_jbrbanli;//初始化下一流程为经办人处理
							vm.isShowDeptUsers=true;//初始化显示投资科人员
						}
						if(vm.taskPlan.thisProcess==common.basicDataConfig().processStage_jbrbanli ||
								vm.taskPlan.thisProcess==common.basicDataConfig().processStage_zbqitaren){//经办人办理阶段、转办其他人
							vm.isProcessStage_jbrbanli=true;
							getDeptByName(vm,"投资科");//初始化下一流程处理人为投资科科长处理
							vm.taskRecord.nextProcess=common.basicDataConfig().processState_niwendengji;//初始化下一流程为下达计划拟文
							vm.isShowXiaDaJiHuaBtn=true;//初始化显示填写下达计划按钮
						}
						if(vm.taskPlan.thisProcess==common.basicDataConfig().processState_niwendengji){//发文拟稿阶段
							vm.isShowBtn=true;
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
						vm.isSHInvestment = false;
						vm.isZFInvestment = false;
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
						if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_xuJianPlan){//申报阶段为:续建计划
							vm.isXuJian=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_xuJian;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_junGong){//申报阶段为:竣工决算
							vm.isJunGong=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_junGong;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_prePlanFee){//申报阶段为:规划设计前期费
							vm.isPrePlanFee=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_prePlanFee;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_newStratPlan){//申报阶段为:新开工计划
							vm.isNewStart=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_newStart;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_capitalApplyReport){//申报阶段为:资金申请报告
							vm.isCapitalApplyReport=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_capitalApplyReport;
						}else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_jihuaxiada){//申报阶段为:计划下达
							vm.isJihuaxiada=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_jihuaxiada;
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
				  		//计划下达申请资金累计
				  		vm.sqPlanReachTotal=function(){
				  			vm.sqPlanReachSum = common.getSum([vm.model.shenBaoInfo.sqPlanReach_ggys || 0,vm.model.shenBaoInfo.sqPlanReach_gtzj || 0]);
				  			return vm.sqPlanReachSum;
				  		};
				  		//下达计划信息填写模态框
				  		if(vm.isShowXiaDaJiHuaBtn){
				  			//初始化安排资金为申请资金
				  			vm.apPlanReach_ggys=vm.model.shenBaoInfo.sqPlanReach_ggys;
				  			vm.apPlanReach_gtzj=vm.model.shenBaoInfo.sqPlanReach_gtzj;
				  			vm.apPlanReachTotal=function(){
					  			vm.apPlanReachSum = common.getSum([vm.apPlanReach_ggys || 0,vm.apPlanReach_gtzj || 0]);
					  			return vm.apPlanReachSum;
					  		};
				  			$('.planReach').modal({
			                    backdrop: 'static',
			                    keyboard:false
			                });
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
		}
		
		/**
		 * 查询部门
		 */
		function getDeptByName(vm,name){
			var httpOptions = {
				method : 'get',
				async:false,
				url : common.format(url_dept+ "?$filter=name eq '{0}'", name)
			};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.dept = response.data.value[0]||{};
						if(vm.taskPlan.thisProcess==common.basicDataConfig().processStage_qianshou ||
								vm.taskPlan.thisProcess==common.basicDataConfig().processStage_jbrbanli ||
								vm.taskPlan.thisProcess==common.basicDataConfig().processStage_zbqitaren){//签收阶段或经办人办理阶段、转办其他人
							vm.model.dept.userDtos.every(function (value, index) {
								var hasRole=$linq(value.roles)
									.where(function(x){return x.roleName=='科长';}).firstOrDefault();
								if(hasRole){
									vm.taskRecord.nextUser = value.id;
									return false;
								}
								 return true;
							});
						}
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
			common.initJqValidation();
 			var isValid = $('form').valid();
	   		if (isValid) {
				var httpOptions = {
					method : 'post',
					url : url_task+"/"+vm.taskId,
					data : vm.taskRecord
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
		 * 个人已办--计划类
		 */
		function complete_PlanGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord_plan),
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
				change: function(e) {//当数据发生变化时
				    var filters = dataSource.filter();//获取所有的过滤条件
				    vm.filters = filters;
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
						width : 500,			
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/plan_details/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
						}
					},
					 {
						field : "unitName",
						title : "建设单位",
						width : 350,						
						filterable : true
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 180,
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
						field : "thisProcess",
						title : "审批阶段",
						width : 180,						
						filterable : false,
						template:function(item){						
							return common.getBasicDataDesc(item.thisProcess);
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

			vm.gridOptions_complete_plan = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		/**
		 * 个人待办列表--计划类
		 */
		function grid_plan(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskPlan),
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
					$('#todoNumber_plan').html(e.response.count);
				},
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.todo_planOption = grid.getOptions();
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
						width : 500,			
						filterable : true,
						template:function(item){
							return common.format("<a href='#/task/handle_plan/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
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
			
			if(window.todo_planOption && window.todo_planOption !=''){
				vm.gridOptions_plan = window.todo_planOption;
			}else{
				vm.gridOptions_plan = {
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