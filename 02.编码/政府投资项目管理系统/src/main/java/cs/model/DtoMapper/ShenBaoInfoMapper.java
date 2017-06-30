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
			shenBaoInfoDto.setProjectId(entity.getProjectId());
			shenBaoInfoDto.setProjectNumber(entity.getProjectNumber());
			shenBaoInfoDto.setProjectName(entity.getProjectName());
			shenBaoInfoDto.setProjectStage(entity.getProjectStage());
			shenBaoInfoDto.setProjectAddress(entity.getProjectAddress());
			shenBaoInfoDto.setProjectType(entity.getProjectType());
			shenBaoInfoDto.setProjectCategory(entity.getProjectCategory());
			shenBaoInfoDto.setProjectIndustry(entity.getProjectIndustry());
			shenBaoInfoDto.setProjectClassify(entity.getProjectClassify());
//			shenBaoInfoDto.setProjectFunctionClassify(entity.getProjectFunctionClassify());
//			shenBaoInfoDto.setProjectGoverEconClassify(entity.getProjectGoverEconClassify());
			shenBaoInfoDto.setProjectIntro(entity.getProjectIntro());
			shenBaoInfoDto.setProjectGuiMo(entity.getProjectGuiMo());
			shenBaoInfoDto.setPlanYear(entity.getPlanYear());
			shenBaoInfoDto.setProjectConstrChar(entity.getProjectConstrChar());
			shenBaoInfoDto.setProjectShenBaoStage(entity.getProjectShenBaoStage());
						
			//begin#年度计划
			shenBaoInfoDto.setApplyYearInvest(entity.getApplyYearInvest());
			shenBaoInfoDto.setYearInvestApproval(entity.getYearInvestApproval());
			shenBaoInfoDto.setYearConstructionTask(entity.getYearConstructionTask());
			shenBaoInfoDto.setYearConstructionContent(entity.getYearConstructionContent());
			shenBaoInfoDto.setYearPlanCapitalId(entity.getYearPlanCapitalId());
			
			shenBaoInfoDto.setBeginDate(entity.getBeginDate());
			shenBaoInfoDto.setEndDate(entity.getEndDate());
			shenBaoInfoDto.setUnitName(entity.getUnitName());
			shenBaoInfoDto.setProjectInvestSum(entity.getProjectInvestSum());
			shenBaoInfoDto.setRemark(entity.getRemark());
			shenBaoInfoDto.setProjectInvestAccuSum(entity.getProjectInvestAccuSum());
			
			shenBaoInfoDto.setCapitalQCZ_ggys(entity.getCapitalQCZ_ggys());
			shenBaoInfoDto.setCapitalQCZ_gtzj(entity.getCapitalQCZ_gtzj());
			shenBaoInfoDto.setCapitalSCZ_gtzj(entity.getCapitalSCZ_gtzj());
			shenBaoInfoDto.setCapitalSCZ_zxzj(entity.getCapitalSCZ_zxzj());
			shenBaoInfoDto.setCapitalSCZ_ggys(entity.getCapitalSCZ_ggys());
			shenBaoInfoDto.setCapitalSHTZ(entity.getCapitalSHTZ());
			shenBaoInfoDto.setCapitalOther(entity.getCapitalOther());
			shenBaoInfoDto.setCapitalOtherType(entity.getCapitalOtherType());
			shenBaoInfoDto.setCapitalOtherDescription(entity.getCapitalOtherDescription());
			
			shenBaoInfoDto.setPifuJYS_date(entity.getPifuJYS_date());
			shenBaoInfoDto.setPifuKXXYJBG_date(entity.getPifuKXXYJBG_date());
			shenBaoInfoDto.setPifuCBSJYGS_date(entity.getPifuCBSJYGS_date());
			shenBaoInfoDto.setPifuKXXYJBG_wenhao(entity.getPifuKXXYJBG_wenhao());
			shenBaoInfoDto.setPifuCBSJYGS_wenhao(entity.getPifuCBSJYGS_wenhao());
			shenBaoInfoDto.setPifuJYS_wenhao(entity.getPifuJYS_wenhao());
			
			shenBaoInfoDto.setCreatedDate(entity.getCreatedDate());
			shenBaoInfoDto.setModifiedDate(entity.getModifiedDate());
			shenBaoInfoDto.setModifiedBy(entity.getModifiedBy());
			shenBaoInfoDto.setCreatedBy(entity.getCreatedBy());
			shenBaoInfoDto.setItemOrder(entity.getItemOrder());
			
			//begin#审批相关
			shenBaoInfoDto.setProcessState(entity.getProcessState());
						
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
			shenBaoInfo.setProjectName(shenBaoInfoDto.getProjectName());
			shenBaoInfo.setProjectType(shenBaoInfoDto.getProjectType());
			shenBaoInfo.setProjectCategory(shenBaoInfoDto.getProjectCategory());
			shenBaoInfo.setProjectInvestSum(shenBaoInfoDto.getProjectInvestSum());
			shenBaoInfo.setApplyYearInvest(shenBaoInfoDto.getApplyYearInvest());
			shenBaoInfo.setYearInvestApproval(shenBaoInfoDto.getYearInvestApproval());
			shenBaoInfo.setProjectAddress(shenBaoInfoDto.getProjectAddress());
			shenBaoInfo.setProjectNumber(shenBaoInfoDto.getProjectNumber());
			shenBaoInfo.setProjectStage(shenBaoInfoDto.getProjectStage());
			shenBaoInfo.setProjectId(shenBaoInfoDto.getProjectId());//?
			shenBaoInfo.setUnitName(shenBaoInfoDto.getUnitName());
			shenBaoInfo.setProjectClassify(shenBaoInfoDto.getProjectClassify());
