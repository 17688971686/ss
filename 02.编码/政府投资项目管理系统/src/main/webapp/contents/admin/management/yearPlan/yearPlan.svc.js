(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http','$location'];

	function yearPlan($http,$location) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_project = "/management/project";
		var url_userUnitInfo = "/management/userUnit";
		var url_planList="/management/yearPlan";
		var url_planCapital="/management/yearPlanCapital";
		var url_back_planList="#/yearPlan/planList";
		var url_document="/management/replyFile";
		var url_back_shenbaoInfoList="/yearPlan/shenbaoInfoList";
		var url_exportExcel="/common/exportExcel";
		var url_basicData="/management/basicData";
		
		var service = {
			//年度计划项目库相关
			grid_shenbaoInfoList : grid_shenbaoInfoList,//政投申报项目列表
			grid_shenbaoInfoListSH:grid_shenbaoInfoListSH,//社投申报项目列表
			updateShenBaoInfoState:updateShenBaoInfoState,//更新申报信息的状态
			addProjectToLibrary:addProjectToLibrary,//项目纳入项目库
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			createShenBaoInfo:createShenBaoInfo,//创建申报信息
			updateProject:updateProject,//更新项目基本信息
			//年度计划编制相关
			grid_planList:grid_planList,//政投年度计划列表
			plan_create:plan_create,//创建年度计划
			plan_update:plan_update,//更新年度计划
			plan_delete:plan_delete,//删除年度计划
			getPlanById:getPlanById,//根据年度计划id查找计划信息
			getPlanStatisticsInfo:getPlanStatisticsInfo,//获取年度计划统计信息
			grid_yearPlan_shenbaoInfoList:grid_yearPlan_shenbaoInfoList,//年度计划编制信息列表
			grid_yearPlan_addShenbaoInfoList:grid_yearPlan_addShenbaoInfoList,//年度计划编制新增项目申报列表
			addShenBaoInfoconfirm:addShenBaoInfoconfirm,//年度计划新增项目申报			
			getShenBaoInfoById:getShenBaoInfoById,//根据申报id查找申报信息
			getYearPlanCapitalById:getYearPlanCapitalById,//根据申报id查找年度计划编制信息
			updateYearPlanCapital:updateYearPlanCapital,//更新年度计划编制信息	
			removeYearPlanCapital:removeYearPlanCapital,//移除申报项目
			documentRecordsGird:documentRecordsGird,//批复文件列表
			getUserUnit:getUserUnit,//获取用户单位信息
			exportExcelForYS:exportExcelForYS,//导出印刷版Excel
			savePackageType:savePackageType,//保存打包类型
			updateIsMonthReport:updateIsMonthReport//更新项目是否填写月报
		};
		
		function updateIsMonthReport(vm){
			vm.isSumbit=true;
			var httpOptions = {
					method : 'put',
					url : url_project+"/isMonthReport",
					data : {id:vm.isMonthReportId,isMonthReport:vm.isMonthReport}
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							vm.isSumbit=false;
							//关闭模态框
							$("#myModal_edit").modal('hide');
							common.alert({
								vm:vm,
								msg:"操作成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
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
		 * 保存打包类型
		 */
		function savePackageType(vm){
			//目的：获取当前打包类型最大id值
			var idNum = [];
			var index = 0;
			//获取当前打包类型id尾数集合（因为只为一级目录，所以直接获取）
			for(var i=0;i<vm.basicData.packageType.length;i++){
				var id = vm.basicData.packageType[i].id;
				var idSplit = id.split("_");
				idNum[index+i] = parseInt(idSplit[idSplit.length-1],10);//获取所有子级id最后的一组数字									
			}
			//获取数组中的最大值
			var idNumMax = Math.max.apply(null, idNum);
			//替换掉最后的数值
			var oldId = vm.basicData.packageType[0].id;
			var oldIdSplit = oldId.split("_");
			 oldIdSplit[oldIdSplit.length-1] = idNumMax+1;//将最后的一个元素的值变更为最大值+1
			var newId = oldIdSplit.join("_");
			vm.packageType.id=newId;//最后获取到新增类型的id
			vm.packageType.pId=vm.basicData.packageType[0].pId;
			vm.packageType.identity=vm.basicData.packageType[0].identity;
			vm.packageType.canEdit=vm.basicData.packageType[0].canEdit;
			
			//保存新增的打包类型
			var httpOptions = {
					method : 'post',
					url :url_basicData,
					data:vm.packageType
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.basicData.packageType.push(vm.packageType);//添加用于显示
						vm.model.shenBaoInfo.packageType = vm.packageType.id;//赋值					
						//关闭输入框
						vm.isOtherPackageType = false;
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
		
		/**
		 * 导出印刷版Excel
		 */
		function exportExcelForYS(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_exportExcel+"?planId={0}",vm.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						common.alert({
							vm:vm,
							msg:"导出成功！",
							fn:function(){
								$('.alertDialog').modal('hide');
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
		
		//begin#updateShenBaoInfo 更新申报信息
		function updateShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//处理项目类型、建设单位多选问题
				vm.model.shenBaoInfo.projectType=common.arrayToString(vm.projectTypes,',');
				vm.model.shenBaoInfo.constructionUnit = common.arrayToString(vm.constructionUnits,',');
				//安排资金计算
				vm.model.shenBaoInfo.yearInvestApproval=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastTwoYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear || 0);
				//开工时间&竣工时间的处理
				vm.model.shenBaoInfo.beginDate = (vm.model.shenBaoInfo.beginDate != '')?vm.model.shenBaoInfo.beginDate:null;
				vm.model.shenBaoInfo.endDate = (vm.model.shenBaoInfo.endDate != '')?vm.model.shenBaoInfo.endDate:null;
				var httpOptions = {
						method : 'put',
						url : common.format(url_shenbaoInfoList),
						data:vm.model.shenBaoInfo
					};
			
				var httpSuccess = function success(response) {
					common.alert({
						vm:vm,
						msg:"操作成功！",
						fn:function(){
							$('.alertDialog').modal('hide');
							$('.modal-backdrop').remove();
							vm.isSubmit = false;
							if(vm.isAudit){//如果是审核
								$location.path(url_back_shenbaoInfoList);
							}
						}
					});
				};
			
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
			}else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		//end#updateShenBaoInfo
		
		//begin#createShenBaoInfo 创建申报信息
		function createShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//处理项目类型、建设单位多选问题
				vm.model.shenBaoInfo.projectType=common.arrayToString(vm.projectTypes,',');
				vm.model.shenBaoInfo.constructionUnit = common.arrayToString(vm.constructionUnits,',');
				//申请资金计算
				vm.model.shenBaoInfo.applyYearInvest = common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear || 0]);
				vm.model.shenBaoInfo.applyYearInvest_LastYear = common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear || 0]);
				vm.model.shenBaoInfo.applyYearInvest_LastTwoYear = common.getSum([vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear || 0,vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear || 0]);
				//安排资金计算
				vm.model.shenBaoInfo.yearInvestApproval = common.getSum([vm.model.shenBaoInfo.capitalAP_ggys_TheYear || 0,vm.model.shenBaoInfo.capitalAP_gtzj_TheYear || 0]);
				vm.model.shenBaoInfo.yearInvestApproval_lastYear = common.getSum([vm.model.shenBaoInfo.capitalAP_ggys_LastYear || 0,vm.model.shenBaoInfo.capitalAP_gtzj_LastYear || 0]);
				vm.model.shenBaoInfo.yearInvestApproval_lastTwoYear = common.getSum([vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear || 0,vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear || 0]);
				//开工时间&竣工时间的处理
				vm.model.shenBaoInfo.beginDate = (vm.model.shenBaoInfo.beginDate != '')?vm.model.shenBaoInfo.beginDate:null;
				vm.model.shenBaoInfo.endDate = (vm.model.shenBaoInfo.endDate != '')?vm.model.shenBaoInfo.endDate:null;
				var httpOptions = {
						method : 'post',
						url : url_shenbaoInfoList,
						data:vm.model.shenBaoInfo
					};
			
				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function(){
							common.alert({
								vm:vm,
								msg:"操作成功！",
								fn:function(){
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									vm.isSubmit = false;
									$location.path(url_back_shenbaoInfoList);
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
			}else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		//end#createShenBaoInfo
		
		//begin#getUserUnit
		function getUserUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnitInfo+"?$filter=id eq '{0}'",vm.model.shenBaoInfo.unitName)
				};
			
			var httpSuccess = function success(response) {
				//初始化项目单位信息
				vm.model.shenBaoInfo.shenBaoUnitInfoDto = response.data.value[0]||{};
				if(vm.model.shenBaoInfo.shenBaoUnitInfoDto){
					//初始化建设单位信息
					vm.constructionUnits.splice(0,vm.constructionUnits.length);//清空数组
					vm.constructionUnits.push(vm.model.shenBaoInfo.shenBaoUnitInfoDto.unitName);//添加默认的单位名称
				}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		//end#getUserUnit
		
		//查询批复文件
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
		 * 项目纳入项目库
		 */
		function addProjectToLibrary(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbaoInfoList+"/addProjectToLibrary?shenbaoInfoId={0}",vm.id)
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
		
		/**
		 * 更新项目基本信息
		 */
		function updateProject(vm){
			//处理项目类型多选、建设单位问题
			vm.model.shenBaoInfo.projectType=common.arrayToString(vm.projectTypes,',');
			vm.model.shenBaoInfo.constructionUnit=common.arrayToString(vm.constructionUnits,',');
			
			var httpOptions = {
					method : 'put',
					url : common.format(url_shenbaoInfoList+"/updateProjectBasic"),
					data:vm.model.shenBaoInfo
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
		
		
		/**
		 *更新申报信息的状态 
		 */
		function updateShenBaoInfoState(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_shenbaoInfoList+"/updateState"),
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
								vm.grid.dataSource.read();
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
		
		
		
		function removeYearPlanCapital(vm,yearPlanCapitalId){
			var httpOptions = {
					method : 'post',
					url : common.format(url_planList+"/removeCapital?planId={0}",vm.id),
					data:yearPlanCapitalId
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
			vm.model.capital.capitalSum=common.toDecimal4(
						parseFloat(vm.model.capital.capitalSCZ_ggys || 0)
					   +parseFloat(vm.model.capital.capitalSCZ_gtzj||0)
					   +parseFloat(vm.model.capital.capitalSCZ_zxzj||0)
					   +parseFloat(vm.model.capital.capitalQCZ_ggys||0)
					   +parseFloat(vm.model.capital.capitalQCZ_gtzj||0)
					   +parseFloat(vm.model.capital.capitalSHTZ||0)
					   +parseFloat(vm.model.capital.capitalZYYS||0)
					   +parseFloat(vm.model.capital.capitalOther||0));

			var httpOptions = {
					method : 'put',
					url : url_planCapital,
					data:vm.model.capital
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						//查询年度计划统计数据--更新页面数据
						getPlanStatisticsInfo(vm);
						
						$('#capitalSum_'+vm.currentCapitalId).val(vm.model.capital.capitalSum);
						vm.isPopOver = false;
						vm.planGridOptions.dataSource.read();
					}
				});
				
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
				//进行金额的处理
				vm.model.capital.capitalSCZ_ggys = common.toMoney(vm.model.capital.capitalSCZ_ggys);
				vm.model.capital.capitalSCZ_gtzj = common.toMoney(vm.model.capital.capitalSCZ_gtzj);
				vm.model.capital.capitalSCZ_zxzj = common.toMoney(vm.model.capital.capitalSCZ_zxzj);
				vm.model.capital.capitalQCZ_ggys = common.toMoney(vm.model.capital.capitalQCZ_ggys);
				vm.model.capital.capitalQCZ_gtzj = common.toMoney(vm.model.capital.capitalQCZ_gtzj);
				vm.model.capital.capitalSHTZ = common.toMoney(vm.model.capital.capitalSHTZ);
				vm.model.capital.capitalZYYS = common.toMoney(vm.model.capital.capitalZYYS);
				vm.model.capital.capitalOther = common.toMoney(vm.model.capital.capitalOther);
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
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbaoInfoList + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.shenBaoInfo = response.data.value[0]||{};
						if(vm.shenBaoInfoEdit){//如果是编辑页面
							//年度计划申报年份处理
							vm.planYear = vm.model.shenBaoInfo.planYear;
							vm.isSHInvestment = false;
							vm.isZFInvestment = false;
						}
						//判断项目的投资类型
						if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
							vm.isSHInvestment = true;
							//如果是编辑页面并且为社会投资项目，则项目行业需要进行处理进行显示
							var child = $linq(common.getBasicData())
				        		.where(function(x){return x.id==vm.model.shenBaoInfo.projectIndustry;})
				        		.toArray()[0];
								if(child.pId=="projectIndustry"){
									vm.search.projectIndustryParent=child.id;
								}else{
									vm.search.projectIndustryParent=child.pId;
								}
							vm.projectIndustryChange();
							//投资去处计算（社投）
			    	   		 vm.investTotal=function(){
			    	   			 vm.model.shenBaoInfo.projectInvestSum=common.getSum([vm.model.shenBaoInfo.landPrice||0,vm.model.shenBaoInfo.equipmentInvestment||0,
			  	   				 	 vm.model.shenBaoInfo.buidSafeInvestment||0,vm.model.shenBaoInfo.capitalOther||0]);
			    	   			 return vm.model.shenBaoInfo.projectInvestSum;
			    	   		 };
						}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
							vm.isZFInvestment = true;
						}
						
						if(vm.shenBaoInfoAdd){//如果是新增页面
							//初始化相关数据
				    		vm.model.shenBaoInfo.projectInvestmentType = vm.investmentType;//投资类型
				     		vm.model.shenBaoInfo.projectShenBaoStage = vm.stage;//申报阶段
				    		//初始化申报年份（三年滚动）
							var date = new Date();
							vm.planYear = vm.model.shenBaoInfo.planYear = parseInt(date.getFullYear()+1,10);
						}
						//没有打包类型时默认打包类型为单列项目
						vm.model.shenBaoInfo.packageType=vm.model.shenBaoInfo.packageType || common.basicDataConfig().packageType_danLie;
						//项目类型、建设单位的显示
						vm.projectTypes = common.stringToArray(vm.model.shenBaoInfo.projectType,',');
						vm.constructionUnits = common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
						if(vm.constructionUnits.length >1){//如果建设单位有多个则可以删除
							vm.canDelete = true;
						}else{
							vm.canDelete = false;
						}
						//日期展示
						vm.model.shenBaoInfo.beginDate=common.formatDate(vm.model.shenBaoInfo.beginDate);//开工日期
						vm.model.shenBaoInfo.endDate=common.formatDate(vm.model.shenBaoInfo.endDate);//竣工日期
						vm.model.shenBaoInfo.pifuJYS_date=common.formatDate(vm.model.shenBaoInfo.pifuJYS_date);//项目建议书批复日期			
						vm.model.shenBaoInfo.pifuKXXYJBG_date=common.formatDate(vm.model.shenBaoInfo.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.shenBaoInfo.pifuCBSJYGS_date=common.formatDate(vm.model.shenBaoInfo.pifuCBSJYGS_date);//初步设计与概算批复日期
						//资金处理
						vm.model.shenBaoInfo.projectInvestSum=common.toMoney(vm.model.shenBaoInfo.projectInvestSum);//项目总投资
						vm.model.shenBaoInfo.projectInvestAccuSum=common.toMoney(vm.model.shenBaoInfo.projectInvestAccuSum);//累计完成投资
						vm.model.shenBaoInfo.capitalSCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys);//市财政-公共预算
						vm.model.shenBaoInfo.capitalSCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj);//市财政-国土资金
						vm.model.shenBaoInfo.capitalSCZ_zxzj=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_zxzj);//市财政-专项资金
						vm.model.shenBaoInfo.capitalQCZ_ggys=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_ggys);//区财政-公共预算
						vm.model.shenBaoInfo.capitalQCZ_gtzj=common.toMoney(vm.model.shenBaoInfo.capitalQCZ_gtzj);//区财政-国土资金
						vm.model.shenBaoInfo.capitalZYYS=common.toMoney(vm.model.shenBaoInfo.capitalZYYS);//中央预算
						vm.model.shenBaoInfo.capitalSHTZ=common.toMoney(vm.model.shenBaoInfo.capitalSHTZ);//社会投资
						vm.model.shenBaoInfo.capitalOther=common.toMoney(vm.model.shenBaoInfo.capitalOther);//其他
						//申请资金
						vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear);
						vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear);
						vm.model.shenBaoInfo.capitalSCZ_qita=common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita);
						
						vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear);
						vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear);
						vm.model.shenBaoInfo.capitalSCZ_qita_LastYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastYear);
						
						vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear);
						vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear);
						vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.shenBaoInfo.capitalSCZ_qita_LastTwoYear);
						
						//安排资金
						vm.model.shenBaoInfo.apInvestSum=common.toMoney(vm.model.shenBaoInfo.apInvestSum);//累计安排投资
						vm.model.shenBaoInfo.capitalAP_ggys_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_TheYear);
						vm.model.shenBaoInfo.capitalAP_gtzj_TheYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear);
						vm.model.shenBaoInfo.capitalAP_qita=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita);
						
						vm.model.shenBaoInfo.capitalAP_gtzj_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear);
						vm.model.shenBaoInfo.capitalAP_ggys_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastYear);
						vm.model.shenBaoInfo.capitalAP_qita_LastYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastYear);
						
						vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear);
						vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear);
						vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear=common.toMoney(vm.model.shenBaoInfo.capitalAP_qita_LastTwoYear);
						
					
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalZYYS)||0 )
				  			 		+ (parseFloat(vm.model.shenBaoInfo.capitalOther)||0) ;
				  		 };
				  		 
				  		 //申请资金计算
				  		vm.lastTwoYearCapitalTotal = function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastTwoYear)||0);
				  		};
				  		vm.lastYearCapitalTotal= function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_LastYear)||0);
				  		};
				  		vm.theYearCapitalTotal= function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalSCZ_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalSCZ_gtzj_TheYear)||0);
				  		};
				  		
				  		//安排资金
				  		vm.lastTwoYearAPCapitalTotal = function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear)||0);
				  		};
				  		vm.lastYearAPCapitalTotal= function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear)||0);
				  		};
				  		vm.theYearAPCapitalTotal= function(){
				  			return (parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear)||0) + (parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear)||0);
				  		};
						//如果申报信息的申报阶段为下一年度计划
			  			if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
							 vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
							 vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
			    			   vm.isYearPlan = true;
						}
					}
				});
			}
					
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
					method : 'post',
					url : common.format(url_planList+"/addCapital/{0}",vm.id),
					data:ids
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
					//刷新文字输入长度
					vm.checkLength(vm.model.remark,500,'remarkTips');
				}					
				if(vm.page=='planBZ'){//用于年度计划的编制
					vm.model.plan=response.data.value[0] || {};
					vm.planYear = vm.model.plan.year;//用于编制列表表头年份的绑定
					grid_yearPlan_shenbaoInfoList(vm);//查询年度计划编制中的申报信息列表
				}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getPlanById
		
		/**
		 * 获取年度计划统计信息
		 */
		function getPlanStatisticsInfo(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_planList +"/getStatistics?planId={0}", vm.id)					
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model.yearPlanStatistics = response.data[0] || {};
					}
				});
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getPlanStatisticsInfo
		
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
											"<input type='checkbox'  relId='{0}' projectId='{1}' name='checkbox' class='checkbox'/>",
											item.id,item.projectId);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll_shenBaoList' type='checkbox'  class='checkbox'/>",
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }

					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format('<a href="#/projectDetails/{0}/{1}" >{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
						width:300,
						filterable : false,
						headerAttributes: {
						      "class": "table-header-cell",
						      style: "text-align: center;vertical-align: middle;",
						      rowspan:2
						    }
					},					
					{
						field : "functionSubjects",
						title : "功能科目",
						width:80,
						filterable : false,
						headerAttributes: {
						      "class": "table-header-cell",
						      style: "text-align: center;vertical-align: middle;"
						    }
					},
					{
						field : "econClassSubjects",
						title : "经济分类科目",
						width:100,
						filterable : false,
						headerAttributes: {
						      "class": "table-header-cell",
						      style: "text-align: center;vertical-align: middle;"
						    }
					},
					{
						field : "projectIndustry",
						title : "行业领域",
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						width:100,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 80,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : false,
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
						width : 80,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					      style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "beginDate",
						title : "开工/竣工时间",
						width : 120,
						template:function(item){
							return common.format(
									(common.formatDate(item.beginDate)?common.formatDate(item.beginDate):'')+"~\n"+
									(common.formatDate(item.endDate)?common.formatDate(item.endDate):''));
						},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectGuiMo",
						title : "建设规模及主要建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.projectGuiMo || '');},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width:120,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "projectInvestAccuSum",
						title : "累计完成投资（万元）",
						width:120,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "apInvestSum",
						title : "累计安排资金（万元）",
						width:120,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						field : "yearConstructionContent",
						width:200,
						title:vm.planYear+"年度建设内容",
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContent || ''); },
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						title: vm.planYear+"年资金来源及需求(万元)",
                        columns: [
                        	{
        						field : "capitalSCZ_ggys_TheYear",
        						title : "公共预算",
        						width:100,
        						filterable : false,
        						headerAttributes: {
        					      "class": "table-header-cell",
        					       style: "text-align: center;"
        					    }
        					},
        					{
        						field : "capitalSCZ_gtzj_TheYear",
        						title : "国土基金",
        						width:100,
        						filterable : false,
        						headerAttributes: {
        					      "class": "table-header-cell",
        					       style: "text-align: center;"
        					    }
        					},
        					{
        						field : "capitalSCZ_qita",
        						title : "其他",
        						width:100,
        						filterable : false,
        						headerAttributes: {
        					      "class": "table-header-cell",
        					       style: "text-align: center;"
        					    }
        					}
                        ],
                        headerAttributes: {
  					      "class": "table-header-cell",
  					       style: "text-align: center;vertical-align: middle;"
  					    }
					},
					{
						field : "yearInvestApproval",
						title : "安排资金合计",
						template :function(item){					
							return common.format($('#input').html(),item.id,item.yearInvestApproval || 0);
						},
						width:130,
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						title : "安排资金（万元）",
						columns: [
							{
								field : "capitalAP_ggys_TheYear",
								title : "公共预算",
								width:130,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "capitalAP_gtzj_TheYear",
								title : "国土基金",
								width:130,
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
						field : "yearConstructionContentLastYear",
						title : vm.planYear+1+"年度建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastYear|| ''); },
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
						title: vm.planYear+1+"年资金来源及需求(万元)",
						columns: [
							{
								field : "capitalSCZ_ggys_LastYear",
								title : "公共预算",
								width:100,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "capitalSCZ_gtzj_LastYear",
								title : "国土基金",
								width:100,
								filterable : false,
								headerAttributes: {
							      "class": "table-header-cell",
							       style: "text-align: center;vertical-align: middle;"
							    }
							},
							{
								field : "capitalSCZ_qita_LastYear",
								title : "其他",
								width:100,
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
						field : "yearConstructionContentLastTwoYear",
						title : vm.planYear+2+"年度建设内容",
						width:200,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastTwoYear|| '');},
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					},
					{
                        title: vm.planYear+2+"年资金来源及需求(万元)",
                        columns: [
                        	{
                        		field: "capitalSCZ_ggys_LastTwoYear",
                        		title: "公共预算",
                        		width: 100,
                        		filterable : false,
                        		headerAttributes: {
          					      "class": "table-header-cell",
          					       style: "text-align: center;vertical-align: middle;"
          					    }
	                        },
	                        {
	                            field: "capitalSCZ_gtzj_LastTwoYear",
	                            title: "国土基金",
	                            width: 100,
	                            filterable : false,
                        		headerAttributes: {
          					      "class": "table-header-cell",
          					       style: "text-align: center;vertical-align: middle;"
          					    }
	                        },
	                        {
	                            field: "capitalSCZ_qita_LastTwoYear",
	                            title: "其他",
                            	width: 100,
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
						field : "yearConstructionContentShenBao",
						title : "备注",
						width : 150,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:10px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentShenBao|| ''); },
						filterable : false,
						headerAttributes: {
					      "class": "table-header-cell",
					       style: "text-align: center;vertical-align: middle;"
					    }
					}

			];
			// End:column
			
			var excelExport = function(e) {
					var data = vm.planGrid.dataSource.data();
					var sheet = e.workbook.sheets[0];
					var template = this.columns[8].template;
					
					for(var j=0;j<data.length;j++){
						var timeFormat = template(data[j]);
						var row = sheet.rows[j+2];
						row.cells[4].value = vm.getBasicDataDesc(row.cells[4].value);
						row.cells[5].value = vm.getBasicDataDesc(row.cells[5].value);
						row.cells[6].value = vm.getBasicDataDesc(row.cells[6].value);
						row.cells[7].value = timeFormat;
					}
				  };
				  
			vm.planGridOptions = {
				excel: {
		                fileName: "年度计划编制.xlsx"
		            	},
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				scrollable:true,
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
					field : "projectIndustry",
					dir : "desc"
				},
				filter:[{//申报阶段为下一年度计划
					field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
				},{//审批状态为签收
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
						width : 80,
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width:300,
						filterable : true
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
						filterable : true
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: vm.basicData.projectConstrChar,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
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
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource:vm.basicData.projectIndustry_ZF,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
						}
					},
					{
						field : "auditState",
						title : "审批状态",
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						width : 100,
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource:vm.basicData.auditState,
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
						}
					},
					{
						field : "projectInvestSum",
						title : "总投资（万元）",
						width : 120,
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
						template:function(item){
							return common.formatDateTime(item.createdDate);
							}
					}

			];
			// End:column

			vm.addPlanGridOptions = {	
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
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
		
		/**
		 * 删除年度计划
		 */
		function plan_delete(vm,id){
			vm.isSubmit = true;
			
			var httpOptions = {
					method : 'delete',
					url : url_planList,
					data : id
				};
				
				var httpSuccess = function success(response) {	
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {	
							common.alert({
								vm:vm,
								msg:"操作成功!",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									vm.gridOptions.dataSource.read();//列表数据刷新
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

		return service;
		
		/**
		 * 年度计划政投列表
		 */
		function grid_planList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_planList),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						year:{
							type:"number"
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
					filterable : {
						number: {
							eq: "Equal to",
							neq: "Not equal to",
							gte: "Greater than or equal to",//大于等于
							gt: "Greater than",//大于
							lte: "Less than or equal to",//小于等于
							lt: "Less than"//小于
						},
					}
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
					width : 200,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,"vm.deletePlan('" + item.id + "')");
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
				resizable : true,
				sortable:true,
				scrollable:true
			};

		}// end#fun grid_planList
		
		/**
		 * 政投申报项目列表
		 */
		function grid_shenbaoInfoList(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
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
					field : "projectIndustry",
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
				},{
					field:'projectInvestmentType',
					operator:'eq',
					value:common.basicDataConfig().projectInvestmentType_ZF
				}],
				change:function(){
					var grid = $(".grid").data("kendoGrid");
					window.yearPlanListOptions = grid.getOptions();
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
						template:function(item){
							return common.format("<a href='javascript:void(0)' data-toggle='tooltip' data-placement='right' title='点击查看申报详情' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.id,item.projectName);
						},
						width:200,
						filterable : true,
						attributes: {
					      style: "font-size: 14.5px"
					    },
					    headerAttributes: {
					      style: "text-align:center;font-size: 14.5px"
					    }
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
						filterable : true,
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 105,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 105,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectCategory),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: $linq(common.getBasicData())
			         	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			         	       		.toArray(),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
		                },
		                attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 100,
						filterable : false,
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "auditState",
						title : "审核状态",
						width : 100,
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().auditState),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						filed:"",
						title:"操作",
						width:150,
						template:function(item){
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					}
			];
			// End:column
		  if(window.yearPlanListOptions !=null && window.yearPlanListOptions !=''){
			  vm.gridOptions = window.yearPlanListOptions;
		  }else{
			  vm.gridOptions = {					
			            excel: {
			                fileName: "年度计划项目库.xlsx"
			            },
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
		}// end#fun grid_shenbaoInfoList
		
		/**
		 * 社投申报项目列表
		 */
		function grid_shenbaoInfoListSH(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbaoInfoList),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
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
					field : "projectIndustry",
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
				},{
					field:'projectInvestmentType',
					operator:'eq',
					value:common.basicDataConfig().projectInvestmentType_SH
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
							return common.format("<a href='javascript:void(0)' data-toggle='tooltip' data-placement='right' title='点击查看申报详情' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.id,item.projectName);
						},
						width:200,
						filterable : true,
						attributes: {
					      style: "font-size: 14.5px"
					    },
					    headerAttributes: {
					      style: "text-align:center;font-size: 14.5px"
					    }
					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:200,
						filterable : true,
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectConstrChar",
						title : "建设性质",
						width : 105,
						template:function(item){
							return common.getBasicDataDesc(item.projectConstrChar);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 105,
						template:function(item){
							return common.getBasicDataDesc(item.projectCategory);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectCategory),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "projectIndustry",
						title : "项目行业",
						width : 120,
						template:function(item){
							return common.getBasicDataDesc(item.projectIndustry);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: $linq(common.getBasicData())
			         	       		.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
			         	       		.toArray(),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
							}
		                },
		                attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "planYear",
						title : "计划年度",
						width : 100,
						filterable : false,
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},
					{
						field : "auditState",
						title : "审核状态",
						width : 100,
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().auditState),
			                        dataTextField: "description",
			                        dataValueField: "id",
			                        filter:"startswith"
			                    });
			                }
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					},				
					{
						filed:"",
						title:"操作",
						width:150,
						template:function(item){
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
						},
						attributes: {
						      style: "font-size: 14.5px"
						    },
						    headerAttributes: {
						      style: "text-align:center;font-size: 14.5px"
						    }
					}
			];
			// End:column
		  vm.yearPlanListGridOptionsSH = {					
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true,
				sortable:true,
				scrollable:true
			};
			  
		}// end#fun grid_shenbaoInfoListSH
	}
})();