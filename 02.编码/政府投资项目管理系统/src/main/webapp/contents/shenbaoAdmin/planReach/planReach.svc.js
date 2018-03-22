(function() {
	'use strict';

	angular.module('app').factory('planReachSvc', planReach);

	planReach.$inject = ['$http','$compile','$location'];	
	function planReach($http,$compile,$location) {
		var url="/shenbaoAdmin/planReach";
		var url_shenbao="/shenbaoAdmin/shenbao";
		var url_project="/shenbaoAdmin/project";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_back="/planReach"
		
		var service={
				getHasIncludYearPlan:getHasIncludYearPlan,
				getNotIncludYearPlan:getNotIncludYearPlan,
				planReachRecords:planReachRecords,
				comfirmPlanReach:comfirmPlanReach,
				deletePlanReach:deletePlanReach,
				grid:grid,
				projectGrid:projectGrid,
				getUserUnit:getUserUnit,
				getShenBaoInfoByProjectNumber:getShenBaoInfoByProjectNumber,
				createApplication:createApplication,
				updateApplication:updateApplication,
				deleteApplication:deleteApplication,
				getApplicationById:getApplicationById
		}
		
		return service;
		
		/**
		 * 根据项目代码获取下一年度申报信息
		 */
		function getShenBaoInfoByProjectNumber(vm,projectNumber,isIncludYearPlan,applicationTime,isHas){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=projectNumber eq '{0}' and isIncludYearPlan eq {1} and projectShenBaoStage eq '{3}' and planYear eq {2}", projectNumber,isIncludYearPlan,applicationTime,common.basicDataConfig().projectShenBaoStage_nextYearPlan)
				};
			var httpSuccess = function success(response) {
				vm.shenBaoInfo = response.data.value[0] || {};
				if(isHas){
					vm.model.shenBaoInfoDtos.push({id:vm.shenBaoInfo.id,projectId:vm.shenBaoInfo.projectId,projectNumber:projectNumber,projectName:vm.shenBaoInfo.projectName,isIncludYearPlan:isIncludYearPlan,
						projectInvestSum:vm.shenBaoInfo.projectInvestSum,capitalAP_ggys_TheYear:vm.shenBaoInfo.capitalAP_ggys_TheYear,capitalAP_gtzj_TheYear:vm.shenBaoInfo.capitalAP_gtzj_TheYear,
						sqPlanReach_ggys:vm.shenBaoInfo.capitalAP_ggys_TheYear,sqPlanReach_gtzj:vm.shenBaoInfo.capitalAP_gtzj_TheYear,processState:common.basicDataConfig().processState_weikaishi,
						processStage:common.basicDataConfig().processStage_qianshou});
				}else{
					vm.model.shenBaoInfoDtos=[{id:vm.shenBaoInfo.id,projectId:vm.shenBaoInfo.projectId,projectNumber:projectNumber,projectName:vm.shenBaoInfo.projectName,isIncludYearPlan:isIncludYearPlan,
						projectInvestSum:vm.shenBaoInfo.projectInvestSum,capitalAP_ggys_TheYear:vm.shenBaoInfo.capitalAP_ggys_TheYear,capitalAP_gtzj_TheYear:vm.shenBaoInfo.capitalAP_gtzj_TheYear,
						sqPlanReach_ggys:vm.shenBaoInfo.capitalAP_ggys_TheYear,sqPlanReach_gtzj:vm.shenBaoInfo.capitalAP_gtzj_TheYear,processState:common.basicDataConfig().processState_weikaishi,
						processStage:common.basicDataConfig().processStage_qianshou}];
				}
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getShenBaoInfoByProjectNumber
		
		/**
		 * 根据id获取计划下达申请信息
		 */
		function getApplicationById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url + "?$filter=id eq '{0}'", vm.id)
				};
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
				//时间信息的展示
				vm.model.applicationTime=common.formatDate(vm.model.applicationTime);
				//移除按钮是否可点击
				vm.processStage_tianbao=common.basicDataConfig().processStage_tianbao;
				vm.processStage_qianshou=common.basicDataConfig().processStage_qianshou;
				vm.processState_pass=common.basicDataConfig().processState_pass;
				vm.processState_notPass=common.basicDataConfig().processState_notpass;
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getApplicationById
		
		/**
		 * 删除计划下达申请
		 */
		function deleteApplication(vm,id){
			var httpOptions = {
					method : 'delete',
					url : url,
					data : id
				};
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						common.alert({
							vm : vm,
							msg : "操作成功!",
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
		}//end fun deleteApplication
		
		/**
		 * 更新计划下达申请
		 */
		function updateApplication(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				var httpOptions = {
						method : 'put',
						url : url+'/updatePlanReach',
						data : vm.model
					};
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功!",
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
			}
		}//end fun updateApplication
		
		/**
		 * 创建计划下达申请
		 */
		function createApplication(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				var httpOptions = {
						method : 'post',
						url : url,
						data : vm.model
					};
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功，开始流程审批！",
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
			}	
		}//end fun createApplication
		
		/**
		 * 获取当前登陆用户单位
		 */
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
			var httpSuccess = function success(response) {
				vm.userUnit = response.data.value[0] || {};
				vm.model.applicationUnit = vm.userUnit.id;//设置项目的所属单位名称
				projectGrid(vm);//获取项目数据
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getUserUnit
		
		/**
		 * 项目信息列表
		 */
		function projectGrid(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),						
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						isIncludYearPlan:{
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
				filter:[{
					field:'unitName',
					operator:'eq',
					value:vm.userUnit.id
				},
				{
					field:'isLatestVersion',
					operator:'eq',
					value:true
				},
				]
			});
			var columns = [	
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.projectNumber+","+item.projectName+","+item.isIncludYearPlan+","+item.projectInvestSum+","+item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='projects' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : true						
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					width : 150,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: $linq(common.getBasicData())
	               	   				.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	               	   				.toArray(),
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					}
				},
				{
					field : "isIncludYearPlan",
					title : "是否纳入年度计划",
					width : 150,
					filterable : true,
					template:function(item){
						if(item.isIncludYearPlan){
							return "是";
						}else{
							return "否";
						}
					}
				},
				{
					field : "",
					title : "操作",
					width : 80,
					template : function(item) {					
						return common.format($('#columnBtn_projects').html(),item.projectNumber,item.projectName,item.isIncludYearPlan,item.projectInvestSum,item.id);
					}
				}
			];
			vm.gridOptions_project = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end fun projectGrid
		
		function grid(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url),						
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
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
			});
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
					field : "applicationName",
					title : "标题",
					width:250,
					filterable : true						
				},
				{
					field : "",
					title : "项目数量",
					width : 150,
					filterable : false,
					template:function(item){
						return item.shenBaoInfoDtos.length;
					}
				},
				{
					field : "applicationTime",
					title : "申请时间",
					width : 100,
					filterable : false,
					template:function(item){
						return common.formatDate(item.applicationTime);
					}
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {					
						return common.format($('#columnBtns_applications').html(),item.id);
					}
				}
			];
			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end fun grid
		
		/**
		 * 删除计划下达申请
		 */
		function deletePlanReach(vm,id){
			vm.isSubmit=true;
			var httpOptions = {
					method : 'delete',
					url :url_shenbao,
					data:id
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit=false;
						$('.alertDialog').modal('hide');
						$(".modal-backdrop").remove();
						vm.gridOptions_shenBaoRecords.dataSource.read();
					}
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun deletePlanReach
		
		/**
		 * 确认计划下达资金
		 */
		function comfirmPlanReach(vm,id){
			var httpOptions = {
				method : 'post',
				url : url+"/comfirmPlanReach",
				data : {"id":id,"sqPlanReach_ggys":vm.model.sqPlanReach_ggys,"sqPlanReach_gtzj":vm.model.sqPlanReach_gtzj}
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.hasIncludGridOptions.dataSource.read();
					}
				});
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun comfirmPlanReach
		
		/**
		 * 获取已纳入年度计划的项目数据
		 */
		function getHasIncludYearPlan(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url+"/hasInclud")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						planYear : {
							type : "number"
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
						field:'isIncludYearPlan',
						operator:'eq',
						value:true
					},
					{
						field:'projectShenBaoStage',
						operator:'eq',
						value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
					},
				],
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
			});
			
			var columns = [	
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : true,
					template:function(item){
						var css = "text-primary";
						return common.format('<a class="{2}" href="#/project/projectInfo/{0}">{1}</a>',item.projectId,item.projectName,css);
					},
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "projectConstrChar",
					title : "建设性质",
					template:function(item){
						return common.getBasicDataDesc(item.projectConstrChar);
					},
					width : 100,
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.projectConstrChar,
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter: "startswith"
	                        });
	                    }
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					template:function(item){
						return common.getBasicDataDesc(item.projectIndustry);
					},
					width : 120,
					filterable : false,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field:"planYear",
					title:"计划年度",
					width : 100,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "申请资金(万元)",
					columns: [
						{
							field : "capitalSCZ_ggys_TheYear",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "capitalSCZ_gtzj_TheYear",
							title : "国土基金",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "安排资金(万元)",
					columns: [
						{
							field : "capitalAP_ggys_TheYear",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "capitalAP_gtzj_TheYear",
							title : "国土基金",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "计划下达申请(万元)",
					columns: [
						{
							field : "sqPlanReach_ggys",
							title : "公共预算",
							width:100,
							filterable : false,
							template:function(item){
								return common.format($('#input_ggys').html(),item.id,item.sqPlanReach_ggys,item.capitalAP_ggys_TheYear);
							},
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "sqPlanReach_gtzj",
							title : "国土基金",
							width:100,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    },
						    template:function(item){
								return common.format($('#input_gtzj').html(),item.id,item.sqPlanReach_gtzj,item.capitalAP_gtzj_TheYear);
							},
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title : "操作",
					width : 175,
					template : function(item) {
						var isShowConfirmBtn= !item.isPlanReach;
						var isShowEditBtn = item.isPlanReach && item.prcessState != common.basicDataConfig().processState_pass
						return common.format($('#columnBtns_hasInclud').html(),item.id,isShowConfirmBtn,isShowEditBtn,item.projectNumber);
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				}
			];
			
			vm.hasIncludGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}//end fun getHasIncludYearPlan
		
		/**
		 * 获取未纳入年度计划的项目数据
		 */
		function getNotIncludYearPlan(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url+"/notInclud")),
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
				filter:[
					{
						field:'isIncludYearPlan',
						operator:'eq',
						value:false
					},
					{
						field:'projectInvestmentType',
						operator:'eq',
						value:common.basicDataConfig().projectInvestmentType_ZF
					},
				],
				requestStart: function () {
					kendo.ui.progress($("#loading"), true);
				},
				requestEnd : function () {
					kendo.ui.progress($("#loading"), false);
				}
			});
			
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
						var css = "text-primary";
						return common.format('<a class="{2}" href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName,css);
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
					field : "",
					title : "操作",
					width : 85,
					template : function(item) {
						var isHideEditBtn = item.isPlanReach;
						return common.format($('#columnBtns_notInclud').html(),
								item.id,item.projectInvestmentType,common.basicDataConfig().projectShenBaoStage_jihuaxiada,item.projectNumber,isHideEditBtn);
					}
				}

			];
			
			vm.notIncludGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}//end fun getNotIncludYearPlan
		
		function planReachRecords(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),						
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
				filter:[
					{	
						field:'projectNumber',
						operator:'eq',
						value:vm.projectNumber
					},
					{
						field:'projectShenBaoStage',
						operator:'eq',
						value:common.basicDataConfig().projectShenBaoStage_jihuaxiada
					}
				]
				
			});
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
					title : "<input id='checkboxAll_planReachRecords' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : false						
				},
				{
					field : "processStage",
					title : "审批阶段",
					width : 150,
					filterable : false,
					template:function(item){
						return common.format("<span class='text-danger'>{0}</span>",common.getBasicDataDesc(item.processStage));
					}
				},
				{
					field : "processState",
					title : "审批状态",
					width : 100,
					filterable : false,
					template:function(item){
						return common.format("<span class='text-danger'>{0}</span>",common.getProcessStateDesc(item.processState));
					}
				},
				{
					field : "planYear",
					title : "计划年度",	
					width : 100,
					filterable : false
				},
				{
					field : "",
					title : "操作",
					width : 200,
					template : function(item) {					
						var isShowEditAndRemoveBtn=(item.processStage==common.basicDataConfig().processStage_qianshou&&item.processState==common.basicDataConfig().processState_jinxingzhong)
						   ||item.processState==common.basicDataConfig().processState_notpass||item.processStage==common.basicDataConfig().processStage_tianbao;
						return common.format($('#columnBtns_records').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShowEditAndRemoveBtn?'':'display:none',"vm.deleteShenBaoInfo('"+item.id+"')");
					}
				}
			];
			vm.gridOptions_shenBaoRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}
	}	
})();