//			shenBaoInfo.setProjectFunctionClassify(shenBaoInfoDto.getProjectFunctionClassify());
//			shenBaoInfo.setProjectGoverEconClassify(shenBaoInfoDto.getProjectGoverEconClassify());
			shenBaoInfo.setProjectIndustry(shenBaoInfoDto.getProjectIndustry());
			shenBaoInfo.setProjectIntro(shenBaoInfoDto.getProjectIntro());
			shenBaoInfo.setProjectGuiMo(shenBaoInfoDto.getProjectGuiMo());			
			shenBaoInfo.setRemark(shenBaoInfoDto.getRemark());
			
			shenBaoInfo.setCapitalQCZ_gtzj(shenBaoInfoDto.getCapitalQCZ_gtzj());
			shenBaoInfo.setCapitalQCZ_ggys(shenBaoInfoDto.getCapitalQCZ_ggys());
			shenBaoInfo.setCapitalSCZ_gtzj(shenBaoInfoDto.getCapitalSCZ_gtzj());
			shenBaoInfo.setCapitalSCZ_ggys(shenBaoInfoDto.getCapitalSCZ_ggys());
			shenBaoInfo.setCapitalSCZ_zxzj(shenBaoInfoDto.getCapitalSCZ_zxzj());
			shenBaoInfo.setCapitalSHTZ(shenBaoInfoDto.getCapitalSHTZ());
			shenBaoInfo.setCapitalOther(shenBaoInfoDto.getCapitalOther());
			shenBaoInfo.setCapitalOtherType(shenBaoInfoDto.getCapitalOtherType());
			shenBaoInfo.setCapitalOtherDescription(shenBaoInfoDto.getCapitalOtherDescription());
						
			shenBaoInfo.setBeginDate(shenBaoInfoDto.getBeginDate());
			shenBaoInfo.setEndDate(shenBaoInfoDto.getEndDate());
					
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
			
			shenBaoInfo.setPlanYear(shenBaoInfoDto.getPlanYear());
			shenBaoInfo.setProjectShenBaoStage(shenBaoInfoDto.getProjectShenBaoStage());
			shenBaoInfo.setProjectInvestAccuSum(shenBaoInfoDto.getProjectInvestAccuSum());
			shenBaoInfo.setProjectConstrChar(shenBaoInfoDto.getProjectConstrChar());
			shenBaoInfo.setYearConstructionTask(shenBaoInfoDto.getYearConstructionTask());
			shenBaoInfo.setYearConstructionContent(shenBaoInfoDto.getYearConstructionContent());
			
			//begin#审批相关
			shenBaoInfo.setProcessState(shenBaoInfoDto.getProcessState());		
		}
		return shenBaoInfo;
		
	}

	

}


