package cs.service.shenbaoAdmin;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.MonthReportProblem;
import cs.domain.ProjectInfo;
import cs.domain.UnitInfo;
import cs.model.management.AttachmentDto;
import cs.model.management.MonthReportDto;
import cs.model.management.MonthReportProblemDto;
import cs.model.management.ProjectInfoDto;
import cs.model.management.UnitInfoDto;

public class DtoFactory {
	
	public static ProjectInfoDto projectInfoToprojectInfoDto(ProjectInfo projectInfo){
		ProjectInfoDto projectInfoDto = new ProjectInfoDto();
		//判断参数是否为空
		if(projectInfo != null){
			//进行数据的转换
			projectInfoDto.setId(projectInfo.getId());
			//获取以下信息用于列表展示
			projectInfoDto.setProjectStage(projectInfo.getProjectStage());//项目阶段(代码)					
			projectInfoDto.setShenBaoYear(projectInfo.getShenBaoYear());//申报年度
			projectInfoDto.setProjectName(projectInfo.getProjectName());//项目名称
			projectInfoDto.setInvestType(projectInfo.getInvestType());//投资类型(代码)			
			projectInfoDto.setProjectStatus(projectInfo.getProjectStatus());//项目状态
			
		
			//获取以下信息用于详情展示
			//begin#项目基本信息				
			projectInfoDto.setProjectNumber(projectInfo.getProjectNumber());
			projectInfoDto.setUnitName(projectInfo.getUnitName());//申报单位名称
			projectInfoDto.setProjectClassify(projectInfo.getProjectClassify());//项目分类(代码)			
			projectInfoDto.setIndustry(projectInfo.getIndustry());//国民经济行业分类(代码)		
			projectInfoDto.setProjectIndustry(projectInfo.getProjectIndustry());//项目行业归口(代码)			
			projectInfoDto.setProjectType(projectInfo.getProjectType());//项目类型(代码)			
			projectInfoDto.setProjectAddress(projectInfo.getProjectAddress());//项目建设地址
			projectInfoDto.setProjectLocation(projectInfo.getProjectLocation());//项目坐标
			projectInfoDto.setProjectStatus(projectInfo.getProjectStatus());//项目状态
			projectInfoDto.setProjectBuildStage(projectInfo.getProjectBuildStage());//项目建设阶段	
			//end#项目基本信息
			
			//begin#项目投资信息
			projectInfoDto.setInvestSum(projectInfo.getInvestSum());//项目总投资
			projectInfoDto.setInvestJianAnFei(projectInfo.getInvestJianAnFei());//项目总投资-建安费
			projectInfoDto.setInvestGongChengJianSheQiTaFei(projectInfo.getInvestGongChengJianSheQiTaFei());//项目总投资-工程建设其他费
			projectInfoDto.setInvestJiBenYuBeiFei(projectInfo.getInvestJiBenYuBeiFei());//项目总投资-基本预备费
			projectInfoDto.setCapitalShiCaiZheng(projectInfo.getCapitalShiCaiZheng());//资金筹措方案-市财政
			projectInfoDto.setCapitalQuCaiZheng(projectInfo.getCapitalQuCaiZheng());//资金筹措方案-区财政
			projectInfoDto.setCapitalSheHuiTouZi(projectInfo.getCapitalSheHuiTouZi());//资金筹措方案-社会投资
			projectInfoDto.setCapitalGuoTuZiJin(projectInfo.getCapitalGuoTuZiJin());//资金筹措方案-国土资金
			projectInfoDto.setCapitalZhuanXiangZiJin(projectInfo.getCapitalZhuanXiangZiJin());//资金筹措方案-专项资金
			projectInfoDto.setCapitalZhongYangTouZi(projectInfo.getCapitalZhongYangTouZi());//资金筹措方案-中央投资
			projectInfoDto.setCapitalShengBu(projectInfo.getCapitalShengBu());//资金筹措方案-部省
			projectInfoDto.setCapitalZiChou(projectInfo.getCapitalZiChou());//资金筹措方案-自筹
			projectInfoDto.setCapitalZhengFuTongChou(projectInfo.getCapitalZhengFuTongChou());//资金筹措方案-政府统筹
			projectInfoDto.setCapitalJiaoYuFuJia(projectInfo.getCapitalJiaoYuFuJia());//资金筹措方案-教育费附加
			projectInfoDto.setCapitalOther(projectInfo.getCapitalOther());//资金筹措方案-其他
			projectInfoDto.setCapitalOtherExplain(projectInfo.getCapitalOtherExplain());//资金筹措方案（其他） 的来源途径说明
			//end#项目投资信息
			
			//begin#项目描述
			projectInfoDto.setProjectSummary(projectInfo.getProjectSummary());//项目简介
			projectInfoDto.setProjectGuiMo(projectInfo.getProjectGuiMo());//建设规模
			projectInfoDto.setProjectBiYaoXingAndYiJu(projectInfo.getProjectBiYaoXingAndYiJu());//项目必要性和依据
			projectInfoDto.setProjectTuiJianFangAnJieShao(projectInfo.getProjectTuiJianFangAnJieShao());//推荐方案介绍
			projectInfoDto.setProjectSheHuiJingJiXiaoYiPingGu(projectInfo.getProjectSheHuiJingJiXiaoYiPingGu());//社会及经济效益评价
			projectInfoDto.setRemark(projectInfo.getRemark());//备注
			//end#项目描述
			
			//begin#资金申请
			projectInfoDto.setProjectStartDate(projectInfo.getProjectStartDate());//开工日期
			projectInfoDto.setProjectCompleteDate(projectInfo.getProjectCompleteDate());//竣工日期
			projectInfoDto.setPlanYear(projectInfo.getPlanYear());//计划年度
			projectInfoDto.setShenBaoJingFei(projectInfo.getShenBaoJingFei());//申报经费
			projectInfoDto.setCapital2ShiCaiZheng(projectInfo.getCapital2ShiCaiZheng());//至上年底累计下达-市财政
			projectInfoDto.setCapital2QuCaiZheng(projectInfo.getCapital2QuCaiZheng());//至上年底累计下达-区财政
			projectInfoDto.setCapital2SheHuiTouZi(projectInfo.getCapital2SheHuiTouZi());//至上年底累计下达-社会投资
			projectInfoDto.setCapital2GuoTuZiJin(projectInfo.getCapital2GuoTuZiJin());//至上年底累计下达-国土资金
			projectInfoDto.setCapital2ZhuanXiangZiJin(projectInfo.getCapital2ZhuanXiangZiJin());//至上年底累计下达-专项资金
			projectInfoDto.setCapital2ZhongYangTouZi(projectInfo.getCapital2ZhongYangTouZi());//至上年底累计下达-中央投资
			projectInfoDto.setCapital2ShengBu(projectInfo.getCapital2ShengBu());//至上年底累计下达-部省
			projectInfoDto.setCapital2ZiChou(projectInfo.getCapital2ZiChou());//至上年底累计下达-自筹
			projectInfoDto.setCapital2ZhengFuTongChou(projectInfo.getCapital2ZhengFuTongChou());//至上年底累计下达-政府统筹
			projectInfoDto.setCapital2JiaoYuFuJia(projectInfo.getCapital2JiaoYuFuJia());//至上年底累计下达-教育费附加
			projectInfoDto.setCapital2Other(projectInfo.getCapital2Other());//至上年底累计下达-其他	
			projectInfoDto.setCapital2OtherExplain(projectInfo.getCapital2OtherExplain());//至上年底累计下达（其他） 的来源途径说明
			//end#资金申请
			
			//begin#年度投资计划
			projectInfoDto.setCapital3ShiCaiZheng(projectInfo.getCapital3ShiCaiZheng());//年度投资计划-市财政
			projectInfoDto.setCapital3QuCaiZheng(projectInfo.getCapital3QuCaiZheng());//年度投资计划-区财政
			projectInfoDto.setCapital3SheHuiTouZi(projectInfo.getCapital3SheHuiTouZi());//年度投资计划-社会投资
			projectInfoDto.setCapital3GuoTuZiJin(projectInfo.getCapital3GuoTuZiJin());//年度投资计划-国土资金
			projectInfoDto.setCapital3ZhuanXiangZiJin(projectInfo.getCapital3ZhuanXiangZiJin());//年度投资计划-专项资金
			projectInfoDto.setCapital3ZhongYangTouZi(projectInfo.getCapital3ZhongYangTouZi());//年度投资计划-中央投资
			projectInfoDto.setCapital3ShengBu(projectInfo.getCapital3ShengBu());//年度投资计划-部省
			projectInfoDto.setCapital3ZiChou(projectInfo.getCapital3ZiChou());//年度投资计划-自筹
			projectInfoDto.setCapital3ZhengFuTongChou(projectInfo.getCapital3ZhengFuTongChou());//年度投资计划-政府统筹
			projectInfoDto.setCapital3JiaoYuFuJia(projectInfo.getCapital3JiaoYuFuJia());//年度投资计划-教育费附加
			projectInfoDto.setCapital3Other(projectInfo.getCapital3Other());//年度投资计划-其他
			projectInfoDto.setCapital3OtherExplain(projectInfo.getCapital3OtherExplain());//年度投资计划（其他） 的来源途径说明
			//end#年度投资计划
			
			projectInfoDto.setCurrentYearMainBuild(projectInfo.getCurrentYearMainBuild());//本年度主要建设内容
			projectInfoDto.setLastYearXingXiangJinDu(projectInfo.getLastYearXingXiangJinDu());//上年度项目形象进度
			projectInfoDto.setXingXiangJinDu(projectInfo.getXingXiangJinDu());//形象进度
			
			//begin#下一年度计划
			projectInfoDto.setJianSheXingZhi(projectInfo.getJianSheXingZhi());//建设性质（代码）			
			projectInfoDto.setGaiSuanPiWenNum(projectInfo.getGaiSuanPiWenNum());//总概算批复文号
			projectInfoDto.setRecentCapitalXiaDaPiWenNum(projectInfo.getRecentCapitalXiaDaPiWenNum());//最近一次资金计划下达文号
			projectInfoDto.setNianDiQianHaiKeBoFuZiJing(projectInfo.getNianDiQianHaiKeBoFuZiJing());//至年底前还可拨付资金
			projectInfoDto.setLeiJiAnPaiTouZi(projectInfo.getLeiJiAnPaiTouZi());//累计安排投资
			projectInfoDto.setShenQingNianDuTouZi(projectInfo.getShenQingNianDuTouZi());//申请年度投资
			projectInfoDto.setZongChaiQianMianJiAndCapital(projectInfo.getZongChaiQianMianJiAndCapital());//项目涉及总拆迁面积及拆迁资金估算
			projectInfoDto.setNianDuChaiQianMianJiAndCapitalXuQiu(projectInfo.getNianDuChaiQianMianJiAndCapitalXuQiu());//年度拆迁面积及资金需求
			//end#下一年度计划
			
			//begin#委托审计
			projectInfoDto.setAuditTitle(projectInfo.getAuditTitle());//委托审计-标题
			projectInfoDto.setAuditContent(projectInfo.getAuditContent());//委托审计-内容
			projectInfoDto.setAuditSongShenZaoJia(projectInfo.getAuditSongShenZaoJia());//委托审计-送审造价
			//end#委托审计
			
			//begin#关联信息 
			//将编制单位信息进行处理
			UnitInfo unitInfoBZ = projectInfo.getBianZhiUnit();//编制单位
			if(unitInfoBZ!=null){
				UnitInfoDto unitInfoDtoBZ = DtoFactory.unitInfoTounitInfoDto(unitInfoBZ);
				projectInfoDto.setBianZhiUnit(unitInfoDtoBZ);
			}
			
			
			//将申报单位信息进行处理
			UnitInfo unitInfo = projectInfo.getShenBaoUnit();
			if(unitInfo!=null){
				UnitInfoDto unitInfoDto = DtoFactory.unitInfoTounitInfoDto(unitInfo);
				projectInfoDto.setShenBaoUnit(unitInfoDto);
			}
			
			
			//将附件信息进行处理
			List<Attachment> attachments = projectInfo.getAttachments();
			List<AttachmentDto> attachmentDtos = new ArrayList<>();
			attachments.forEach(x->{
				AttachmentDto attachmentDto = DtoFactory.attachmentToattachmentDto(x);
				attachmentDtos.add(attachmentDto);
				
			});
			projectInfoDto.setAttachmentDtos(attachmentDtos);
			
			
			
			//将月报信息进行处理
			List<MonthReport> monthReports = projectInfo.getMonthReports();
			List<MonthReportDto> monthReportDtos = new ArrayList<>();
			monthReports.forEach(x->{
				MonthReportDto monthReportDto = DtoFactory.monthReportTomonthReportDto(x);
				monthReportDtos.add(monthReportDto);
			});			
			projectInfoDto.setMonthReportDtos(monthReportDtos);
			//end#关联信息
			
			projectInfoDto.setModifiedBy(projectInfo.getModifiedBy());
			projectInfoDto.setModifiedDate(projectInfo.getModifiedDate());
			projectInfoDto.setCreatedBy(projectInfo.getCreatedBy());
			projectInfoDto.setCreatedDate(projectInfo.getCreatedDate());
		}	
		return projectInfoDto;
}
	

