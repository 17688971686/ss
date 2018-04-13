package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoUnitInfo;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
/**
 * @Description: 申报信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class ShenBaoInfoMapper implements IMapper<ShenBaoInfoDto, ShenBaoInfo> {
	@Autowired
	IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
		
	@Override
	public ShenBaoInfoDto toDto(ShenBaoInfo entity) {
		ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
		if(entity!=null){			
			shenBaoInfoDto.setId(entity.getId());
			shenBaoInfoDto.setProjectShenBaoStage(entity.getProjectShenBaoStage());
			//begin#项目基本信息
			shenBaoInfoDto.setProjectId(entity.getProjectId());
			shenBaoInfoDto.setIsIncludLibrary(entity.getIsIncludLibrary());
			shenBaoInfoDto.setProjectNumber(entity.getProjectNumber());
			shenBaoInfoDto.setProjectName(entity.getProjectName());
			shenBaoInfoDto.setProjectStage(entity.getProjectStage());
			shenBaoInfoDto.setDivisionId(entity.getDivisionId());
			shenBaoInfoDto.setProjectAddress(entity.getProjectAddress());
			shenBaoInfoDto.setProjectType(entity.getProjectType());
			shenBaoInfoDto.setProjectCategory(entity.getProjectCategory());
			shenBaoInfoDto.setProjectIndustry(entity.getProjectIndustry());
			shenBaoInfoDto.setProjectInvestmentType(entity.getProjectInvestmentType());
			shenBaoInfoDto.setProjectClassify(entity.getProjectClassify());
			shenBaoInfoDto.setProjectRepName(entity.getProjectRepName());
			shenBaoInfoDto.setProjectRepMobile(entity.getProjectRepMobile());
			shenBaoInfoDto.setProjectIntro(entity.getProjectIntro());
			shenBaoInfoDto.setProjectGuiMo(entity.getProjectGuiMo());
			shenBaoInfoDto.setProjectInvestSum(entity.getProjectInvestSum());			
			shenBaoInfoDto.setProjectInvestAccuSum(entity.getProjectInvestAccuSum());
			shenBaoInfoDto.setBeginDate(entity.getBeginDate());
			shenBaoInfoDto.setEndDate(entity.getEndDate());
			shenBaoInfoDto.setUnitName(entity.getUnitName());
			shenBaoInfoDto.setRemark(entity.getRemark());
			shenBaoInfoDto.setNationalIndustry(entity.getNationalIndustry());
			//申报信息相关时间
			shenBaoInfoDto.setShenbaoDate(entity.getShenbaoDate());
			shenBaoInfoDto.setQianshouDate(entity.getQianshouDate());
			shenBaoInfoDto.setPifuDate(entity.getPifuDate());
			shenBaoInfoDto.setPlanYear(entity.getPlanYear());
			//资金来源
			shenBaoInfoDto.setCapitalQCZ_ggys(entity.getCapitalQCZ_ggys());
			shenBaoInfoDto.setCapitalQCZ_gtzj(entity.getCapitalQCZ_gtzj());
			shenBaoInfoDto.setCapitalSCZ_gtzj(entity.getCapitalSCZ_gtzj());
			shenBaoInfoDto.setCapitalSCZ_zxzj(entity.getCapitalSCZ_zxzj());
			shenBaoInfoDto.setCapitalSCZ_ggys(entity.getCapitalSCZ_ggys());
			shenBaoInfoDto.setCapitalSHTZ(entity.getCapitalSHTZ());
			shenBaoInfoDto.setCapitalZYYS(entity.getCapitalZYYS());
			shenBaoInfoDto.setCapitalOther(entity.getCapitalOther());
			shenBaoInfoDto.setCapitalOtherType(entity.getCapitalOtherType());
			shenBaoInfoDto.setCapitalOtherDescription(entity.getCapitalOtherDescription());
			//批复信息
			shenBaoInfoDto.setPifuJYS_date(entity.getPifuJYS_date());
			shenBaoInfoDto.setPifuKXXYJBG_date(entity.getPifuKXXYJBG_date());
			shenBaoInfoDto.setPifuCBSJYGS_date(entity.getPifuCBSJYGS_date());
			shenBaoInfoDto.setPifuKXXYJBG_wenhao(entity.getPifuKXXYJBG_wenhao());
			shenBaoInfoDto.setPifuCBSJYGS_wenhao(entity.getPifuCBSJYGS_wenhao());
			shenBaoInfoDto.setPifuJYS_wenhao(entity.getPifuJYS_wenhao());															
			//begin#年度计划
			shenBaoInfoDto.setProjectConstrChar(entity.getProjectConstrChar());
			shenBaoInfoDto.setYearPlanCapitalId(entity.getYearPlanCapitalId());
			shenBaoInfoDto.setConstructionUnit(entity.getConstructionUnit());
			shenBaoInfoDto.setIsApplyOutsideCapital(entity.getIsApplyOutsideCapital());
			shenBaoInfoDto.setApplyOutsideCapital(entity.getApplyOutsideCapital());
			shenBaoInfoDto.setIsIncludYearPlan(entity.getIsIncludYearPlan());
			//下一年度计划三年滚动--第一年
			shenBaoInfoDto.setApplyYearInvest(entity.getApplyYearInvest());//申请资金累计
			shenBaoInfoDto.setCapitalSCZ_ggys_TheYear(entity.getCapitalSCZ_ggys_TheYear());
			shenBaoInfoDto.setCapitalSCZ_gtzj_TheYear(entity.getCapitalSCZ_gtzj_TheYear());
			shenBaoInfoDto.setCapitalSCZ_qita(entity.getCapitalSCZ_qita());
			shenBaoInfoDto.setCapitalOtherDescriptionShenBao(entity.getCapitalOtherDescriptionShenBao());
			shenBaoInfoDto.setYearConstructionTask(entity.getYearConstructionTask());
			shenBaoInfoDto.setYearConstructionContent(entity.getYearConstructionContent());
			shenBaoInfoDto.setYearInvestApproval(entity.getYearInvestApproval());//安排资金累计
			shenBaoInfoDto.setCapitalAP_ggys_TheYear(entity.getCapitalAP_ggys_TheYear());
			shenBaoInfoDto.setCapitalAP_gtzj_TheYear(entity.getCapitalAP_gtzj_TheYear());
			shenBaoInfoDto.setCapitalAP_qita(entity.getCapitalAP_qita());
			//三年滚动--第二年
			shenBaoInfoDto.setApplyYearInvest_LastYear(entity.getApplyYearInvest_LastYear());//申请资金累计
			shenBaoInfoDto.setCapitalSCZ_gtzj_LastYear(entity.getCapitalSCZ_gtzj_LastYear());
			shenBaoInfoDto.setCapitalSCZ_ggys_LastYear(entity.getCapitalSCZ_ggys_LastYear());
			shenBaoInfoDto.setCapitalSCZ_qita_LastYear(entity.getCapitalSCZ_qita_LastYear());
			shenBaoInfoDto.setCapitalOtherDescriptionShenBao_LastYear(entity.getCapitalOtherDescriptionShenBao_LastYear());
			shenBaoInfoDto.setYearConstructionContentLastYear(entity.getYearConstructionContentLastYear());
			shenBaoInfoDto.setYearInvestApproval_lastYear(entity.getYearInvestApproval_lastYear());//安排资金累计
			shenBaoInfoDto.setCapitalAP_ggys_LastYear(entity.getCapitalAP_ggys_LastYear());
			shenBaoInfoDto.setCapitalAP_gtzj_LastYear(entity.getCapitalAP_gtzj_LastYear());
			shenBaoInfoDto.setCapitalAP_qita_LastYear(entity.getCapitalAP_qita_LastYear());
			//三年滚动--第三年
			shenBaoInfoDto.setApplyYearInvest_LastTwoYear(entity.getApplyYearInvest_LastTwoYear());//申请资金累计
			shenBaoInfoDto.setCapitalSCZ_gtzj_LastTwoYear(entity.getCapitalSCZ_gtzj_LastTwoYear());
			shenBaoInfoDto.setCapitalSCZ_ggys_LastTwoYear(entity.getCapitalSCZ_ggys_LastTwoYear());
			shenBaoInfoDto.setCapitalSCZ_qita_LastTwoYear(entity.getCapitalSCZ_qita_LastTwoYear());
			shenBaoInfoDto.setCapitalOtherDescriptionShenBao_LastTwoYear(entity.getCapitalOtherDescriptionShenBao_LastTwoYear());
			shenBaoInfoDto.setYearConstructionContentLastTwoYear(entity.getYearConstructionContentLastTwoYear());
			shenBaoInfoDto.setYearInvestApproval_lastTwoYear(entity.getYearInvestApproval_lastTwoYear());//安排资金累计
			shenBaoInfoDto.setCapitalAP_ggys_LastTwoYear(entity.getCapitalAP_ggys_LastTwoYear());
			shenBaoInfoDto.setCapitalAP_gtzj_LastTwoYear(entity.getCapitalAP_gtzj_LastTwoYear());
			shenBaoInfoDto.setCapitalAP_qita_LastTwoYear(entity.getCapitalAP_qita_LastTwoYear());
			
			shenBaoInfoDto.setApInvestSum(entity.getApInvestSum());//累计安排投资
			
			//申报信息备注
			shenBaoInfoDto.setYearConstructionContentShenBao(entity.getYearConstructionContentShenBao());
			shenBaoInfoDto.setPackageType(entity.getPackageType());//打包类型
			//计划下达
			shenBaoInfoDto.setIsPlanReach(entity.getIsPlanReach());
			shenBaoInfoDto.setSqPlanReach_ggys(entity.getSqPlanReach_ggys());
			shenBaoInfoDto.setSqPlanReach_gtzj(entity.getSqPlanReach_gtzj());
			shenBaoInfoDto.setApPlanReach_ggys(entity.getApPlanReach_ggys());
			shenBaoInfoDto.setApPlanReach_gtzj(entity.getApPlanReach_gtzj());
			
			//基础数据		
			shenBaoInfoDto.setCreatedDate(entity.getCreatedDate());
			shenBaoInfoDto.setModifiedDate(entity.getModifiedDate());
			shenBaoInfoDto.setModifiedBy(entity.getModifiedBy());
			shenBaoInfoDto.setCreatedBy(entity.getCreatedBy());
			shenBaoInfoDto.setItemOrder(entity.getItemOrder());			
			//begin#审批相关
			shenBaoInfoDto.setProcessState(entity.getProcessState());	
			shenBaoInfoDto.setProcessStage(entity.getProcessStage());
			shenBaoInfoDto.setZong_processId(entity.getZong_processId());
			shenBaoInfoDto.setThisTaskId(entity.getThisTaskId());
			shenBaoInfoDto.setThisTaskName(entity.getThisTaskName());
			//begin#财政局
			shenBaoInfoDto.setFunctionSubjects(entity.getFunctionSubjects());
			shenBaoInfoDto.setEconClassSubjects(entity.getEconClassSubjects());
			//begin#项目建议书
			shenBaoInfoDto.setProjectConstrBasis(entity.getProjectConstrBasis());
			//begin#可行性研究报告
			shenBaoInfoDto.setRecomProgram(entity.getRecomProgram());
			shenBaoInfoDto.setSocialAndEconomic(entity.getSocialAndEconomic());
			//begin#前期计划
			shenBaoInfoDto.setIsApplyQianQiFei(entity.getIsApplyQianQiFei());
			shenBaoInfoDto.setQianQiFeiApply(entity.getQianQiFeiApply());
			//begin#续建计划
			shenBaoInfoDto.setLastYearImageSchedule(entity.getLastYearImageSchedule());			
			//begin#竣工决算
			shenBaoInfoDto.setYearImageSchedule(entity.getYearImageSchedule());
			
			//为保存客户提供的数据添加字段
			shenBaoInfoDto.setConstructionCycle(entity.getConstructionCycle());//建设周期
			shenBaoInfoDto.setFinalAmount(entity.getFinalAmount());//决算金额
			shenBaoInfoDto.setFinanceProjectNumber(entity.getFinanceProjectNumber());//财政项目代码
			//begin#审核相关
			shenBaoInfoDto.setAuditState(entity.getAuditState());
			shenBaoInfoDto.setReceiver(entity.getReceiver());

			//begin#社会投资项目申报添加字段
			shenBaoInfoDto.setExistingProblem(entity.getExistingProblem());//存在的问题
			shenBaoInfoDto.setMoveSuggestion(entity.getMoveSuggestion());//推进建议
			shenBaoInfoDto.setConstructionLand(entity.getConstructionLand());
			shenBaoInfoDto.setLandPrice(entity.getLandPrice());//总投资--地价
			shenBaoInfoDto.setEquipmentInvestment(entity.getEquipmentInvestment());//总投资--设备投资
			shenBaoInfoDto.setBuidSafeInvestment(entity.getBuidSafeInvestment());//总投资--建安投资
			shenBaoInfoDto.setRepUnitRepName(entity.getRepUnitRepName());//责任单位联系人
			shenBaoInfoDto.setRepUnitRepMobile(entity.getRepUnitRepMobile());//责任单位联系电话
			shenBaoInfoDto.setCompanyName(entity.getCompanyName());//企业单位名称
			shenBaoInfoDto.setApproval_pzwh(entity.getApproval_pzwh());//核准/备案批准文号
			shenBaoInfoDto.setUseBenefits(entity.getUseBenefits());//投入使用后的效益

			//begin关联信息
			//附件
			entity.getAttachments().stream().forEach(x->{
				shenBaoInfoDto.getAttachmentDtos().add(attachmentMapper.toDto(x));				
			});
			//申报单位
			shenBaoInfoDto.setShenBaoUnitInfoDto(shenBaoUnitInfoMapper.toDto(entity.getShenBaoUnitInfo()));
			//编制单位
			shenBaoInfoDto.setBianZhiUnitInfoDto(shenBaoUnitInfoMapper.toDto(entity.getBianZhiUnitInfo()));
		}
		return  shenBaoInfoDto;
	}

	@Override
	public ShenBaoInfo buildEntity(ShenBaoInfoDto shenBaoInfoDto, ShenBaoInfo shenBaoInfo) {
		if(shenBaoInfoDto !=null && shenBaoInfo !=null){
			if(shenBaoInfo.getId() == null || shenBaoInfo.getId().isEmpty()){
				shenBaoInfo.setId(UUID.randomUUID().toString());
			}
			shenBaoInfo.setProjectShenBaoStage(shenBaoInfoDto.getProjectShenBaoStage());			
			//begin#项目基本信息
			shenBaoInfo.setProjectId(shenBaoInfoDto.getProjectId());
			shenBaoInfo.setIsIncludLibrary(shenBaoInfoDto.getIsIncludLibrary());
			shenBaoInfo.setProjectNumber(shenBaoInfoDto.getProjectNumber());
			shenBaoInfo.setProjectStage(shenBaoInfoDto.getProjectStage());
			shenBaoInfo.setProjectName(shenBaoInfoDto.getProjectName());		
			shenBaoInfo.setProjectType(shenBaoInfoDto.getProjectType());
			shenBaoInfo.setProjectInvestmentType(shenBaoInfoDto.getProjectInvestmentType());
			shenBaoInfo.setProjectClassify(shenBaoInfoDto.getProjectClassify());
			shenBaoInfo.setProjectIndustry(shenBaoInfoDto.getProjectIndustry());
			shenBaoInfo.setProjectCategory(shenBaoInfoDto.getProjectCategory());
			shenBaoInfo.setProjectInvestSum(shenBaoInfoDto.getProjectInvestSum());
			shenBaoInfo.setProjectInvestAccuSum(shenBaoInfoDto.getProjectInvestAccuSum());
			shenBaoInfo.setDivisionId(shenBaoInfoDto.getDivisionId());
			shenBaoInfo.setProjectAddress(shenBaoInfoDto.getProjectAddress());
			shenBaoInfo.setProjectRepName(shenBaoInfoDto.getProjectRepName());
			shenBaoInfo.setProjectRepMobile(shenBaoInfoDto.getProjectRepMobile());
			shenBaoInfo.setProjectIntro(shenBaoInfoDto.getProjectIntro());
			shenBaoInfo.setProjectGuiMo(shenBaoInfoDto.getProjectGuiMo());
			shenBaoInfo.setBeginDate(shenBaoInfoDto.getBeginDate());
			shenBaoInfo.setEndDate(shenBaoInfoDto.getEndDate());		
			shenBaoInfo.setUnitName(shenBaoInfoDto.getUnitName());
			shenBaoInfo.setRemark(shenBaoInfoDto.getRemark());
			shenBaoInfo.setNationalIndustry(shenBaoInfoDto.getNationalIndustry());
			//申报信息相关时间
			shenBaoInfo.setShenbaoDate(shenBaoInfoDto.getShenbaoDate());
			shenBaoInfo.setQianshouDate(shenBaoInfoDto.getQianshouDate());
			shenBaoInfo.setPifuDate(shenBaoInfoDto.getPifuDate());
			shenBaoInfo.setPlanYear(shenBaoInfoDto.getPlanYear());
			//资金来源
			shenBaoInfo.setCapitalQCZ_gtzj(shenBaoInfoDto.getCapitalQCZ_gtzj());
			shenBaoInfo.setCapitalQCZ_ggys(shenBaoInfoDto.getCapitalQCZ_ggys());
			shenBaoInfo.setCapitalSCZ_gtzj(shenBaoInfoDto.getCapitalSCZ_gtzj());
			shenBaoInfo.setCapitalSCZ_ggys(shenBaoInfoDto.getCapitalSCZ_ggys());
			shenBaoInfo.setCapitalSCZ_zxzj(shenBaoInfoDto.getCapitalSCZ_zxzj());
			shenBaoInfo.setCapitalZYYS(shenBaoInfoDto.getCapitalZYYS());
			shenBaoInfo.setCapitalSHTZ(shenBaoInfoDto.getCapitalSHTZ());
			shenBaoInfo.setCapitalOther(shenBaoInfoDto.getCapitalOther());
			shenBaoInfo.setCapitalOtherType(shenBaoInfoDto.getCapitalOtherType());
			shenBaoInfo.setCapitalOtherDescription(shenBaoInfoDto.getCapitalOtherDescription());
			//批复信息
			shenBaoInfo.setPifuCBSJYGS_date(shenBaoInfoDto.getPifuCBSJYGS_date());
			shenBaoInfo.setPifuCBSJYGS_wenhao(shenBaoInfoDto.getPifuCBSJYGS_wenhao());
			shenBaoInfo.setPifuKXXYJBG_date(shenBaoInfoDto.getPifuKXXYJBG_date());			
			shenBaoInfo.setPifuKXXYJBG_wenhao(shenBaoInfoDto.getPifuKXXYJBG_wenhao());			
			shenBaoInfo.setPifuJYS_wenhao(shenBaoInfoDto.getPifuJYS_wenhao());
			shenBaoInfo.setPifuJYS_date(shenBaoInfoDto.getPifuJYS_date());
			shenBaoInfo.setModifiedDate(shenBaoInfoDto.getModifiedDate());							
			//begin#年度计划
			shenBaoInfo.setProjectConstrChar(shenBaoInfoDto.getProjectConstrChar());
			shenBaoInfo.setYearPlanCapitalId(shenBaoInfoDto.getYearPlanCapitalId());//安排年度投资Id
			shenBaoInfo.setConstructionUnit(shenBaoInfoDto.getConstructionUnit());
			shenBaoInfo.setIsApplyOutsideCapital(shenBaoInfoDto.getIsApplyOutsideCapital());
			shenBaoInfo.setApplyOutsideCapital(shenBaoInfoDto.getApplyOutsideCapital());
			shenBaoInfo.setIsIncludYearPlan(shenBaoInfoDto.getIsIncludYearPlan());
			//下一年度计划（三年滚动）--第一年
			shenBaoInfo.setApplyYearInvest(shenBaoInfoDto.getApplyYearInvest());//申请年度投资累计
			shenBaoInfo.setCapitalSCZ_ggys_TheYear(shenBaoInfoDto.getCapitalSCZ_ggys_TheYear());
			shenBaoInfo.setCapitalSCZ_gtzj_TheYear(shenBaoInfoDto.getCapitalSCZ_gtzj_TheYear());
			shenBaoInfo.setCapitalSCZ_qita(shenBaoInfoDto.getCapitalSCZ_qita());
			shenBaoInfo.setCapitalOtherDescriptionShenBao(shenBaoInfoDto.getCapitalOtherDescriptionShenBao());
			shenBaoInfo.setYearConstructionTask(shenBaoInfoDto.getYearConstructionTask());
			shenBaoInfo.setYearConstructionContent(shenBaoInfoDto.getYearConstructionContent());
			shenBaoInfo.setYearInvestApproval(shenBaoInfoDto.getYearInvestApproval());//安排年度投资累计
			shenBaoInfo.setCapitalAP_ggys_TheYear(shenBaoInfoDto.getCapitalAP_ggys_TheYear());
			shenBaoInfo.setCapitalAP_gtzj_TheYear(shenBaoInfoDto.getCapitalAP_gtzj_TheYear());
			shenBaoInfo.setCapitalAP_qita(shenBaoInfoDto.getCapitalAP_qita());
			//三年滚动--第二年
			shenBaoInfo.setApplyYearInvest_LastYear(shenBaoInfoDto.getApplyYearInvest_LastYear());//申请年度投资累计
			shenBaoInfo.setCapitalSCZ_ggys_LastYear(shenBaoInfoDto.getCapitalSCZ_ggys_LastYear());
			shenBaoInfo.setCapitalSCZ_gtzj_LastYear(shenBaoInfoDto.getCapitalSCZ_gtzj_LastYear());
			shenBaoInfo.setCapitalSCZ_qita_LastYear(shenBaoInfoDto.getCapitalSCZ_qita_LastYear());
			shenBaoInfo.setCapitalOtherDescriptionShenBao_LastYear(shenBaoInfoDto.getCapitalOtherDescriptionShenBao_LastYear());
			shenBaoInfo.setYearConstructionContentLastYear(shenBaoInfoDto.getYearConstructionContentLastYear());
			shenBaoInfo.setYearInvestApproval_lastYear(shenBaoInfoDto.getYearInvestApproval_lastYear());//安排年度投资累计
			shenBaoInfo.setCapitalAP_ggys_LastYear(shenBaoInfoDto.getCapitalAP_ggys_LastYear());
			shenBaoInfo.setCapitalAP_gtzj_LastYear(shenBaoInfoDto.getCapitalAP_gtzj_LastYear());
			shenBaoInfo.setCapitalAP_qita_LastYear(shenBaoInfoDto.getCapitalAP_qita_LastYear());
			//三年滚动--第三年
			shenBaoInfo.setApplyYearInvest_LastTwoYear(shenBaoInfoDto.getApplyYearInvest_LastTwoYear());//申请年度投资累计		
			shenBaoInfo.setCapitalSCZ_gtzj_LastTwoYear(shenBaoInfoDto.getCapitalSCZ_gtzj_LastTwoYear());
			shenBaoInfo.setCapitalSCZ_ggys_LastTwoYear(shenBaoInfoDto.getCapitalSCZ_ggys_LastTwoYear());
			shenBaoInfo.setCapitalSCZ_qita_LastTwoYear(shenBaoInfoDto.getCapitalSCZ_qita_LastTwoYear());
			shenBaoInfo.setCapitalOtherDescriptionShenBao_LastTwoYear(shenBaoInfoDto.getCapitalOtherDescriptionShenBao_LastTwoYear());
			shenBaoInfo.setYearConstructionContentLastTwoYear(shenBaoInfoDto.getYearConstructionContentLastTwoYear());
			shenBaoInfo.setYearInvestApproval_lastTwoYear(shenBaoInfoDto.getYearInvestApproval_lastTwoYear());//安排年度投资累计
			shenBaoInfo.setCapitalAP_ggys_LastTwoYear(shenBaoInfoDto.getCapitalAP_ggys_LastTwoYear());
			shenBaoInfo.setCapitalAP_gtzj_LastTwoYear(shenBaoInfoDto.getCapitalAP_gtzj_LastTwoYear());
			shenBaoInfo.setCapitalAP_qita_LastTwoYear(shenBaoInfoDto.getCapitalAP_qita_LastTwoYear());
			
			shenBaoInfo.setApInvestSum(shenBaoInfoDto.getApInvestSum());//累计安排投资
			//申报信息备注
			shenBaoInfo.setYearConstructionContentShenBao(shenBaoInfoDto.getYearConstructionContentShenBao());
			shenBaoInfo.setPackageType(shenBaoInfoDto.getPackageType());//打包类型
			//计划下达
			shenBaoInfo.setIsPlanReach(shenBaoInfoDto.getIsPlanReach());
			shenBaoInfo.setSqPlanReach_ggys(shenBaoInfoDto.getSqPlanReach_ggys());
			shenBaoInfo.setSqPlanReach_gtzj(shenBaoInfoDto.getSqPlanReach_gtzj());
			shenBaoInfo.setApPlanReach_ggys(shenBaoInfoDto.getApPlanReach_ggys());
			shenBaoInfo.setApPlanReach_gtzj(shenBaoInfoDto.getApPlanReach_gtzj());
			
			//begin#审批相关
			shenBaoInfo.setProcessState(shenBaoInfoDto.getProcessState());
			shenBaoInfo.setProcessStage(shenBaoInfoDto.getProcessStage());
			shenBaoInfo.setZong_processId(shenBaoInfoDto.getZong_processId());
			shenBaoInfo.setThisTaskId(shenBaoInfoDto.getThisTaskId());
			shenBaoInfo.setThisTaskName(shenBaoInfoDto.getThisTaskName());
			//begin#财政相关
			shenBaoInfo.setFunctionSubjects(shenBaoInfoDto.getFunctionSubjects());
			shenBaoInfo.setEconClassSubjects(shenBaoInfoDto.getEconClassSubjects());
			//begin#项目建议书
			shenBaoInfo.setProjectConstrBasis(shenBaoInfoDto.getProjectConstrBasis());
			//begin#可行性研究报告
			shenBaoInfo.setRecomProgram(shenBaoInfoDto.getRecomProgram());
			shenBaoInfo.setSocialAndEconomic(shenBaoInfoDto.getSocialAndEconomic());
			//begin#前期计划
			shenBaoInfo.setIsApplyQianQiFei(shenBaoInfoDto.getIsApplyQianQiFei());
			shenBaoInfo.setQianQiFeiApply(shenBaoInfoDto.getQianQiFeiApply());
			//begin#续建计划
			shenBaoInfo.setLastYearImageSchedule(shenBaoInfoDto.getLastYearImageSchedule());
			//begin#竣工决算
			shenBaoInfo.setYearImageSchedule(shenBaoInfoDto.getYearImageSchedule());
			//基础数据																														
			shenBaoInfo.setModifiedBy(shenBaoInfoDto.getModifiedBy());
			shenBaoInfo.setCreatedBy(shenBaoInfoDto.getCreatedBy());
			shenBaoInfo.setCreatedDate(shenBaoInfoDto.getCreatedDate());
			shenBaoInfo.setModifiedDate(shenBaoInfoDto.getModifiedDate());
			shenBaoInfo.setItemOrder(shenBaoInfoDto.getItemOrder());
			//begin#关联信息：外部根据需要自己创建
			//为保存客户提供的数据添加字段
			shenBaoInfo.setConstructionCycle(shenBaoInfoDto.getConstructionCycle());//建设周期
			shenBaoInfo.setFinalAmount(shenBaoInfoDto.getFinalAmount());//决算金额
			shenBaoInfo.setFinanceProjectNumber(shenBaoInfoDto.getFinanceProjectNumber());//财政项目代码
			//begin#审核相关
			shenBaoInfo.setAuditState(shenBaoInfoDto.getAuditState());
			shenBaoInfo.setReceiver(shenBaoInfoDto.getReceiver());

			//begin#社会投资项目申报添加字段
			shenBaoInfo.setExistingProblem(shenBaoInfoDto.getExistingProblem());//存在的问题
			shenBaoInfo.setMoveSuggestion(shenBaoInfoDto.getMoveSuggestion());//推进建议
			shenBaoInfo.setConstructionLand(shenBaoInfoDto.getConstructionLand());
			shenBaoInfo.setLandPrice(shenBaoInfoDto.getLandPrice());//总投资--地价
			shenBaoInfo.setEquipmentInvestment(shenBaoInfoDto.getEquipmentInvestment());//总投资--设备投资
			shenBaoInfo.setBuidSafeInvestment(shenBaoInfoDto.getBuidSafeInvestment());//总投资--建安投资
			shenBaoInfo.setRepUnitRepName(shenBaoInfoDto.getRepUnitRepName());//责任单位联系人
			shenBaoInfo.setRepUnitRepMobile(shenBaoInfoDto.getRepUnitRepMobile());//责任单位联系电话
			shenBaoInfo.setCompanyName(shenBaoInfoDto.getCompanyName());//企业单位名称
			shenBaoInfo.setApproval_pzwh(shenBaoInfoDto.getApproval_pzwh());//核准/备案批准文号
			shenBaoInfo.setUseBenefits(shenBaoInfoDto.getUseBenefits());//投入使用后的效益
		}
		return shenBaoInfo;
	}
}


