(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = [ '$http' ];

	function project($http) {
		var url_project = "/management/project";//获取项目信息数据
		var url_userUnit = "/management/userUnit";//获取建设单位信息
		var url_back = "#/project";
		var service = {
			grid : grid,			
			getProjectById:getProjectById,
			updateProject:updateProject,
			createProject:createProject,
			getUserUnits:getUserUnits
		};

		return service;
		
		/**
		 * 获取建设单位
		 */
		function getUserUnits(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				}
				var httpSuccess = function success(response) {
					vm.userUnits = response.data;
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 创建项目
		 */		
		function createProject(vm){
		    console.log(vm.model);		   
			common.initJqValidation();
			var isValid = $('form').valid();        
			if (isValid) {
				vm.isSubmit = true;				
				var httpOptions = {
					method : 'post',
					url : url_project,
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
		//end#createProject
		
		/**
		 * 更新项目信息
		 */
		//begin#updateProject
		function updateProject(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				var httpOptions = {
					method : 'put',
					url : url_project,
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
		//end#updateProject
		
		
		
		/**
		 * 通过项目代码查询项目信息
		 */
		//begin#getProjectById
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];
					if(vm.page=='update'){
						//日期展示
						vm.model.beginDate=common.toDate(vm.model.beginDate);//开工日期
						vm.model.endDate=common.toDate(vm.model.endDate);//竣工日期
						vm.model.pifuJYS_date=common.toDate(vm.model.pifuJYS_date);//项目建议书批复日期			
						vm.model.pifuKXXYJBG_date=common.toDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.pifuCBSJYGS_date=common.toDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
		        		//项目行业归口
						var child = $linq(common.getBasicData())
		        		.where(function(x){return x.id==vm.model.projectIndustry})
		        		.toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();			        		
					}
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		//end#getProjectById
		
		
		// begin#grid
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