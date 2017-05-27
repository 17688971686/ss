(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {
		var url_projectInfo = "/projectInfo";//获取申报的项目的列表数据
		var url_basicData = "/common/basicData";//获取基础数据
		var url_projectMonthReport="/shenbaoAdmin/projectMonthReport";
		
		var service = {
			grid : grid,
			submitMonthReport:submitMonthReport,
			getProjectInfo:getProjectInfo
		};		
		return service;	
	
		/**
		 * 查询项目数据
		 */
		function getProjectInfo(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_projectInfo + "?$filter=id eq '{0}'", vm.projectId),
				}
				var httpSuccess = function success(response) {					
					vm.model.projectInfo = response.data.value[0]||{};	
					
					if(vm.page=='selectMonth'){
						vm.setMonthSelected();
						
					}
					if(vm.page=='fillReport'){
						var report=$linq(vm.model.projectInfo.monthReportDtos)
											.where(function(x){return x.submitYear==vm.year && x.submitMonth==vm.month;})
											.toArray();
						if(report.length>0){
							vm.isReportExist=true;
							vm.model.monthReport=report[0];
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
				vm.isSubmit = true;
				var httpOptions = {
						method : 'post',
						url : url_projectMonthReport,
						data : vm.model.monthReport
					}
				
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
									location.reload();
								}
							})
						}

					})
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			}			
		}
		
		/**
		 * 月报列表页数据查询以及列表设计（申报的项目）
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectInfo), //获取数据
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
						field : "projectNumber",
						title : "项目代码",
						width : 180,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 200,
						template:function(data){
							//根据不同的申报阶段点击项目链接跳转到不同的详情页面
							return "<a href='#/projectDetails/"+data.id+"'>"+data.projectName+"</a>";							
						},
						filterable : true
					},
					
					{
						field : "projectStageValue",
						title : "申报阶段",
						width : 165,
						filterable : false
					},
					{
						field : "shenBaoYear",
						title : "申报年度",
						width : 80,
						filterable : false
					},
					{
						field : "projectIndustryValue",
						title : "所属行业",
						width : 100,
						filterable : false
					},
					{
						field : "investTypeValue",
						title : "投资类型",
						width : 100,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						template:function(data){
							//不同的投资类型返回不同的填报页面；政府投资类型还要分为两种情况然后返回不同的页面
							return common.format($('#columnBtns').html(),data.id);		
						},
						width:80,
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