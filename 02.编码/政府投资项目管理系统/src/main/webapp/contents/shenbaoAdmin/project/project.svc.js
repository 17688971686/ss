(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = ['$http','$compile','$location'];	
	function project($http,$compile,$location) {
		var url_project = "/shenbaoAdmin/project/unitProject";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_back = "/project";
		
		var service = {
			grid : grid,
			createProject:createProject,
			getUserUnit:getUserUnit,
			getProjectById:getProjectById,
			updateProject:updateProject
		};		
		return service;
		
		/**
		 * 更新项目信息
		 */		
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

		
		/**
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0]||{};
						//日期展示
						vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
						vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
						vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
						vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
						//资金处理
						vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
						vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
						vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
						vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
						vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
						vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
						vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
						vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算
						vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
						vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他					
					if(vm.page=='update'){					
		        		//项目行业归口
						var child = $linq(common.getBasicData())
		        		.where(function(x){return x.id==vm.model.projectIndustry})
		        		.toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();			        		
					}if(vm.page=='projectInfo'){										
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.capitalZYYS)||0 )
				  			 		+ (parseFloat(vm.model.capitalOther)||0) ;
				  		 }						
					}
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 获取当前用户的单位信息
		 */
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				}
				var httpSuccess = function success(response) {
					vm.userUnit = response.data;
					vm.model.unitName = vm.userUnit.userName;
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
									$location.path(url_back);								
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
	

		/**
		 * 项目列表数据获取
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
						field : "projectName",
						title : "项目名称",						
						filterable : true,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName);
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