(function() {
	'use strict';

	angular.module('app').factory('creditInfoSvc', creditInfo);

	creditInfo.$inject = ['$http','$compile','$location'];	
	function creditInfo($http,$compile,$location) {
		var url_shenbao = "/management/shenbao";
		var url_creditInfo = "/management/creditInfo";
		var service = {
				grid : grid,
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
				deleteBlackListById : deleteBlackListById
		};		
		return service;
		//根据黑名单id 删除黑名单信息
		function deleteBlackListById(vm){
			var httpOptions = {
					method : 'put',
					url : common.format(url_creditInfo+"/blackList/delete?id={0}", vm.id),
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
		
			
		}
		
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
						return common.format("<a>{0}</a>",item.projectName);
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
									$('#checkbox').removeAttr("checked");
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/blackList//"+vm.blackListModel.projectNumber+"/"+vm.blackListModel.projectName+"/"+vm.blackListModel.unitName+"/"+vm.blackListModel.createdDate;
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
									$('#checkbox').removeAttr("checked");
									$('.alertDialog').modal('hide');
								}
							});
						}else{
							location.href="#/creditInfo/illegalNameEdit//"+vm.projectNumber+"/"+vm.projectName+"/"+vm.unitName+"/"+vm.createdDate;
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
					method : 'put',
					url : common.format(url_creditInfo+"/delete?id={0}", vm.id),
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
		}
		
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
						return common.format("<a>{0}</a>",item.projectName);
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
						return kendo.format("<input type='radio' relId='{0},{1},{2},{3}' id='checkbox' name='checkbox' class='checkbox' ng-click='vm.change()'/>",item.projectNumber,item.projectName,item.unitName,common.formatDateTime(item.createdDate));
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
						return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
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