	public static ProjectInfo projectInfoDtoToprojectInfo(ProjectInfoDto projectInfoDto){
		ProjectInfo projectInfo = new ProjectInfo();
		//判断参数是否为空
		if(projectInfoDto != null){
			//进行数据的转换
			projectInfo.setId(UUID.randomUUID().toString());
			
			projectInfo.setProjectNumber(projectInfoDto.getProjectNumber());
			//获取以下信息用于列表展示
			projectInfo.setProjectStage(projectInfoDto.getProjectStage());//项目阶段(代码)					
			projectInfo.setShenBaoYear(projectInfoDto.getShenBaoYear());//申报年度
			projectInfo.setProjectName(projectInfoDto.getProjectName());//项目名称
			projectInfo.setInvestType(projectInfoDto.getInvestType());//投资类型(代码)			
			projectInfo.setProjectStatus(projectInfoDto.getProjectStatus());//项目状态
			
		
			//获取以下信息用于详情展示
			//begin#项目基本信息																														
			projectInfo.setUnitName(projectInfoDto.getUnitName());//申报单位名称
			projectInfo.setProjectClassify(projectInfoDto.getProjectClassify());//项目分类(代码)
			projectInfo.setProjectType(projectInfoDto.getProjectType());//项目类型(代码)			
			projectInfo.setProjectAddress(projectInfoDto.getProjectAddress());//项目建设地址
			projectInfo.setProjectLocation(projectInfoDto.getProjectLocation());//项目坐标
			projectInfo.setProjectStatus(projectInfoDto.getProjectStatus());//项目状态			
			//end#项目基本信息
			
			//begin#项目投资信息
			projectInfo.setInvestSum(projectInfoDto.getInvestSum());//项目总投资
			projectInfo.setInvestJianAnFei(projectInfoDto.getInvestJianAnFei());//项目总投资-建安费
			projectInfo.setInvestGongChengJianSheQiTaFei(projectInfoDto.getInvestGongChengJianSheQiTaFei());//项目总投资-工程建设其他费
			projectInfo.setInvestJiBenYuBeiFei(projectInfoDto.getInvestJiBenYuBeiFei());//项目总投资-基本预备费
			projectInfo.setCapitalShiCaiZheng(projectInfoDto.getCapitalShiCaiZheng());//资金筹措方案-市财政
			projectInfo.setCapitalQuCaiZheng(projectInfoDto.getCapitalQuCaiZheng());//资金筹措方案-区财政
			projectInfo.setCapitalSheHuiTouZi(projectInfoDto.getCapitalSheHuiTouZi());//资金筹措方案-社会投资
			projectInfo.setCapitalGuoTuZiJin(projectInfoDto.getCapitalGuoTuZiJin());//资金筹措方案-国土资金
			projectInfo.setCapitalZhuanXiangZiJin(projectInfoDto.getCapitalZhuanXiangZiJin());//资金筹措方案-专项资金
			projectInfo.setCapitalZhongYangTouZi(projectInfoDto.getCapitalZhongYangTouZi());//资金筹措方案-中央投资
			projectInfo.setCapitalShengBu(projectInfoDto.getCapitalShengBu());//资金筹措方案-部省
			projectInfo.setCapitalZiChou(projectInfoDto.getCapitalZiChou());//资金筹措方案-自筹
			projectInfo.setCapitalZhengFuTongChou(projectInfoDto.getCapitalZhengFuTongChou());//资金筹措方案-政府统筹
			projectInfo.setCapitalJiaoYuFuJia(projectInfoDto.getCapitalJiaoYuFuJia());//资金筹措方案-教育费附加
			projectInfo.setCapitalOther(projectInfoDto.getCapitalOther());//资金筹措方案-其他
			projectInfo.setCapitalOtherExplain(projectInfoDto.getCapitalOtherExplain());//资金筹措方案（其他） 的来源途径说明
			//end#项目投资信息
			
			//begin#项目描述
			projectInfo.setProjectSummary(projectInfoDto.getProjectSummary());//项目简介
			projectInfo.setProjectGuiMo(projectInfoDto.getProjectGuiMo());//建设规模
			projectInfo.setProjectBiYaoXingAndYiJu(projectInfoDto.getProjectBiYaoXingAndYiJu());//项目必要性和依据
			projectInfo.setProjectTuiJianFangAnJieShao(projectInfoDto.getProjectTuiJianFangAnJieShao());//推荐方案介绍
			projectInfo.setProjectSheHuiJingJiXiaoYiPingGu(projectInfoDto.getProjectSheHuiJingJiXiaoYiPingGu());//社会及经济效益评价
			projectInfo.setRemark(projectInfoDto.getRemark());//备注
			//end#项目描述
			
			//begin#资金申请
			projectInfo.setProjectStartDate(projectInfoDto.getProjectStartDate());//开工日期
			projectInfo.setProjectCompleteDate(projectInfoDto.getProjectCompleteDate());//竣工日期
			projectInfo.setPlanYear(projectInfoDto.getPlanYear());//计划年度
			projectInfo.setShenBaoJingFei(projectInfoDto.getShenBaoJingFei());//申报经费
			projectInfo.setCapital2ShiCaiZheng(projectInfoDto.getCapital2ShiCaiZheng());//至上年底累计下达-市财政
			projectInfo.setCapital2QuCaiZheng(projectInfoDto.getCapital2QuCaiZheng());//至上年底累计下达-区财政
			projectInfo.setCapital2SheHuiTouZi(projectInfoDto.getCapital2SheHuiTouZi());//至上年底累计下达-社会投资
			projectInfo.setCapital2GuoTuZiJin(projectInfoDto.getCapital2GuoTuZiJin());//至上年底累计下达-国土资金
			projectInfo.setCapital2ZhuanXiangZiJin(projectInfoDto.getCapital2ZhuanXiangZiJin());//至上年底累计下达-专项资金
			projectInfo.setCapital2ZhongYangTouZi(projectInfoDto.getCapital2ZhongYangTouZi());//至上年底累计下达-中央投资
			projectInfo.setCapital2ShengBu(projectInfoDto.getCapital2ShengBu());//至上年底累计下达-部省
			projectInfo.setCapital2ZiChou(projectInfoDto.getCapital2ZiChou());//至上年底累计下达-自筹
			projectInfo.setCapital2ZhengFuTongChou(projectInfoDto.getCapital2ZhengFuTongChou());//至上年底累计下达-政府统筹
			projectInfo.setCapital2JiaoYuFuJia(projectInfoDto.getCapital2JiaoYuFuJia());//至上年底累计下达-教育费附加
			projectInfo.setCapital2Other(projectInfoDto.getCapital2Other());//至上年底累计下达-其他	
			projectInfo.setCapital2OtherExplain(projectInfoDto.getCapital2OtherExplain());//至上年底累计下达（其他） 的来源途径说明
			//end#资金申请
			
			//begin#年度投资计划
			projectInfo.setCapital3ShiCaiZheng(projectInfoDto.getCapital3ShiCaiZheng());//年度投资计划-市财政
			projectInfo.setCapital3QuCaiZheng(projectInfoDto.getCapital3QuCaiZheng());//年度投资计划-区财政
			projectInfo.setCapital3SheHuiTouZi(projectInfoDto.getCapital3SheHuiTouZi());//年度投资计划-社会投资
			projectInfo.setCapital3GuoTuZiJin(projectInfoDto.getCapital3GuoTuZiJin());//年度投资计划-国土资金
			projectInfo.setCapital3ZhuanXiangZiJin(projectInfoDto.getCapital3ZhuanXiangZiJin());//年度投资计划-专项资金
			projectInfo.setCapital3ZhongYangTouZi(projectInfoDto.getCapital3ZhongYangTouZi());//年度投资计划-中央投资
			projectInfo.setCapital3ShengBu(projectInfoDto.getCapital3ShengBu());//年度投资计划-部省
			projectInfo.setCapital3ZiChou(projectInfoDto.getCapital3ZiChou());//年度投资计划-自筹
			projectInfo.setCapital3ZhengFuTongChou(projectInfoDto.getCapital3ZhengFuTongChou());//年度投资计划-政府统筹
			projectInfo.setCapital3JiaoYuFuJia(projectInfoDto.getCapital3JiaoYuFuJia());//年度投资计划-教育费附加
			projectInfo.setCapital3Other(projectInfoDto.getCapital3Other());//年度投资计划-其他
			projectInfo.setCapital3OtherExplain(projectInfoDto.getCapital3OtherExplain());//年度投资计划（其他） 的来源途径说明
			//end#年度投资计划
			
			projectInfo.setCurrentYearMainBuild(projectInfoDto.getCurrentYearMainBuild());//本年度主要建设内容
			projectInfo.setLastYearXingXiangJinDu(projectInfoDto.getLastYearXingXiangJinDu());//上年度项目形象进度
			projectInfo.setXingXiangJinDu(projectInfoDto.getXingXiangJinDu());//形象进度
			
			//begin#下一年度计划
			projectInfo.setJianSheXingZhi(projectInfoDto.getJianSheXingZhi());//建设性质（代码）			
			projectInfo.setGaiSuanPiWenNum(projectInfoDto.getGaiSuanPiWenNum());//总概算批复文号
			projectInfo.setRecentCapitalXiaDaPiWenNum(projectInfoDto.getRecentCapitalXiaDaPiWenNum());//最近一次资金计划下达文号
			projectInfo.setNianDiQianHaiKeBoFuZiJing(projectInfoDto.getNianDiQianHaiKeBoFuZiJing());//至年底前还可拨付资金
			projectInfo.setLeiJiAnPaiTouZi(projectInfoDto.getLeiJiAnPaiTouZi());//累计安排投资
			projectInfo.setShenQingNianDuTouZi(projectInfoDto.getShenQingNianDuTouZi());//申请年度投资
			projectInfo.setZongChaiQianMianJiAndCapital(projectInfoDto.getZongChaiQianMianJiAndCapital());//项目涉及总拆迁面积及拆迁资金估算
			projectInfo.setNianDuChaiQianMianJiAndCapitalXuQiu(projectInfoDto.getNianDuChaiQianMianJiAndCapitalXuQiu());//年度拆迁面积及资金需求
			//end#下一年度计划
			
			//begin#委托审计
			projectInfo.setAuditTitle(projectInfoDto.getAuditTitle());//委托审计-标题
			projectInfo.setAuditContent(projectInfoDto.getAuditContent());//委托审计-内容
			projectInfo.setAuditSongShenZaoJia(projectInfoDto.getAuditSongShenZaoJia());//委托审计-送审造价
			//end#委托审计
			
			//begin#关联信息 
			//编制单位&申报单位
			UnitInfoDto unitInfoDto_bianZhi = projectInfoDto.getBianZhiUnit();
			UnitInfoDto unitInfoDto_shenBao = projectInfoDto.getShenBaoUnit();
			//进行数据的转换
			UnitInfo unitInfo_bianZhi = DtoFactory.unitInfoDtoTounitInfo(unitInfoDto_bianZhi);
			UnitInfo unitInfo_shenBao = DtoFactory.unitInfoDtoTounitInfo(unitInfoDto_shenBao);
	
			projectInfo.setBianZhiUnit(unitInfo_bianZhi);
			projectInfo.setShenBaoUnit(unitInfo_shenBao);
				//附件
					List<AttachmentDto> attachmentDtos = projectInfoDto.getAttachmentDtos();
					List<Attachment> attachments = new ArrayList<>();
					if(attachmentDtos !=null && attachmentDtos.size()>0){
						attachmentDtos.forEach(x->{
							Attachment attachment = DtoFactory.attachmentDtoToattachment(x);
							attachments.add(attachment);
						});
					}
					projectInfo.setAttachments(attachments);
			//end#关联信息
	
		}	
		return projectInfo;
}
	
