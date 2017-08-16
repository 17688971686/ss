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
			//申报年份信息
			shenBaoInfoDto.setPlanYear(entity.getPlanYear());
			shenBaoInfoDto.setApplyYearInvest(entity.getApplyYearInvest());
			shenBaoInfoDto.setCapitalSCZ_ggys_TheYear(entity.getCapitalSCZ_ggys_TheYear());
			shenBaoInfoDto.setCapitalSCZ_gtzj_TheYear(entity.getCapitalSCZ_gtzj_TheYear());
			shenBaoInfoDto.setCapitalSCZ_qita(entity.getCapitalSCZ_qita());
			shenBaoInfoDto.setYearConstructionTask(entity.getYearConstructionTask());
			shenBaoInfoDto.setYearConstructionContent(entity.getYearConstructionContent());
			shenBaoInfoDto.setYearInvestApproval(entity.getYearInvestApproval());
			//三年滚动--下一年
			shenBaoInfoDto.setApplyYearInvest_LastYear(entity.getApplyYearInvest_LastYear());
			shenBaoInfoDto.setCapitalSCZ_gtzj_LastYear(entity.getCapitalSCZ_gtzj_LastYear());
			shenBaoInfoDto.setCapitalSCZ_ggys_LastYear(entity.getCapitalSCZ_ggys_LastYear());
			shenBaoInfoDto.setCapitalSCZ_qita_LastYear(entity.getCapitalSCZ_qita_LastYear());
			shenBaoInfoDto.setYearConstructionContentLastYear(entity.getYearConstructionContentLastYear());
			shenBaoInfoDto.setYearInvestApproval_lastYear(entity.getYearInvestApproval_lastYear());
			//三年滚动--下两年
			shenBaoInfoDto.setApplyYearInvest_LastTwoYear(entity.getApplyYearInvest_LastTwoYear());
			shenBaoInfoDto.setCapitalSCZ_gtzj_LastTwoYear(entity.getCapitalSCZ_gtzj_LastTwoYear());
			shenBaoInfoDto.setCapitalSCZ_ggys_LastTwoYear(entity.getCapitalSCZ_ggys_LastTwoYear());
			shenBaoInfoDto.setCapitalSCZ_qita_LastTwoYear(entity.getCapitalSCZ_qita_LastTwoYear());
			shenBaoInfoDto.setYearConstructionContentLastTwoYear(entity.getYearConstructionContentLastTwoYear());
			shenBaoInfoDto.setYearInvestApproval_lastTwoYear(entity.getYearInvestApproval_lastTwoYear());
			//备注
			shenBaoInfoDto.setYearConstructionContentShenBao(entity.getYearConstructionContentShenBao());
			//其他资金来源
			shenBaoInfoDto.setCapitalOtherDescriptionShenBao(entity.getCapitalOtherDescriptionShenBao());
			shenBaoInfoDto.setCapitalOtherDescriptionShenBao_LastYear(entity.getCapitalOtherDescriptionShenBao_LastYear());
			shenBaoInfoDto.setCapitalOtherDescriptionShenBao_LastTwoYear(entity.getCapitalOtherDescriptionShenBao_LastTwoYear());
			
			//安排资金来源
			shenBaoInfoDto.setCapitalAP_ggys_LastTwoYear(entity.getCapitalAP_ggys_LastTwoYear());
			shenBaoInfoDto.setCapitalAP_ggys_LastYear(entity.getCapitalAP_ggys_LastYear());
			shenBaoInfoDto.setCapitalAP_ggys_TheYear(entity.getCapitalAP_ggys_TheYear());
			
			shenBaoInfoDto.setCapitalAP_gtzj_LastTwoYear(entity.getCapitalAP_gtzj_LastTwoYear());
			shenBaoInfoDto.setCapitalAP_gtzj_LastYear(entity.getCapitalAP_gtzj_LastYear());
			shenBaoInfoDto.setCapitalAP_gtzj_TheYear(entity.getCapitalAP_gtzj_TheYear());
			
			shenBaoInfoDto.setCapitalAP_qita_LastTwoYear(entity.getCapitalAP_qita_LastTwoYear());
			shenBaoInfoDto.setCapitalAP_qita_LastYear(entity.getCapitalAP_qita_LastYear());
			shenBaoInfoDto.setCapitalAP_qita(entity.getCapitalAP_qita());
			//基础数据		
			shenBaoInfoDto.setCreatedDate(entity.getCreatedDate());
			shenBaoInfoDto.setModifiedDate(entity.getModifiedDate());
			shenBaoInfoDto.setModifiedBy(entity.getModifiedBy());
			shenBaoInfoDto.setCreatedBy(entity.getCreatedBy());
			shenBaoInfoDto.setItemOrder(entity.getItemOrder());			
			//begin#审批相关
			shenBaoInfoDto.setProcessState(entity.getProcessState());			
			//begin#财政局
			shenBaoInfoDto.setFunctionSubjects(entity.getFunctionSubjects());
			shenBaoInfoDto.setEconClassSubjects(entity.getEconClassSubjects());
			//为保存客户提供的数据添加字段
			shenBaoInfoDto.setConstructionCycle(entity.getConstructionCycle());//建设周期
			shenBaoInfoDto.setFinalAmount(entity.getFinalAmount());//决算金额
			shenBaoInfoDto.setFinanceProjectNumber(entity.getFinanceProjectNumber());//财政项目代码
			//begin#审核相关
			shenBaoInfoDto.setAuditState(entity.getAuditState());
						
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
			//申报年份
			shenBaoInfo.setPlanYear(shenBaoInfoDto.getPlanYear());
			shenBaoInfo.setApplyYearInvest(shenBaoInfoDto.getApplyYearInvest());//申请年度投资
			shenBaoInfo.setCapitalSCZ_ggys_TheYear(shenBaoInfoDto.getCapitalSCZ_ggys_TheYear());
			shenBaoInfo.setCapitalSCZ_gtzj_TheYear(shenBaoInfoDto.getCapitalSCZ_gtzj_TheYear());
			shenBaoInfo.setCapitalSCZ_qita(shenBaoInfoDto.getCapitalSCZ_qita());
			shenBaoInfo.setYearConstructionTask(shenBaoInfoDto.getYearConstructionTask());
			shenBaoInfo.setYearConstructionContent(shenBaoInfoDto.getYearConstructionContent());
			shenBaoInfo.setYearInvestApproval(shenBaoInfoDto.getYearInvestApproval());//安排年度投资
			//三年滚动--下一年
			shenBaoInfo.setApplyYearInvest_LastYear(shenBaoInfoDto.getApplyYearInvest_LastYear());
			shenBaoInfo.setCapitalSCZ_ggys_LastYear(shenBaoInfoDto.getCapitalSCZ_ggys_LastYear());
			shenBaoInfo.setCapitalSCZ_gtzj_LastYear(shenBaoInfoDto.getCapitalSCZ_gtzj_LastYear());
			shenBaoInfo.setCapitalSCZ_qita_LastYear(shenBaoInfoDto.getCapitalSCZ_qita_LastYear());
			shenBaoInfo.setYearConstructionContentLastYear(shenBaoInfoDto.getYearConstructionContentLastYear());
			shenBaoInfo.setYearInvestApproval_lastYear(shenBaoInfoDto.getYearInvestApproval_lastYear());
			//三年滚动--下下年
			shenBaoInfo.setApplyYearInvest_LastTwoYear(shenBaoInfoDto.getApplyYearInvest_LastTwoYear());		
			shenBaoInfo.setCapitalSCZ_gtzj_LastTwoYear(shenBaoInfoDto.getCapitalSCZ_gtzj_LastTwoYear());
			shenBaoInfo.setCapitalSCZ_ggys_LastTwoYear(shenBaoInfoDto.getCapitalSCZ_ggys_LastTwoYear());
			shenBaoInfo.setCapitalSCZ_qita_LastTwoYear(shenBaoInfoDto.getCapitalSCZ_qita_LastTwoYear());
			shenBaoInfo.setYearConstructionContentLastTwoYear(shenBaoInfoDto.getYearConstructionContentLastTwoYear());
			shenBaoInfo.setYearInvestApproval_lastTwoYear(shenBaoInfoDto.getYearInvestApproval_lastTwoYear());
			//备注
			shenBaoInfo.setYearConstructionContentShenBao(shenBaoInfoDto.getYearConstructionContentShenBao());
			
			//其他资金来源
			shenBaoInfo.setCapitalOtherDescriptionShenBao(shenBaoInfoDto.getCapitalOtherDescriptionShenBao());
			shenBaoInfo.setCapitalOtherDescriptionShenBao_LastYear(shenBaoInfoDto.getCapitalOtherDescriptionShenBao_LastYear());
			shenBaoInfo.setCapitalOtherDescriptionShenBao_LastTwoYear(shenBaoInfoDto.getCapitalOtherDescriptionShenBao_LastTwoYear());

			//安排资金来源
			shenBaoInfo.setCapitalAP_ggys_LastTwoYear(shenBaoInfoDto.getCapitalAP_ggys_LastTwoYear());
			shenBaoInfo.setCapitalAP_ggys_LastYear(shenBaoInfoDto.getCapitalAP_ggys_LastYear());
			shenBaoInfo.setCapitalAP_ggys_TheYear(shenBaoInfoDto.getCapitalAP_ggys_TheYear());
			
			shenBaoInfo.setCapitalAP_gtzj_LastTwoYear(shenBaoInfoDto.getCapitalAP_gtzj_LastTwoYear());
			shenBaoInfo.setCapitalAP_gtzj_LastYear(shenBaoInfoDto.getCapitalAP_gtzj_LastYear());
			shenBaoInfo.setCapitalAP_gtzj_TheYear(shenBaoInfoDto.getCapitalAP_gtzj_TheYear());
			
			shenBaoInfo.setCapitalAP_qita_LastTwoYear(shenBaoInfoDto.getCapitalAP_qita_LastTwoYear());
			shenBaoInfo.setCapitalAP_qita_LastYear(shenBaoInfoDto.getCapitalAP_qita_LastYear());
			shenBaoInfo.setCapitalAP_qita(shenBaoInfoDto.getCapitalAP_qita());
			//begin#审批相关
			shenBaoInfo.setProcessState(shenBaoInfoDto.getProcessState());
			//begin#财政相关
			shenBaoInfo.setFunctionSubjects(shenBaoInfoDto.getFunctionSubjects());
			shenBaoInfo.setEconClassSubjects(shenBaoInfoDto.getEconClassSubjects());
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
		}
		return shenBaoInfo;
		
	}

	

}


