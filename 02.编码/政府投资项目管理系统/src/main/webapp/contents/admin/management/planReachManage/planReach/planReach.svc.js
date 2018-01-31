(function() {
	'use strict';

	angular.module('app').factory('planReachSvc', planReach);

	planReach.$inject = ['$http','$compile','$location'];	
	function planReach($http,$compile,$location) {
		var url="/management/planReachManage/planReach";
		var url_shenbao="/shenbaoAdmin/shenbao";
		
		var service={
				getHasIncludYearPlan:getHasIncludYearPlan,
				getNotIncludYearPlan:getNotIncludYearPlan,
				planReachRecords:planReachRecords,
				comfirmPlanReach:comfirmPlanReach,
				deletePlanReach:deletePlanReach,
				getShenBaoInfoById:getShenBaoInfoById
		}
		
		return service;
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.model.shenBaoInfo = response.data.value[0]||{};
						//项目类型
						vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,",");
						//时间的显示
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						//判断项目的投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
						}
						//如果申报信息的申报阶段为计划下达
			  			if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_jihuaxiada){
			  				vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_jihuaxiada;
			    			vm.isJihuaxiada = true;
						}
			  			//计划下达申请资金累计
				  		vm.sqPlanReachTotal=function(){
				  			vm.sqPlanReachSum = common.getSum([vm.model.shenBaoInfo.sqPlanReach_ggys || 0,vm.model.shenBaoInfo.sqPlanReach_gtzj || 0]);
				  			return vm.sqPlanReachSum;
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
		}//end fun getShenBaoInfoById
		
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
		function comfirmPlanReach(vm,id,str){
			var httpOptions = {
				method : 'post',
				url : url+"/comfirmPlanReach",
				data : {"id":id,"apPlanReach_ggys":vm.model.apPlanReach_ggys,"apPlanReach_gtzj":vm.model.apPlanReach_gtzj,"isPass":str}
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
				transport : common.kendoGridConfig().transport(url),
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
						value:common.basicDataConfig().projectShenBaoStage_jihuaxiada
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
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>",
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "projectName",
					title : "项目名称",
					filterable : true,
					width:250,
					template:function(item){
						var css = "text-primary";
						return common.format("<a class='{2}' href='javascript::' ng-click='vm.dialog_shenbaoInfo(\"{3}\")'>{1}</a>",item.projectId,item.projectName,css,item.id);
					},
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "unitName",
					title : "建设单位",
					width : 250,
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
					title: "年度计划申请(万元)",
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
					title: "年度计划安排(万元)",
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
								return common.format($('#input_sq_ggys').html(),item.id,item.sqPlanReach_ggys,item.capitalAP_ggys_TheYear);
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
								return common.format($('#input_sq_gtzj').html(),item.id,item.sqPlanReach_gtzj,item.capitalAP_gtzj_TheYear);
							},
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "计划下达安排(万元)",
					columns: [
						{
							field : "apPlanReach_ggys",
							title : "公共预算",
							width:100,
							filterable : false,
							template:function(item){
								var isShowOperation = item.processStage==common.basicDataConfig().processStage_qianshou && 
								item.processState==common.basicDataConfig().processState_jinxingzhong;
								return common.format($('#input_ap_ggys').html(),item.id,item.apPlanReach_ggys,item.capitalAP_ggys_TheYear,!isShowOperation);
							},
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "apPlanReach_gtzj",
							title : "国土基金",
							width:100,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    },
						    template:function(item){
						    	var isShowOperation = item.processStage==common.basicDataConfig().processStage_qianshou && 
								item.processState==common.basicDataConfig().processState_jinxingzhong;
								return common.format($('#input_ap_gtzj').html(),item.id,item.apPlanReach_gtzj,item.capitalAP_gtzj_TheYear,!isShowOperation);
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
					width : 130,
					template : function(item) {
						var isShowOperation = item.processStage==common.basicDataConfig().processStage_qianshou && 
								item.processState==common.basicDataConfig().processState_jinxingzhong;
						return common.format($('#columnBtns_hasInclud').html(),item.id,isShowOperation?'':'display:none');
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
				filter:[
						{
							field:'isIncludYearPlan',
							operator:'eq',
							value:false		
						},
						{
							field:'projectShenBaoStage',
							operator:'eq',
							value:common.basicDataConfig().projectShenBaoStage_jihuaxiada
						},{
							field:'processStage',
							operator:'eq',
							value:common.basicDataConfig().processState_mskfawen
						}
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
						return common.format("<a class='{2}' href='javascript::' ng-click='vm.dialog_shenbaoInfo(\"{3}\")'>{1}</a>",item.projectId,item.projectName,css,item.id);
					},
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "unitName",
					title : "建设单位",
					width : 250,
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
					field:"processState",
					title:"审批状态",
					width : 120,
					template:function(item){
						return common.getBasicDataDesc(item.processState);
					},
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: vm.basicData.processState,
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
					title: "年度计划申请资金(万元)",
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
					title: "年度安排资金(万元)",
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
								return common.format($('#input_sq_ggys').html(),item.id,item.sqPlanReach_ggys,item.capitalAP_ggys_TheYear);
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
								return common.format($('#input_sq_gtzj').html(),item.id,item.sqPlanReach_gtzj,item.capitalAP_gtzj_TheYear);
							},
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					title: "计划下达安排(万元)",
					columns: [
						{
							field : "apPlanReach_ggys",
							title : "公共预算",
							width:100,
							filterable : false,
							template:function(item){
								var isShowOperation = item.processStage==common.basicDataConfig().processStage_qianshou && 
								item.processState==common.basicDataConfig().processState_jinxingzhong;
								return common.format($('#input_ap_ggys').html(),item.id,item.apPlanReach_ggys,item.capitalAP_ggys_TheYear,!isShowOperation);
							},
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "apPlanReach_gtzj",
							title : "国土基金",
							width:100,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    },
						    template:function(item){
						    	var isShowOperation = item.processStage==common.basicDataConfig().processStage_qianshou && 
								item.processState==common.basicDataConfig().processState_jinxingzhong;
								return common.format($('#input_ap_gtzj').html(),item.id,item.apPlanReach_gtzj,item.capitalAP_gtzj_TheYear,!isShowOperation);
							},
						}
					],
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
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
					field : "processState",
					title : "审批状态",
					width : 150,
					filterable : false,
					template:function(item){
						var processStateDesc=common.getBasicDataDesc(item.processState);
						var css='text-danger';
						return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
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
						var isShowEditAndRemoveBtn=item.processState==common.basicDataConfig().processState_jinxingzhong
						   ||item.processState==common.basicDataConfig().processState_notpass;
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