	public static UnitInfoDto unitInfoTounitInfoDto(UnitInfo unitInfo){
		UnitInfoDto unitInfoDto = new UnitInfoDto();
		if(unitInfo != null){
			unitInfoDto.setId(unitInfo.getId());
			unitInfoDto.setUnitName(unitInfo.getUnitName());//单位名称
			unitInfoDto.setOrgCode(unitInfo.getOrgCode());//组织机构代码
			unitInfoDto.setDivisionId(unitInfo.getDivisionId());//行政区划编号
			unitInfoDto.setQualifiedLeval(unitInfo.getQualifiedLeval());//资质等级
			unitInfoDto.setUnitTel(unitInfo.getUnitTel());//电话号码
			unitInfoDto.setUnitEmail(unitInfo.getUnitEmail());//电子邮箱
			unitInfoDto.setUnitFax(unitInfo.getUnitFax());//传真号码
			unitInfoDto.setUnitProperty(unitInfo.getUnitProperty());//单位性质
			unitInfoDto.setUnitAddress(unitInfo.getUnitAddress());//单位地址
			unitInfoDto.setLegalName(unitInfo.getLegalName());//法人名称
			unitInfoDto.setLegalTel(unitInfo.getLegalTel());//法人电话
			
			unitInfoDto.setUnitResPerson(unitInfo.getUnitResPerson());//单位负责人名称
			unitInfoDto.setResPersonTel(unitInfo.getResPersonTel());//负责人电话
			unitInfoDto.setResPersonMobile(unitInfo.getResPersonMobile());//负责人手机
			unitInfoDto.setResPersonFax(unitInfo.getResPersonFax());//负责人传真
			unitInfoDto.setResPersonEmail(unitInfo.getResPersonEmail());//负责人邮箱
			
			unitInfoDto.setUnitContactPerson(unitInfo.getUnitContactPerson());//单位联系人名称
			unitInfoDto.setContactPersonMobile(unitInfo.getContactPersonMobile());//单位联系人手机
			unitInfoDto.setContactPersonEmail(unitInfo.getContactPersonEmail());//单位联系人邮箱
			unitInfoDto.setContactPersonTel(unitInfo.getContactPersonTel());//单位联系人电话
			unitInfoDto.setContactPersonFax(unitInfo.getContactPersonFax());//单位联系人传真
			
			unitInfoDto.setRemark(unitInfo.getRemark());//备注
			unitInfoDto.setIsSubmit(unitInfo.getIsSubmit());//是否提交			
			unitInfoDto.setIsFinish(unitInfo.getIsFinish());//是否完成
		}
		return unitInfoDto;
	
	}
	
