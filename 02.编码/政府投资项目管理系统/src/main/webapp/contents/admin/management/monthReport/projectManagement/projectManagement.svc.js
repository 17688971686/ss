(function() {
	'use strict';

	angular.module('app').factory('projectManagementSvc', projectManagement);

	projectManagement.$inject = [ '$http' ];

	function projectManagement($http) {
		var url_projectManagement = "/projectManagement";//获取项目信息数据
		var url_basicData = "/common/basicData";
		var url_back = "#/projectManagement"

		var service = {
			grid : grid,
			deleteProject:deleteProject,
			getProjectInfoById:getProjectInfoById,
			getBasicData:getBasicData,
			updateProjectInfo:updateProjectInfo,
			createProjectInfo:createProjectInfo
		};

		return service;
		
		/**
		 * 创建项目信息
		 */
		//begin#createProjectInfo
		function createProjectInfo(vm){
			console.log(vm);
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.industry=vm.model.industryOBJ.id;
				vm.model.projectIndustry=vm.model.projectIndustryOBJ.id;
				var httpOptions = {
					method : 'post',
					url : url_projectManagement,
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
									$('.modal-backdrop').remove();
									location.href = url_back;
								}
							})
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
		}
		//end#createProjectInfo
		
		/**
		 * 更新项目信息
		 */
		//begin#updateProjectInfo
		function updateProjectInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				var httpOptions = {
					method : 'put',
					url : url_projectManagement,
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
				 })
			}
		}
		//end#updateProjectInfo
		
		/**
		 * 查询基础数据
		 */
		//begin#getBasicData
		function getBasicData(vm,identity){
			var httpOptions = {
					method : 'get',
					url : url_basicData+"/"+identity
				}
				var httpSuccess = function success(response) {
					vm.basicData[identity] = response.data;
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		//end#getBasicData
		
		/**
		 * 通过项目代码查询项目信息
		 */
		//begin#getProjectInfoById
		function getProjectInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_projectManagement + "?$filter=id eq '{0}'", vm.id)
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];
					console.log("获取项目信息"); //--测试用
					console.log(vm.model); //--测试用
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		//end#getProjectInfoById
		
		/**
		 * 删除项目
		 */
		//beigin#deleteProject
		function deleteProject(vm,id){
			vm.isSubmit = true;
			var httpOptions = {
				method : 'delete',
				url : url_projectManagement,
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
		
		//end#deleteProject
		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectManagement),
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
						width : 200,
						filterable : true
					},
					{
						field : "projectStageValue",
						title : "申报阶段",
						width : 200,
						filterable : true
					},
					{
						field : "shenBaoYear",
						title : "申报年度",
						width : 80,
						filterable : true
					},
					{
						field : "projectIndustryValue",
						title : "所属行业",
						width : 100,
						filterable : true
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