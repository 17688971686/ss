(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http' ];

	function yearPlan($http) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_planList="/management/yearPlan";
		var url_planCapital="/management/yearPlanCapital";
		var url_back_planList="#/yearPlan/planList";

		
		var service = {
			grid_shenbaoInfoList : grid_shenbaoInfoList,//申报项目列表
			grid_planList:grid_planList,//年度计划列表
			plan_create:plan_create,//创建年度计划
			plan_update:plan_update,//更新年度计划
			getPlanById:getPlanById,//根据年度计划id查找计划信息
			grid_yearPlan_shenbaoInfoList:grid_yearPlan_shenbaoInfoList,//年度计划编制信息列表
			grid_yearPlan_addShenbaoInfoList:grid_yearPlan_addShenbaoInfoList,//年度计划编制新增项目申报列表
			addShenBaoInfoconfirm:addShenBaoInfoconfirm,//年度计划新增项目申报			
			getShenBaoInfoById:getShenBaoInfoById,//根据申报id查找申报信息
			getYearPlanCapitalById:getYearPlanCapitalById,//根据申报id查找年度计划编制信息
			updateYearPlanCapital:updateYearPlanCapital,//更新年度计划编制信息	
			removeYearPlanCapital:removeYearPlanCapital//移除申报项目
		};
		
		function removeYearPlanCapital(vm,id){
			var httpOptions = {
					method : 'post',
					url : common.format(url_planList+"/removeCapital?planId={0}&yearPlanCapitalId={1}",vm.id,id)
				};
			
			var httpSuccess = function success(response) {
				vm.planGridOptions.dataSource.read();//编制申报信息列表数据刷新
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});	
		}//removeYearPlanCapital
		
		/**
		 * 更新年度计划编制信息
		 */
		function updateYearPlanCapital(vm){
			vm.model.capital.capitalSum=parseFloat(vm.model.capital.capitalSCZ_ggys||0)
									   +parseFloat(vm.model.capital.capitalSCZ_gtzj||0)
									   +parseFloat(vm.model.capital.capitalSCZ_zxzj||0)
									   +parseFloat(vm.model.capital.capitalQCZ_ggys||0)
									   +parseFloat(vm.model.capital.capitalQCZ_gtzj||0)
									   +parseFloat(vm.model.capital.capitalSHTZ||0)
									   +parseFloat(vm.model.capital.capitalZYYS||0)
									   +parseFloat(vm.model.capital.capitalOther||0);
			var httpOptions = {
					method : 'put',
					url : url_planCapital,
					data:vm.model.capital
				};
			
			var httpSuccess = function success(response) {
				getPlanById(vm);//查询计划--更新页面数据
				$('#capitalSum_'+vm.currentCapitalId).val(vm.model.capital.capitalSum);
				vm.isPopOver = false;
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end updateYearPlanCapital
		
		/**
		 * 根据申报id查找年度计划编制信息
		 */
		function getYearPlanCapitalById(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planCapital + "?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.capital = response.data.value[0]||{};				
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getYearPlanCapitalById
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbaoInfoList + "?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value[0]||{};
				if(vm.model.shenBaoInfo.projectInvestSum){
					return vm.model.shenBaoInfo.projectInvestSum;
				}else{
					return 0;
				}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getShenBaoInfoById
				
		/**
		 * 年度计划新增项目申报
		 */
		function addShenBaoInfoconfirm(vm,ids){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList+"/addCapital?planId={0}&shenBaoId={1}",vm.id,ids)
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
								$('.alertDialog').modal('hide');
								vm.planGridOptions.dataSource.read();//编制申报信息列表数据刷新								
							}
						});
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});			
		}//end addShenBaoInfoconfirm
		
		/**
		 * 根据id查找年度计划信息
		 */
		function getPlanById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList + "?$filter=id eq '{0}'", vm.id)					
				};
			
			var httpSuccess = function success(response) {
				if(vm.page=='plan_update'){//用于年度计划基本信息的编辑
					vm.model=response.data.value[0] || {};
				}					
				if(vm.page=='planBZ'){//用于年度计划的编制
					vm.model.plan=response.data.value[0] || {};						
					//数据汇总数据计算
					var Capitals = vm.model.plan.yearPlanCapitalDtos;
					//属于该年度计划编制的申报项目信息
					var shenBaoInfoList = vm.planGridOptions.dataSource._data;
					//项目总数
					vm.model.shenBaoInfoTotal = shenBaoInfoList.length;
					vm.model.QianQiTotal = 0;//前期
					vm.model.NewStratTotal = 0;//新开工
					vm.model.XuJianTotal = 0;//续建
					vm.model.projectInvestSumTotal = 0;//项目总投资
					vm.model.applyYearInvestTotal = 0;//申请资金总额
					
					for(var j=0;j<shenBaoInfoList.length;j++){
						var obj = shenBaoInfoList[j];
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_qianqi){//前期
							vm.model.QianQiTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_xinkaigong){//新开工
							vm.model.NewStratTotal ++;
						}
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_xujian){//续建
							vm.model.XuJianTotal ++;
						}
						if(obj.projectInvestSum){//总投资
							vm.model.projectInvestSumTotal += obj.projectInvestSum;
						}
						if(obj.applyYearInvest){//年度申请资金
							vm.model.applyYearInvestTotal += obj.applyYearInvest;
						}
//						if(obj.yearInvestApproval){//年度安排资金
//							vm.model.yearInvestApprovalTotal += obj.yearInvestApproval;
//						}
					}
					//计划总规模						
					vm.model.yearInvestApprovalTotal = 0;//安排资金总计
					vm.model.capitalSCZ_ggysTotal = 0;//市投资-公共预算
					vm.model.capitalSCZ_gtzjTotal = 0;//市投资-国土基金
					vm.model.capitalSCZ_zxzjTotal = 0;//市投资-专项基金
					vm.model.capitalQCZ_ggysTotal = 0;//区投资-公共预算
					vm.model.capitalQCZ_gtzjTotal = 0;//区投资-国土基金
					vm.model.capitalZYYSTotal = 0;//中央预算内投资
					vm.model.capitalSHTZTotal = 0;//社会投资

					vm.model.capitalOtherTotal = 0;
					for(var i=0;i<Capitals.length;i++){						
						if(Capitals[i].capitalSCZ_ggys){
							vm.model.capitalSCZ_ggysTotal += Capitals[i].capitalSCZ_ggys;
						}
						if(Capitals[i].capitalSCZ_gtzj){
							vm.model.capitalSCZ_gtzjTotal += Capitals[i].capitalSCZ_gtzj;
						}
						if(Capitals[i].capitalSCZ_zxzj){
							vm.model.capitalSCZ_zxzjTotal += Capitals[i].capitalSCZ_zxzj;
						}
						if(Capitals[i].capitalQCZ_ggys){
							vm.model.capitalQCZ_ggysTotal += Capitals[i].capitalQCZ_ggys;
						}
						if(Capitals[i].capitalQCZ_gtzj){
							vm.model.capitalQCZ_gtzjTotal += Capitals[i].capitalQCZ_gtzj;
						}
						if(Capitals[i].capitalZYYS){
							vm.model.capitalZYYSTotal += Capitals[i].capitalZYYS;
						}
						if(Capitals[i].capitalSHTZ){
							vm.model.capitalSHTZTotal += Capitals[i].capitalSHTZ;
						}
						if(Capitals[i].capitalOther){
							vm.model.capitalOtherTotal += Capitals[i].capitalOther;
						}
						if(Capitals[i].capitalSum){//年度安排资金
							vm.model.yearInvestApprovalTotal += Capitals[i].capitalSum;
						}
					}
				}
				
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end getPlanById
		
		/**
		 * 年度计划编制信息列表
		 */
		function grid_yearPlan_shenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList+"/"+vm.id+"/projectList"),
				schema : common.kendoGridConfig().schema({
					id : "yearPlanCapitalId"
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 1000,
				sort : {
					field : "createdDate",
					dir : "desc"
				},
				requestEnd:function(){
					getPlanById(vm);//请求结束后查询年度计划刷新数据
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						field:"",
						template : function(item) {
							return kendo.format("<input type='checkbox' relId='{0}' name='checkbox' class='checkbox'/>",item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll_shenBaoList' type='checkbox'  class='checkbox'/>"
					},
					{
						field : "shenBaoUnitInfoDto.unitName",
						title : "建设单位",
						width:120,
						template:function(item){
							return common.format(item.shenBaoUnitInfoDto.unitName);
						},
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format('<a href="#/projectDetails/{0}/{1}" >{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						width:200,
						filterable : false
					},					
					{
						field : "functionSubjects",
						title : "功能科目",
//						template:function(item){
//							return common.getBasicDataDesc(item.functionSubjects);
//						},
						width:110,
						filterable : false
					},
					{
						field : "econClassSubjects",
						title : "经济分类科目",
//						template:function(item){
//							return common.getBasicDataDesc(item.econClassSubjects);
//						},
						width:140,
						filterable : false
					},
					{
						field : "projectIndustryDesc",
						title : "行业领域",
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						width:100,
						filterable : false	
					},
					{
						field : "projectCategoryDesc",
						title : "项目类别",
						width : 80,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : false
					},
					{
						field : "projectConstrCharDesc",
						title : "建设性质",						
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						width : 80,
						filterable : false
					},
					{
						field : "beginDate",
						title : "开工/竣工时间",
						width : 100,
						template:function(item){
							if(item.projectCategory==common.basicDataConfig().projectCategory_A){
								return common.formatDate(item.endDate);
							}else if(item.projectCategory==common.basicDataConfig().projectCategory_B || 
									item.projectCategory==common.basicDataConfig().projectCategory_C ||
									item.projectCategory==common.basicDataConfig().projectCategory_D){
								return common.formatDate(item.beginDate);
							}					
						},
						filterable : false
					},
					{
						field : "projectGuiMo",
						title : "建设规模及主要建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.projectGuiMo); },
						filterable : false
					},
					{
						field : "yearConstructionTask",
						title : "本年度建设任务",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionTask); },
						filterable : false
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width:120,
						filterable : false
					},
					{
						field : "projectInvestAccuSum",
						title : "已拨付资金（万元）",
						width:145,
						filterable : false
					},
					{
						field : "planYear",
						title : "计划年度",
						width:100,
						filterable : false
					},
					{
						field : "yearConstructionContent",
						title : "本年度建设内容",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContent); },
						filterable : false
					},
					{
						field : "applyYearInvest",
						title : "申请年度投资（万元）",
						filterable : false
					},
					{
						field : "yearInvestApproval",
						title : "安排资金（万元）",
						template :function(item){					
							return common.format($('#input').html(),item.id,item.yearInvestApproval||0);
						},
						width:130,
						filterable : false
					},
					{
						field : "remark",
						title : "备注",
						width : 150,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:10px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.remark); },
						filterable : false				
					}

			];
			// End:column
			
			var excelExport = function(e) {
					var data = e.data;
					var sheet = e.workbook.sheets[0];
					var template = this.columns[8].template;
					
					for(var j=0;j<data.length;j++){
						var timeFormat = template(data[j]);
						for (var i = 1; i < sheet.rows.length; i++) {
						      var row = sheet.rows[i];
							  row.cells[7].value = 	timeFormat;		      
						    }
					}				    
				  };

			vm.planGridOptions = {
					 excel: {
			                fileName: "年度计划编制.xlsx"
			            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,				
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				excelExport:excelExport
			};
		}//end grid_yearPlan_shenbaoInfoList
		
		/**
		 * 年度计划编制新增项目申报列表
		 */
		function grid_yearPlan_addShenbaoInfoList(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
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
				filter:[{
					field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
				},{
					field:'processState',
					operator:'eq',
					value:common.basicDataConfig().processState_qianShou
				}]
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
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width:200,
						filterable : true
					},
					{
						field : "projectConstrCharDesc",
						title : "建设性质",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						},
						width : 150,
						filterable : false
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资（万元）",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column

			vm.addPlanGridOptions = {	
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end grid_addShenbaoInfoList
		
		/**
		 *创建年度计划 
		 */
		function plan_create(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				
				var httpOptions = {
					method : 'post',
					url : url_planList,
					data : vm.model
				};
				
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//end plan_create
		
		/**
		 * 更新年度计划
		 */
		function plan_update(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				
				var httpOptions = {
					method : 'put',
					url : url_planList,
					data : vm.model
				};
				
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = url_back_planList;
								}
							});
						}						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}
		}//end plan_update

		return service;
		
		/**
		 * 年度计划列表
		 */
		function grid_planList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList),
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
						field : "name",
						title : "编制名称",						
						filterable : true
					},
					{
						field : "year",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					},{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(), item.id);

						}

					}

			];
			// End:column

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid_planList
		
		
		/**
		 * 申报项目列表
		 */
		function grid_shenbaoInfoList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
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
				filter:[{
					field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
				},{
					field:'processState',
					operator:'eq',
					value:common.basicDataConfig().processState_qianShou
				}]
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
						template:function(item){
							return common.format('<a href="#/projectDetails/{0}/{1}" >{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectClassify);
						},
						filterable : false
					},
					{
						field : "projectInvestSum",
						title : "总投资",
						width : 150,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资",
						width : 150,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建日期",
						width : 180,
						filterable : false,
						template:function(item){return kendo.toString(new Date(item.createdDate), "yyyy/MM/dd HH:mm:ss");}
					}

			];
			// End:column
			var excelExport = function(e) {
			    var sheet = e.workbook.sheets[0];

			    for (var i = 1; i < sheet.rows.length; i++) {
			      var row = sheet.rows[i];
			      row.cells[1].value = common.getBasicDataDesc(row.cells[1].value);
				  row.cells[6].value = common.formatDateTime(row.cells[6].value);			      
			    }
			  };

			vm.gridOptions = {					
		            excel: {
		                fileName: "年度计划项目库.xlsx"
		            },
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				excelExport:excelExport,
				resizable : true
			};

		}// end fun grid_shenbaoInfoList
	}
})();