	public static UnitInfo unitInfoDtoTounitInfo(UnitInfoDto unitInfoDto){
		UnitInfo unitInfo = new UnitInfo();
		if(unitInfoDto != null){
			if(unitInfoDto.getId() ==null || unitInfoDto.getId().isEmpty()){
				unitInfo.setId(UUID.randomUUID().toString());
			}else{
				unitInfo.setId(unitInfoDto.getId());
				
			}			
			unitInfo.setUnitName(unitInfoDto.getUnitName());//单位名称
			unitInfo.setOrgCode(unitInfoDto.getOrgCode());//组织机构代码
			unitInfo.setDivisionId(unitInfoDto.getDivisionId());//行政区划编号
			unitInfo.setQualifiedLeval(unitInfoDto.getQualifiedLeval());//资质等级
			unitInfo.setUnitTel(unitInfoDto.getUnitTel());//电话号码
			unitInfo.setUnitEmail(unitInfoDto.getUnitEmail());//电子邮箱
			unitInfo.setUnitFax(unitInfoDto.getUnitFax());//传真号码
			unitInfo.setUnitProperty(unitInfoDto.getUnitProperty());//单位性质
			unitInfo.setUnitAddress(unitInfoDto.getUnitAddress());//单位地址
			unitInfo.setLegalName(unitInfoDto.getLegalName());//法人名称
			unitInfo.setLegalTel(unitInfoDto.getLegalTel());//法人电话
			
			unitInfo.setUnitResPerson(unitInfoDto.getUnitResPerson());//单位负责人名称
			unitInfo.setResPersonTel(unitInfoDto.getResPersonTel());//负责人电话
			unitInfo.setResPersonMobile(unitInfoDto.getResPersonMobile());//负责人手机
			unitInfo.setResPersonFax(unitInfoDto.getResPersonFax());//负责人传真
			unitInfo.setResPersonEmail(unitInfoDto.getResPersonEmail());//负责人邮箱
			
			unitInfo.setUnitContactPerson(unitInfoDto.getUnitContactPerson());//单位联系人名称
			unitInfo.setContactPersonMobile(unitInfoDto.getContactPersonMobile());//单位联系人手机
			unitInfo.setContactPersonEmail(unitInfoDto.getContactPersonEmail());//单位联系人邮箱
			unitInfo.setContactPersonTel(unitInfoDto.getContactPersonTel());//单位联系人电话
			unitInfo.setContactPersonFax(unitInfoDto.getContactPersonFax());//单位联系人传真
			
			unitInfo.setRemark(unitInfoDto.getRemark());//备注
			unitInfo.setIsSubmit(unitInfoDto.getIsSubmit());//是否提交			
			unitInfo.setIsFinish(unitInfoDto.getIsFinish());//是否完成
		}
		return unitInfo;
	}
	public static AttachmentDto attachmentToattachmentDto(Attachment attachment){
		AttachmentDto attachmentDto = new AttachmentDto();
		if(attachment != null){
			attachmentDto.setId(attachment.getId());
			attachmentDto.setComment(attachment.getComment());
			attachmentDto.setName(attachment.getName());
			attachmentDto.setUrl(attachment.getUrl());
			
			attachmentDto.setCreatedBy(attachment.getCreatedBy());
			attachmentDto.setCreatedDate(attachment.getCreatedDate());
			attachmentDto.setModifiedDate(attachment.getModifiedDate());
			attachmentDto.setModifiedBy(attachment.getModifiedBy());
			attachmentDto.setType(attachment.getType());
		}
		return 	attachmentDto;						
		
	}
	public static Attachment attachmentDtoToattachment(AttachmentDto attachmentDto){
		Attachment attachment = new Attachment();
		if(attachmentDto != null){
			if(attachmentDto.getId() !=null && !"".equals(attachmentDto.getId())){
				attachment.setId(attachmentDto.getId());
			}else{
				attachment.setId(UUID.randomUUID().toString());
			}
			
			attachment.setComment(attachmentDto.getComment());
			attachment.setName(attachmentDto.getName());
			attachment.setUrl(attachmentDto.getUrl());
			attachment.setIsUpload(attachmentDto.getIsUpload());
			attachment.setType(attachmentDto.getType());
		}
		return 	attachment;			
	}

