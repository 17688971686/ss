(function() {
	'use strict';

	angular.module('app').factory('creditInfoSvc', creditInfo);

	creditInfo.$inject = ['$http','$compile','$location'];	
	function creditInfo($http,$compile,$location) {
		var url_shenbao = "/management/shenbao";
		var url_creditInfo = "/management/creditInfo";
		var service = {
				grid : grid,//获取申报项目列表
				getShenBaoInfoById : getShenBaoInfoById,//根据申报id获取申报信息
				createIllegalName : createIllegalName,
				illegalNameGrid : illegalNameGrid,
				getIllegalNameById : getIllegalNameById,
				updateIllegalNameById : updateIllegalNameById,
				deleteIllegalNameById : deleteIllegalNameById,
				haveIllegalName : haveIllegalName,
				haveBlackList : haveBlackList,
				createBlackList : createBlackList,
				blackListGrid : blackListGrid,
				getBlackListById : getBlackListById,
				updateBlackListById : updateBlackListById,
				deleteBlackListById : deleteBlackListById,
				projectAnomalyGrid : projectAnomalyGrid,
				haveProjectAnomaly : haveProjectAnomaly,
				createProjectAnomaly : createProjectAnomaly,
				getProjectAnomalyById : getProjectAnomalyById,
				updateProjectAnomalyById : updateProjectAnomalyById,
				deleteProjectAnomalyById : deleteProjectAnomalyById
		};		
		return service;
		
		//根据id 删除项目异常信息
		function deleteProjectAnomalyById(vm){
			var httpOptions = {
					method : 'delete',
					url : common.format(url_creditInfo+"/projectAnomaly/delete"),
					data : vm.id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.gridProjectAnomalyInfo.dataSource.read();
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
		}//end fun deleteProjectAnomalyById
		
		//根据id更新项目异常信息
		function updateProjectAnomalyById(vm){
			var httpOptions = {
					method : "put",
					url : common.format(url_creditInfo+"/projectAnomaly"),
					data : vm.standby
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
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
		
		//根据id获取项目异常信息
		function getProjectAnomalyById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo + "/projectAnomaly?$filter=id eq '{0}'", vm.id)
			};
			var httpSuccess = function (response) {
				vm.standby = response.data.value[0]||{};
				//处理时间问题
				vm.standby.shenbaoDate=vm.formatDate(vm.standby.shenbaoDate);
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		//创建项目异常数据
		function createProjectAnomaly(vm){
			var httpOptions = {
					method : "post",
					url : common.format(url_creditInfo+"/projectAnomaly"),
					data : vm.projectAnomalyModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						location.href = "#/creditInfo/projectAnomalyList";
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
		
		//查看数据库是否存在该项目
		function haveProjectAnomaly(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo+"/projectAnomaly?$filter=projectNumber eq '{0}'", vm.projectNumber)
			};
			var httpSuccess = function (response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isIllegalName = response.data.value[0];
						if(vm.isIllegalName){
							common.alert({
								vm:vm,
								msg:'该条申报项目已存在',
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/projectAnomaly//"+vm.projectNumber+"/"+vm.projectName+"/"+vm.unitName+"/"+vm.createdDate+"/"+vm.shenBaoInfoId;
						}
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
		
		//获取项目异常数据
		function projectAnomalyGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_creditInfo+"/projectAnomaly")),
				schema : common.kendoGridConfig().schema({
					id : "id",
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.shenBaoInfoId,item.projectName);
					},
					width : 180,
					filterable : true
				},
				{
					field : "unitName",
					title : "申报单位名称",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					width : 180,
					template:function(item){
						return common.getUnitName(item.unitName);
					},
					filterable : false
				},
				
				{
					field : "shenbaodDate",
					title : "申报日期",
					template:function(item){
						return common.formatDate(item.shenbaoDate);
					},
					width : 180,						
					filterable : false
				},
				{
					field : "isIllegalName",
					title : "项目审批和建设过程异常",
					width : 180,						
					filterable : true
				},
				{
					field : "isBlackList",
					title : "被纳入黑名单异常",
					width : 180,						
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						return common.format($('#projectAnomalyColumnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.gridProjectAnomalyInfo = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}
		//根据黑名单id 删除黑名单信息
		function deleteBlackListById(vm){
			var httpOptions = {
					method : 'delete',
					url : common.format(url_creditInfo+"/blackList/delete"),
					data : vm.id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.gridBlackListGrid.dataSource.read();
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
		
			
		}//end fun deleteBlackListById
		
		//根据黑名单id 更新黑名单信息
		function updateBlackListById(vm){
			var httpOptions = {
					method : "put",
					url : common.format(url_creditInfo+"/blackList"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								vm.isSubmit = false;
								$('.alertDialog').modal('hide');
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
		
		//根据黑名单id获取黑名单信息
		function getBlackListById(vm){

			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo + "/blackList?$filter=id eq '{0}'", vm.id)
			};
			var httpSuccess = function (response) {
				vm.model = response.data.value[0]||{};
				//处理时间问题
				vm.model.blackDate=vm.formatDate(vm.model.blackDate);
				vm.model.shenbaoDate=vm.formatDate(vm.model.shenbaoDate);
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		
		}
		
		//获取黑名单列表数据
		function blackListGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_creditInfo+"/blackList")),
				schema : common.kendoGridConfig().schema({
					id : "id",
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.shenBaoInfoId,item.projectName);
					},
					width : 180,
					filterable : true
				},
				{
					field : "unitName",
					title : "申报单位名称",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					width : 180,
					template:function(item){
						return common.getUnitName(item.unitName);
					},
					filterable : false
				},
				
				{
					field : "shenbaodDate",
					title : "申报日期",
					template:function(item){
						return common.formatDate(item.shenbaoDate);
					},
					width : 180,						
					filterable : false
				},
				{
					field : "enterpriseName",
					title : "法人单位名称",
					width : 180,						
					filterable : true
				},
				{
					field : "blackReason",
					title : "列入黑名单原因",
					width : 180,						
					filterable : true
				},
				{
					field : "departmentName",
					title : "监管部门",
					width : 180,						
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						return common.format($('#blackColumnBtns').html(),item.id);
					}
				}
				
				
			];
			// End:column

			vm.gridBlackListGrid = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}
		
		//创建黑名单信息
		function createBlackList(vm){
			var httpOptions = {
					method : "post",
					url : common.format(url_creditInfo+"/blackList"),
					data : vm.blackListModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
//						common.alert({
//							vm:vm,
//							msg:'录入成功！',
//							fn:function(){
//								$('.alertDialog').modal('hide');
								location.href = "#/creditInfo/blackList";
//							}
//						});
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
		
		//判断是否存在该申报项目，不存在则可以存入到黑名单表中
		function haveBlackList(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo+"/blackList?$filter=projectNumber eq '{0}'", vm.blackListModel.projectNumber)
			};
			var httpSuccess = function (response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.model = response.data.value[0];
						if(vm.model){
							common.alert({
								vm:vm,
								msg:'该条申报项目已存在',
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/blackList//"+vm.blackListModel.projectNumber+"/"+vm.blackListModel.projectName+"/"+vm.blackListModel.unitName+"/"+vm.blackListModel.createdDate+"/"+vm.blackListModel.shenBaoInfoId;
						}
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
		
		//判断是否存在该申报项目，不存在则可以存入到项目异常名录表中
		function haveIllegalName(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo+"?$filter=projectNumber eq '{0}'", vm.projectNumber)
			};
			var httpSuccess = function (response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isIllegalName = response.data.value[0];
						if(vm.isIllegalName){
							common.alert({
								vm:vm,
								msg:'该条申报项目已存在',
								fn:function(){
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/illegalNameEdit//"+vm.projectNumber+"/"+vm.projectName+"/"+vm.unitName+"/"+vm.createdDate+"/"+vm.shenBaoInfoId;
						}
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
		
		function deleteIllegalNameById(vm){
			var httpOptions = {
					method : 'delete',
					url : common.format(url_creditInfo),
					data : vm.id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.gridIllegalNameInfo.dataSource.read();
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
		}//end fun deleteIllegalNameById
		
		//根据id更新项目异常名录信息
		function updateIllegalNameById(vm){
			var httpOptions = {
					method : "put",
					url : url_creditInfo,
					data : vm.illegalNameModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								vm.isSubmit = false;
								$('.alertDialog').modal('hide');
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
			
		
			
		}//end fun updateIllegalNameById
		
		//根据id获取项目异常名录信息
		function getIllegalNameById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_creditInfo + "?$filter=id eq '{0}'", vm.id)
			};
			var httpSuccess = function (response) {
				vm.illegalNameModel = response.data.value[0]||{};
				//处理时间问题
				vm.illegalNameModel.illegalDate=vm.formatDate(vm.illegalNameModel.illegalDate);
				vm.illegalNameModel.shenbaoDate=vm.formatDate(vm.illegalNameModel.shenbaoDate);
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getIllegalNameById
		
		//获取异常名录列表
		function illegalNameGrid(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_creditInfo),
				schema : common.kendoGridConfig().schema({
					id : "id",
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
//						return common.format("<a>{0}</a>",item.projectName);
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.shenBaoInfoId,item.projectName);
					},
					width : 180,
					filterable : true
				},
				{
					field : "unitName",
					title : "申报单位名称",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					width : 180,
					template:function(item){
						return common.getUnitName(item.unitName);
					},
					filterable : false
				},
				
				{
					field : "shenbaodDate",
					title : "申报日期",
					template:function(item){
						return common.formatDate(item.shenbaoDate);
					},
					width : 180,						
					filterable : false
				},
				{
					field : "illegalType",
					title : "异常情形代码",
					width : 180,						
					filterable : true
				},
				{
					field : "illegalContent",
					title : "异常内容",
					width : 180,						
					filterable : true
				},
				{
					field : "departmentName",
					title : "监管部门",
					width : 180,						
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
				
				
			];
			// End:column

			vm.gridIllegalNameInfo = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}//end fun illegalNameGrid
		
		//创建项目异常名录信息
		function createIllegalName(vm){
			var httpOptions = {
					method : "post",
					url : url_creditInfo,
					data : vm.illegalNameModel
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						location.href = "#/creditInfo/illegalNameList";
					}
				});
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
			
		}//end fun createIllegalName
		
		//根据申报id获取申报信息
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value[0]||{};
//				if(vm.shenBaoInfoEdit){//如果是编辑页面
//					//年度计划申报年份处理
//					vm.planYear = vm.model.shenBaoInfo.planYear;
//				}
//				if(vm.shenBaoInfoAdd){//如果是新增页面
//					//初始化相关数据
//		    		vm.model.shenBaoInfo.projectInvestmentType = vm.investmentType;//投资类型
//		     		vm.model.shenBaoInfo.projectShenBaoStage = vm.stage;//申报阶段
//		    		//初始化申报年份（三年滚动）
//					var date = new Date();
//					vm.planYear = vm.model.shenBaoInfo.planYear = parseInt(date.getFullYear()+1);
//				}
				
				//项目类型、建设单位的显示
				vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,',');
				vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
//				if(vm.constructionUnits.length >1){//如果建设单位有多个则可以删除
//					vm.canDelete = true;
//				}else{
//					vm.canDelete = false;
//				}
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
				vm.model.shenBaoInfo.capitalSCZ_qita_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastYear);
				
				vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
				
				//安排资金
				vm.model.shenBaoInfo.apInvestSum=common.toMoney(vm.model.shenBaoInfo.apInvestSum);//累计安排投资
				vm.model.shenBaoInfo.capitalAP_ggys_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_TheYear);
				vm.model.shenBaoInfo.capitalAP_gtzj_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear);
				vm.model.shenBaoInfo.capitalAP_qita=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita);
				
				vm.model.shenBaoInfo.capitalAP_gtzj_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear);
				vm.model.shenBaoInfo.capitalAP_ggys_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastYear);
				vm.model.shenBaoInfo.capitalAP_qita_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastYear);
				
				vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear);
				vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear);
				vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear);
				
			
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
		  		
		  		//安排资金
		  		vm.lastTwoYearAPCapitalTotal = function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear)||0);
		  		};
		  		vm.lastYearAPCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear)||0);
		  		};
		  		vm.theYearAPCapitalTotal= function(){
		  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear)||0);
		  		};
				//如果申报信息的申报阶段为下一年度计划
