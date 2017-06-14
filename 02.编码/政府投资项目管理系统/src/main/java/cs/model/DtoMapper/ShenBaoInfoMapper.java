package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoUnitInfo;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;

@Component
public class ShenBaoInfoMapper implements IMapper<ShenBaoInfoDto, ShenBaoInfo> {
	
	@Autowired ShenBaoUnitInfoMapper shenBaoUnitInfoMapper;
	
	@Override
	public ShenBaoInfoDto toDto(ShenBaoInfo entity) {
		ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
		if(shenBaoInfoDto!=null){
			shenBaoInfoDto.setId(entity.getId());
			shenBaoInfoDto.setProjectId(entity.getProjectId());
			shenBaoInfoDto.setProjectNumber(entity.getProjectNumber());
			shenBaoInfoDto.setProjectName(entity.getProjectName());
			shenBaoInfoDto.setProjectStage(entity.getProjectStage());
			shenBaoInfoDto.setProjectAddress(entity.getProjectAddress());
			shenBaoInfoDto.setProjectType(entity.getProjectType());
			shenBaoInfoDto.setProjectIndustry(entity.getProjectIndustry());
			shenBaoInfoDto.setProjectClassify(entity.getProjectClassify());
			shenBaoInfoDto.setProjectIntro(entity.getProjectIntro());
			shenBaoInfoDto.setProjectGuiMo(entity.getProjectGuiMo());
			shenBaoInfoDto.setPlanYear(entity.getPlanYear());
			shenBaoInfoDto.setProjectConstrChar(entity.getProjectConstrChar());
			shenBaoInfoDto.setProjectShenBaoStage(entity.getProjectShenBaoStage());
			shenBaoInfoDto.setApplyYearInvest(entity.getApplyYearInvest());
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
						
			//begin关联信息
			//附件
			entity.getAttachments().stream().forEach(x->{
				shenBaoInfoDto.getAttachmentDtos().add(AttachmentMapper.toDto(x));				
			});
			//申报单位
			shenBaoInfoDto.setShenBaoUnitInfoDto(shenBaoUnitInfoMapper.toDto(entity.getShenBaoUnitInfo()));
			//编制单位
			shenBaoInfoDto.setBianZhiUnitInfoDto(shenBaoUnitInfoMapper.toDto(entity.getBianZhiUnitInfo()));
		}
		return  shenBaoInfoDto;
	}

	@Override
	public void buildEntity(ShenBaoInfoDto shenBaoInfoDto, ShenBaoInfo shenBaoInfo) {
		if(shenBaoInfoDto !=null && shenBaoInfo !=null){
			if(shenBaoInfo.getId() == null || shenBaoInfo.getId().isEmpty()){
				shenBaoInfo.setId(UUID.randomUUID().toString());
			}
			shenBaoInfo.setId(shenBaoInfoDto.getId());
			shenBaoInfo.setProjectName(shenBaoInfoDto.getProjectName());
			shenBaoInfo.setProjectType(shenBaoInfoDto.getProjectType());
			
			shenBaoInfo.setProjectInvestSum(shenBaoInfoDto.getProjectInvestSum());
			shenBaoInfo.setApplyYearInvest(shenBaoInfoDto.getApplyYearInvest());
			shenBaoInfo.setProjectAddress(shenBaoInfoDto.getProjectAddress());
			shenBaoInfo.setProjectNumber(shenBaoInfoDto.getProjectNumber());
			shenBaoInfo.setProjectStage(shenBaoInfoDto.getProjectStage());
			shenBaoInfo.setProjectId(shenBaoInfoDto.getProjectId());//?
			shenBaoInfo.setUnitName(shenBaoInfoDto.getUnitName());
			shenBaoInfo.setProjectClassify(shenBaoInfoDto.getProjectClassify());			
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
						
			//begin#关联信息
			//附件
			shenBaoInfoDto.getAttachmentDtos().stream().forEach(x->{
				Attachment attachment=new Attachment();
				AttachmentMapper.buildEntity(x, attachment);
				shenBaoInfo.getAttachments().add(attachment);
			});
			//申报单位
			ShenBaoUnitInfoDto shenBaoUnitInfoDto = shenBaoInfoDto.getShenBaoUnitInfoDto();
			if(shenBaoInfo.getShenBaoUnitInfo() != null){
				ShenBaoUnitInfo shenBaoUnitInfo = shenBaoInfo.getShenBaoUnitInfo();
				shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
				shenBaoInfo.setShenBaoUnitInfo(shenBaoUnitInfo);
			}else{
				ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
				shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
				shenBaoInfo.setShenBaoUnitInfo(shenBaoUnitInfo);
			}
			
			//编制单位
			ShenBaoUnitInfoDto bianZhiUnitInfoDto = shenBaoInfoDto.getBianZhiUnitInfoDto();
			if(shenBaoInfo.getBianZhiUnitInfo() != null){
				ShenBaoUnitInfo bianZhiUnitInfo = shenBaoInfo.getBianZhiUnitInfo();
				shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
				shenBaoInfo.setBianZhiUnitInfo(bianZhiUnitInfo);
			}else{
				ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
				shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
				shenBaoInfo.setBianZhiUnitInfo(bianZhiUnitInfo);
			}
			
		}
		
	}

	

}


