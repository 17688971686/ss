(function() {
	'use strict';

	angular.module('app').factory('projectDetailsSvc', projectDetails);

	projectDetails.$inject = [ '$http','$compile' ];	
	function projectDetails($http,$compile) {	
		var url_projectDetails = "/projectInfo";
		var url_back = '#/projectDetais';	
		var service = {			
				checkProject:checkProject
		};		
		return service;	
		
		/**
		 * 查看申报项目的详细信息
		 */
		function checkProject(vm){		
			var httpOptions = {
					method : 'get',
					url : common.format(url_projectDetails + "?$filter=id eq '{0}'", vm.projectId)
				}

				var httpSuccess = function success(response) {
					vm.model = response.data.value;
					console.log("项目详情：");
					console.log(vm.model);
					//请求成功之后根据不同的申报阶段展示不同的页面信息
					var projectStage = vm.model[0].projectStage;
					if(projectStage == "projectStage_01" || projectStage == "projectStage_02" || projectStage == "projectStage_03"){//前期计划（前期费）、规划设计前期费	、新开工计划									
						vm.projectType = true;//项目类型
						vm.projectAddress = true;//项目建设地址
						vm.weiTuoShenJi = false;//委托审计标题、内容、送审造价
						vm.investSum = true;//项目总投资
						vm.planYear = true;//计划年度
						vm.ziJinChouChuoFanAn = true;//资金筹措方案
						vm.leiJiXiaDa = true;//至上年底累计下达
						vm.nianDuTouZiJiHua = true;//年度投资计划
						vm.projectBasic = true;//本年度主要建设内容、项目简介、建设规模、项目必要性和依据
						vm.projectTuiJianFangAnJieShao = false;//推荐方案介绍
						vm.projectSheHuiJingJiXiaoYiPingGu = false;//社会经济及效益评价
						vm.ZCQMJAndC = false;//项目涉及总拆迁面积及拆迁资金估算
						vm.NianDuChaiQianMianJiAndCapitalXuQiu = false;//年度拆迁面积及资金需求
						vm.XingXiangJinDu = false;//形象进度
						vm.lastYearXingXiangJinDu = false;//上年度项目形象进度
						vm.remark = false;//备注					
					}else if(projectStage == "projectStage_04"){//续建计划						
						vm.projectType = true;//项目类型
						vm.projectAddress = true;//项目建设地址
						vm.weiTuoShenJi = false;//委托审计标题、内容、送审造价
						vm.investSum = true;//项目总投资
						vm.planYear = true;//计划年度
						vm.ziJinChouChuoFanAn = true;//资金筹措方案
						vm.leiJiXiaDa = true;//至上年底累计下达
						vm.nianDuTouZiJiHua = true;//年度投资计划
						vm.projectBasic = true;//本年度主要建设内容、项目简介、建设规模、项目必要性和依据
						vm.projectTuiJianFangAnJieShao = false;//推荐方案介绍
						vm.projectSheHuiJingJiXiaoYiPingGu = false;//社会经济及效益评价
						vm.ZCQMJAndC = false;//项目涉及总拆迁面积及拆迁资金估算
						vm.NianDuChaiQianMianJiAndCapitalXuQiu = false;//年度拆迁面积及资金需求
						vm.XingXiangJinDu = true;//形象进度
						vm.lastYearXingXiangJinDu = true;//上年度项目形象进度
						vm.remark = false;//备注
					}else if(projectStage == "projectStage_05"){//委托审计
						vm.projectType = false;//项目类型
						vm.projectAddress = false;//项目建设地址
						vm.weiTuoShenJi = true;//委托审计标题、内容、送审造价
						vm.investSum = false;//项目总投资
						vm.planYear = false;//计划年度
						vm.ziJinChouChuoFanAn = false;//资金筹措方案
						vm.leiJiXiaDa = false;//至上年底累计下达
						vm.nianDuTouZiJiHua = false;//年度投资计划
						vm.projectBasic = false;//本年度主要建设内容、项目简介、建设规模、项目必要性和依据
						vm.projectTuiJianFangAnJieShao = false;//推荐方案介绍
						vm.projectSheHuiJingJiXiaoYiPingGu = false;//社会经济及效益评价
						vm.ZCQMJAndC = false;//项目涉及总拆迁面积及拆迁资金估算
						vm.NianDuChaiQianMianJiAndCapitalXuQiu = false;//年度拆迁面积及资金需求
						vm.XingXiangJinDu = false;//形象进度
						vm.lastYearXingXiangJinDu = false;//上年度项目形象进度
						vm.remark = false;//备注
					}else if(projectStage == "projectStage_06"){//审计决算资金
						vm.projectType = true;//项目类型
						vm.projectAddress = true;//项目建设地址
						vm.weiTuoShenJi = false;//委托审计标题、内容、送审造价
						vm.investSum = true;//项目总投资
						vm.planYear = true;//计划年度
						vm.ziJinChouChuoFanAn = true;//资金筹措方案
						vm.leiJiXiaDa = true;//至上年底累计下达
						vm.nianDuTouZiJiHua = true;//年度投资计划
						vm.projectBasic = true;//本年度主要建设内容、项目简介、建设规模、项目必要性和依据
						vm.projectTuiJianFangAnJieShao = false;//推荐方案介绍
						vm.projectSheHuiJingJiXiaoYiPingGu = false;//社会经济及效益评价
						vm.ZCQMJAndC = false;//项目涉及总拆迁面积及拆迁资金估算
						vm.NianDuChaiQianMianJiAndCapitalXuQiu = false;//年度拆迁面积及资金需求
						vm.XingXiangJinDu = true;//形象进度 
						vm.lastYearXingXiangJinDu = true;//上年度项目形象进度 
						vm.remark = false;//备注	
					}else if(projectStage == "projectStage_07" || projectStage == "projectStage_08"){//下一年度计划、年度调整计划
						vm.projectType = true;//项目类型
						vm.projectAddress = true;//项目建设地址
						vm.weiTuoShenJi = false;//委托审计标题、内容、送审造价
						vm.investSum = true;//项目总投资
						vm.planYear = true;//计划年度
						vm.ziJinChouChuoFanAn = true;//资金筹措方案
						vm.leiJiXiaDa = true;//至上年底累计下达
						vm.nianDuTouZiJiHua = true;//年度投资计划
						vm.projectBasic = true;//本年度主要建设内容、项目简介、建设规模、项目必要性和依据
						vm.projectTuiJianFangAnJieShao = false;//推荐方案介绍
						vm.projectSheHuiJingJiXiaoYiPingGu = false;//社会经济及效益评价
						vm.ZCQMJAndC = true;//项目涉及总拆迁面积及拆迁资金估算
						vm.NianDuChaiQianMianJiAndCapitalXuQiu = true;//年度拆迁面积及资金需求
						vm.XingXiangJinDu = true;//形象进度
						vm.lastYearXingXiangJinDu = false;//上年度项目形象进度 
						vm.remark = true;//备注	
					}
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
	}
	
	
	
})();