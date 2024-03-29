(function() {
	'use strict';

	angular
	.module('app')
	.controller('shenbaoCtrl', shenbao);

	shenbao.$inject = ['$location', 'shenbaoSvc', '$state', '$scope', '$sce' ];

	function shenbao($location, shenbaoSvc, $state, $scope, $sce) {
		/* jshint validthis:true */
		var vm = this;
		vm.id = $state.params.id;//获取url上面的id参数
		vm.investmentType = $state.params.projectInvestmentType;//获取url上面的项目投资类型参数
		vm.stage = $state.params.stage;//获取url上面的申报阶段参数
		vm.model = {};
		vm.basicData = {};
		vm.search = {};
		vm.sysConfig = {};
		vm.page = 'list';
		vm.title = '申报信息录入';
		//vm.projectInfo = {};
		$scope.animationsEnabled = true;

		$(".menu li a").removeClass("focus");
		$(".menu li a:eq(3)").addClass("focus");

		$(".menu li a").click(function() {
			$(".menu li a").removeClass("focus");
			$(this).addClass("focus");
		});

		vm.init = function() {
			if ($state.current.name == 'shenbao_edit') {//申报信息填写
				vm.page = 'edit';
			}
			if ($state.current.name == 'shenbao_records') {//所有的申报信息记录
				vm.page = 'records';
			}
			if ($state.current.name == 'shenbao_record') {//单条申报信息详情
				vm.page = 'record';
				$(".modal-backdrop").remove();//去除模态框跳转页面之后遗留背景色
			}
			if ($state.current.name == 'shenbao_record_edit') {//申报信息编辑
				vm.page = 'record_edit';
			}
			vm.getBasicDataDesc = function(Str) {
				return common.getBasicDataDesc(Str);
			};

            vm.getBasicDataComment = function (str) {//获取基础数据comment
                return common.getBasicDataComment(str);
            };


			vm.checkLength = function(obj, max, id) {
				common.checkLength(obj, max, id);
			};

			vm.html = function(val) {
				return $sce.trustAsHtml(val);
			};

			vm.getUnitName = function(unitId) {
				return common.getUnitName(unitId);
			};
			
			shenbaoSvc.getUserUnit(vm);

			//资金统计方法
			//项目资金筹措总计
			vm.capitalTotal = function() {
				return common.getSum([ vm.model.capitalSCZ_ggys || 0,
						vm.model.capitalSCZ_gtzj || 0,
						vm.model.capitalSCZ_zxzj || 0,
						vm.model.capitalQCZ_ggys || 0,
						vm.model.capitalQCZ_gtzj || 0,
						vm.model.capitalSHTZ || 0, vm.model.capitalZYYS || 0,
						vm.model.capitalOther || 0 ]);
			};
			//第一年度申请资金累计
			vm.theYearCapitalTotal = function() {
				vm.model.applyYearInvest = common.getSum([
						vm.model.capitalSCZ_ggys_TheYear || 0,
						vm.model.capitalSCZ_gtzj_TheYear || 0 ]);
				return vm.model.applyYearInvest;
			};
			//第二年度申请资金累计
			vm.lastTwoYearCapitalTotal = function() {
				vm.model.applyYearInvest_LastTwoYear = common.getSum([
						vm.model.capitalSCZ_ggys_LastTwoYear || 0,
						vm.model.capitalSCZ_gtzj_LastTwoYear || 0 ]);
				return vm.model.applyYearInvest_LastTwoYear;
			};
			//第三年度申请资金累计
			vm.lastYearCapitalTotal = function() {
				vm.model.applyYearInvest_LastYear = common.getSum([
						vm.model.capitalSCZ_ggys_LastYear || 0,
						vm.model.capitalSCZ_gtzj_LastYear || 0 ]);
				return vm.model.applyYearInvest_LastYear;
			};
			//计划下达申请资金累计
			vm.sqPlanReachTotal = function() {
				return common.getSum([ vm.model.sqPlanReach_ggys || 0,
						vm.model.sqPlanReach_gtzj || 0 ]);
			}

			//删除申报记录
			vm.deleteShenBaoInfo = function(id) {
				//获取当前页面的url
				var url = $location.url();
				if (url == "/shenbao_records") {//如果是申报记录列表页面
					vm.isRecordsDelete = true;
				} else if (url == "/shenbao") {//如果是项目申报记录列表模态框页面
					$("#shenBaoRecords").modal('hide');//列表申报记录模态框关闭
					$(".modal-backdrop").remove();//去除模态框背景色
				}
				common.confirm({
					vm : vm,
					msg : "确认要删除此申报信息吗？",
					fn : function() {
						$('.confirmDialog').modal('hide');
						$(".modal-backdrop").remove();
						shenbaoSvc.deleteShenBaoInfo(vm, id);
					}
				});
			};

			//全选框选择
			$(document).on(
					'click',
					'#checkboxAll_projectShenBaoRecords',
					function() {
						var isSelected = $(this).is(':checked');
						$('.shenBaoRecordsGrid').find('tr td:nth-child(1)')
								.find('input:checkbox').prop('checked',
										isSelected);
					});

			//用于查询、申报--基础数据
			vm.basicData.projectStage = common.getBacicDataByIndectity(common
					.basicDataConfig().projectStage);//项目阶段
			vm.basicData.projectShenBaoStage = [];//项目建设性质
			
			vm.projectShenBaoStage = common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段用于模态框
			
			for (var i = 0; i < vm.projectShenBaoStage.length; i++) {
				var array_element = vm.projectShenBaoStage[i];
				if(array_element.id=="projectShenBaoStage_1" || array_element.id=="projectShenBaoStage_5" ){
					vm.projectShenBaoStage.splice(i,1);
				}
				
			}
			vm.basicData.projectShenBaoStage = vm.projectShenBaoStage;

			vm.basicData.shenBaoStageForZF = [
					common.basicDataConfig().projectShenBaoStage_projectProposal,
					common.basicDataConfig().projectShenBaoStage_KXXYJBG,
					common.basicDataConfig().projectShenBaoStage_CBSJYGS,
					common.basicDataConfig().projectShenBaoStage_capitalApplyReport,
					common.basicDataConfig().projectShenBaoStage_nextYearPlan,
					common.basicDataConfig().projectShenBaoStage_soucijihuaxiada];
			vm.basicData.shenBaoStageForSH = [ common.basicDataConfig().projectShenBaoStage_nextYearPlan ];
			vm.basicData.projectType = common.getBacicDataByIndectity(common
					.basicDataConfig().projectType);//项目类型   			   			       		   		
			vm.basicData.projectCategory = common
					.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
            vm.basicData.urgencyState = common.getBacicDataByIndectity(common.basicDataConfig().fileSet);//紧急类型
			vm.basicData.projectConstrChar = common
					.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
			vm.basicData.unitProperty = common.getBacicDataByIndectity(common
					.basicDataConfig().unitProperty);//单位性质
            //vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
			vm.basicData.processState = [{id:0,description:"未开始"},{id:1,description:"进行中"},{id:2,description:"审批通过"},{id:3,description:"转办他人"},{id:4,description:"审批不通过"},{id:5,description:"退文"}];//审批状态
			vm.basicData.auditState = common.getBacicDataByIndectity(common
					.basicDataConfig().auditState);//审核状态
			vm.basicData.investmentType = common.getBacicDataByIndectity(common
					.basicDataConfig().projectInvestmentType);//项目投资类型
			vm.basicData.projectIndustryAll = common
					.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
			vm.basicData.projectIndustry_ZF = $linq(common.getBasicData())
					.where(
							function(x) {
								return x.identity == common.basicDataConfig().projectIndustry
										&& x.pId == common.basicDataConfig().projectIndustry_ZF;
							}).toArray();//政府投资项目行业
			vm.basicData.projectIndustry_SH = $linq(common.getBasicData())
					.where(
							function(x) {
								return x.identity == common.basicDataConfig().projectIndustry
										&& x.pId == common.basicDataConfig().projectIndustry_SH;
							}).toArray();//社会投资项目行业
			vm.basicData.projectClassify_ZF = $linq(common.getBasicData())
					.where(
							function(x) {
								return x.identity == common.basicDataConfig().projectClassify
										&& x.pId == common.basicDataConfig().projectClassify_ZF;
							}).toArray();//政府投资项目分类
			vm.basicData.projectClassify_SH = $linq(common.getBasicData())
					.where(
							function(x) {
								return x.identity == common.basicDataConfig().projectClassify
										&& x.pId == common.basicDataConfig().projectClassify_SH;
							}).toArray();//社会投资项目分类
			vm.basicData.area_Street = $linq(common.getBasicData()).where(
					function(x) {
						return x.identity == common.basicDataConfig().area
								&& x.pId == common.basicDataConfig().area_GM;
					}).toArray(); //行政区划街道
			vm.basicData.userUnit = common.getUserUnits();//获取所有单位
			//国民经济行业分类
			vm.basicData.nationalIndustry = common
					.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
			vm.nationalIndustryChange = function() {
				vm.basicData.nationalIndustryChildren = $linq(
						common.getBasicData())
						.where(
								function(x) {
									return x.identity == common
											.basicDataConfig().projectGoverEconClassify
											&& x.pId == vm.model.nationalIndustryParent;
								}).toArray();
			}
		};

		activate();
		function activate() {
			vm.init();
			if (vm.page == 'list') {//项目信息列表页
				page_list();
			}
			if (vm.page == 'edit') {//项目申报填报页
				page_edit();
			}
			if (vm.page == 'records') {//申报记录列表页
				page_records();
			}
			if (vm.page == 'record') {//申报信息详情页
				page_record();
			}
			if (vm.page == 'record_edit') {//申报信息编辑页
				vm.isRecordEdit = true;
				vm.title = "申报信息编辑";
				page_edit();
				page_record();
			}
		}

		function page_list() {
			shenbaoSvc.projectShenBaoRecordsGird(vm);      //获取项目申报记录
            shenbaoSvc.projectUpdateShenBaoRecordsGird(vm);//获取项目代码查询暂存项目申报信息列表
			//条件查询
			vm.search = function() {
				var filters = [];
				filters.push({
					field : 'isLatestVersion',
					operator : 'eq',
					value : true
				});//默认条件--查询最新版本的项目

				if (vm.search.projectName != null
						&& vm.search.projectName != '') {//查询条件--项目名称
					filters.push({
						field : 'projectName',
						operator : 'contains',
						value : vm.search.projectName
					});
				}
				if (vm.search.projectStage != null
						&& vm.search.projectStage != '') {//查询条件--项目阶段
					filters.push({
						field : 'projectStage',
						operator : 'eq',
						value : vm.search.projectStage
					});
				}
				if (vm.search.isIncludLibrary != null
						&& vm.search.isIncludLibrary != null) {//查询条件--是否纳入项目酷
					if (vm.search.isIncludLibrary == "true") {
						filters.push({
							field : 'isIncludLibrary',
							operator : 'eq',
							value : true
						});
					} else if (vm.search.isIncludLibrary == "false") {
						filters.push({
							field : 'isIncludLibrary',
							operator : 'eq',
							value : false
						});
					}
				}
				if (vm.search.unitName != null && vm.search.unitName != '') {//查询条件--项目所属单位
					filters.push({
						field : 'unitName',
						operator : 'eq',
						value : vm.search.unitName
					});
				}
				if (vm.search.projectIndustry != null
						&& vm.search.projectIndustry != '') {//查询条件--项目行业类型
					filters.push({
						field : 'projectIndustry',
						operator : 'eq',
						value : vm.search.projectIndustry
					});
				}
				if (vm.search.projectInvestmentType != null
						&& vm.search.projectInvestmentType != '') {//查询条件--项目投资类型
					filters.push({
						field : 'projectInvestmentType',
						operator : 'eq',
						value : vm.search.projectInvestmentType
					});
				}
				vm.gridOptions.dataSource.filter(filters);
			};
			//条件查询--项目行业父级发生变化
			vm.searchIndustryFatherChange = function() {
				vm.searchIndustryIsZF = false;
				vm.searchIndustryIsSH = false;
				vm.searchIndustryChild = false;
				if (vm.searchIndustryFather == common.basicDataConfig().projectIndustry_ZF) {
					vm.searchIndustryIsZF = true;
				} else if (vm.searchIndustryFather == common.basicDataConfig().projectIndustry_SH) {
					vm.searchIndustryIsSH = true;
				}
			};
			//条件查询--项目行业子集发生变化
			vm.searchIndustryChildChange = function() {
				vm.searchIndustryChild = false;
				if (vm.search.projectIndustryChild != null
						&& vm.search.projectIndustryChild != '') {
					vm.basicData.projectIndustryChild_SH = $linq(
							common.getBasicData())
							.where(
									function(x) {
										return x.identity == common
												.basicDataConfig().projectIndustry
												&& x.pId == vm.search.projectIndustryChild;
									}).toArray();//社会投资项目行业子集
					vm.searchIndustryChild = true;
				}
			};
			//清空查询条件
			vm.filterClear = function() {
				location.reload();
			};

			//点击列表中的申报按钮
			vm.shenbaoBtn = function(id) {
				shenbaoSvc.getShenBaoPortStateForYearPlan(vm,id);//查询申报端口状态
			};

			//判断是申报前修改还是提交走申报流程
			vm.isUpdate = function(shenbaoId,zong_processId){
                var isUpdate,h1,h2;
				if(shenbaoId && shenbaoId != 'null' && shenbaoId != ''){
					h1 = true;
				}else{
					h1 = false;
				}
				if(zong_processId && zong_processId != 'null' && zong_processId != ''){
					h2 = true;
				}else{
					h2 = false;
				}
                if(h2){
                    isUpdate = false;
                }
				if(h1==false && h2 ==false){
                    isUpdate = false;
				}
				if(h1==true && h2 ==false){
                    isUpdate = true;
				}
                return isUpdate;
			};
			
			//查询审批附件
			vm.getApprovalAtts = function(id) {
				shenbaoSvc.getApprovalAtts(vm, id);//查询审批附件
			};
			
			//审批的附件类型
			vm.approvalAttsType = common.uploadFileTypeConfig().approvalAttsType;
			
			/****************************************************************上传附件 begin**********************************************************************************************************//* 
	    	//相关附件文件上传文件种类
	   		vm.uploadSuccess=function(e){
				var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
                     angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                         $scope.$apply(function() {
                             if(vm.approvalAtts){
                                 vm.approvalAtts.push({
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 });
                             } else {
                                 vm.approvalAtts = [{
                                     name: fileObj.originalFilename,
                                     url: fileObj.randomName,
                                     type: type
                                 }];
                             }
                         });
                     })
	           		 // var fileName=e.XMLHttpRequest.response;
	           		 // $scope.$apply(function(){
	           			//  if(vm.approvalAtts){
	           			// 	vm.approvalAtts.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			//  }else{
	           			// 	vm.approvalAtts=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			//  }
	           		 // });
	           	 }
	   		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

	   		//相关附件上传配置
	   		vm.uploadOptions={
				async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
                success:vm.uploadSuccess,
				error:vm.uploadError,
				localization:{select:'上传文件'},
				showFileList:false,
				multiple:true,
				validation: {
	                maxFileSize: common.basicDataConfig().uploadSize
	            },
	            select:vm.onSelect
	   		};
	   		
	   		//删除上传文件
			vm.delFile=function(idx){
				var file = vm.approvalAtts[idx];
				if(file){
					vm.approvalAtts.splice(idx,1);
				}
		    };  	
	         
		    //选择上传文件验证文件大小
			vm.onSelect=function(e){
				$.each(e.files, function (index, value) {
			        if(value.size > common.basicDataConfig().uploadSize){
			        	$scope.$apply(function(){
			   				common.alert({
				        		vm : vm,
								msg : "上传文件过大！"
				            });               			           			
			      		 });
			        }
			        
			    });
			}; 
			
			*//****************************************************************上传附件 end**********************************************************************************************************//* */

			/*vm.saveApprovalAttDtos = function(){
				vm.projectInfo.attachmentDtos = vm.projectInfo.attachmentDtos.concat(vm.approvalAtts);
				shenbaoSvc.saveApprovalAttDtos(vm);
			}*/
			
			//模态框中申报阶段下拉选发生变化时
			vm.changeShenBaoStage = function() {
				vm.massage = '';
				shenbaoSvc.getShenBaoInfoByProjectId(vm);//查询项目申报记录验证是否已有申报
			};
			//撤销申报
			vm.reback = function(name,processId) {
				if (name == "") {
					$(".shenBaoRecords").modal('hide');
					common.alert({
						vm : vm,
						msg : "没有申报或已经撤销，无法撤销！",
						fn : function() {
							vm.isSubmit = false;
							$('.alertDialog').modal('hide');
						}
					});
				}else if (name == "usertask1" || name == "usertask2") {
					shenbaoSvc.reback(vm,processId);
				}else {
					$(".shenBaoRecords").modal('hide');
					common.alert({
						vm : vm,
						msg : "申报已被签收，无法撤销！",
						fn : function() {
							vm.isSubmit = false;
							$('.alertDialog').modal('hide');
						}
					});
				}
			}
			//点击模态框的确认按钮
			// vm.confirm = function() {
			// 	$('#myModal').modal('hide');
			// 	$(".modal-backdrop").remove(); //去掉模态框背面的阴影
			//
			// 	shenbaoSvc.getShenBaoPortStateForYearPlan(vm);
			//
			// };
			//点击列表中的申报记录按钮
			vm.checkShenBaoRecords = function(id) {
				//展示模态框
				$("#shenBaoRecords").modal({
					backdrop : 'static',
					keyboard : true
				});
				vm.projectId = id;
				//根据项目代码查询项目的申报记录 	  
				vm.gridOptions_shenBaoRecords.dataSource.filter({
					field : 'projectId',
					operator : 'eq',
					value : vm.projectId
				});
				vm.gridOptions_shenBaoRecords.dataSource.read();
			};

            //点击列表中的更新或提交按钮
            vm.updateShenBaoRecords = function(id) {
                //展示模态框
                $("#UpdateShenBaoRecords").modal({
                    backdrop : 'static',
                    keyboard : true
                });
                vm.projectId = id;
                //根据项目代码查询项目的申报记录
                var filters = [];
                filters.push({field:'projectId',operator:'eq',value:vm.projectId});//项目id
                vm.grid_Update_shenBaoRecords.dataSource.filter(filters);
                vm.grid_Update_shenBaoRecords.dataSource.read();
            };

			//批量删除申报记录
			vm.deleteShenBaoInfos = function() {
				var selectIds = common.getKendoCheckId('.shenBaoRecordsGrid');
				if (selectIds.length == 0) {
					alert('请选择数据!');
				} else {
					var ids = [];
					for (var i = 0; i < selectIds.length; i++) {
						ids.push(selectIds[i].value);
					}
					var idStr = ids.join(',');
					vm.deleteShenBaoInfo(idStr);
				}
			};
		}//end#page_list

		function page_edit() {
			
			//页面初始化
			var init_page = function() {
				vm.isProjectProposal = vm.stage == common.basicDataConfig().projectShenBaoStage_projectProposal;//申报阶段为:项目建议书
				vm.isKXXYJBG = vm.stage == common.basicDataConfig().projectShenBaoStage_KXXYJBG;//申报阶段为:可行性研究报告
				vm.isCBSJYGS = vm.stage == common.basicDataConfig().projectShenBaoStage_CBSJYGS;//申报阶段为:初步设计与概算
				vm.isCapitalApplyReport = vm.stage == common.basicDataConfig().projectShenBaoStage_capitalApplyReport;//申报阶段为:资金申请报告
				vm.isJihuaxiada = vm.stage == common.basicDataConfig().projectShenBaoStage_soucijihuaxiada;//申报阶段为:计划下达
				vm.isYearPlan = vm.stage == common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为:下一年度计划

				//申报材料初始化
				vm.materialsType = vm.isProjectProposal ? common
						.uploadFileTypeConfig().projectShenBaoStage_projectProposal
						: vm.isKXXYJBG ? common.uploadFileTypeConfig().projectShenBaoStage_KXXYJBG
								: vm.isCBSJYGS ? common.uploadFileTypeConfig().projectShenBaoStage_CBSJYGS
										: vm.isCapitalApplyReport ? common
												.uploadFileTypeConfig().projectShenBaoStage_capitalApplyReport
												: vm.isJihuaxiada ? common
														.uploadFileTypeConfig().projectShenBaoStage_jihuaxiada
														: vm.isYearPlan ? common
																.uploadFileTypeConfig().projectShenBaoStage_YearPlan
																: [];
				vm.uploadType = vm.isYearPlan ? [ [ 'JYS', '立项文件' ],
						[ 'KXXYJBG', '可行性研究报告' ], [ 'CBSJYGS', '初步设计与概算' ],['ZJSQBG','资金申请报告批复'] ]
						: [];

				//初始化tab--禁止点击Tab切换
				$("#tab1").attr("disabled", "true");
				$("#tab2").attr("disabled", "true");
				$("#tab3").attr("disabled", "true");

				$("#tab4").attr("disabled", "true");//下一年度计划单独页面
				$("#tab5").attr("disabled", "true");//竣工决算单独页面
				$("#tab6").attr("disabled", "true");//资金申请报告单独页面
				$("#tab7").attr("disabled", "true");//计划下达单独页面
			};
			//初始化基础数据
			var init_basicData = function() {
				if (vm.investmentType == common.basicDataConfig().projectInvestmentType_ZF) {//如果为政府投资
					vm.isZFInvestment = true;
					vm.basicData.projectClassify = vm.basicData.projectClassify_ZF;//基础数据--项目分类
					vm.basicData.projectIndustry = vm.basicData.projectIndustry_ZF;//基础数据--行业归口
				} else if (vm.investmentType == common.basicDataConfig().projectInvestmentType_SH) {//如果为社会投资
					vm.isSHInvestment = true;
					vm.basicData.projectClassify = vm.basicData.projectClassify_SH; //基础数据--项目分类
					vm.basicData.projectIndustry = vm.basicData.projectIndustry_SH;//基础数据--行业归口
					vm.projectIndustryChange = function() {//行业发生变化时触发		
						vm.basicData.projectIndustryChildren = $linq(
								common.getBasicData())
								.where(
										function(x) {
											return x.identity == common
													.basicDataConfig().projectIndustry
													&& x.pId == vm.model.projectIndustryParent;
										}).toArray();
					};
				}
			};

			init_page();
			init_basicData();
			//申报年份发生变化时触发
			vm.changeYear = function() {
				vm.planYear = parseInt(vm.model.planYear, 10);//以10进制格式化申报年度
			};

			if (vm.page == 'edit') {//如果为申报信息填报
				shenbaoSvc.getProjectById(vm);
			}

			//获取项目类型， 多选
			vm.updateSelection = function(id) {
				var index = vm.model.projectType.indexOf(id);
				if (index == -1) {
					vm.model.projectType.push(id);
				} else {
					vm.model.projectType.splice(index, 1);
				}
			};
			//展示批复文件选择模态框
			vm.choseDocument = function(e) {
				vm.pifuType = $(e.target).parents('.uploadBox').attr(
						'data-type');
				$("#documentRecords").modal({
					backdrop : 'static',
					keyboard : false
				});
				vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
			};
			shenbaoSvc.documentRecordsGird(vm);//查询批复文件

			//批复文件选择模态框确认
			vm.pifuChoseConfirm = function() {
				//关闭模态框
				$("#documentRecords").modal('hide');
				$(".modal-backdrop").remove();
				//获取选择框中的信息
				var select = common.getKendoCheckId('.grid');
				var fileName = select[0].value;
				if (fileName) {
					var file = common.stringToArray(fileName, ",");
					var number = file[0];
					var name = file[1];
					var url = file[2];
					vm.model['pifu' + vm.pifuType + '_wenhao'] = number;
					if (vm.model.attachmentDtos) {
						vm.model.attachmentDtos.push({
							name : name,
							url : url,
							type : vm.pifuType
						});
					} else {
						vm.model.attachmentDtos = [ {
							name : name,
							url : url,
							type : vm.pifuType
						} ];
					}
				}
			};

			//文件上传
			vm.uploadSuccess = function(e) {
				var type = $(e.sender.element).parents('.uploadBox').attr(
						'data-type');
				if (e.XMLHttpRequest.status == 200) {
                    angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                        $scope.$apply(function() {
                            if (vm.model.attachmentDtos){
                                vm.model.attachmentDtos.push({
                                    name: fileObj.originalFilename,
                                    url: fileObj.randomName,
                                    type: type
                                });
                            } else {
                                vm.model.attachmentDtos = [{
                                    name: fileObj.originalFilename,
                                    url: fileObj.randomName,
                                    type: type
                                }];
                            }
                        });
                    })
					// var fileName = e.XMLHttpRequest.response;
					// $scope.$apply(function() {
					// 	if (vm.model.attachmentDtos) {
					// 		vm.model.attachmentDtos.push({
					// 			name : fileName.split('_')[2],
					// 			url : fileName,
					// 			type : type
					// 		});
					// 	} else {
					// 		vm.model.attachmentDtos = [ {
					// 			name : fileName.split('_')[2],
					// 			url : fileName,
					// 			type : type
					// 		} ];
					// 	}
					// });
				}
			};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

			vm.onSelect = function(e) {
				$.each(e.files, function(index, value) {
					if (value.size > common.basicDataConfig().uploadSize) {
						$scope.$apply(function() {
							common.alert({
								vm : vm,
								msg : "上传文件过大！"
							});
						});
					}

				});
			};
			//批复文件上传配置
			vm.uploadOptions_pifu = {
				async : {
					saveUrl : '/common/save',
					removeUrl : '/common/remove',
					autoUpload : true
				},
                success:vm.uploadSuccess,
                error:vm.uploadError,
				localization : {
					select : '上传文件'
				},
				showFileList : false,
				multiple : false,
				validation : {
					maxFileSize : common.basicDataConfig().uploadSize
				},
				select : vm.onSelect
			};
			//相关附件上传配置
			vm.uploadOptions = {
				async : {
					saveUrl : '/common/save',
					removeUrl : '/common/remove',
					autoUpload : true
				},
                success:vm.uploadSuccess,
                error:vm.uploadError,
				localization : {
					select : '上传文件'
				},
				showFileList : false,
				multiple : true,
				validation : {
					maxFileSize : common.basicDataConfig().uploadSize
				},
				select : vm.onSelect
			};

			//删除上传文件
			vm.delFile = function(idx) {
				var file = vm.model.attachmentDtos[idx];
				if (file) {//删除上传文件的同时删除批复文号
					var pifuType = file.type;
					vm.model['pifu' + pifuType + '_wenhao'] = "";
					vm.model.attachmentDtos.splice(idx, 1);
				}
			};

			//tab切换(上一步)
			vm.tabReturn = function(tabId) {
				var activeTab = $("#tab" + tabId);
				vm.tabStrip.activateTab(activeTab);
			};

			//tab切换(下一步)
			vm.tabChange = function(tabId) {
				//验证表单
				common.initJqValidation();
				var isValid = $('form').valid();
				var activeTab = $("#tab" + tabId);
				if (isValid) {//通过则跳转到下一页面
					if(tabId == '4' ){

                        if(vm.model.attachmentDtos == undefined ||
                            vm.model.attachmentDtos.length == 0) {

                            common.confirm({
                                vm: vm,
                                msg: "确认不再上传审批资料？",
                                fn: function () {
                                    $('.confirmDialog').modal('hide');
                                    $(".modal-backdrop").remove();
                                    vm.tabStrip.activateTab(activeTab);
                                }
                            });
                        }else{
                        	var typelist = [];
                        	var atts = vm.model.attachmentDtos;
                        	for(var i=0;i<atts.length;i++){
								typelist.push(atts[i].type);
							}
							if(typelist.indexOf("JYS") == -1){
                                common.confirm({
                                    vm: vm,
                                    msg: "确认不上传项目建议书批复吗？",
                                    fn: function () {
                                        $('.confirmDialog').modal('hide');
                                        $(".modal-backdrop").remove();
                                        vm.tabStrip.activateTab(activeTab);
                                    }
                                });
							}
                            if(typelist.indexOf("CBSJYGS") == -1){
                                common.confirm({
                                    vm: vm,
                                    msg: "确认不上传初步设计与概算批复吗？",
                                    fn: function () {
                                        $('.confirmDialog').modal('hide');
                                        $(".modal-backdrop").remove();
                                        vm.tabStrip.activateTab(activeTab);
                                    }
                                });
                            }
                            if(typelist.indexOf("KXXYJBG") == -1){
                                common.confirm({
                                    vm: vm,
                                    msg: "确认不上传可行性研究报告批复吗？",
                                    fn: function () {
                                        $('.confirmDialog').modal('hide');
                                        $(".modal-backdrop").remove();
                                        vm.tabStrip.activateTab(activeTab);
                                    }
                                });
                            }
                            if(typelist.indexOf("ZJSQBG") == -1){
                                common.confirm({
                                    vm: vm,
                                    msg: "确认不上传资金申请报告批复吗？",
                                    fn: function () {
                                        $('.confirmDialog').modal('hide');
                                        $(".modal-backdrop").remove();
                                        vm.tabStrip.activateTab(activeTab);
                                    }
                                });
                            }
                            if(typelist.indexOf("KXXYJBG") != -1 && typelist.indexOf("CBSJYGS") != -1 && typelist.indexOf("JYS") != -1 && typelist.indexOf("ZJSQBG") != -1){
                                vm.tabStrip.activateTab(activeTab);
							}
						}

					}else{
                        vm.tabStrip.activateTab(activeTab);
					}

				}
			};
			//添加建设单位
			vm.addUnit = function() {
				if (vm.model.constructionUnit.constructor == String) {
					vm.model.constructionUnit = common
							.stringToArray(vm.model.constructionUnit);
				}
				vm.model.constructionUnit.push('');
				if (vm.model.constructionUnit.length > 1) {
					vm.canDelete = true;
				}
			};
			//删除建设单位
			vm.deleteUnit = function(idx) {
				if (vm.canDelete) {
					vm.model.constructionUnit.splice(idx, 1);
					if (vm.model.constructionUnit.length <= 1) {
						vm.canDelete = false;
					}
				}
			};

			//确认提交
			vm.submit = function(flag) { //flag 1为暂存，2为提交
				vm.model.isUpdateOrSubmit = flag;
				var hasAtts = false;
				var t1 = false;
				var t2= false;
				var t3 = false;
				var t4 = false;
				var t5 = false;
				var t6 = false;
				var t7 = false;
				var t8 = false;
			
				for (var i = 0; i < vm.model.attachmentDtos.length; i++) {
					var att = vm.model.attachmentDtos[i];
					if(att.type=="ApplyReport_pdf"){
						t1 = true;
					}else if(att.type=="ApplyReport_word"){
						t2 = true;
					}else if(att.type=="ProjectBasis"){
						t3 = true;
					}else if(att.type=="XMSQGW"){
						t4 = true;
					}else if(att.type=="ProjectProPosalReply_Scanning"){
						t5 = true;
					}else if(att.type=="BudgetReply_Scanning"){
						t6 = true;
					}else if(att.type=="IssuedReplyFile_Scanning"){
						t7 = true;
					}else if(att.type=="LastYearPlanReply_Copy"){
						t8 = true;
					}
				}
				if(vm.isProjectProposal&&t1&&t2){
					hasAtts = true;
				}else if(vm.isKXXYJBG&&t1&&t2){
					hasAtts = true;
				}else if(vm.isCBSJYGS&&t1&&t2){
					hasAtts = true;
				}else if(vm.isCapitalApplyReport&&t1&&t2&&t4){
					hasAtts = true;
				}else if(vm.isJihuaxiada&&t1&&t2&&t3&&t6&&t7&&t8){
					hasAtts = true;
				}else if(vm.isYearPlan){
					hasAtts = true;
				}else{
					hasAtts = false;
				}
				if(!hasAtts){
					common.alert({
						vm : vm,
						msg : "请上传必要的文件后提交！",
						fn : function() {
							$('.alertDialog').modal('hide');
						}
					});
				}else{
					shenbaoSvc.getShenBaoInfoByProjectId(vm);
				}
			};
		}//end#page_edit

		function page_records() {
			shenbaoSvc.recordsGird(vm);
			//条件查询
			vm.search = function() {
				var filters = [];
				if (vm.search.projectName != null
						&& vm.search.projectName != '') {
					filters.push({
						field : 'projectName',
						operator : 'contains',
						value : vm.search.projectName
					});
				}
				if (vm.search.projectShenBaoStage != null
						&& vm.search.projectShenBaoStage != '') {
					filters.push({
						field : 'projectShenBaoStage',
						operator : 'eq',
						value : vm.search.projectShenBaoStage
					});
				}
				if (vm.search.planYear != null && vm.search.planYear != '') {
					filters.push({
						field : 'planYear',
						operator : 'eq',
						value : parseInt(vm.search.planYear, 10)
					});
				}
				if (vm.search.unitName != null
						&& vm.search.unitName != '') {
					filters.push({
						field : 'unitName',
						operator : 'contains',
						value : vm.search.unitName
					});
				}
				if (vm.search.processState != null
						&& vm.search.processState != '') {
					filters.push({
						field : 'processState',
						operator : 'eq',
						value : Number(vm.search.processState)
					});
				}
				if (vm.search.auditState != null && vm.search.auditState != '') {
					filters.push({
						field : 'auditState',
						operator : 'eq',
						value : vm.search.auditState
					});
				}
				vm.gridOptions_records.dataSource.filter(filters);
			};
		}//end#page_records

		function page_record() {
			shenbaoSvc.getShenBaoInfoById(vm);//获取申报信息
			shenbaoSvc.getHistoryInfo(vm);
			$(".modal-backdrop").remove();

			vm.update = function(flag) {
                vm.model.isUpdateOrSubmit = flag;
				shenbaoSvc.updateShenBaoInfo(vm);
			};
		}//end#page_record
	}
})();