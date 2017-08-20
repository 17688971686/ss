(function() {
	'use strict';

	angular.module('app').factory('yearPlanSvc', yearPlan);

	yearPlan.$inject = [ '$http','$location'];

	function yearPlan($http,$location) {
		var url_shenbaoInfoList = "/management/shenbao";
		var url_planList="/management/yearPlan";
		var url_planCapital="/management/yearPlanCapital";
		var url_back_planList="#/yearPlan/planList";
		var url_document="/management/replyFile";
		var url_back_shenbaoInfoList="#/yearPlan/shenbaoInfoList";
		
		var service = {
			grid_shenbaoInfoList : grid_shenbaoInfoList,//申报项目列表
			updateShenBaoInfoState:updateShenBaoInfoState,//更新申报信息的状态
			addProjectToLibrary:addProjectToLibrary,//项目纳入项目库
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			updateProject:updateProject,//更新项目基本信息
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
			removeYearPlanCapital:removeYearPlanCapital,//移除申报项目
			documentRecordsGird:documentRecordsGird//批复文件列表
		};
		
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
			vm.model.shenBaoInfo.projectType=common.arrayToString(vm.model.shenBaoInfo.projectType,',');
			vm.model.shenBaoInfo.constructionUnit=common.arrayToString(vm.model.shenBaoInfo.constructionUnit,',');
			var httpOptions = {
					method : 'put',
					url : common.format(url_shenbaoInfoList+"/updateProjectBasic"),
					data:vm.model.shenBaoInfo
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo.constructionUnit=common.stringToArray(vm.model.shenBaoInfo.constructionUnit,',');
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
				common.alert({
					vm:vm,
					msg:"操作成功！",
					fn:function(){
						$('.alertDialog').modal('hide');
						$('.modal-backdrop').remove();
						vm.grid.dataSource.read();
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
		
		function updateShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//处理项目类型、建设单位多选问题
				vm.model.shenBaoInfo.projectType=common.arrayToString(vm.model.shenBaoInfo.projectType,',');
				vm.model.shenBaoInfo.constructionUnit = common.arrayToString(vm.model.shenBaoInfo.constructionUnit,',');
				//安排资金计算
				vm.model.shenBaoInfo.yearInvestApproval=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_TheYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_TheYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastYear || 0);
				vm.model.shenBaoInfo.yearInvestApproval_lastTwoYear=parseFloat(vm.model.shenBaoInfo.capitalAP_ggys_LastTwoYear || 0) + parseFloat(vm.model.shenBaoInfo.capitalAP_gtzj_LastTwoYear || 0);
				var httpOptions = {
						method : 'put',
						url : common.format(url_shenbaoInfoList),
						data:vm.model.shenBaoInfo
					};
			
				var httpSuccess = function success(response) {
					vm.model.shenBaoInfo.constructionUnit=common.stringToArray(vm.model.shenBaoInfo.constructionUnit,',');
					common.alert({
						vm:vm,
						msg:"操作成功！",
						fn:function(){
							$('.alertDialog').modal('hide');
							$('.modal-backdrop').remove();
							vm.isSubmit = false;
							//location.href=url_back_shenbaoInfoList;
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
				vm.model.shenBaoInfo = response.data.value[0]||{};
				//年度计划申报年份处理
				vm.planYear = vm.model.shenBaoInfo.planYear;
				//项目类型、建设单位的显示
				vm.model.shenBaoInfo.projectType = common.stringToArray(vm.model.shenBaoInfo.projectType,',');
				vm.model.shenBaoInfo.constructionUnit=common.stringToArray(vm.model.shenBaoInfo.constructionUnit,",");
				if(vm.model.shenBaoInfo.constructionUnit.length >1){
					vm.canDelete = true;
				}else{
					vm.canDelete = false;
				}
				//判断项目的投资类型
				if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资
					vm.isSHInvestment = true;
				}else if(vm.model.shenBaoInfo.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){//政府投资
					vm.isZFInvestment = true;
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
				vm.model.capitalAP_ggys_TheYear=common.toMoney(vm.model.capitalAP_ggys_TheYear);
				vm.model.capitalAP_gtzj_TheYear=common.toMoney(vm.model.capitalAP_gtzj_TheYear);
				vm.model.capitalAP_qita=common.toMoney(vm.model.capitalAP_qita);
				
				vm.model.capitalAP_gtzj_LastYear=common.toMoney(vm.model.capitalAP_gtzj_LastYear);
				vm.model.capitalAP_ggys_LastYear=common.toMoney(vm.model.capitalAP_ggys_LastYear);
				vm.model.capitalAP_qita_LastYear=common.toMoney(vm.model.capitalAP_qita_LastYear);
				
				vm.model.capitalAP_ggys_LastTwoYear=common.toMoney(vm.model.capitalAP_ggys_LastTwoYear);
				vm.model.capitalAP_gtzj_LastTwoYear=common.toMoney(vm.model.capitalAP_gtzj_LastTwoYear);
				vm.model.capitalAP_qita_LastTwoYear=common.toMoney(vm.model.capitalAP_qita_LastTwoYear);
				
			
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
		  		if(vm.page=='shenbaoInfoList'){//如果为列表页时--申报详情链接
		  			if(vm.model.shenBaoInfo.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
						 vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
						 vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
		    			   vm.isYearPlan = true;
					}
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
					vm.model.ChuBeiTotal = 0;
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
						if(obj.projectConstrChar && obj.projectConstrChar == common.basicDataConfig().projectConstrChar_chubei){//储备类
							vm.model.ChuBeiTotal ++;
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll_shenBaoList' type='checkbox'  class='checkbox'/>"

					},
					{
						field : "constructionUnit",
						title : "建设单位",
						width:120,
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
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContent || ''); },
						filterable : false
					},
					{
						field : "capitalSCZ_ggys_TheYear",
						title : "资金需求及资金来源--公共预算（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_gtzj_TheYear",
						title : "资金需求及资金来源--国土基金（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_qita",
						title : "资金需求及资金来源--其他（万元）",
						width:100,
						filterable : false
					},
					{
						field : "planYear+1",
						title : "计划年度",
						width:100,
						filterable : false
					},
					{
						field : "yearConstructionContentLastYear",
						title : "本年度建设内容",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastYear|| ''); },
						filterable : false
					},
					{
						field : "capitalSCZ_ggys_LastYear",
						title : "资金需求及资金来源--公共预算（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_gtzj_LastYear",
						title : "资金需求及资金来源--国土基金（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_qita_LastYear",
						title : "资金需求及资金来源--其他（万元）",
						width:100,
						filterable : false
					},
					{
						field : "planYear+2",
						title : "计划年度",
						width:100,
						filterable : false
					},
					{
						field : "yearConstructionContentLastTwoYear",
						title : "本年度建设内容",
						width:120,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastTwoYear|| '');},
						filterable : false
					},
					{
						field : "capitalSCZ_ggys_LastTwoYear",
						title : "资金需求及资金来源--公共预算（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_gtzj_LastTwoYear",
						title : "资金需求及资金来源--国土基金（万元）",
						width:100,
						filterable : false
					},
					{
						field : "capitalSCZ_qita_LastTwoYear",
						title : "资金需求及资金来源--其他（万元）",
						width:100,
						filterable : false
					},
//					{
//						field : "yearInvestApproval",
//						title : "安排资金（万元）",
//						width:100,
//						filterable : false
//					},
					{
						field : "yearInvestApproval",
						title : "安排资金（万元）",
						template :function(item){					
							return common.format($('#input').html(),item.id,item.yearInvestApproval || 0);
						},
						width:130,
						filterable : false
					},
					{
						field : "yearConstructionContentShenBao",
						title : "备注",
						width : 150,
						template:function(item){return common.format('<span style="text-overflow:ellipsis;width:10px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentShenBao|| ''); },
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
				filter:[{//申报阶段为下一年度计划
					field:'projectShenBaoStage',
					operator:'eq',
					value:common.basicDataConfig().projectShenBaoStage_nextYearPlan
				},{//审批状态为签收
					field:'processState',
					operator:'eq',
					value:common.basicDataConfig().processState_qianShou
				},{//审核状态为审核通过
					field:'auditState',
					operator:'eq',
					value:common.basicDataConfig().auditState_auditPass
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
						field : "constructionUnit",
						title : "建设单位",
						width:200,
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
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
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
							return common.format("<a href='javascript:void(0)' ng-click='vm.dialog_shenbaoInfo(\"{0}\")'>{1}</a>",item.id,item.projectName);
						},
						filterable : true
					},
					{
						field : "constructionUnit",
						title : "建设单位",
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
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "projectCategory",
						title : "项目类别",
						width : 120,
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
						field : "planYear",
						title : "计划年度",
						width : 100,
						filterable : false
					},
					{
						field : "auditState",
						title : "审核状态",
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.auditState);
						},
						filterable : {
							ui: function(element){
			                    element.kendoDropDownList({
			                        valuePrimitive: true,
			                        dataSource: common.getBacicDataByIndectity(common.basicDataConfig().auditState),
			                        dataTextField: "description",
			                        dataValueField: "id"
			                    });
			                }
						}
					},
					{
						field : "isIncludLibrary",
						title : "项目是否纳入项目库",
						width : 150,
						template:function(item){
							if(item.isIncludLibrary){
								return "已纳入";
							}else{
								return "未纳入";
							}
						},
						filterable :true
					},
					{
						field : "projectInvestSum",
						title : "总投资(万元)",
						width : 100,
						filterable : false
					},{
						field : "applyYearInvest",
						title : "申请年度投资(万元)",
						width : 100,
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
					},
					{
						filed:"",
						title:"操作",
						width:150,
						template:function(item){
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage);
						}
					}
			];
			// End:column
			var excelExport = function(e) {
			    var sheet = e.workbook.sheets[0];

			    for (var i = 1; i < sheet.rows.length; i++) {
			      var row = sheet.rows[i];
			      row.cells[2].value = common.getBasicDataDesc(row.cells[2].value);//建设性质
			      row.cells[3].value = common.getBasicDataDesc(row.cells[3].value);//项目类别
			      row.cells[4].value = common.getBasicDataDesc(row.cells[4].value);//项目分类
				  row.cells[6].value = common.getBasicDataDesc(row.cells[6].value);//审核状态
				  if(row.cells[7].value){//项目是否纳入项目库
					  row.cells[7].value = "已纳入";
				  }else{
					  row.cells[7].value = "未纳入";
				  }
				  row.cells[10].value = common.formatDateTime(row.cells[10].value);//创建日期
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