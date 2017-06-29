(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {
		var url_project = "/shenbaoAdmin/project/unitProject";
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
					vm.model.monthReport.respUnitManagerName = vm.model.userUnitInfo.unitResPerson;
					vm.model.monthReport.respUnitManagerTel = vm.model.userUnitInfo.resPersonMobile;
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
						//关联上项目
						vm.model.monthReport.projectId=vm.model.projectInfo.id;
						vm.model.monthReport.projectNumber=vm.model.projectInfo.projectNumber;
						vm.model.monthReport.projectRepName=vm.model.projectInfo.projectRepName;
						vm.model.monthReport.projectRepMobile=vm.model.projectInfo.projectRepMobile;
						//项目批复信息的获取
//						vm.model.monthReport.pifuJYS_date=common.toDate(vm.model.projectInfo.pifuJYS_date);
//						vm.model.monthReport.pifuKXXYJBG_date=common.toDate(vm.model.projectInfo.pifuKXXYJBG_date);
//						vm.model.monthReport.pifuCBSJYGS_date=common.toDate(vm.model.projectInfo.pifuCBSJYGS_date);						
//						vm.model.monthReport.pifuJYS_wenhao=vm.model.projectInfo.pifuJYS_wenhao;
//						vm.model.monthReport.pifuKXXYJBG_wenhao=vm.model.projectInfo.pifuKXXYJBG_wenhao;
//						vm.model.monthReport.pifuCBSJYGS_wenhao=vm.model.projectInfo.pifuCBSJYGS_wenhao;
						//项目开工以及竣工日期的获取
						vm.model.monthReport.beginDate=common.toDate(vm.model.projectInfo.beginDate);
						vm.model.monthReport.endDate=common.toDate(vm.model.projectInfo.endDate);
						//项目总投资的获取
						vm.model.monthReport.invertPlanTotal=common.toMoney(vm.model.projectInfo.projectInvestSum);
						//TODO 至今完成投资、本年度已完成投资计算、本年度批复投资获取？
						vm.model.monthReport.actuallyFinishiInvestment=common.toMoney(vm.model.monthReport.actuallyFinishiInvestment);
						vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);
						//资金处理
						vm.model.monthReport.thisYearPlanInvestment=common.toMoney(vm.model.monthReport.thisYearPlanInvestment);//本年度计划完成投资
						vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);//本年度已完成投资
						vm.model.monthReport.thisMonthInvestTotal=common.toMoney(vm.model.monthReport.thisMonthInvestTotal);//本月完成投资
						vm.model.monthReport.firstQuarCompInvestment=common.toMoney(vm.model.monthReport.firstQuarCompInvestment)//1到3月份完成投资
						vm.model.monthReport.secondQuarCompInvestment=common.toMoney(vm.model.monthReport.secondQuarCompInvestment)//1到6月份完成投资
						vm.model.monthReport.thirdQuarCompInvestment=common.toMoney(vm.model.monthReport.thirdQuarCompInvestment)//1到9月份完成投资
						vm.model.monthReport.fourthQuarCompInvestment=common.toMoney(vm.model.monthReport.fourthQuarCompInvestment)//1到12月份完成投资
						//获取用户单位信息
						//getUserUnitInfo(vm);
					}
					if(vm.page=='projectInfo'){				
						//资金处理
						vm.model.projectInfo.projectInvestSum=common.toMoney(vm.model.projectInfo.projectInvestSum);//项目总投资
						vm.model.projectInfo.projectInvestAccuSum=common.toMoney(vm.model.projectInfo.projectInvestAccuSum);//累计完成投资
						vm.model.projectInfo.capitalSCZ_ggys=common.toMoney(vm.model.projectInfo.capitalSCZ_ggys);//市财政-公共预算
						vm.model.projectInfo.capitalSCZ_gtzj=common.toMoney(vm.model.projectInfo.capitalSCZ_gtzj);//市财政-国土资金
						vm.model.projectInfo.capitalSCZ_zxzj=common.toMoney(vm.model.projectInfo.capitalSCZ_zxzj);//市财政-专项资金
						vm.model.projectInfo.capitalQCZ_ggys=common.toMoney(vm.model.projectInfo.capitalQCZ_ggys);//区财政-公共预算
						vm.model.projectInfo.capitalQCZ_gtzj=common.toMoney(vm.model.projectInfo.capitalQCZ_gtzj);//区财政-国土资金
						vm.model.projectInfo.capitalSHTZ=common.toMoney(vm.model.projectInfo.capitalSHTZ);//社会投资
						vm.model.projectInfo.capitalOther=common.toMoney(vm.model.projectInfo.capitalOther);//其他
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.projectInfo.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.projectInfo.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.projectInfo.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.projectInfo.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.projectInfo.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.projectInfo.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.projectInfo.capitalOther)||0) ;
				  		 }
						//日期处理
						vm.model.projectInfo.beginDate = common.toDate(vm.model.projectInfo.beginDate);
						vm.model.projectInfo.endDate = common.toDate(vm.model.projectInfo.endDate);
						vm.model.projectInfo.pifuJYS_date=common.toDate(vm.model.projectInfo.pifuJYS_date);
						vm.model.projectInfo.pifuKXXYJBG_date=common.toDate(vm.model.projectInfo.pifuKXXYJBG_date);
						vm.model.projectInfo.pifuCBSJYGS_date=common.toDate(vm.model.projectInfo.pifuCBSJYGS_date);
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
				},filter:{
					field:'isMonthReport',
					operator:'eq',
					value:true
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true,
						template:function(item){
							return common.format('<a href="#/projectMonthReport/projectInfo/{0}">{1}</a>',item.id,item.projectName);
						}
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