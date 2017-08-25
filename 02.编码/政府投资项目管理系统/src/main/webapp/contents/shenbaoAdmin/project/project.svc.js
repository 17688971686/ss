(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = ['$http','$compile','$location'];	
	function project($http,$compile,$location) {
		var url_project = "/shenbaoAdmin/project";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_back = "/project";
		var url_document="/shenbaoAdmin/replyFile";
		
		var service = {
			grid : grid,
			createProject:createProject,
			getUserUnit:getUserUnit,
			getProjectById:getProjectById,
			updateProject:updateProject,
			documentRecordsGird:documentRecordsGird
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
				vm.model.projectType = common.arrayToString(vm.model.projectType,',');
				//资金处理没有就显示为0
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
				var httpOptions = {
					method : 'put',
					url : url_project+"/unitProject",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					vm.model.projectType =vm.model.projectType.split(",");
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

			} else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}

		
		/**
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				
				//查询项目的所属单位的单位名称
			   	getProjectUnit(vm);
			   	
			   	//项目类型的处理--多选框回显					
			   	vm.model.projectType = common.stringToArray(vm.model.projectType,',');
				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "/userName?$filter=id eq '{0}'", vm.model.unitName)
				};
				var httpSuccess = function success(response) {
					vm.userUnit = response.data.value[0] || {};
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 获取当前登录用户用户的单位信息
		 */
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
				var httpSuccess = function success(response) {
					vm.userUnit = response.data.value[0] || {};
					vm.model.unitName = vm.userUnit.id;//设置项目的所属单位名称
				};
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
				vm.model.projectType =common.arrayToString(vm.model.projectType,',');
				vm.isSubmit = true;				
				var httpOptions = {
					method : 'post',
					url : url_project+"/unitProject",
					data : vm.model
				};

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
									$location.path(url_back);//创建成功返回到列表页								
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
			}else{//表单验证失败
				common.alert({
					vm:vm,
					msg:"您填写的信息不正确,请核对后提交!"
				});
			}
		}
	
		function documentRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_document),						
				schema : common.kendoGridConfig().schema({
					id : "id"
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
							return kendo
									.format(
											"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
											item.number,item.name,item.fullName);
						},
						filterable : false,
						width : 40,
						title : ""
					},
					{
						field : "number",
						title : "文号",
						width:180,
						
						filterable : true
					},
					{
						field : "name",
						title : "文件名",
						width : 550,
						template:function(item){
							return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
						},
						filterable : true
						
					}
					
			];
			// End:column

			vm.gridOptions_documentRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}

		/**
		 * 单位项目列表
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitProject")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
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
					field:'isLatestVersion',
					operator:'eq',
					value:true
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
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "projectName",
					title : "项目名称",
					filterable : true,
					template:function(item){
						return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);
					}
				},
				{
					field : "unitName",
					title : "所属单位",
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
					}
				},
				{
					field : "projectStage",
					title : "项目阶段",
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectStage),
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectClassify",
					title : "项目分类",
					template:function(item){
						return common.getBasicDataDesc(item.projectClassify);
					},
					width : 150,
					filterable : false
				},
				{
					field : "isIncludLibrary",
					title : "是否已纳入项目库",
					template:function(item){
						if(item.isIncludLibrary){
							return '已纳入';
						}else{
							return '未纳入';
						}
					},
					width : 150,
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						var isHide = item.isIncludLibrary;
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,isHide?'display:none':'');
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