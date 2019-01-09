(function() {
	'use strict';

	var app = angular.module('app').factory('planReachSvc', planReach);

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
	planReach.$inject = ['$http','$compile','$location'];	
	function planReach($http,$compile,$location) {
		var url="/management/planReachManage/planReach";
		var url_shenbao="/management/shenbao";
		var url_back="/planReach_tabList";
		var url_taskAudit = "/management/task/plan";
		var url_plan = "/shenbaoAdmin/planReach";
		var service={
				grid:grid,
				getHasIncludYearPlan:getHasIncludYearPlan,
				getNotIncludYearPlan:getNotIncludYearPlan,
				planReachRecords:planReachRecords,
				comfirmPlanReach:comfirmPlanReach,
				deletePlanReach:deletePlanReach,
				getShenBaoInfoById:getShenBaoInfoById,
				retreat:retreat,
				planReachGrid:planReachGrid,
				planReachApprovaGrid:planReachApprovaGrid,
				createApproval:createApproval,
				updateApproval:updateApproval,
				deleteApproval:deleteApproval,
				getPlanReachApprovalById:getPlanReachApprovalById,
				updateShnebaoInfo:updateShnebaoInfo,
				endProcess:endProcess,
				endProcesss:endProcesss,
				checkIsOnly:checkIsOnly
		}
		
		return service;
		
		function checkIsOnly(vm,dataList){
			var httpOptions = {
					method : 'get',
					url : common.format(url + "/checkIsOnly/{0}/{1}", dataList[0],vm.id)
				};
			var httpSuccess = function success(response) {
				var resp = response.data;
				if(!resp.success){//如果不重复
					if(vm.model.shenBaoInfoDtos){
	        			//判断是否是重复添加
	    					vm.model.shenBaoInfoDtos.push({id:dataList[0],projectName:dataList[1],constructionUnit:dataList[2],projectGuiMo:dataList[3],
	    						projectConstrChar:dataList[4],beginDate:dataList[5],endDate:dataList[6],projectInvestSum:dataList[7],projectInvestAccuSum:dataList[8],
	    						planYear:dataList[9],capitalAP_ggys_TheYear:dataList[10],capitalAP_gtzj_TheYear:dataList[11],sqPlanReach_ggys:dataList[12],sqPlanReach_gtzj:dataList[13],
	    						apPlanReach_ggys:dataList[14],apPlanReach_gtzj:dataList[15],xdPlanReach_ggys:dataList[16],xdPlanReach_gtzj:dataList[17],thisTaskName:dataList[18],
	    						processState:dataList[19],apInvestSum:dataList[20],yearConstructionTask:dataList[21],remark:dataList[22]});
	        				
	    			}else{//如果没有申报集合
	    				vm.model.shenBaoInfoDtos=[{id:dataList[0],projectName:dataList[1],constructionUnit:dataList[2],projectGuiMo:dataList[3],
							projectConstrChar:dataList[4],beginDate:dataList[5],endDate:dataList[6],projectInvestSum:dataList[7],projectInvestAccuSum:dataList[8],
							planYear:dataList[9],capitalAP_ggys_TheYear:dataList[10],capitalAP_gtzj_TheYear:dataList[11],sqPlanReach_ggys:dataList[12],sqPlanReach_gtzj:dataList[13],
							apPlanReach_ggys:dataList[14],apPlanReach_gtzj:dataList[15],xdPlanReach_ggys:dataList[16],xdPlanReach_gtzj:dataList[17],thisTaskName:dataList[18],
							processState:dataList[19],apInvestSum:dataList[20],yearConstructionTask:dataList[21],remark:dataList[22]}];
	    			}
					
				}else{
					common.alert({
						vm : vm,
						msg : resp.message,
						fn : function() {
							vm.isSubmit = false;
							$('.alertDialog').modal('hide');
						}
					});
				}
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		function endProcess(vm,id){
			 $http.post(common.format(url + "/endProcess/{0}", id)).then(function () {
				 getPlanReachApprovalById(vm);
	            })
		}
		function endProcesss(vm){
			 $http.post(common.format(url + "/endProcesss/{0}", vm.id)).then(function () {
				 $location.path(url_back);
	            })
		}
		 function updateShnebaoInfo(vm, shenbaoinfo) {
	            $http.post(common.format(url + "/updateShnebaoInfo"),shenbaoinfo).then(function () {
	                vm.gridOptions && vm.gridOptions.dataSource && vm.gridOptions.dataSource.read();
	            })
	        };
		
		/**
		 * 根据id获取计划下达批复表单信息
		 */
		function getPlanReachApprovalById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url + "/approval?$filter=id eq '{0}'", vm.id)
				};
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
				//时间信息的展示
				vm.model.approvalTime=common.formatDate(vm.model.approvalTime);
				//建设起止日期展示
				vm.model.shenBaoInfoDtos.forEach(function(item,index){
					//item.beginDate=common.formatDate(item.beginDate);
					//item.endDate=common.formatDate(item.endDate);
					vm.gg[item.id] = item.xdPlanReach_ggys;
					vm.gt[item.id] = item.xdPlanReach_gtzj;
				});
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun getApplicationById
		
		/**
		 * 删除计划下达批复表单
		 */
		function deleteApproval(vm,id){
			var httpOptions = {
					method : 'post',
					url : url+'/deletePlanReach',
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
		}//end fun deleteApproval
		
		/**
		 * 更新计划下达批复表单
		 */
		function updateApproval(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				var isList = [];
				for (var int = 0; int < vm.model.shenBaoInfoDtos.length; int++) {
					var array_element = vm.model.shenBaoInfoDtos[int];
					isList.push(array_element.id);
				}
				var httpOptions = {
						method : 'post',
						url : url+'/updatePlanReachManage',
						data : {"id": vm.model.id,"ids" : isList,"resPersonTel":vm.model.resPersonTel,"resPerson":vm.model.resPerson,"approvalTime":vm.model.approvalTime,"title":vm.model.title}
					};
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功！",
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
		}//end fun updateApproval
		
		/**
		 * 创建计划下达批复表单
		 */
		function createApproval(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				var isList = [];
				if(vm.model.shenBaoInfoDtos != undefined){
					for (var int = 0; int < vm.model.shenBaoInfoDtos.length; int++) {
						var array_element = vm.model.shenBaoInfoDtos[int];
						isList.push(array_element.id);
					}
				}
				
				var httpOptions = {
						method : 'post',
						url : url,
						data : {"ids" : isList,"resPersonTel":vm.model.resPersonTel,"resPerson":vm.model.resPerson,"approvalTime":vm.model.approvalTime,"title":vm.model.title}
					};
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功！",
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
		}//end fun createApproval
		
		/**
		 * 计划下达批复表单数据
		 */
		function planReachApprovaGrid(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url+"/approval"),						
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
					field : "title",
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
					field : "approvalTime",
					title : "制表时间",
					width : 100,
					filterable : false,
					template:function(item){
						return common.formatDate(item.approvalTime);
					}
				},
				{
					field : "",
					title : "操作",
					width : 150,
					template : function(item) {					
						return common.format($('#columnBtns_approval').html(),item.id);
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
		}//end fun planReachApprovaGrid
		
		/**
		 * 计划下达数据表格
		 */
		function planReachGrid(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport: common.kendoGridConfig().transport(url_shenbao),				
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						planYear:{
							type:"number",
							validation: { required: true, min: 1}
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
//					{//过滤条件为审批状态不为退回状态
//					field:'processState',
//					operator:'eq',
//					value:1
//				},
				{
					field:'projectShenBaoStage',
					operator:'eq',
					value:"projectShenBaoStage_5"
				},
				{
					field:'thisTaskName',
					operator:'eq',
					value:"usertask5"
				}
//				{
//					field:'isFaWen',
//					operator:'eq',
//					value:false
//				}
				]
			});
			var columns = [	
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
										item.id+","+item.projectName+","+item.constructionUnit+","+item.projectGuiMo+","+item.projectConstrChar+","+
											item.beginDate+","+item.endDate+","+item.projectInvestSum+","+item.projectInvestAccuSum+","+item.planYear+","+
											item.capitalAP_ggys_TheYear+","+item.capitalAP_gtzj_TheYear+","+item.sqPlanReach_ggys+","+item.sqPlanReach_gtzj+","+
											item.apPlanReach_ggys+","+item.apPlanReach_gtzj+","+item.xdPlanReach_ggys+","+item.xdPlanReach_gtzj+","+item.thisTaskName+","+item.processState
											+","+item.apInvestSum+","+item.yearConstructionContent+","+item.remark);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll_planReachData' type='checkbox'  class='checkbox'/>",
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "constructionUnit",
					title : "建设单位",
					width : 150,
					filterable :true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "planName",
					title : "单列/打包",
					width : 150,
					filterable :true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					width : 100,
					filterable : {
						ui: function(element){
		                    element.kendoDropDownList({
		                        valuePrimitive: true,
		                        dataSource: vm.basicData.projectIndustry_ZF,
		                        dataTextField: "description",
		                        dataValueField: "id",
		                        filter:"startswith"
		                    });
		                }
					},
					template:function(item){
						return vm.getBasicDataDesc(item.projectIndustry);
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "planYear",
					title : "计划年度",	
					width : 100,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "itemOrder",
					title : "申报次数",	
					width : 100,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field:"projectInvestSum",
					title:"总投资",
					width:80,
					filterable : false,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				
				{
					title: "累计资金(万元)",
					columns: [
						{
							field : "apPlanReach_ggys",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "apPlanReach_gtzj",
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
					title: "计划申请资金(万元)",
					columns: [
						{
							field : "sqPlanReach_ggys",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "sqPlanReach_gtzj",
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
					title: "计划下达资金(万元)",
					columns: [
						{
							field : "xdPlanReach_ggys",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "xdPlanReach_gtzj",
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
				}
			];
			vm.gridOptions_planReachData = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//end fun planReachGrid
		
		/**
		 * 计划下达退回操作
		 */
		function retreat(vm,id){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbao+"/updateState"),
					data:vm.model
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"操作成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								vm.gridOptions.dataSource.read();//刷新数据
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
		}//end fun retreat
		
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
						//vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						//vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
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
					method : 'post',
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
		
		function grid(vm){
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
                transport: common.kendoGridConfig().transport(url_shenbao),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						planYear:{
							type:"number",
							validation: { required: true, min: 1}
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
				filter:[{//TODO 这里过滤条件是审批阶段为“秘书科发文”，与OA对接成功之后这里应该是与OA返回同意的那个阶段
					field:'processState',
					operator:'eq',
					value:2
				},
				{//TODO 这里过滤条件是审批阶段为“秘书科发文”，与OA对接成功之后这里应该是与OA返回同意的那个阶段
					field:'projectShenBaoStage',
					operator:'eq',
					value:"projectShenBaoStage_5"
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
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>",
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "constructionUnit",
					title : "建设单位",
					width : 150,
					filterable :true,
					template:function(item){
						return vm.getUnitName(item.unitName);
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "projectIndustry",
					title : "项目行业",
					width : 100,
					filterable : {
						ui: function(element){
		                    element.kendoDropDownList({
		                        valuePrimitive: true,
		                        dataSource: vm.basicData.projectIndustry_ZF,
		                        dataTextField: "description",
		                        dataValueField: "id",
		                        filter:"startswith"
		                    });
		                }
					},
					template:function(item){
						return vm.getBasicDataDesc(item.projectIndustry);
					},
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field : "planYear",
					title : "计划年度",	
					width : 100,
					filterable : true,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
					field:"projectInvestSum",
					title:"总投资",
					width:80,
					filterable : false,
					headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
				},
				{
                    field: "apInvestSum",
                    title: "累计安排资金",
                    width: 140,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
				{
					title: "累计安排资金(万元)",
					columns: [
						{
							field : "apPlanReach_ggys",
							title : "公共预算",
							width:80,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "apPlanReach_gtzj",
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
							width:60,
							filterable : false,
							headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
						    }
						},
						{
							field : "sqPlanReach_gtzj",
							title : "国土基金",
							width:60,
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
						title: "计划下达资金(万元)",
						columns: [
							{
								field : "xdPlanReach_ggys",
								title : "公共预算",
								width:100,
								filterable : false,
//							    template: function (item) {
//	                                vm.gg[item.id] = item.xdPlanReach_ggys;
//	                                return common.format($('#input').html(), item.id, item.xdPlanReach_ggys);
//	                            },
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "xdPlanReach_gtzj",
								title : "国土基金",
								width:100,
								filterable : false,
//								template: function (item) {
//	                               vm.gt[item.id] = item.xdPlanReach_gtzj;
//	                               return common.format($('#input2').html(), item.id, item.xdPlanReach_gtzj);
//	                            },
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
						field : "planName",
						title : "单列/打包",	
						width : 100,
						filterable : true,
						headerAttributes: {
						      "class": "table-header-cell",
						       style: "text-align: center;vertical-align: middle;"
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
	}	
})();