(function() {
	'use strict';
	angular.module('app').factory('unitManagementSvc', unitManagement);

	unitManagement.$inject = [ '$http' ];

	function unitManagement($http) {
		var url_unitManagement = "/unitManagement";//获取单位信息数据
		var url_basicData = "/common/basicData";//获取基础数据
		
		var service = {
			grid : grid,
			deleteUnit : deleteUnit,
			getUnitById:getUnitById,
			createUnit:createUnit,
			updateUnit:updateUnit,
			getBasicData:getBasicData
			
		};

		return service;
		
		/**
		 * 查询基础数据
		 */
		//begin#getBasicData
		function getBasicData(vm,identity){
			var httpOptions = {
					method : 'get',
					url : url_basicData+"/"+identity,
				}
				var httpSuccess = function success(response) {					
					vm.basicData[identity] = response.data;
				}				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		//end#getBasicData

		/**
		 * 创建单位
		 */
		// begin#createUnit
		function createUnit(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;				
				
				var httpOptions = {
					method : 'post',
					url : url_unitManagement,
					data : vm.model
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

			} else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!" 
				});
			}
		}
		// end#createUnit
		
		// begin#getUnitById
		function getUnitById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_unitManagement + "?$filter=id eq '{0}'", vm.id)
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];
					console.log("获取单位信息"); //--测试用
					console.log(vm.model); //--测试用					
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		// end#getUnitById
		
		// begin#updateUnit
		function updateUnit(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;				
				
				var httpOptions = {
					method : 'put',
					url : url_unitManagement,
					data : vm.model
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

			} else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!" 
				});
			}
		}
		// end#updateUnit
		
		// begin#deleteUnit
		function deleteUnit(vm, id) {
			vm.isSubmit = true;
			var httpOptions = {
				method : 'delete',
				url : url_unitManagement,
				data : id

			}
			var httpSuccess = function success(response) {

				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit = false;
						vm.gridOptions.dataSource.read();
					}

				});

			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		//end#deleteUnit
	
		// begin#grid 获取单位信息生成单位列表
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_unitManagement),
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
				pageSize : 10
			});
			// End:dataSource			
			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",item.id)					
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "unitName",
						title : "单位名称",
						width : 300,
						filterable : true
					},
					{
						field : "unitAddress",
						title : "单位地址",
						width : 300,
						filterable : true
					},
					{
						field : "unitPropertyValue",
						title : "单位性质",
						width : 200,
						filterable : true
					},
					{
						field : "legalName",
						title : "单位法人名称",
						filterable : false,
					},
					{
						field : "unitTel",
						title : "单位电话",
						filterable : false,
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