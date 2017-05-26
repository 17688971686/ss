package cs.model.DtoMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.ProjectInfo;
import cs.domain.UnitInfo;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectInfoDto;
import cs.model.DomainDto.UnitInfoDto;

public class ProjectInfoMapper {
	public static ProjectInfoDto toDto(ProjectInfo projectInfo) {
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
				UnitInfoDto unitInfoDtoBZ = UnitInfoMapper.toDto(unitInfoBZ);
				projectInfoDto.setBianZhiUnit(unitInfoDtoBZ);
			}
			
			
			//将申报单位信息进行处理
			UnitInfo unitInfo = projectInfo.getShenBaoUnit();
			if(unitInfo!=null){
				UnitInfoDto unitInfoDto = UnitInfoMapper.toDto(unitInfo);
				projectInfoDto.setShenBaoUnit(unitInfoDto);
			}
			
			
			//将附件信息进行处理
			List<Attachment> attachments = projectInfo.getAttachments();
			List<AttachmentDto> attachmentDtos = new ArrayList<>();
			attachments.forEach(x->{
				AttachmentDto attachmentDto = AttachmentMapper.toDto(x);
				attachmentDtos.add(attachmentDto);
				
			});
			projectInfoDto.setAttachmentDtos(attachmentDtos);
			
			
			
			//将月报信息进行处理
			List<MonthReport> monthReports = projectInfo.getMonthReports();
			List<MonthReportDto> monthReportDtos = new ArrayList<>();
			monthReports.forEach(x->{
				MonthReportDto monthReportDto = MonthReportMapper.toDto(x);
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
	
	public static void buildEntity(ProjectInfoDto projectInfoDto,ProjectInfo projectInfo){
		
		//判断参数是否为空
		if(projectInfoDto != null){
			//进行数据的转换
			if(projectInfo.getId() ==null || projectInfo.getId().isEmpty()){
				projectInfo.setId(UUID.randomUUID().toString());
			}
			
			projectInfo.setProjectNumber(projectInfoDto.getProjectNumber());
			//获取以下信息用于列表展示
			projectInfo.setProjectStage(projectInfoDto.getProjectStage());//项目阶段(代码)					
			projectInfo.setShenBaoYear(projectInfoDto.getShenBaoYear());//申报年度
			projectInfo.setProjectName(projectInfoDto.getProjectName());//项目名称
			projectInfo.setInvestType(projectInfoDto.getInvestType());//投资类型(代码)			
			projectInfo.setProjectStatus(projectInfoDto.getProjectStatus());//项目状态
			
			projectInfo.setIndustry(projectInfoDto.getIndustry());//国民经济行业分类(代码)		
			projectInfo.setProjectIndustry(projectInfoDto.getProjectIndustry());//项目行业归口(代码)
			
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
			UnitInfoDto unitInfoDto_bianZhi = projectInfoDto.getBianZhiUnitDto();
			UnitInfoDto unitInfoDto_shenBao = projectInfoDto.getShenBaoUnitDto();
			//进行数据的转换
			UnitInfo unitInfo_bianZhi = new UnitInfo();
			UnitInfoMapper.buildEntity(unitInfoDto_bianZhi,unitInfo_bianZhi);
			UnitInfo unitInfo_shenBao =  new UnitInfo();
			UnitInfoMapper.buildEntity(unitInfoDto_shenBao,unitInfo_shenBao);
	
			projectInfo.setBianZhiUnit(unitInfo_bianZhi);
			projectInfo.setShenBaoUnit(unitInfo_shenBao);
				//附件
					List<AttachmentDto> attachmentDtos = projectInfoDto.getAttachmentDtos();
					List<Attachment> attachments = new ArrayList<>();
					if(attachmentDtos !=null && attachmentDtos.size()>0){
						attachmentDtos.forEach(x->{
							Attachment attachment = new Attachment();
							AttachmentMapper.buildEntity(x,attachment);
							attachments.add(attachment);
						});
					}
					projectInfo.setAttachments(attachments);
			//end#关联信息
	
		}	
	}
}
