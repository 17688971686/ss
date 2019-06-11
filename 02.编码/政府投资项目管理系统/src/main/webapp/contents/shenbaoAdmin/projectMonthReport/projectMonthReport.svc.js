(function() {
	'use strict';

	angular.module('app').factory('projectMonthReportSvc', projectMonthReport);

	projectMonthReport.$inject = [ '$http','$compile' ];	
	function projectMonthReport($http,$compile) {
		var url_project = "/shenbaoAdmin/project";
		var url_basicData = "/common/basicData";//获取基础数据
		var url_projectMonthReport="/shenbaoAdmin/projectMonthReport";
		var url_userUnitInfo="/shenbaoAdmin/userUnitInfo";
		var url_sysConfig="/sys/getSysConfig";
		
		var service = {
			grid : grid,
			submitMonthReport:submitMonthReport,
			getProjectById:getProjectById,
			checkPort:checkPort
			
		};		
		return service;	
		
		/**
		 * 检查月报端口
		 */
		function checkPort(vm,month){
			var httpOptions = {
					method : 'get',
					url : common.format(url_sysConfig + "?configName={0}", common.basicDataConfig().taskType_monthReportPort)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response : response,
					fn:function(){
						vm.sysConfing = response.data;
						if(vm.sysConfing.enable){
							var nowDate = new Date();
							var nowMonth = nowDate.getMonth()+1; 
							var nowDay = nowDate.getDate();
							var beginDay = parseInt(vm.sysConfing.configValue.split("-")[0]);
							var endDay = parseInt(vm.sysConfing.configValue.split("-")[1]);
							var msg ="";
							if(nowMonth == month){
								//填报月在beginDay后，可以填报
								if(nowDay >= beginDay){
									//跳转到月报信息填写页面
									location.href = "#/projectMonthReportInfoFill/"+vm.projectId+"/"+vm.model.projectInfo.projectInvestmentType+"/"+vm.submitYear+"/"+month;
								}else{
									msg = "该月月报填报日期为本月" + beginDay + "日至下月" + endDay + "日";
									common.alert({
										vm:vm,
										msg:msg
									});
								}
							}else if(nowMonth == month+1){
								//次月如果日期是endDay前，还可以填报
								if(nowDay <= endDay){
									location.href = "#/projectMonthReportInfoFill/"+vm.projectId+"/"+vm.model.projectInfo.projectInvestmentType+"/"+vm.submitYear+"/"+month;
								}else{
									msg = "该月月报填报日期为上月"+beginDay+"日至本月"+endDay+"日";
									common.alert({
										vm:vm,
										msg:msg
									});
								}
							}else{
								if(nowMonth > month){
									msg="该月月报已逾期，不可填写!";
								}else if(nowMonth<month){
									msg="该月月报还未到填写时间，不可填写!";
								}
								common.alert({
				   					vm:vm,
				   					msg:msg
								});
							}
						}else{
							common.alert({
			   					vm:vm,
			   					msg:"月报端口已关闭,请联系管理人员!"
			   				});
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
		}
		
		/**
		 * 查询项目数据
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}' ", vm.projectId)
				};
				var httpSuccess = function success(response) {					
					vm.model.projectInfo = response.data.value[0]||{};
					if(vm.page=='selectMonth'){//如果为月份选择页面
						vm.setMonthSelected();//设置月份选择按钮的状态
					}
					if(vm.page=='fillReport'){//如果为月报填报页面
						//vm.isReportTuiWen = false; 此块用于月报的退文（暂时不需要）
						//判断是否有月报
						var report=$linq(vm.model.projectInfo.monthReportDtos)
											.where(function(x){return x.submitYear==vm.year && x.submitMonth==vm.month;})
											.toArray();
						if(report.length>0){//有月报
							vm.isReportExist=true;
							for (var i = 0; i < report.length; i++) {
								if(report[i].isLatestVersion == true){
									vm.model.monthReport=report[i];
								}
							}
						}else{//没有月报
							vm.isReportExist=false;
						}
						//项目相关资金获取 （TODO 资金处理这一块可以不用了）
						if(vm.isZFInvestment){
                            getPlanByProjectId(vm);
						}
					}		
					
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}

        function getPlanByProjectId(vm){
            var httpOptions = {
                method : 'get',
                url : common.format(url_project + "/getPlanByProjectId/"+vm.projectId)
            };
            var httpSuccess = function success(response) {
                vm.model.projectInfo = response.data ||{};
                if(vm.page=='fillReport'){//如果为月报填报页面
                    //关联上项目
                    vm.model.monthReport.projectId=vm.model.projectInfo.id;
                    vm.model.monthReport.projectNumber=vm.model.projectInfo.projectNumber;
                    vm.model.monthReport.projectRepName=vm.model.projectInfo.projectRepName;
                    vm.model.monthReport.projectRepMobile=vm.model.projectInfo.projectRepMobile;
                    //项目开工以及竣工日期的获取
                    vm.model.monthReport.beginDate=common.formatDate(vm.model.projectInfo.beginDate);
                    vm.model.monthReport.endDate=common.formatDate(vm.model.projectInfo.endDate);

                    vm.model.monthReport.invertPlanTotal=common.toMoney(vm.model.projectInfo.projectInvestSum);//项目总投资
                    //项目相关资金获取 （TODO 资金处理这一块可以不用了）
                    if(vm.isZFInvestment){
                        vm.model.monthReport.actuallyFinishiInvestment=common.toMoney(vm.model.projectInfo.projectInvestAccuSum);//累计完成投资
                        //资金处理
                        vm.model.monthReport.releasePlanTotal = common.toMoney(vm.model.projectInfo.applyAPYearInvest);//截止上年底累计下达计划
                        vm.model.monthReport.thisYearPlanInvestment=common.toMoney(vm.model.projectInfo.yearInvestApproval);//本年度计划完成投资
                        vm.model.monthReport.thisYearPlanHasInvestment=common.toMoney(vm.model.monthReport.thisYearPlanHasInvestment);//本年度已下达计划
                        vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);
                        vm.model.monthReport.thisMonthPlanInvestTotal=common.toMoney(vm.model.monthReport.thisMonthPlanInvestTotal);//本月计划完成投资yearInvestApproval
                        vm.model.monthReport.thisMonthInvestTotal=common.toMoney(vm.model.monthReport.thisMonthInvestTotal);//本月完成投资
                        vm.model.monthReport.thisYearAccumulatedInvestment=common.toMoney(vm.model.monthReport.thisYearAccumulatedInvestment);//本年度已完成投资
                        vm.model.monthReport.firstQuarCompInvestment=common.toMoney(vm.model.monthReport.firstQuarCompInvestment);//1到3月份完成投资
                        vm.model.monthReport.secondQuarCompInvestment=common.toMoney(vm.model.monthReport.secondQuarCompInvestment);//1到6月份完成投资
                        vm.model.monthReport.thirdQuarCompInvestment=common.toMoney(vm.model.monthReport.thirdQuarCompInvestment);//1到9月份完成投资
                        vm.model.monthReport.fourthQuarCompInvestment=common.toMoney(vm.model.monthReport.fourthQuarCompInvestment);//1到12月份完成投资
                    }
                }

            };

            common.http({
                vm:vm,
                $http:$http,
                httpOptions:httpOptions,
                success:httpSuccess
            });
        }
		
		/**
		 * 提交项目月报信息到数据库
		 */
		function submitMonthReport(vm){
			//验证表单信息
			common.initJqValidation();
			var isValid = $('form').valid();
			//验证通过
			if(isValid){				
				vm.model.monthReport.submitYear=vm.year;
				vm.model.monthReport.submitMonth=vm.month;
				vm.model.monthReport.projectId=vm.projectId;
				vm.isSubmit = true;
				var httpOptions = {
						method : 'post',
						url : url_projectMonthReport,
						data : vm.model.monthReport
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
									location.reload();
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
		}
		
		/**
		 * 月报列表页数据查询以及列表设计（申报的项目）
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_projectMonthReport+"/unitProject")),
				schema : common.kendoGridConfig().schema({
					id : "id",
//					fields : {
//						createdDate : {
//							type : "date"
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
					field:'isMonthReport',
					operator:'eq',
					value:true
				},{
					field:'isLatestVersion',
					operator:'eq',
					value:true
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
					filterable : true,
					width:250,
					template:function(item){
						return common.format('<a href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName);
					}
				},
				{
					field : "projectStage",
					title : "项目阶段",
					width : 120,
					template:function(item){
						return common.getBasicDataDesc(item.projectStage);
					},
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
	                            dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType),
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
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,"vm.del('" + item.id + "')");
					}

				}

			];

			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
//				dataBound:dataBound,
				resizable : true,
				sortable:true,
				scrollable:true
			};

		}// end fun grid

	}
	
	
	
})();