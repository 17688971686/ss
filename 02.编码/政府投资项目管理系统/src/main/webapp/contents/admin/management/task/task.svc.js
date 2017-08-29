(function() {
	'use strict';

	angular.module('app').factory('taskSvc', task);

	task.$inject = [ '$http' ,'$location'];

	function task($http,$location) {
		var url_task = "/management/task";
		var url_taskRecord = "/management/taskRecord";
		var url_shenbao = "/management/shenbao";
		var url_monthReport = "/management/monthReport";
		var url_project = "/management/project";
		var url_back = "#/task/todo";
		var service = {
			grid : grid,//待办任务列表
			completeGird:completeGird,//已办任务列表
			getTaskById:getTaskById,//根据任务id获取任务信息
			getShenBaoInfoById:getShenBaoInfoById,//根据id获取申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			handle:handle
		};
		
		return service;
		
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
				//项目类型、建设单位的显示
				vm.projectTypes=common.stringToArray(vm.model.shenBaoInfo.projectType,",");
				vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
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
				
				vm.model.shenBaoInfo.apInvestSum = common.toMoney(vm.model.shenBaoInfo.apInvestSum);//累计安排资金
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
				//如果申报信息的申报阶段为下一年度计划
				if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
					 vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
					 vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
	    			   vm.isYearPlan = true;
				}
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end getShenBaoInfoById
		
		function handle(vm){
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
					$('#todoNumber').html(e.response.count);
				},
				change: function(e) {//当数据发生变化时
//				    var filters = dataSource.filter();//获取所有的过滤条件
//				    vm.filters = filters;
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
				},
				change: function(e) {//当数据发生变化时
					var filters = dataSource.filter();
					if(filters){
						var userfilters = filters.filters;//获取所有的过滤条件
					}
				    vm.filters = userfilters;
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