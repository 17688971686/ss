(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {
		var url_project = "/shenbaoAdmin/project";
		var url_basicData = "/common/basicData";//获取基础数据
		var url_projectMonthReport="/shenbaoAdmin/projectMonthReport";
		var url_userUnitInfo="/shenbaoAdmin/userUnitInfo";
		
		var service = {
			grid : grid,
			submitMonthReport:submitMonthReport,
			getProjectById:getProjectById
			
		};		
		return service;	
	
		
		//begin#getUserUnitInfo
		function getUserUnitInfo(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnitInfo,
				}
				var httpSuccess = function success(response) {					
					vm.model.userUnitInfo=response.data;
					vm.model.monthReport.fillName=vm.model.userUnitInfo.unitContactPerson;
					vm.model.monthReport.fillMobile=vm.model.userUnitInfo.contactPersonMobile;
					vm.model.monthReport.monRepManagerName=vm.model.userUnitInfo.unitResPerson;
					vm.model.monthReport.monRepManagerTel=vm.model.userUnitInfo.resPersonTel;
					vm.model.monthReport.monRepManagerFax=vm.model.userUnitInfo.resPersonFax;
					vm.model.monthReport.monRepManagUnitName=vm.model.userUnitInfo.unitName;					
				}
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		/**
		 * 查询项目数据
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.projectId),
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
						
						vm.model.monthReport.pifuJYS_date=common.toDate(vm.model.projectInfo.pifuJYS_date);
						vm.model.monthReport.pifuKXXYJBG_date=common.toDate(vm.model.projectInfo.pifuKXXYJBG_date);
						vm.model.monthReport.pifuCBSJYGS_date=common.toDate(vm.model.projectInfo.pifuCBSJYGS_date);
						
						vm.model.monthReport.pifuJYS_wenhao=vm.model.projectInfo.pifuJYS_wenhao;
						vm.model.monthReport.pifuKXXYJBG_wenhao=vm.model.projectInfo.pifuKXXYJBG_wenhao;
						vm.model.monthReport.pifuCBSJYGS_wenhao=vm.model.projectInfo.pifuCBSJYGS_wenhao;
						
						vm.model.monthReport.beginDate=common.toDate(vm.model.monthReport.beginDate);
						vm.model.monthReport.endDate=common.toDate(vm.model.monthReport.endDate);
						
						//单位信息
						getUserUnitInfo(vm);
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
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
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
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					 {
						field : "projectNumber",
						title : "项目代码",
						width : 180,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectStageDesc",
						title : "项目阶段",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,"vm.del('" + item.id + "')");
									 

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

		
		
		

	}
	
	
	
})();