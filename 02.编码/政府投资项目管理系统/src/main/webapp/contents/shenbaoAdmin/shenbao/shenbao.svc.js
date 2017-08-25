(function() {
	'use strict';

	angular.module('app').factory('shenbaoSvc', shenbao);

	shenbao.$inject = ['$http','$compile','$location'];	
	function shenbao($http,$compile,$location) {
		var url_project = "/shenbaoAdmin/project";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_shenbao = "/shenbaoAdmin/shenbao";
		var url_back = "/shenbao_records";
		var url_document="/shenbaoAdmin/replyFile";
		var url_backToProjectList="/shenbao";
		
		var service = {
			grid : grid,//项目列表
			getProjectById:getProjectById,//根据id查询项目信息
			projectShenBaoRecordsGird:projectShenBaoRecordsGird,//根据项目代码查询项目申报信息列表
			createShenBaoInfo:createShenBaoInfo,//创建申报信息
			recordsGird:recordsGird,//所有的申报记录列表
			getShenBaoInfoById:getShenBaoInfoById,//根据id查询项目申报信息
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			documentRecordsGird:documentRecordsGird,//批复文件列表
			getShenBaoInfoByProjectId:getShenBaoInfoByProjectId//根据项目id查询申报信息
		};		
		return service;
		
		
		/**
		 * 根据项目id查询申报信息
		 */
		function getShenBaoInfoByProjectId(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=projectId eq '{0}'", vm.projectId)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoInfoRecords = response.data.value;
				 var list = [];
				 //判断申报记录中的申报阶段，防止多次申报同一阶段
	        	   if(vm.model.shenBaoInfoRecords.length >0){
	        		   for (var i = 0; i < vm.model.shenBaoInfoRecords.length; i++) {
	   	           			list.push(vm.model.shenBaoInfoRecords[i].projectShenBaoStage);
	   					}
	        		   if(list.indexOf(vm.projectShenBaoStage)>-1 && vm.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
	    	        	   vm.massage = "下一年度计划已申报！";
	    	        	   vm.isHased = true;
	    	           }else{
	    	        	   vm.isHased = false;
	    	           }
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
		 * 根据项目代码查询项目的申报记录
		 */
		function getShenBaoRecordsByProjectNumber(vm,projectNumber,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=projectNumber eq '{0}'", projectNumber)
				};
			
			var httpSuccess = function success(response) {
				vm.model.shenBaoRecords = response.data.value;
				if(vm.model.shenBaoRecords.length>0){
					var number = 0;
					for(var i=0;i<vm.model.shenBaoRecords.length;i++){
						var shenBaoRecord = vm.model.shenBaoRecords[i];
						if(shenBaoRecord.processState == common.basicDataConfig().processState_tuiWen){//如果是退文
							number += 1;
						}
					}
					if(number>0){
						$("#tuiwenNumber"+id).html(number);//添加提示徽章
					}
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
		 * 查询申报记录列表
		 */
		function projectShenBaoRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),						
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
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
						field : "projectName",
						title : "项目名称",
						width:200,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
						},
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
						field : "projectShenBaoStage",
						title : "申报阶段",	
						width : 150,
						template:function(item){
							return common.getBasicDataDesc(item.projectShenBaoStage);
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
						field : "",
						title : "操作",
						width : 200,
						template : function(item) {					
							var isShow=item.processState==common.basicDataConfig().processState_waitQianShou
							   ||item.processState==common.basicDataConfig().processState_tuiWen;
							return common.format($('#columnBtns_Record').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none');
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
				resizable : true
			};
		}
				
		/**
		 * 更新申报信息
		 */
		function updateShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.projectType = common.arrayToString(vm.model.projectType,',');
				vm.model.constructionUnit = common.arrayToString(vm.model.constructionUnit,',');
				var httpOptions = {
					method : 'put',
					url : url_shenbao,
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
									$(".modal-backdrop").remove();
									$location.path(url_backToProjectList);
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
		}//end#updateShenBaoInfo
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)
				};
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0]||{};
					
					//查询项目的所属单位的单位名称
				   	getProjectUnit(vm);
					//多选框、建设单位回显						
					vm.model.projectType = common.stringToArray(vm.model.projectType,',');
					vm.model.constructionUnit = common.stringToArray(vm.model.constructionUnit,',');
					if(vm.model.constructionUnit.length >1){
						vm.canDelete = true;
					}else{
						vm.canDelete = false;
					}
					//日期展示
					vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
					vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
					vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
					vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
					vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期						
					//资金处理（TODO这一块可以不需要了）
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
					
					vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请年度投资
					vm.model.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.capitalSCZ_gtzj_TheYear);
					vm.model.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.capitalSCZ_ggys_TheYear);
					vm.model.capitalSCZ_qita =common.toMoney(vm.model.capitalSCZ_qita);
					
					vm.model.applyYearInvest_LastYear=common.toMoney(vm.model.applyYearInvest_LastYear);//申请下年度投资
					vm.model.capitalSCZ_gtzj_LastYear=common.toMoney(vm.model.capitalSCZ_gtzj_LastYear);
					vm.model.capitalSCZ_ggys_LastYear=common.toMoney(vm.model.capitalSCZ_ggys_LastYear);
					vm.model.capitalSCZ_qita_LastYear=common.toMoney(vm.model.capitalSCZ_qita_LastYear);
					
					vm.model.applyYearInvest_LastTwoYear=common.toMoney(vm.model.applyYearInvest_LastTwoYear);//申请下下年度投资
					vm.model.capitalSCZ_gtzj_LastTwoYear=common.toMoney(vm.model.capitalSCZ_gtzj_LastTwoYear);
					vm.model.capitalSCZ_ggys_LastTwoYear=common.toMoney(vm.model.capitalSCZ_ggys_LastTwoYear);
					vm.model.capitalSCZ_qita_LastTwoYear=common.toMoney(vm.model.capitalSCZ_qita_LastTwoYear);
					
					vm.model.apInvestSum = common.toMoney(vm.model.apInvestSum);//累计安排资金
					
					//计算资金筹措总计
					vm.capitalTotal=function(){
						return common.getSum([
							vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
							vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
							vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
							vm.model.capitalOther||0
						]);
			  		 };
			  		 
			  		//下下年度申请资金
			  		vm.lastTwoYearCapitalTotal = function(){
			  			return vm.model.applyYearInvest_LastTwoYear=common.getSum([vm.model.capitalSCZ_ggys_LastTwoYear||0,vm.model.capitalSCZ_gtzj_LastTwoYear||0]);
			  		};
			  		//下年度申请资金
			  		vm.lastYearCapitalTotal= function(){
			  			return vm.model.applyYearInvest_LastYear=common.getSum([vm.model.capitalSCZ_ggys_LastYear||0,vm.model.capitalSCZ_gtzj_LastYear||0]);
			  		};
			  		//本年度申请资金
			  		vm.theYearCapitalTotal= function(){
			  			return vm.model.applyYearInvest=common.getSum([vm.model.capitalSCZ_ggys_TheYear||0,vm.model.capitalSCZ_gtzj_TheYear||0]);
			  		};
			  		
					if(vm.page=='record'){//如果是申报信息详情页面
						if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
							vm.isYearPlan = true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
		    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}
					}
	        		if(vm.page=='record_edit' && vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){
	        			//项目行业归口
						var child = $linq(common.getBasicData()).where(function(x){return x.id==vm.model.projectIndustry;}).toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();			        	
	        		}
	        		vm.planYear = vm.model.planYear;//初始化申报年份（三年滚动）
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		
		/**
		 * 创建申报信息
		 */
		function createShenBaoInfo(vm){
			//申请资金计算
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.projectType = common.arrayToString(vm.model.projectType,',');
				vm.model.constructionUnit = common.arrayToString(vm.model.constructionUnit,',');
				var httpOptions = {
					method : 'post',
					url : url_shenbao,
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功,等待管理员签收！",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();									
									$location.path(url_backToProjectList);
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
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "/userName?$filter=id eq '{0}'", vm.model.unitName)
				};
			
			var httpSuccess = function success(response) {
				var userUnit = response.data.value[0] || {};
				if(vm.page=='edit' || vm.page=='record_edit'){//新建申报信息填报页面或编辑页面
					if(vm.page=='edit'){
						vm.model.shenBaoUnitInfoDto = userUnit;//初始化申报单位
						vm.model.constructionUnit.push(vm.model.shenBaoUnitInfoDto.unitName);//初始化建设单位为申报单位
					}
					if(vm.page=='record_edit'){
						vm.model.shenBaoUnitInfoDto.unitName = userUnit.unitName;
					}
					if(vm.model.constructionUnit.length >1){
						vm.canDelete = true;
					}else{
						vm.canDelete = false;
					}
				}
				if(vm.page=='record'){//如果详情页面
					vm.model.unitName = userUnit.unitName;
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
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				
				//初始化处理建设单位
        		vm.model.constructionUnit = [];
				//获取项目单位信息（用于设置申报单位信息、建设单位信息）
				getProjectUnit(vm);
				
				if(vm.page=='edit'){//如果为申报信息填写页面
					//多选框回显						
					vm.model.projectType = common.stringToArray(vm.model.projectType,',');
					//日期展示处理
					vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
					vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
					vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
					vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
					vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期 					
					//资金处理
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
					
					vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请年度投资
					vm.model.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.capitalSCZ_gtzj_TheYear);//本年度国土
					vm.model.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.capitalSCZ_ggys_TheYear);//本年度公共预算
					vm.model.capitalSCZ_qita=common.toMoney(vm.model.capitalSCZ_qita);//本年度其他资金
					
					vm.model.applyYearInvest_LastYear=common.toMoney(vm.model.applyYearInvest_LastYear);//申请下年度投资
					vm.model.capitalSCZ_gtzj_LastYear =common.toMoney(vm.model.capitalSCZ_gtzj_LastYear);//下年度国土
					vm.model.capitalSCZ_ggys_LastYear =common.toMoney(vm.model.capitalSCZ_ggys_LastYear);//下年度公共预算
					vm.model.capitalSCZ_qita_LastYear =common.toMoney(vm.model.capitalSCZ_qita_LastYear);//下年度其他资金
					
					vm.model.applyYearInvest_LastTwoYear=common.toMoney(vm.model.applyYearInvest_LastTwoYear);//申请下下年度投资					
					vm.model.capitalSCZ_gtzj_LastTwoYear =common.toMoney(vm.model.capitalSCZ_gtzj_LastTwoYear);//下下年度国土
					vm.model.capitalSCZ_ggys_LastTwoYear =common.toMoney(vm.model.capitalSCZ_ggys_LastTwoYear);//下下年度公共预算
					vm.model.capitalSCZ_qita_LastTwoYear =common.toMoney(vm.model.capitalSCZ_qita_LastTwoYear);//下下年度其他资金
					
					vm.model.apInvestSum = common.toMoney(vm.model.apInvestSum);//累计安排资金
					//计算资金筹措总计
					vm.capitalTotal=function(){
						return common.getSum([
							vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
							vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
							vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
							vm.model.capitalOther||0
						]);
			  		 };
			  		 //下下年度申请资金
			  		vm.lastTwoYearCapitalTotal = function(){
			  			return vm.model.applyYearInvest_LastTwoYear=common.getSum([vm.model.capitalSCZ_ggys_LastTwoYear||0,vm.model.capitalSCZ_gtzj_LastTwoYear||0]);
			  		};
			  		//下年度申请资金
			  		vm.lastYearCapitalTotal= function(){
			  			return vm.model.applyYearInvest_LastYear=common.getSum([vm.model.capitalSCZ_ggys_LastYear||0,vm.model.capitalSCZ_gtzj_LastYear||0]);
			  		};
			  		//本年度申请资金
			  		vm.theYearCapitalTotal= function(){
			  			return vm.model.applyYearInvest=common.getSum([vm.model.capitalSCZ_ggys_TheYear||0,vm.model.capitalSCZ_gtzj_TheYear||0]);
			  		};
			  		//基础数据--行业归口
			  		  if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			 			  
			 			var child = $linq(common.getBasicData())
			 				.where(function(x){return x.id==vm.model.projectIndustry;})
			 				.toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();
			 		   }							
					vm.model.projectId = vm.model.id;//申报信息中的字段数据录入
					//初始化申报年份（三年滚动）
					var date = new Date();
					vm.planYear = vm.model.planYear = parseInt(date.getFullYear()+1);
				}
				vm.model.projectShenBaoStage = vm.stage;//申报信息中的字段数据录入	
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 单位申报记录列表数据获取
		 */
		function recordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao+"/unit"),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
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
					field : "projectName",
					title : "项目名称",
					template:function(item){
						return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.projectId,item.projectInvestmentType,item.projectName);
					},
					filterable : true
					
				},
				{
					field : "processState",
					title : "审批状态",	
					width : 150,
					template:function(item){
						var processStateDesc=common.getBasicDataDesc(item.processState);
						var css='text-danger';
						return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
					},
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: common.getBacicDataByIndectity(common.basicDataConfig().processState),
	                            dataTextField: "description",
	                            dataValueField: "id"
	                        });
						}
					}
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
					field : "projectShenBaoStage",
					title : "申报阶段",	
					width : 150,
					template:function(item){
						return common.getBasicDataDesc(item.projectShenBaoStage);
					},
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage),
	                            dataTextField: "description",
	                            dataValueField: "id"
	                        });
						}
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
						var isShow=item.processState==common.basicDataConfig().processState_waitQianShou
								   ||item.processState==common.basicDataConfig().processState_tuiWen;
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none');
					}
				}
			];
			// End:column

			vm.gridOptions_records = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//End recordsGird
		
		/**
		 * 单位项目最新版本列表数据
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitProject")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
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
				filter:{
					field:'isLatestVersion',
					operator:'eq',
					value:true
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
					filterable : true,
					template:function(item){
						return common.format('<a href="#/project/projectInfo/{0}/{1}">{2}</a>',item.id,item.projectInvestmentType,item.projectName);
					}
				},
				{
					field : "unitName",
					title : "所属单位",
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
					}
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
					template:function(item){
						if(item.isIncludLibrary){
							return '已纳入';
						}else{
							return '未纳入';
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
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,common.repSign(item.projectName),item.projectNumber);
					}

				}

			];
			// End:column
			var dataBound = function(e){
				var dataSource = e.sender._data;
				for(var i=0;i<dataSource.length;i++){
					var model = dataSource[i];
					//根据项目代码获取其申报记录根据情况添加徽章
					getShenBaoRecordsByProjectNumber(vm,model.projectNumber,model.id);				
				}
			};


			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				dataBound:dataBound,
				resizable : true
			};

		}// end fun grid
		
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


	}
})();