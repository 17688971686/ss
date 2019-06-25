(function() {
	'use strict';

	angular.module('app').factory('projectSvc', project);

	project.$inject = [ '$http' ];

	function project($http) {
		var url_project = "/management/project";//获取项目信息数据
		var url_userUnit = "/management/userUnit";//获取单位信息
		var url_back = "#/project";
		var url_backSH = "#/project_SH";
		var url_document="/management/replyFile";
		var url_shenbao="/management/shenbao";
        var url_taskAudit_new = "/management/task";

		var service = {
			grid : grid,
			grid_SH:grid_SH,
			getProjectById:getProjectById,
			getUserUnits:getUserUnits,
			updateProject:updateProject,
			createProject:createProject,
			updateIsMonthReport:updateIsMonthReport,
			documentRecordsGird:documentRecordsGird,
			updateProjectToLibray:updateProjectToLibray,
            findShenbaoinfoByProjectId:findShenbaoinfoByProjectId,
            getShenBaoInfoById:getShenBaoInfoById,
            getHistoryInfo:getHistoryInfo,
			//统计分析
			getProjects:getProjects,
            updateAlreadyDisbursedByExcel:updateAlreadyDisbursedByExcel,
            getProjectUnit : getProjectUnit
			
		};

		return service;

        /*
         * 流转信息
         */
        function getHistoryInfo(vm,shenbaoid) {
            var httpOptions = {
                method: 'get',
                url: common.format(url_taskAudit_new + "/his/" + shenbaoid)
            }
            var httpSuccess = function success(response) {

                vm.taskRecord = response.data;
                for (var int = 0; int < vm.taskRecord.length; int++) {
                    var array_element = vm.taskRecord[int];
                    if (array_element.msg.substring(0,2) == "退文" || array_element.msg.substring(0,2) == "办结") {
                        vm.taskRecord=[];
                        vm.taskRecord.push(array_element);
                        return;
                    }
                }
            }
            common.http({
                vm: vm,
                $http: $http,
                httpOptions: httpOptions,
                success: httpSuccess
            });
        }

        /**
         * 根据id查询申报信息
         */
        function getShenBaoInfoById(vm,shenbaoid) {
            var httpOptions = {
                method: 'get',
                url: common.format(url_shenbao + "?$filter=id eq '{0}'", shenbaoid)
            };

            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm: vm,
                    response: response,
                    fn: function () {
                        vm.isSHInvestment = false;
                        vm.isZFInvestment = false;
                        vm.model.shenBaoInfo = response.data.value[0] || {};
                        //数据的展示处理
                        //项目类型
                        vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType, ",");
                        //判断投资类型
                        if (vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF) {//政府投资
                            vm.isZFInvestment = true;
                            vm.basicData.projectClassify = vm.basicData.projectClassify_ZF;//基础数据--项目分类
                            vm.basicData.projectIndustry = vm.basicData.projectIndustry_ZF;//基础数据--行业归口
                        }
                        //判断申报阶段
                        if (vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan) {//申报阶段为:资金申请报告
                            vm.isCapitalApplyReport = true;
                            vm.isJihuaxiada = false;
                            vm.materialsType = common.uploadFileTypeConfig().projectShenBaoStage_capitalApplyReport;
                        }else if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_jihuaxiada){//申报阶段为:计划下达
                            vm.isJihuaxiada=true;
                            vm.isCapitalApplyReport = false;
                            vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_jihuaxiada;
                        }
                        //时间的显示
                        vm.model.shenBaoInfo.createdDate = common.formatDate(vm.model.shenBaoInfo.createdDate);//开工日期
                        vm.model.shenBaoInfo.beginDate = common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
                        vm.model.shenBaoInfo.endDate = common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
                        vm.model.shenBaoInfo.pifuJYS_date = common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期
                        vm.model.shenBaoInfo.pifuKXXYJBG_date = common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
                        vm.model.shenBaoInfo.pifuCBSJYGS_date = common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
                        //资金计算显示
                        //计算资金筹措总计
                        vm.capitalTotal = function () {
                            return common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys || 0, vm.model.shenBaoInfo.capitalSCZ_gtzj || 0, vm.model.shenBaoInfo.capitalSCZ_zxzj || 0,
                                vm.model.shenBaoInfo.capitalQCZ_ggys || 0, vm.model.shenBaoInfo.capitalQCZ_gtzj || 0,
                                vm.model.shenBaoInfo.capitalSHTZ || 0, vm.model.shenBaoInfo.capitalZYYS || 0, vm.model.shenBaoInfo.capitalOther || 0]);
                        };
                        // 国民经济行业分类
                        var child2 = $linq(common.getBasicData()).where(function (x) {
                            return x.id == vm.model.shenBaoInfo.nationalIndustry
                        }).toArray()[0];
                        if (child2) {
                            vm.model.shenBaoInfo.nationalIndustryParent = child2.pId;
                            vm.nationalIndustryChange();
                        }
                        // getDeptByName(vm, "投资科");
                        // getPackPlanInfo(vm);

                        // if (vm.model.shenBaoInfo.thisTaskName != 'usertask1' || vm.model.shenBaoInfo.thisTaskName != 'usertask2') {
                        //     getAssigneeByUserId(vm, vm.model.shenBaoInfo.zong_processId);//查询登录人员是否是指定办理人员
                        // }
                        // getUnfinished(vm, vm.model.shenBaoInfo.zong_processId);
                        // getProjectUnit(vm,vm.model.shenBaoInfo.unitName);
                    }
                });
            };

            common.http({
                vm: vm,
                $http: $http,
                httpOptions: httpOptions,
                success: httpSuccess
            });
        }//end fun getShenBaoInfoById

		function findShenbaoinfoByProjectId(vm,projectid){
            var dataSource = new kendo.data.DataSource({
                type : 'odata',
                transport : common.kendoGridConfig().transport(common.format(url_shenbao)),
                schema : common.kendoGridConfig().schema({
                    id : "id",
                    fields : {
                        isMonthReport:{
                            type:'boolean'
                        },
                        isIncludLibrary:{
                            type:'boolean'
                        }
                    }
                }),
                serverPaging : true,
                serverSorting : true,
                serverFiltering : true,
                pageSize : 10,
                sort : {
                    field : "projectIndustry",
                    dir : "desc"
                }
            });
            // End:dataSource
            // Begin:column
            var columns = [
                {
                    field : "projectName",
                    title : "项目名称",
                    width:300,
                    filterable : true,
                    attributes: {
                        "class": "table-cell",
                    }
                },
                {
                    field : "projectInvestSum",
                    title : "总投资",
                    width : 80,
                    filterable : false,
                    attributes: {
                        "class": "table-cell",
                    }
                },
                {
                    field : "projectInvestAccuSum",
                    title : "累计完成投资",
                    width : 80,
                    filterable : false,
                    attributes: {
                        "class": "table-cell",
                    }
                },
                {
                    field : "projectShenBaoStage",
                    title : "申报阶段",
                    width : 120,
                    template:function(item){
                            return common.getBasicDataDesc(item.projectShenBaoStage);
                    },
                    filterable : false
                },
                {
                    field : "processStage",
                    title : "审批阶段",
                    width : 150,
                    filterable : false,
                    template:function(item){
                        return common.format("<span class='text-danger'>{0}</span>",item.processStage);
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
                    width : 150,
                    template : function(item) {
                        return common.format($('#columnBtns_info').html(),item.id);
                    },
                    attributes: {
                        "class": "table-cell",
                        //style: "width:150px"
                    }
                }
            ];
            // End:column

            vm.gridOptions_shenBaoRecords = {
                dataSource : common.gridDataSource(dataSource),
                filterable : common.kendoGridConfig().filterable,
                pageable : common.kendoGridConfig().pageable,
                noRecords : common.kendoGridConfig().noRecordMessage,
                columns : columns,
                resizable : true,
                sortable:true,
                scrollable:true,
                columnMenu: {
                    columns: true
                }
//				columnMenu : true
            };

		}

		function updateProjectToLibray(vm){
			var httpOptions = {
				method : 'post',
				url : url_project+"/updateProjectToLibray",
				data : {id : vm.libary.id, isIncludLibary : vm.libary.isIncludLibrary}
			};
			var httpSuccess = function success(response){
				//关闭提示框
				$("#myModal_update").modal('hide');
				//刷新表格数据
				$('.alertDialog').modal('hide');
				vm.gridOptions.dataSource.read();
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}


		function getProjects(vm){
			var httpOptions = {
					method : 'get',
					url : url_project+"/getProjects"
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						// 设置值到阶段统计柱状图
						setDataToStageChart(vm, response.data.projectStage);
						// 设置值到是否需要月报表饼状图
						setDataToMonRepChart(vm, response.data.isMonthReport);
						// 设置值到所属行业柱状图
                        setDataToIndustryChart(vm, response.data.projectIndustry);
					}
				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});

			var setDataToStageChart = function (vm, data) {
                vm.model.projects = data;
                //处理数据
                vm.totalProjects=0;
                var yAxisData=[];
                var seriesData=[];

                if(vm.model.projects.length>0){
                    $.each(vm.model.projects,function(index,element){
                        yAxisData.push(vm.getBasicDataDesc(element.projectStage)==""?"未知阶段":vm.getBasicDataDesc(element.projectStage));
                        seriesData.push(element.count);
                        vm.totalProjects+=element.count;
                    });
                }
                vm.stageChart.hideLoading();
                vm.stageChart.setOption({
                    yAxis:{
                        data:yAxisData
                    },
                    series: {
                        data:seriesData
                    }
                });
            };

			var setDataToMonRepChart = function (vm, data) {
                if (data && data.length > 0) {
                    vm.monRepChart.hideLoading();

                    var seriesData = [];

                    $.each(data, function (index, element) {

                        if (element.monthReport) {
                            seriesData.push({value: element.count, name: "需要填写月报"});
                        } else {
                            seriesData.push({value: element.count, name: "不需要填写月报"});
                        }
                    });

                    vm.monRepChart.setOption({
                        series: {
                            data: seriesData
                        }
                    });
                }
            };

			var setDataToIndustryChart = function (vm, data) {
                if (data && data.length > 0) {


                    var xAxisData = [];
                    var seriesData = [];

                    $.each(data, function (index, element) {

                        xAxisData.push(vm.getBasicDataDesc(element.projectIndustry));
                        seriesData.push(element.count);

                    });

                    vm.industryChart.hideLoading();
                    vm.industryChart.setOption({
                        xAxis: {
                            data: xAxisData
                        },
                        series: {
                            data: seriesData
                        }
                    });

                }
            };

		}//end fun getProjects
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "?$filter=id eq '{0}'", vm.model.unitName)
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
					url : url_userUnit+"/get"
				};
				var httpSuccess = function success(response) {
					vm.userUnits = response.data;
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
				vm.model.projectType=common.arrayToString(vm.model.projectType,',');//项目类型的处理

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
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}									
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
				common.alert({
					vm:vm,
					msg:"您填写的信息不正确,请核对后提交!"
				});

			}
		}
		//end#createProject
		
		/**
		 * 更新是否填写月报
		 */
		function updateIsMonthReport(vm){
			vm.isSumbit=true;
			var httpOptions = {
					method : 'post',
					url : url_project+"/isMonthReport",
					data : {id:vm.model.id,isMonthReport:vm.model.isMonthReport}
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							vm.isSumbit=false;
							//关闭模态框
							$("#myModal_edit").modal('hide');
							//刷新表格数据
							if(vm.isZFInvestment){
								vm.gridOptions.dataSource.read(); 
							}else if(vm.isSHInvestment){
								vm.gridOptions_SH.dataSource.read(); 
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
		 * 更新项目信息
		 */
		//begin#updateProject
		function updateProject(vm){
            checkProjectNumberExist(vm, function (isExist) {
				if (isExist === 'false') {
                    common.initJqValidation();
                    var isValid = $('form').valid();
                    if (isValid) {
                        vm.isSubmit = true;
                        vm.model.projectType=common.arrayToString(vm.model.projectType,',');

                        var httpOptions = {
                            method : 'post',
                            url : url_project+'/updateProject',
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
                                            if(vm.isZFInvestment){
                                                location.href=url_back;
                                            }else if(vm.isSHInvestment){
                                                location.href=url_backSH;
                                            }
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
				} else {
                    common.alert({
                        vm:vm,
                        msg:"您填写的项目代码与其它项目的项目代码重复,请修改后提交!"
                    });
				}
            })

		}
		//end#updateProject
		
		function checkProjectNumberExist(vm, callBack) {

            var httpOptions = {
                method : 'get',
                url : url_project + "/projectNumberExist?projectNumber="+vm.model.projectNumber+"&ignoreProject=" + vm.model.id
            };

            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm : vm,
                    response : response,
                    fn : function() {
                        callBack(response.data)
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
				vm.model.projectType=common.stringToArray(vm.model.projectType,',');

				//日期展示
				//vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				//vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				
				//金额处理 （TODO 这一块可以不需要了）
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
					//资金来源计算
			   		 vm.capitalTotal=function(){
			   			 return common.getSum([
			   					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
			   					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
			   					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
			   					 vm.model.capitalOther||0]);
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
	
		
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
//						createdDate : {
//							type : 'date'
//						},
						isMonthReport:{
							type:'boolean'
						},
						isIncludLibrary:{
							type:'boolean'
						}
						
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "projectIndustry",
					dir : "desc"
				},
				filter:[
					{
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_ZF
					},
					{
						field:"isLatestVersion",
						operator:"eq",
						value:true
					}
					,{
						field:"isIncludLibrary",
						operator:"eq",
						value:true
					}
				]
			});
			// End:dataSource
			// Begin:column
			var columns = [
					 {	field : "countryNumber",
						title : "国家编码 ",
						//width : 130,						
						filterable : false,
						attributes: {  
						      "class": "table-cell",
						}  
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						width:300,
						filterable : true,
						attributes: {  
						      "class": "table-cell",
						}  
					},
					{
						field : "unitName",
						title : "项目所属单位",
						//width : 150,
						filterable:{
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.userUnit,
			                        dataTextField: "unitName",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						template:function(item){
							return common.getUnitName(item.unitName);
						},
						attributes: {  
						      "class": "table-cell",  
						}  
					},
					{
						field : "projectStage",
						title : "项目阶段",
						//width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectStage);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.projectStage,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {  
						      "class": "table-cell",
						}  
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						//width : 100,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
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
						attributes: {  
						      "class": "table-cell",  
						}  
					},
					{
						field : "isIncludLibrary",
						title : "是否纳入项目库",
						template : function(item) {
							if(item.isIncludLibrary){
								return "是";
							}else if(!item.isIncludLibrary){
								return "否";
							}								 
						},
						width : 100,
						filterable : true,
						attributes: {  
						      "class": "table-cell",  
						}  
					},
					{
						hidden: true,
						field : "isMonthReport",
						title : "是否月报",
						template : function(item) {
							if(item.isMonthReport){
								return "是";
							}else if(!item.isMonthReport){
								return "否";
							}								 
						},
						width : 100,
						filterable : true,
						attributes: {  
							"class": "table-cell",  
					    }  
					},
					{	
						hidden: true,
						field : "projectInvestSum",
						title : "总投资",
						//width : 130,						
						filterable : false,
						attributes: {  
						      "class": "table-cell",
						}  
					},
					{
						hidden: true,
						field : "projectCategory",
						title : "项目类别",
						//width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.projectCategory,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {  
						      "class": "table-cell",
						      //style: "text-align: right; font-size: 14px"
						}  
					},
					{	
						hidden: true,
						field : "projectInvestAccuSum",
						title : "累计完成投资",
						//width : 130,						
						filterable : false,
						attributes: {  
						      "class": "table-cell", 
						      //style: "width:130px"
						}  
					},
					{
						field : "",
						title : "操作",
						width : 150,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')","vm.isInLibary('" +item.id+ "','"+item.isIncludLibrary+"')");
						},
						attributes: {  
						      "class": "table-cell",  
						      //style: "width:150px"
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
				scrollable:true,
				columnMenu: {
				    columns: true
				  }
//				columnMenu : true
			};
		}// end fun grid
		
		// begin#grid
		function grid_SH(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
					id : "id"
					/*fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}*/
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
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_SH
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
						width : 120,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						width:300,
						filterable : true
					},
					{
						field : "unitName",
						title : "责任单位",
						width : 200,
						filterable:{
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
			                        dataValueField: "id"
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
						field : "isMonthReport",
						title : "是否月报",
						template : function(item) {
							if(item.isMonthReport){
								return "是";
							}else if(!item.isMonthReport){
								return "否";
							}								 
						},
						width : 120,
						filterable : true
					},
					{//colums里的一个{}
						field : "",
						title : "操作",
						width : 250,
						template : function(item) {
							return common.format($('#columnBtns').html(), item.id, item.projectInvestmentType,"vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')","vm.isInLibary('" +item.id+ "','"+item.isIncludLibrary+"')");
						}
					}

			];
			// End:column

			vm.gridOptions_SH = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				scrollable:true,
				sortable:true
			};

		}// end fun grid

		function updateAlreadyDisbursedByExcel(vm, fileName, successCallBack) {
            var httpOptions = {
                method : 'post',
                url : url_project+'/updateDisbursed',
                data : fileName
            };

            common.http({
                vm : vm,
                $http : $http,
                httpOptions : httpOptions,
                success : successCallBack
            });
        }

	}
	
	
})();