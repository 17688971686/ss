(function() {
	'use strict';

	angular.module('app').factory('taskSvc', task);

	task.$inject = [ '$http' ];

	function task($http) {
		var url_task = "/management/task";
		var url_taskRecord = "/management/taskRecord";
		var url_shenbao = "/management/shenbao";
		var url_monthReport = "/management/monthReport";
		var url_project = "/management/project";
		var url_back = "#/task/todo";
		var url_dept = "/org";
		var url_users="/org/{0}/users";
		var service = {
			grid : grid,//待办任务列表
			completeGird:completeGird,//已办任务列表
			getTaskById:getTaskById,//根据任务id获取任务信息
			getShenBaoInfoById:getShenBaoInfoById,//根据id获取申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			handle:handle,
			getDept:getDept,//获取部门数据
			getDeptUsers:getDeptUsers
		};
		
		return service;
		
		//根据部门id获取人员
		function getDeptUsers(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_users + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response){
				vm.model.deptUsers = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		//获取部门
		function getDept(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_dept)
			};
			
			var httpSuccess = function success(response){
				vm.model.depts = response.data.value||{};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		/**
		 * 根据id获取项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.model.monthReport.projectId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.project= response.data.value[0]||{};
				//项目类型的显示
				if(vm.model.project.projectType != "" && vm.model.project.projectType != undefined){
					vm.model.project.projectType = vm.model.project.projectType.split(",");
				}else{
					vm.model.project.projectType =[];
				}				
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 根据id获取月报信息
		 */
		function getMonthReportById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_monthReport + "?$filter=id eq '{0}'", vm.relId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.monthReport= response.data.value[0]||{};
				getProjectById(vm);//根据关联的项目id获取项目信息
				//处理数据
				vm.model.monthReport.beginDate = common.formatDate(vm.model.monthReport.beginDate);
				vm.model.monthReport.endDate = common.formatDate(vm.model.monthReport.endDate);
				//上传文件类型
				vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.relId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo= response.data.value[0]||{};
				//项目类型的显示
				vm.model.shenBaoInfo.projectType=common.stringToArray(vm.model.shenBaoInfo.projectType,",");
				//判断项目的投资类型
				if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
					vm.isSHInvestment = true;
				}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
					vm.isZFInvestment = true;
				}
				//日期展示
				vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
				vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
				vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
				vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
				//资金处理
				vm.model.shenBaoInfo.projectInvestSum=common.toMoney(vm.model.shenBaoInfo.projectInvestSum);//项目总投资
				vm.model.shenBaoInfo.projectInvestAccuSum=common.toMoney(vm.model.shenBaoInfo.projectInvestAccuSum);//累计完成投资
				vm.model.shenBaoInfo.capitalSCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys);//市财政-公共预算
				vm.model.shenBaoInfo.capitalSCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.shenBaoInfo.capitalSCZ_zxzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.shenBaoInfo.capitalQCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_ggys);//区财政-公共预算
				vm.model.shenBaoInfo.capitalQCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.shenBaoInfo.capitalZYYS=common.toMoney(vm.model.shenBaoInfo.capitalZYYS);//中央预算
				vm.model.shenBaoInfo.capitalSHTZ=common.toMoney(vm.model.shenBaoInfo.capitalSHTZ);//社会投资
				vm.model.shenBaoInfo.capitalOther=common.toMoney(vm.model.shenBaoInfo.capitalOther);//其他
				//申请资金
				vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear);
				vm.model.shenBaoInfo.capitalSCZ_qita=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
				//计算资金筹措总计
				vm.capitalTotal=function(){
		  			 return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_zxzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_ggys)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_gtzj)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSHTZ)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalZYYS)||0 )
		  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalOther)||0) ;
		  		 };
				if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
					vm.isYearPlan = true;
					vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
				}else if(vm.model.shenBaoInfo.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
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
		  		//申请资金计算
		  		vm.lastTwoYearCapitalTotal = function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear)||0);
		  		};
		  		vm.lastYearCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear)||0);
		  		};
		  		vm.theYearCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear)||0);
		  		};
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end getShenBaoInfoById
		
		function handle(vm){
			vm.model.taskRecord.nextUser = vm.nextUser;
			//vm.model.taskRecord.processState = vm.task.processState;
			var httpOptions = {
				method : 'put',
				url : url_task+"/"+vm.taskId,
				data : vm.model.taskRecord
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
	}//handle

		/**
		 * 根据任务id查询任务信息
		 */
		function getTaskById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_task + "?$filter=id eq '{0}'", vm.taskId)
				};
			
			var httpSuccess = function success(response) {
				vm.task = response.data.value[0] || {};
				if(vm.task){
					vm.task.taskTypeDesc=common.getBasicDataDesc(vm.task.taskType);
					if(vm.task.isComplete){//如果任务为已完成
						vm.isComplete=true;
					}else{//任务没有完成
						
						//查看任务的当前流程--设置下一流程
						setNextUser(vm);
						if(vm.task.processState =="processState_1"){
							vm.miShuFenBan = false;
						}
						
					}
				}	
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//getTaskById
		
		function setNextUser(vm){
			var processState = vm.task.processState;//下一流程展示
			if(processState ==  "processState_1"){
				vm.nextState ="部门承办";
			}else if(processState == "processState_4"){
				vm.nextState ="经办人初审";
			}else if(processState == "processState_5"){
				vm.nextState ="科长复核";
			}else if(processState == "processState_6"){
				vm.nextState ="副局长审批";
			}else if(processState == "processState_7"){
				vm.nextState ="局长审批";
			}else if(processState == "processState_8"){
				vm.nextState ="经办人送审";
			}else if(processState == "processState_9"){
				vm.nextState ="评审中心评审";
			}else if(processState == "processState_10"){
				vm.nextState ="经办人拟稿";
			}else if(processState == "processState_17"){
				vm.nextState ="科长核稿";
			}else if(processState == "processState_18"){
				vm.nextState ="秘书科核稿";
			}else if(processState == "processState_19"){
				vm.nextState ="副局长复核";
			}else if(processState == "processState_20"){
				vm.nextState ="局长复核";
			}else if(processState == "processState_21"){
				vm.nextState ="秘书科发文登记";
			}else if(processState == "processState_22"){
				vm.nextState ="结束审批";
			}
			
		}
		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_task),
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
					$('#todoNumber').html(e.response.value.length);					
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
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.id,item.relId);			
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
			                            dataSource: $linq(common.getBasicData())
			             	       					.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			             	       					.toArray(),
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

			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
				
		function completeGird(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord),
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
							return common.format("<a href='#/task/todo/{1}/{2}/{3}'>{0}</a>",item.title,item.taskType,item.taskId,item.relId);
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
			                            dataSource: $linq(common.getBasicData())
			             	       					.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			             	       					.toArray(),
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

			vm.gridOptions_complete = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
	}	
})();