	public static MonthReportDto monthReportTomonthReportDto(MonthReport monthReport){
		MonthReportDto monthReportDto = new MonthReportDto();
		if(monthReport !=null){
			monthReportDto.setId(monthReport.getId());//获取月报id
			monthReportDto.setProjectId(monthReport.getProjectId());//获取项目id
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());//获取计划总投资
			
			//begin#月报联系人信息
			monthReportDto.setFillName(monthReport.getFillName());//填报人名称
			monthReportDto.setFillMobile(monthReport.getFillMobile());//填报人手机
			monthReportDto.setMonRepManagerName(monthReport.getMonRepManagerName());//月报负责人姓名
			monthReportDto.setMonRepManagerTel(monthReport.getMonRepManagerTel());//月报负责人手机号
			monthReportDto.setMonRepManagerFax(monthReport.getMonRepManagerFax());//月报负责人传真号
			monthReportDto.setMonRepManagUnitName(monthReport.getMonRepManagUnitName());//月报负责单位名称
			monthReportDto.setRespUnitManagerName(monthReport.getRespUnitManagerName());//责任单位负责人名称
			monthReportDto.setRespUnitManagerTel(monthReport.getRespUnitManagerTel());//责任单位负责人电话		
			//end#联系人信息
			
			//begin#批文日期和文号
			//日期
			monthReportDto.setProposalsReplyDate(monthReport.getProposalsReplyDate());//项目建议书批复日期
			monthReportDto.setFeaStyRepoReplyDate(monthReport.getFeaStyRepoReplyDate());//可行性研究报告批复日期
			monthReportDto.setAllEstimateReplyDate(monthReport.getAllEstimateReplyDate());//项目总概算批复日期
			monthReportDto.setPrePlanReplyDate(monthReport.getPrePlanReplyDate());//前期工作计划批复日期
			//文号
			monthReportDto.setProposalsType(monthReport.getProposalsType());//项目建议书批复类型
			monthReportDto.setProposalsYear(monthReport.getProposalsYear());//项目建议书批复年份
			monthReportDto.setProposalsNum(monthReport.getProposalsNum());//项目建议书批复文号
			
			monthReportDto.setReportType(monthReport.getReportType());//可行性研究报告批复类型
			monthReportDto.setReportYear(monthReport.getReportYear());//可行性研究报告批复年份
			monthReportDto.setReportNum(monthReport.getReportNum());//可行性研究报告批复文号
			
			monthReportDto.setAllEstimateType(monthReport.getAllEstimateType());//项目总概算批复类型
			monthReportDto.setAllEstimateYear(monthReport.getAllEstimateYear());//项目总概算批复年份
			monthReportDto.setAllEstimateNum(monthReport.getAllEstimateNum());//项目总概算批复文号
					
			monthReportDto.setPrePlanType(monthReport.getPrePlanType());//前期工作计划批复类型
			monthReportDto.setPrePlanYear(monthReport.getPrePlanYear());//前期工作计划批复年份
			monthReportDto.setPrePlanNum(monthReport.getPrePlanNum());//前期工作计划批复文号
			//end#批文日期和文号
			
			//begin#开工时间
			monthReportDto.setCommencementDate(monthReport.getCommencementDate());//预计开工日期没有
			monthReportDto.setActuallyDate(monthReport.getActuallyDate());//对应页面的开工日期
			monthReportDto.setCompletedDate(monthReport.getCompletedDate());//竣工日期
			//end#开工时间
			
			//begin#投资情况
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());//对应页面的项目总投资
			monthReportDto.setActuallyFinishiInvestment(monthReport.getActuallyFinishiInvestment());//实际完成投资
			monthReportDto.setSinceLastYearCompletInvestment(monthReport.getSinceLastYearCompletInvestment());//对应页面至今完成投资
			monthReportDto.setThisYearPlanInvestment(monthReport.getThisYearPlanInvestment());//本年计划投资
			monthReportDto.setThisMonthInvestTotal(monthReport.getThisMonthInvestTotal());//本月完成投资
			monthReportDto.setBuildAndInstallInvest(monthReport.getBuildAndInstallInvest());//建筑安装工程投资
			monthReportDto.setEquipmentInvest(monthReport.getEquipmentInvest());//设备投资
			monthReportDto.setOtherInvest(monthReport.getOtherInvest());//其他投资
			monthReportDto.setThisYearAccumulatedInvestment(monthReport.getThisYearAccumulatedInvestment());//本年度累计完成投资
			//end#投资情况
			