//		  		if(vm.page=='shenbaoInfoList'){//如果为列表页时--申报详情链接
		  			if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
						 vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
						 vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
		    			   vm.isYearPlan = true;
					}
//		  		}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getShenBaoInfoById
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						isIncludLibrary:{
							type:"boolean"
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
				},
				filter:{
					field:"isIncludLibrary",
					operator:"eq",
					value:true
				}
			});
			// End:dataSource
			
			// Begin:column
			var columns = [
				{
					template : function(item) {
//						return kendo.format("<input type='radio' relId='{0},{1},{2},{3}' id='checkbox' name='checkbox' class='checkbox' ng-click='vm.change()'/>",item.projectNumber,item.projectName,item.unitName,common.formatDateTime(item.createdDate));
						return kendo.format("<input type='radio' relId='{0},{1},{2},{3},{4}' id='checkbox' name='checkbox' class='checkbox' ng-click='vm.change()'/>",item.projectNumber,item.projectName,item.unitName,common.formatDateTime(item.createdDate),item.id);
					},
					filterable : false,
					width : 40,
					
				},
				{
					field : "projectNumber",
					title : "项目代码",
					width : 180,						
					filterable : true
				},
				{
					field : "projectName",
					title : "项目名称",
					template:function(item){
						return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.id,item.projectName);
					},
					filterable : true
				},
				
				{
					field : "unitName",
					title : "申报单位",
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.userUnit,
	                            dataTextField: "unitName",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					template:function(item){
						return common.getUnitName(item.unitName);
					}
				},
				{
					field : "createdDate",
					title : "创建时间",
					template:function(item){
						return common.formatDate(item.createdDate);
					},
					width : 180,						
					filterable : false
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