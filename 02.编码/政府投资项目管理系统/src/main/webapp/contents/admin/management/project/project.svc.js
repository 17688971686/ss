(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = [ '$http' ];

	function project($http) {
		var url_project = "/management/project";//获取项目信息数据
		var url_userUnit = "/management/userUnit";//获取单位信息
		var url_back = "#/project";
		var url_document="/management/replyFile";
		var service = {
			grid : grid,			
			getProjectById:getProjectById,
			getUserUnits:getUserUnits,
			updateProject:updateProject,
			createProject:createProject,
			updateIsMonthReport:updateIsMonthReport,
			documentRecordsGird:documentRecordsGird
		};

		return service;
		
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "?$filter=userName eq '{0}'", vm.model.unitName)
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
		function getUserUnits(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
				var httpSuccess = function success(response) {
					vm.userUnits = response.data.value;
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
				vm.isSubmit = true;	
				
				var httpOptions = {
					method : 'post',
					url : url_project,
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
									location.href = url_back;									
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
			}else{
				vm.model.projectType =vm.model.projectType.split(",");
			}
		}
		//end#createProject
		
		/**
		 * 更新是否填写月报
		 */
		function updateIsMonthReport(vm){
			var httpOptions = {
					method : 'put',
					url : url_project+"/isMonthReport",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					//关闭模态框
					$("#myModal_edit").modal('hide');
					//刷新表格数据
					vm.gridOptions.dataSource.read(); 					
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			} 
		
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
									location.href = url_back;
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
				 vm.model.projectType =vm.model.projectType.split(",");
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
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
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				
				//查询项目的所属单位的单位名称
			   	getProjectUnit(vm);
			   	
			   	//项目类型的处理--多选框回显					
				if(vm.model.projectType != "" && vm.model.projectType != null){
					vm.model.projectType = vm.model.projectType.split(",");
				}else{
					vm.model.projectType =[];
				}
			   	
				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				
				//金额处理
        		vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
				vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
				vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
				vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
				vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算内投资
				vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
				vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
				if(vm.page=='update'){
					if(vm.model.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资项目
						//项目行业归口
						var child = $linq(common.getBasicData()).where(function(x){return x.id==vm.model.projectIndustry;}).toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();	
					}     		        		
				}
				if(vm.page=='details'){				
					//计算资金筹措总计
					vm.capitalTotal=function(){
			  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
			  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
			  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
			  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
			  			 		+ (parseFloat(vm.model.capitalZYYS)||0 )
			  			 		+ (parseFloat(vm.model.capitalOther)||0);
			  		 };						
				}
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		//end#getProjectById
		
		//文件选择模态框
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
										"<input type='radio'  relId='{0}' name='checkbox'/>",
										item.fullName);
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
					field : "fullName",
					title : "文件名",
					width : 550,
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
						},
						isMonthReport:{
							type:"boolean"
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
				filter:[
					{
						field:"isLatestVersion",
						operator:"eq",
						value:true
					},{
						field:"isIncludLibrary",
						operator:"eq",
						value:true
					}
				]
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
						field : "projectNumber",
						title : "项目代码",
						width : 180,						
						filterable : false
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
						title : "建设单位",
						width : 150,
						filterable : true
					},
					{
						field : "projectStage",
						title : "项目阶段",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectStage),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "projectClassify",
						title : "项目分类",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						},
						filterable : false
					},
					{
						field : "isIncludLibrary",
						title : "是否已纳入项目库",
						template : function(item) {
							if(item.isIncludLibrary){
								return "已纳入";
							}else{
								return "未纳入";
							}								 
						},
						width : 150,
						filterable : true
					},
					{
						field : "isMonthReport",
						title : "是否月报",
						template : function(item) {
							if(item.isMonthReport){
								return "是";
							}else if(!item.isMonthReport){
								return "否";
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
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')");
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