			//begin#进度情况
			monthReportDto.setProjectApprovalProgress(monthReport.getProjectApprovalProgress());//项目审批进度
			monthReportDto.setProjectImageProgress(monthReport.getProjectImageProgress());//工程形象进度或项目进展情况
			monthReportDto.setSelfReview(monthReport.getSelfReview());//项目进度
			monthReportDto.setFirstQuarCompInvestment(monthReport.getFirstQuarCompInvestment());//预计第一季度完成投资
			monthReportDto.setSecondQuarCompInvestment(monthReport.getSecondQuarCompInvestment());//预计第二季度完成投资
			monthReportDto.setThirdQuarCompInvestment(monthReport.getThirdQuarCompInvestment());//预计第三季度完成投资
			monthReportDto.setFourthQuarCompInvestment(monthReport.getFourthQuarCompInvestment());//预计第四季度完成投资
			monthReportDto.setWorkTargets(monthReport.getWorkTargets());//年度工作目标
			//end#进度情况
			
			//begin#拆迁情况
			monthReportDto.setRequisitionLandArea(monthReport.getRequisitionLandArea());//征用土地面积
			monthReportDto.setDemolitionArea(monthReport.getDemolitionArea());//拆迁面积
			//end#拆迁情况
			
			monthReportDto.setSubmitMonth(monthReport.getSubmitMonth());//提交月
			monthReportDto.setSubmitDate(monthReport.getSubmitDate());//提交日期
			monthReportDto.setApprovalDate(monthReport.getApprovalDate());//立项日期
			
