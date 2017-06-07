(function() {
	'use strict';

	angular.module('app').factory('monthReportSvc', monthReport);

	monthReport.$inject = [ '$http','$compile' ];	
	function monthReport($http,$compile) {	
		var url_project = "/management/project";		
	
		
		var service = {
			grid : grid,
			getProjectById:getProjectById
		};		
		return service;	
		
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.projectId),
				}
				var httpSuccess = function success(response) {					
					vm.model.projectInfo = response.data.value[0]||{};	
								
					if(vm.page=='details'){	
						//根据年，月查到月报数据
						var report=$linq(vm.model.projectInfo.monthReportDtos)
						.where(function(x){return x.submitYear==vm.year && x.submitMonth==vm.month;})
						.toArray();
						if(report.length>0){
							vm.isReportExist=true;
							vm.model.monthReport=report[0];						
							//批复时间处理
							vm.model.monthReport.pifuJYS_date=common.toDate(vm.model.projectInfo.pifuJYS_date);
							vm.model.monthReport.pifuKXXYJBG_date=common.toDate(vm.model.projectInfo.pifuKXXYJBG_date);
							vm.model.monthReport.pifuCBSJYGS_date=common.toDate(vm.model.projectInfo.pifuCBSJYGS_date);
							//开工日期&竣工日期处理
							vm.model.monthReport.beginDate=common.toDate(vm.model.monthReport.beginDate);
							vm.model.monthReport.endDate=common.toDate(vm.model.monthReport.endDate);
							//金钱处理
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
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
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
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					  
					{
						field : "projectName",
						title : "项目名称",						
						template:function(data){							
							return "<a href='#/projectEdit/"+data.id+"'>"+data.projectName+"</a>";							
						},
						filterable : true
					},
					{
						field : "",
						title : "填报月份",
						template:function(data){
							var returnStr="";
							data.monthReportDtos.forEach(function(e,idx){
								returnStr+=common.format('<a class="btn btn-xs btn-success" href="#/monthReport/{0}/{1}/{2}">{1}年{2}月</a> '
										,e.projectId,e.submitYear,e.submitMonth);
																		
							});
							return returnStr;
							
						},
						width:800,
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
					resizable: true
				};
			
		}// end fun grid

		
		
		
		
		

	}
	
	
	
})();