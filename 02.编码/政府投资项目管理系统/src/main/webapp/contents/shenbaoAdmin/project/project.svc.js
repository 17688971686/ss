(function() {
	'use strict';

	var app = angular.module('app').factory('projectSvc', project);
	app.filter('unique', function() {
		   return function(collection, keyname) {
		      var output = [], 
		          keys = [];

		      angular.forEach(collection, function(item) {
		          var key = item[keyname];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              output.push(item);
		          }
		      });

		      return output;
		   };
		});
	project.$inject = ['$http','$compile','$location'];	
	function project($http,$compile,$location) {
		var url_project = "/shenbaoAdmin/project";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_back = "/project";
		var url_document="/shenbaoAdmin/replyFile";
		
		var service = {
			grid : grid,
			createProject:createProject,
			updateProject:updateProject,
			deleteProject:deleteProject,
			getUserUnit:getUserUnit,
			getProjectById:getProjectById,
			documentRecordsGird:documentRecordsGird
		};		
		return service;
		
		/**
		 * 公共资金处理方法
		 */
		function projectFundsFormat(vm){
			//资金处理：没有就设置为0存储到数据库
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
			vm.model.landPrice=common.toMoney(vm.model.landPrice);//总投资--地价（社投）
			vm.model.equipmentInvestment=common.toMoney(vm.model.equipmentInvestment);//总投资--设备投资（社投）
			vm.model.buidSafeInvestment=common.toMoney(vm.model.buidSafeInvestment);//总投资--建安投资（社投）
		}//end fun projectFundsFormat
		
		/**
		 * 删除项目信息
		 */
		function deleteProject(vm,id){
			vm.isSubmit = true;
			var httpOptions = {
					method : 'post',
					url : url_project+"/deleteUnitProject",
					data : id
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
								vm.gridOptions.dataSource.read();
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
		
		/**
		 * 更新项目信息
		 */		
		function updateProject(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//项目类型多选处理
				vm.model.projectType = common.arrayToString(vm.model.projectType,',');
				//项目有关时间清空处理
				vm.model.beginDate = (vm.model.beginDate != '')?vm.model.beginDate:null;
				vm.model.endDate = (vm.model.endDate != '')?vm.model.endDate:null;
				//资金格式化处理
				projectFundsFormat(vm);
				
				var httpOptions = {
					method : 'post',
					url : url_project+"/updateUnitProject",
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
				//如果是编辑页面并且为社会投资项目，则项目行业需要进行处理进行显示
				if(vm.page=='update' && vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){
					var child = $linq(common.getBasicData())
	        		.where(function(x){return x.id==vm.model.projectIndustry;})
	        		.toArray()[0];
					if(child.pId=="projectIndustry"){
						vm.model.projectIndustryParent=child.id;
					}else{
						vm.model.projectIndustryParent=child.pId;
					}
						vm.projectIndustryChange();
				}
				if(vm.page == 'projectInfo'){
					if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
			 			  vm.isZFInvestment = true;
			 			 //相关附件文件上传文件种类
			 			  vm.relatedType=common.uploadFileTypeConfig().projectEdit;
			 		   }else if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资		  
			 			  vm.isSHInvestment = true;
			 			 //相关附件文件上传文件种类
			 			  vm.relatedType=common.uploadFileTypeConfig().projectEdit_SH;
			 		   }
				}
				// 国民经济行业分类
				var child2 = $linq(common.getBasicData()).where(function(x) {
					return x.id == vm.model.nationalIndustry
				}).toArray()[0];
				if (child2) {
					vm.model.nationalIndustryParent = child2.pId;
					vm.nationalIndustryChange();
				}
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
					url : common.format(url_userUnit + "/id?$filter=id eq '{0}'", vm.model.unitName)
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
					vm.userUnit = response.data || {};
					vm.model.unitName = vm.userUnit.id;//设置项目的所属单位名称
					grid(vm)
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
			if(vm.model.unitName == undefined || vm.model.unitName == ""){
				common.alert({
					vm:vm,
					msg:"请先至'单位信息维护'选择本人单位之后申报项目!"
				});
			}else{
				if (isValid) {
					vm.model.projectType =common.arrayToString(vm.model.projectType,',');
					projectFundsFormat(vm);
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
				pageSize : 10,
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
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
				resizable : true,
				sortable:true,
				scrollable:true
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
//					fields : {
//						createdDate : {
//							type : "date"
//						},
//						isIncludLibrary:{
//							type:"boolean"
//						}
//					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				filter:[{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				},{
					field:'unitName',
					operator:'eq',
					value:vm.model.unitName != null?vm.model.unitName:"noId"
				}],
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
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
					width:250,
					filterable : true,
					template:function(item){
						return common.format('<a class="text-primary" href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName);
					}
				},
				{
					field : "unitName",
					title : "所属单位",
					width:200,
					template:function(item){
						return common.getUnitName(item.unitName);
					},
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
	                            dataSource: vm.basicData.projectStage,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectInvestmentType",
					title : "项目投资类型",
					width : 120,
					template:function(item){
						return common.getBasicDataDesc(item.projectInvestmentType);
					},
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.investmentType,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					}
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
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
					width : 100,
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 120,
					template : function(item) {
						var isHide = item.isIncludLibrary;
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,isHide?'display:none':'',"vm.projectDelete('"+item.id+"')");
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
				resizable : true,
				sortable:true,
				scrollable:true
			};

		}// end fun grid

	}	
})();