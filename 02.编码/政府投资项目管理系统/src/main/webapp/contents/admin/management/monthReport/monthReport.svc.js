(function() {
	'use strict';

	angular.module('app').factory('monthReportSvc', monthReport);

	monthReport.$inject = [ '$http','$compile','$location' ];	
	function monthReport($http,$compile,$location) {	
		var url_project = "/management/project";	
		var url_projectMonthReport="/management/monthReport";
		var url_backToZFlist = "/monthReport";
		var url_backToSHlist = "/monthReport_SH";
	
		var service = {
			grid : grid,
			grid_SH:grid_SH,
			getProjectById:getProjectById,
			submitMonthReport:submitMonthReport
		};		
		return service;	
		
		//查询月报信息
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.projectId)
				};
			
			var httpSuccess = function success(response){
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.projectInfo = response.data.value[0]||{};
						//判断项目的投资类型
						if(vm.model.projectInfo.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){
							vm.isZFInvestment = true;
						}else if(vm.model.projectInfo.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){
							vm.isSHInvestment = true;
						}
						if(vm.page=='details' || vm.page=='edit'){	
							//根据年，月查到月报数据
							var report=$linq(vm.model.projectInfo.monthReportDtos)
										.where(function(x){return x.submitYear==vm.year && x.submitMonth==vm.month;})
										.toArray();
							if(report.length>0){
								if(vm.model.display == true){//点击原数据
									for (var i = 0; i < report.length; i++) {
										if(report[i].isLatestVersion == false){
											vm.model.monthReport=report[i];	
										}
									}
								}else{//新数据
									for (var j = 0; j < report.length; j++) {
										if(report[j].isLatestVersion == true){
											vm.model.monthReport=report[j];	
										}
									}
								}
								//vm.model.monthReport=report[0];						
								//批复时间处理
								vm.model.monthReport.pifuJYS_date=common.toDate(vm.model.projectInfo.pifuJYS_date);
								vm.model.monthReport.pifuKXXYJBG_date=common.toDate(vm.model.projectInfo.pifuKXXYJBG_date);
								vm.model.monthReport.pifuCBSJYGS_date=common.toDate(vm.model.projectInfo.pifuCBSJYGS_date);
								//开工日期&竣工日期处理
								vm.model.monthReport.beginDate=common.formatDate(vm.model.monthReport.beginDate);
								vm.model.monthReport.endDate=common.formatDate(vm.model.monthReport.endDate);
								//金钱处理(TODO 这一块没必要了)
								vm.model.monthReport.invertPlanTotal=common.toMoney(vm.model.monthReport.invertPlanTotal);//项目总投资
								vm.model.monthReport.actuallyFinishiInvestment=common.toMoney(vm.model.monthReport.actuallyFinishiInvestment);//至今完成投资
								vm.model.monthReport.thisYearPlanInvestment=common.toMoney(vm.model.monthReport.thisYearPlanInvestment);//本年度计划完成投资
								vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);//本年度已完成投资
								vm.model.monthReport.thisMonthInvestTotal=common.toMoney(vm.model.monthReport.thisMonthInvestTotal);//本月完成投资
								vm.model.monthReport.firstQuarCompInvestment=common.toMoney(vm.model.monthReport.firstQuarCompInvestment);
								vm.model.monthReport.secondQuarCompInvestment=common.toMoney(vm.model.monthReport.secondQuarCompInvestment);
								vm.model.monthReport.thirdQuarCompInvestment=common.toMoney(vm.model.monthReport.thirdQuarCompInvestment);
								vm.model.monthReport.fourthQuarCompInvestment=common.toMoney(vm.model.monthReport.fourthQuarCompInvestment);
							}
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
		 * 提交项目月报信息到数据库
		 */
		function submitMonthReport(vm){
			//验证表单信息
			common.initJqValidation();
			var isValid = $('form').valid();
			//验证通过
			if(isValid){				
				vm.model.monthReport.submitYear=vm.year;
				vm.model.monthReport.submitMonth=vm.month;
				vm.model.monthReport.projectId=vm.projectId;
				
				var httpOptions = {
						method : 'post',
						url : url_projectMonthReport,
						data : vm.model.monthReport
					};
				
				var httpSuccess = function success(response) {
					vm.model.isReportExist=true;
					vm.model.isSubmit = false;
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									if(vm.isZFInvestment){
										$location.path(url_backtToZFlist);//创建成功返回到列表页
									}else if(vm.isSHInvestment){
										$location.path(url_backToSHlist);//创建成功返回到列表页
									}
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
		
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:[{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				},
				{
					field:'isMonthReport',
					operator:'eq',
					value:true
				},
				{
					field:'projectInvestmentType',
					operator:'eq',
					value:common.basicDataConfig().projectInvestmentType_ZF
				}]
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
					field : "projectName",
					title : "项目名称",
					width:300,
					template:function(item){							
						return common.format('<a href="#/projectDetails/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);							
					},
					filterable : true
				},
				{
					field : "unitName",
					title : "责任单位名称",
					width:200,
					template:function(item){
						return vm.getUnitName(item.unitName);
					},
					filterable : {
						ui:function(element){
							element.kendoDropDownList({
								valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
							});
						}
					}
				},
				{
					field : "projectStage",
					title : "项目阶段",
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectStage,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false
				},
				{
					field : "",
					title : "填报月份",
					template:function(data){
						var returnStr="";
						data.monthReportDtos.forEach(function(e,idx){
							returnStr+=common.format('<a class="btn btn-xs btn-success" ng-show="{3}" href="#/monthReport/{0}/{1}/{2}">{1}年{2}月</a> ',
									e.projectId,e.submitYear,e.submitMonth,e.isLatestVersion);
																	
						});
						return returnStr;					
					},
					filterable : false
				}															
			];
			// End:column
		
			vm.gridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true,
					sortable:true
				};
		}// end fun grid
		
		function grid_SH(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:[{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				},
				{
					field:'isMonthReport',
					operator:'eq',
					value:true
				},
				{
					field:'projectInvestmentType',
					operator:'eq',
					value:common.basicDataConfig().projectInvestmentType_SH
				}]
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
					field : "projectName",
					title : "项目名称",
					width:300,
					template:function(item){							
						return common.format('<a href="#/projectDetails/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);							
					},
					filterable : true
				},
				{
					field : "unitName",
					title : "责任单位名称",
					width:200,
					template:function(item){
						return vm.getUnitName(item.unitName);
					},
					filterable : {
						ui:function(element){
							element.kendoDropDownList({
								valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
							});
						}
					}
				},
				{
					field : "projectStage",
					title : "项目阶段",
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectStage,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false
				},
				{
					field : "",
					title : "填报月份",
					template:function(data){
						var returnStr="";
						data.monthReportDtos.forEach(function(e,idx){
							returnStr+=common.format('<a class="btn btn-xs btn-success" ng-show="{3}" href="#/monthReport/{0}/{1}/{2}">{1}年{2}月</a> ',
									e.projectId,e.submitYear,e.submitMonth,e.isLatestVersion);
																	
						});
						return returnStr;					
					},
					filterable : false
				}															
			];
			// End:column
		
			vm.gridOptions_SH={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true,
					sortable:true
				};
		}// end fun grid_SH
	}
})();