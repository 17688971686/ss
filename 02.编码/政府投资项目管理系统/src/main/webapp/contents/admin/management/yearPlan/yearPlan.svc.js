(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http' ];

	function yearPlan($http) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_planList="/management/yearPlan";
		var url_planCapital="/management/yearPlanCapital"
		var url_back_planList="#/yearPlan/planList";

		
		var service = {
			grid_shenbaoInfoList : grid_shenbaoInfoList,//申报项目列表
			grid_planList:grid_planList,//年度计划列表
			plan_create:plan_create,//创建年度计划
			plan_update:plan_update,//更新年度计划
			getPlanById:getPlanById,//根据年度计划id查找计划信息
			grid_yearPlan_shenbaoInfoList:grid_yearPlan_shenbaoInfoList,//年度计划编制信息列表
			grid_yearPlan_addShenbaoInfoList:grid_yearPlan_addShenbaoInfoList,//年度计划编制新增项目申报列表
			addShenBaoInfoconfirm:addShenBaoInfoconfirm,//年度计划新增项目申报
			getShenBaoInfoById:getShenBaoInfoById,//根据申报id查找申报信息
			getYearPlanCapitalByShenBaoId:getYearPlanCapitalByShenBaoId,//根据申报id查找年度计划编制信息
			updateYearPlanCapital:updateYearPlanCapital//更新年度计划编制信息			
		};
		
		/**
		 * 更新年度计划编制信息
		 */
		function updateYearPlanCapital(vm){
			var httpOptions = {
					method : 'put',
					url : url_planCapital,
					data:vm.model.capital
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
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								//关闭弹出框
								vm.isPopOver = false;
								//刷新页面
								location.reload();
							}
						});
					}					
				});
			}
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end updateYearPlanCapital
		
		/**
		 * 根据申报id查找年度计划编制信息
		 */
		function getYearPlanCapitalByShenBaoId(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planCapital + "?$filter=shenbaoInfoId eq '{0}'", id)
				}
				var httpSuccess = function success(response) {
					vm.model.capital = response.data.value[0]||{};
					
			}
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getYearPlanCapitalByShenBaoId
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbaoInfoList + "?$filter=id eq '{0}'", id)
				}
				var httpSuccess = function success(response) {
					vm.model.shenBaoInfo = response.data.value[0]||{};
					if(vm.model.shenBaoInfo.projectInvestSum){
						return vm.model.shenBaoInfo.projectInvestSum
					}else{
						return 0;
					}
			}
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getShenBaoInfoById
				
		/**
		 * 年度计划新增项目申报
		 */
		function addShenBaoInfoconfirm(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList+"/addCapital?planId={0}&shenBaoId={1}",vm.id,id),
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
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								//vm.planGridOptions.dataSource.read();//刷新编制列表
								//刷新页面
								location.reload();
								//this.getPlanById(vm);
								//location.href = url_back;									
							}
						});
					}					
				});
			}
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});			
		}//end addShenBaoInfoconfirm
		
		/**
		 * 根据id查找年度计划信息
		 */
		function getPlanById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList + "?$filter=id eq '{0}'", vm.id)					
				}
				var httpSuccess = function success(response) {
					if(vm.page=='plan_update'){//用于年度计划基本信息的编辑
						vm.model=response.data.value[0];
					}					
					if(vm.page=='planBZ'){//用于年度计划的编制
						vm.model.plan=response.data.value[0];
						console.log(vm.model.plan);//--测试所用
						//数据汇总数据计算
						var Capitals = vm.model.plan.yearPlanCapitalDtos;
						//属于该年度计划编制的申报项目信息
						var shenBaoInfoList = vm.planGridOptions.dataSource._data;
						//项目总数
						vm.model.shenBaoInfoTotal = shenBaoInfoList.length;
						vm.model.QianQiTotal = 0;//前期
						vm.model.NewStratTotal = 0;//新开工
						vm.model.XuJianTotal = 0;//续建
						vm.model.projectInvestSumTotal = 0;//项目总投资
						vm.model.applyYearInvestTotal = 0;//申请资金总额
						for(var j=0;j<shenBaoInfoList.length;j++){
							var obj = shenBaoInfoList[j];
							if(obj.projectConstrChar && obj.projectConstrChar == 'projectConstrChar_1'){
								vm.model.QianQiTotal ++;
							}
							if(obj.projectConstrChar && obj.projectConstrChar == 'projectConstrChar_2'){
								vm.model.NewStratTotal ++;
							}
							if(obj.projectConstrChar && obj.projectConstrChar == 'projectConstrChar_3'){
								vm.model.XuJianTotal ++;
							}
							if(obj.projectInvestSum){
								vm.model.projectInvestSumTotal += obj.projectInvestSum;
							}
							if(obj.applyYearInvest){
								vm.model.applyYearInvestTotal += obj.applyYearInvest;
							}
						}
						//计划总规模						
						vm.model.capitalSCZ_ggysTotal = 0;
						vm.model.capitalSCZ_gtzjTotal = 0;
						vm.model.capitalSCZ_zxzjTotal = 0;
						vm.model.capitalQCZ_ggysTotal = 0;
						vm.model.capitalQCZ_gtzjTotal = 0;
						vm.model.capitalSHTZTotal = 0;
						vm.model.capitalOtherTotal = 0;
						for(var i=0;i<Capitals.length;i++){
							
							if(Capitals[i].capitalSCZ_ggys){
								vm.model.capitalSCZ_ggysTotal += Capitals[i].capitalSCZ_ggys;
							}
							if(Capitals[i].capitalSCZ_gtzj){
								vm.model.capitalSCZ_gtzjTotal += Capitals[i].capitalSCZ_gtzj;
							}
							if(Capitals[i].capitalSCZ_zxzj){
								vm.model.capitalSCZ_zxzjTotal += Capitals[i].capitalSCZ_zxzj;
							}
							if(Capitals[i].capitalQCZ_ggys){
								vm.model.capitalQCZ_ggysTotal += Capitals[i].capitalQCZ_ggys;
							}
							if(Capitals[i].capitalQCZ_gtzj){
								vm.model.capitalQCZ_gtzjTotal += Capitals[i].capitalQCZ_gtzj;
							}
							if(Capitals[i].capitalSHTZ){
								vm.model.capitalSHTZTotal += Capitals[i].capitalSHTZ;
							}
							if(Capitals[i].capitalOther){
								vm.model.capitalOtherTotal += Capitals[i].capitalOther;
							}							
						}
					}
					
				}
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}//end getPlanById
		
		/**
		 * 年度计划编制信息列表
		 */
		function grid_yearPlan_shenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList+"/"+vm.id+"/projectList"),
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
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
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
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "yearInvestApproval",
						title : "安排资金",
						width : 150,
						template :function(item){					
							return common.format($('#input').html(),item.id,item.yearInvestApproval||0);
						},
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.planGridOptions = {
					 excel: {
			                fileName: "年度计划编制.xlsx"
			            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,				
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end grid_shenbaoInfoList
		
		/**
		 * 年度计划编制新增项目申报列表
		 */
		function grid_yearPlan_addShenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
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
					field:'projectShenBaoStage',
					operator:'eq',
					value:'projectShenBaoStage_7'
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
						field : "projectName",
						title : "项目名称",						
						filterable : true
					},
					{
						field : "projectConstrCharDesc",
						title : "建设性质",
						width : 150,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
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
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.addPlanGridOptions = {	
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end grid_addShenbaoInfoList
		
		/**
		 *创建年度计划 
		 */
		function plan_create(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;	               
				var httpOptions = {
					method : 'post',
					url : url_planList,
					data : vm.model
				}
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							})
						}
						
					});

				}

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//end plan_create
		
		/**
		 * 更新年度计划
		 */
		function plan_update(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;	               
				var httpOptions = {
					method : 'put',
					url : url_planList,
					data : vm.model
				}
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							})
						}
						
					});

				}

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//end plan_update

		return service;
		
		/**
		 * 年度计划列表
		 */
		function grid_planList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList),
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
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "name",
						title : "编制名称",						
						filterable : true
					},
					{
						field : "year",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					},{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(), item.id);

						}

					}

			];
			// End:column

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid_planList
		
		
		/**
		 * 申报项目列表
		 */
		function grid_shenbaoInfoList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
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
					field:'projectShenBaoStage',
					operator:'eq',
					value:'projectShenBaoStage_7'
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
						field : "projectName",
						title : "项目名称",
						filterable : true
					},
					{
						field : "projectConstrCharDesc",
						title : "建设性质",
						width : 150,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
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
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid_shenbaoInfoList
	}
})();