			monthReportDto.setIsCompletion(monthReport.getIsCompletion());//是否完工(1:完工 0：未完工)
			monthReportDto.setRemark(monthReport.getRemark());//备注
			
			//begin#工程结算情况
			monthReportDto.setFirstAccountReportSendAuditDate(monthReport.getFirstAccountReportSendAuditDate());//第一份结算报告送审计日期
			monthReportDto.setFirstAccountReportAuditDate(monthReport.getFirstAccountReportAuditDate());//第一份结算报告审计日期
			monthReportDto.setNewestAccountReportSendAuditDate(monthReport.getNewestAccountReportSendAuditDate());//最新结算报告送审计日期
			monthReportDto.setNewestAccountReportAuditDate(monthReport.getNewestAccountReportAuditDate());//最新结算报告审计日期
			monthReportDto.setCompletedAuditAccountAuthorizedAmount(monthReport.getCompletedAuditAccountAuthorizedAmount());//已完成审计的结算审定金额
			//End#工程结算情况
			
			//begin#竣工决算情况
			monthReportDto.setAccountReportSendAuditDate(monthReport.getAccountReportSendAuditDate());//决算报告送审日期
			monthReportDto.setCompleteAccountAuditDate(monthReport.getCompleteAccountAuditDate());//完成决算审计日期
			monthReportDto.setAccountAuthorizedAmount(monthReport.getAccountAuthorizedAmount());//决算审定金额
							
