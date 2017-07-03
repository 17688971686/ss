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
			
			shenBaoInfoDto.setPifuJYS_date(entity.getPifuJYS_date());
			shenBaoInfoDto.setPifuKXXYJBG_date(entity.getPifuKXXYJBG_date());
			shenBaoInfoDto.setPifuCBSJYGS_date(entity.getPifuCBSJYGS_date());
			shenBaoInfoDto.setPifuKXXYJBG_wenhao(entity.getPifuKXXYJBG_wenhao());
			shenBaoInfoDto.setPifuCBSJYGS_wenhao(entity.getPifuCBSJYGS_wenhao());
			shenBaoInfoDto.setPifuJYS_wenhao(entity.getPifuJYS_wenhao());			
												
			//begin#年度计划
			shenBaoInfoDto.setProjectConstrChar(entity.getProjectConstrChar());
			shenBaoInfoDto.setPlanYear(entity.getPlanYear());
			shenBaoInfoDto.setApplyYearInvest(entity.getApplyYearInvest());
			shenBaoInfoDto.setYearInvestApproval(entity.getYearInvestApproval());
			shenBaoInfoDto.setYearConstructionTask(entity.getYearConstructionTask());
			shenBaoInfoDto.setYearConstructionContent(entity.getYearConstructionContent());
			shenBaoInfoDto.setYearPlanCapitalId(entity.getYearPlanCapitalId());
						
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
			
			shenBaoInfo.setPifuCBSJYGS_date(shenBaoInfoDto.getPifuCBSJYGS_date());
			shenBaoInfo.setPifuCBSJYGS_wenhao(shenBaoInfoDto.getPifuCBSJYGS_wenhao());
			shenBaoInfo.setPifuKXXYJBG_date(shenBaoInfoDto.getPifuKXXYJBG_date());			
			shenBaoInfo.setPifuKXXYJBG_wenhao(shenBaoInfoDto.getPifuKXXYJBG_wenhao());			
			shenBaoInfo.setPifuJYS_wenhao(shenBaoInfoDto.getPifuJYS_wenhao());
			shenBaoInfo.setPifuJYS_date(shenBaoInfoDto.getPifuJYS_date());
			shenBaoInfo.setModifiedDate(shenBaoInfoDto.getModifiedDate());
																																		
			shenBaoInfo.setModifiedBy(shenBaoInfoDto.getModifiedBy());
			shenBaoInfo.setCreatedBy(shenBaoInfoDto.getCreatedBy());
			shenBaoInfo.setCreatedDate(shenBaoInfoDto.getCreatedDate());
			shenBaoInfo.setModifiedDate(shenBaoInfoDto.getModifiedDate());
			shenBaoInfo.setItemOrder(shenBaoInfoDto.getItemOrder());
									
			//begin#年度计划
			shenBaoInfo.setProjectConstrChar(shenBaoInfoDto.getProjectConstrChar());
			shenBaoInfo.setPlanYear(shenBaoInfoDto.getPlanYear());			
			shenBaoInfo.setApplyYearInvest(shenBaoInfoDto.getApplyYearInvest());//申请年度投资
			shenBaoInfo.setYearInvestApproval(shenBaoInfoDto.getYearInvestApproval());//安排年度投资
			shenBaoInfo.setYearPlanCapitalId(shenBaoInfoDto.getYearPlanCapitalId());//安排年度投资Id
			shenBaoInfo.setYearConstructionTask(shenBaoInfoDto.getYearConstructionTask());
			shenBaoInfo.setYearConstructionContent(shenBaoInfoDto.getYearConstructionContent());
			
			//begin#审批相关
			shenBaoInfo.setProcessState(shenBaoInfoDto.getProcessState());
			
			//begin#财政相关
			shenBaoInfo.setFunctionSubjects(shenBaoInfoDto.getFunctionSubjects());
			shenBaoInfo.setEconClassSubjects(shenBaoInfoDto.getEconClassSubjects());
		}
		return shenBaoInfo;
		
	}

	

}


