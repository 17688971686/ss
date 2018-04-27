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
		var url_sysConfig="/sys/getSysConfig";
		var url_backToProjectList="/shenbao";
		
		var service = {
			grid : grid,//项目列表
			getProjectById:getProjectById,//根据id查询项目信息
			projectShenBaoRecordsGird:projectShenBaoRecordsGird,//根据项目代码查询项目申报信息列表
			createShenBaoInfo:createShenBaoInfo,//创建申报信息
			recordsGird:recordsGird,//所有的申报记录列表
			getShenBaoInfoById:getShenBaoInfoById,//根据id查询项目申报信息
			updateShenBaoInfo:updateShenBaoInfo,//更新申报信息
			deleteShenBaoInfo:deleteShenBaoInfo,//删除申报信息
			documentRecordsGird:documentRecordsGird,//批复文件列表
			getShenBaoInfoByProjectId:getShenBaoInfoByProjectId,//根据项目id查询申报信息
			getShenBaoPortState:getShenBaoPortState,//查询申报端口的状态哦
			getUserUnit:getUserUnit
		};		
		return service;
		
		/**
		 * 公共资金处理方法
		 */
		function fundsFormat(vm){
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
			
			vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请第一年年度投资
			vm.model.capitalSCZ_gtzj_TheYear =common.toMoney(vm.model.capitalSCZ_gtzj_TheYear);
			vm.model.capitalSCZ_ggys_TheYear =common.toMoney(vm.model.capitalSCZ_ggys_TheYear);
			vm.model.capitalSCZ_qita =common.toMoney(vm.model.capitalSCZ_qita);
			vm.model.applyYearInvest_LastYear=common.toMoney(vm.model.applyYearInvest_LastYear);//申请第二年度投资
			vm.model.capitalSCZ_gtzj_LastYear=common.toMoney(vm.model.capitalSCZ_gtzj_LastYear);
			vm.model.capitalSCZ_ggys_LastYear=common.toMoney(vm.model.capitalSCZ_ggys_LastYear);
			vm.model.capitalSCZ_qita_LastYear=common.toMoney(vm.model.capitalSCZ_qita_LastYear);
			vm.model.applyYearInvest_LastTwoYear=common.toMoney(vm.model.applyYearInvest_LastTwoYear);//申请第三年度投资
			vm.model.capitalSCZ_gtzj_LastTwoYear=common.toMoney(vm.model.capitalSCZ_gtzj_LastTwoYear);
			vm.model.capitalSCZ_ggys_LastTwoYear=common.toMoney(vm.model.capitalSCZ_ggys_LastTwoYear);
			vm.model.capitalSCZ_qita_LastTwoYear=common.toMoney(vm.model.capitalSCZ_qita_LastTwoYear);
			
			vm.model.apInvestSum = common.toMoney(vm.model.apInvestSum);//累计安排资金
			
			//社投专用
			vm.model.landPrice=common.toMoney(vm.model.landPrice);//总投资--地价（社投）
			vm.model.equipmentInvestment=common.toMoney(vm.model.equipmentInvestment);//总投资--设备投资（社投）
			vm.model.buidSafeInvestment=common.toMoney(vm.model.buidSafeInvestment);//总投资--建安投资（社投）
		}//end fun fundsFormat
		
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
		 * 删除申报信息
		 */
		function deleteShenBaoInfo(vm,id){
			vm.isSubmit=true;
			var httpOptions = {
					method : 'post',
					url :url_shenbao+'/deleteShenbao',
					data:id   
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						common.alert({
							vm : vm,
							msg : "删除成功！",
							fn : function() {
								vm.isSubmit=false;
								$('.alertDialog').modal('hide');
								$(".modal-backdrop").remove();
								if(vm.isRecordsDelete){
									vm.gridOptions_records.dataSource.read();
								}else{
									//$location.path(url_backToProjectList);
									location.href="javascript:window.history.back(-1)";
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
		}
		
		/**
		 * 查询申报端口状态
		 * @param id 项目id
		 * @param projectInvestmentType 项目投资类型--用于跳转申报信息录入页面
		 * @param name 项目名称--用于模态框的显示
		 */
		function getShenBaoPortState(vm,id,projectInvestmentType,name){
			var httpOptions = {
					method : 'get',
					url : common.format(url_sysConfig + "?configName={0}", common.basicDataConfig().taskType_shenBao)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response : response,
					fn:function(){
						vm.sysConfing = response.data;
						if(vm.sysConfing.enable){
							vm.projectId = id;//绑定项目id用于url
	   	           			vm.projectInvestmentType=projectInvestmentType;//绑定项目投资类型用于url
		   	           		vm.projectName=name;//绑定项目名称用于模态框显示
		   	           		vm.projectShenBaoStage='';//清空下拉选选中的值
		   	           		vm.massage='';//情况提醒消息
		   	           		vm.isHased = false;//设置确认按钮是否可以点击
		   	           		vm.isZFInvestment=false;//为了申报阶段的展示
		   	           		vm.isSHInvestment=false;
		   	           		//如果是社会投资类型，模态框中就只展示下一年度计划申报阶段
		   	           		if(projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){
		   	           			vm.isZFInvestment=true;
		   	           		}else if(projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){
		   	           			vm.isSHInvestment=true;
		   	           		}
			   	   	   		//展示模态框
				   	          $("#myModal").modal({
						        backdrop: 'static',
						        keyboard:true
				        	   });
			    		   }else{
			    			   common.alert({
			   					vm:vm,
			   					msg:"申报端口已关闭,请联系管理人员!"
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
		 * 根据项目id查询申报信息
		 */
		function getShenBaoInfoByProjectId(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=projectId eq '{0}'", vm.projectId)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response : response,
					fn:function(){
						vm.model.shenBaoInfoRecords = response.data.value;
						 //判断申报记录中的申报阶段，防止多次申报同一阶段
			        	   if(vm.model.shenBaoInfoRecords.length >0){
			        		   vm.isHased = false;
			        		   vm.model.shenBaoInfoRecords.every(function(value,index){
			        			   var shenBaoRecordStage = value.projectShenBaoStage;
			        			   if(shenBaoRecordStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
			        				   var nowDate = new Date();
			        				   var nowYear = nowDate.getFullYear();
			        				   if(nowYear+1 == value.planYear){
			        					   vm.isHased = vm.projectShenBaoStage==shenBaoRecordStage?true:false;
			        				   }
			        			   }else{
			        				   vm.isHased = vm.projectShenBaoStage==shenBaoRecordStage?true:false;
			        			   }
			        			   if(vm.isHased){
			        				   vm.massage=vm.getBasicDataDesc(shenBaoRecordStage)+"已申报!";
			        				   return false;
			        			   }
		        				   return true;
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
		 * 根据项目代码查询项目的申报记录
		 * @param projectNumber 项目代码
		 * @param id 用于需找到对应的徽章元素
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
						if(shenBaoRecord.processState == common.basicDataConfig().processState_notpass){//如果是退文
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
		 * 查询项目申报记录列表
		 */
		function projectShenBaoRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao),						
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
					title : "<input id='checkboxAll_projectShenBaoRecords' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "projectName",
					title : "项目名称",
					width:250,
					template:function(item){
						return common.format('<a class="text-primary" href="#/project/projectInfo/{0}">{1}</a>',item.projectId,item.projectName);
					},
					filterable : false						
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
					width : 200,
					template : function(item) {					
						var isShow=item.processStage==common.basicDataConfig().processStage_tianbao||item.processState==common.basicDataConfig().processState_notpass||item.processState==common.basicDataConfig().processState_tuiwen
							||(item.processStage==common.basicDataConfig().processStage_qianshou && item.processState != common.basicDataConfig().processState_pass);
						return common.format($('#columnBtns_Record').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none',"vm.deleteShenBaoInfo('"+item.id+"')");
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
				//项目有关时间清空处理
				vm.model.beginDate = (vm.model.beginDate != '')?vm.model.beginDate:null;
				vm.model.endDate = (vm.model.endDate != '')?vm.model.endDate:null;
				//资金处理：没有就设置为0存储到数据库
				fundsFormat(vm);

				var httpOptions = {
					method : 'post',
					url : url_shenbao+'/updateShenbao',
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
									location.href="javascript:window.history.back(-1)";
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
					
					
					if(vm.page=='record'){//如果為申報詳情頁面
						if(vm.model.projectInvestmentType == common.basicDataConfig().projectInvestmentType_ZF){
							vm.isZFInvestment = true; 
						}else if(vm.model.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){
							vm.isSHInvestment = true; 
						}
						if(vm.model.projectShenBaoStage ==common.basicDataConfig().projectShenBaoStage_projectProposal){//申报阶段为:项目建议书
							vm.isProjectProposal=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_projectProposal;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_KXXYJBG){//申报阶段为:可行性研究报告
							vm.isKXXYJBG=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_CBSJYGS){//申报阶段为:初步设计与概算
							vm.isCBSJYGS=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
							vm.isYearPlan = true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
		    			    vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_capitalApplyReport){//申报阶段为:资金申请报告
							vm.isCapitalApplyReport=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_capitalApplyReport;
						}else if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_jihuaxiada){//申报阶段为:计划下达
							vm.isJihuaxiada=true;
							vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_jihuaxiada;
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
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.projectType = common.arrayToString(vm.model.projectType,',');
				vm.model.constructionUnit = common.arrayToString(vm.model.constructionUnit,',');
				//申请资金计算
				fundsFormat(vm);
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
								msg : "操作成功,开始审批流程！",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();									
									location.href="javascript:window.history.back(-1)";
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
					url : common.format(url_userUnit + "/id?$filter=id eq '{0}'", vm.model.unitName)
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
				
        		vm.model.constructionUnit = [];//初始化处理建设单位用于申报信息的数据录入
				getProjectUnit(vm);//获取项目单位信息（用于设置申报单位信息、建设单位信息）
				
				if(vm.page=='edit'){//如果为申报信息填写页面
					vm.model.projectType = common.stringToArray(vm.model.projectType,',');//多选框回显	
					//日期展示处理
					vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
					vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
					vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
					vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
					vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期 					
					
			  		//基础数据--行业归口
			  		  if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资			 			  
			 			var child = $linq(common.getBasicData())
			 				.where(function(x){return x.id==vm.model.projectIndustry;})
			 				.toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();
			 		   }						
					vm.model.projectId = vm.model.id;//申报信息中的字段数据录入
					vm.model.projectShenBaoStage = vm.stage;//申报信息中的字段数据录入
					var now = new Date();
					vm.model.planYear=vm.model.projectShenBaoStage==common.basicDataConfig().projectShenBaoStage_nextYearPlan?parseInt(now.getFullYear()+1,10):parseInt(now.getFullYear(),10);
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
		 * 单位申报记录列表数据获取
		 */
		function recordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao+"/unit"),
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
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>",
					headerAttributes: {
				      "class": "table-header-cell",
				      style: "text-align: center;vertical-align: middle;"
					}
				},
				{
					field : "constructionUnit",
					title : "建设单位",
					width:200,
					filterable : true,
					headerAttributes: {
				      "class": "table-header-cell",
				      style: "text-align: center;vertical-align: middle;"
					}

				},
				{
					field : "projectName",
					title : "项目名称",
					width:300,
					template:function(item){
						return common.format('<a class="text-primary" href="#/project/projectInfo/{0}">{1}</a>',item.projectId,item.projectName);
					},
					filterable : true,
					headerAttributes: {
				      "class": "table-header-cell",
				      style: "text-align: center;vertical-align: middle;"
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
					filterable : false,
					width:100,
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
					width : 110,
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
					template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.projectGuiMo); },
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
					field : "planYear",
					title : "计划年度",
					width:100,
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "yearConstructionContent",
					title : "本年度建设内容",
					width:200,
					template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContent || ''); },
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					title: "年资金来源及需求(万元)",
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
					field : "planYear+1",
					title : "计划年度",
					width:100,
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "yearConstructionContentLastYear",
					title : "本年度建设内容",
					width:200,
					template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastYear|| ''); },
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					title: "年资金来源及需求(万元)",
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
					field : "planYear+2",
					title : "计划年度",
					width:100,
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "yearConstructionContentLastTwoYear",
					title : "本年度建设内容",
					width:120,
					template:function(item){return common.format('<span style="text-overflow:ellipsis;width:120px;overflow:hidden;white-space:nowrap;" title="{0}">{0}</span>',item.yearConstructionContentLastTwoYear|| '');},
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
                    title:"年资金来源及需求(万元)",
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
					field : "processStage",
					title : "审批阶段",	
					width : 150,
					template:function(item){
						var processStateDesc=common.getBasicDataDesc(item.processStage);
						var css='text-danger';
						return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
					},
					filterable : {
						ui: function(element){
	                        element.kendoDropDownList({
	                            valuePrimitive: true,
	                            dataSource: common.getBacicDataByIndectity(common.basicDataConfig().processStage),
	                            dataTextField: "description",
	                            dataValueField: "id",
	                            filter:"startswith"
	                        });
						}
					},
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "processState",
					title : "审批状态",	
					width : 150,
					template:function(item){
						var processStateDesc=common.getProcessStateDesc(item.processState);
						var css='text-danger';
						return common.format("<span class='{1}'>{0}</span>",processStateDesc,css);
					},
					filterable : false,
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "auditState",
					title : "审核状态",	
					width : 120,
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
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				},
				{
					field : "",
					title : "操作",
					width : 200,
					template : function(item) {
						var isShow=item.processStage==common.basicDataConfig().processStage_tianbao||item.processState==common.basicDataConfig().processState_notpass||item.processState==common.basicDataConfig().processState_tuiwen
							||(item.processStage==common.basicDataConfig().processStage_qianshou && item.processState != common.basicDataConfig().processState_pass);
						return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,item.projectShenBaoStage,isShow?'':'display:none');
					},
					headerAttributes: {
				      "class": "table-header-cell",
				       style: "text-align: center;vertical-align: middle;"
				    }
				}
			];
			// End:column
			
			var excelExport = function(e) {
				var data = e.data;
				var sheet = e.workbook.sheets[0];
				var template = this.columns[8].template;
			
				for(var j=0;j<data.length;j++){
					var timeFormat = template(data[j]);
					var row = sheet.rows[j+2];//从第三行开始
					row.cells[4].value = common.getBasicDataDesc(row.cells[4].value);//行业领域
					row.cells[5].value = common.getBasicDataDesc(row.cells[5].value);//项目类别
					row.cells[6].value = common.getBasicDataDesc(row.cells[6].value);//建设性质
					row.cells[7].value = timeFormat;
					row.cells[27].value = common.getBasicDataDesc(row.cells[27].value);//审批阶段
					row.cells[28].value = common.getProcessStateDesc(row.cells[28].value);//审批阶段
					row.cells[29].value = common.getBasicDataDesc(row.cells[29].value);//审核状态     
				}			
			  };

			vm.gridOptions_records = {
				excel: {
	                fileName: "申报记录.xlsx"
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
						return common.format('<a class="text-primary" href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName);
					}
				},
				{
					field : "unitName",
					title : "所属单位",
					width:200,
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
					width : 150,
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
				resizable : true,
				scrollable:true
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
				resizable : true,
				sortable:true,
				scrollable:true
			};
		}


	}
})();