			//月报问题
			//将月报问题进行数据转换
			List<MonthReportProblem> monthReportProblems = monthReport.getMonthReportProblems();
			List<MonthReportProblemDto> monthReportProblemDtos = new ArrayList<>();
			if(monthReportProblems !=null && monthReportProblems.size()>0){
				for(MonthReportProblem monthReportProblem:monthReportProblems){
					MonthReportProblemDto monthReportProblemDto = DtoFactory.monRepProTomonRepProDto(monthReportProblem);
					monthReportProblemDtos.add(monthReportProblemDto);
				}					
			}
			monthReportDto.setMonthReportProblems(monthReportProblemDtos);
			
			//月报附件
			//将月报附件进行数据格式转换
			List<Attachment> attachments = monthReport.getAttachments();
			List<AttachmentDto> attachmentDtos = new ArrayList<>();
			if(attachments !=null && attachments.size()>0){
				for(Attachment attachment:attachments){
					AttachmentDto attachmentDto = DtoFactory.attachmentToattachmentDto(attachment);					
					attachmentDtos.add(attachmentDto);
				}
			}
			monthReportDto.setAttachments(attachmentDtos);
			//begin#项目信息
			monthReportDto.setProjectBuildStage(monthReport.getProjectBuildStage());//项目建设阶段
			
			//end#项目信息

//											
			monthReportDto.setModifiedBy(monthReport.getModifiedBy());
			monthReportDto.setCreatedBy(monthReport.getCreatedBy());			
			monthReportDto.setCreatedDate(monthReport.getCreatedDate());
			monthReportDto.setModifiedDate(monthReport.getModifiedDate());
		}
		return monthReportDto;
	}
	
	public static MonthReportProblemDto monRepProTomonRepProDto(MonthReportProblem monthReportProblem){
		MonthReportProblemDto monthReportProblemDto = new MonthReportProblemDto();
		if(monthReportProblem != null){
			monthReportProblemDto.setId(monthReportProblem.getId());
			monthReportProblemDto.setProblemIntroduction(monthReportProblem.getProblemIntroduction());
			monthReportProblemDto.setSolutionsAndSuggest(monthReportProblem.getSolutionsAndSuggest());
			monthReportProblemDto.setCreatedBy(monthReportProblem.getCreatedBy());
			monthReportProblemDto.setCreatedDate(monthReportProblem.getCreatedDate());
			monthReportProblemDto.setModifiedBy(monthReportProblem.getModifiedBy());
			monthReportProblemDto.setModifiedDate(monthReportProblem.getModifiedDate());
			monthReportProblemDto.setRemark(monthReportProblem.getRemark());
		}
		return monthReportProblemDto;
	}
	
}
