package cs.model.DtoMapper;

import org.springframework.stereotype.Component;

import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.ShenBaoInfoDto;

@Component
public class ShenBaoInfoMapper implements IMapper<ShenBaoInfoDto, ShenBaoInfo> {
	
	
	@Override
	public ShenBaoInfoDto toDto(ShenBaoInfo entity) {
		ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
		if(shenBaoInfoDto!=null){			
			shenBaoInfoDto.setProjectName(entity.getProjectName());
			shenBaoInfoDto.setCapitalQCZ_gtzj(entity.getCapitalQCZ_gtzj());
			shenBaoInfoDto.setCapitalSCZ_gtzj(entity.getCapitalSCZ_gtzj());
			shenBaoInfoDto.setPifuCBSJYGS_date(entity.getPifuCBSJYGS_date());	
			shenBaoInfoDto.setModifiedDate(entity.getModifiedDate());
			shenBaoInfoDto.setModifiedBy(entity.getModifiedBy());
			shenBaoInfoDto.setProjectConstrChar(entity.getProjectConstrChar());			
			shenBaoInfoDto.setCapitalSCZ_zxzj(entity.getCapitalSCZ_zxzj());
			shenBaoInfoDto.setCapitalSHTZ(entity.getCapitalSHTZ());
			shenBaoInfoDto.setRemark(entity.getRemark());
			shenBaoInfoDto.setProjectShenBaoStage(entity.getProjectShenBaoStage());
			shenBaoInfoDto.setCapitalOther(entity.getCapitalOther());
			shenBaoInfoDto.setProjectInvestSum(entity.getProjectInvestSum());
			shenBaoInfoDto.setApplyYearInvest(entity.getApplyYearInvest());
			shenBaoInfoDto.setProjectAddress(entity.getProjectAddress());		
			shenBaoInfoDto.setPifuJYS_date(entity.getPifuJYS_date());
			shenBaoInfoDto.setPlanYear(entity.getPlanYear());
			shenBaoInfoDto.setCapitalQCZ_ggys(entity.getCapitalQCZ_ggys());
			shenBaoInfoDto.setProjectIntro(entity.getProjectIntro());
			shenBaoInfoDto.setCreatedBy(entity.getCreatedBy());
			shenBaoInfoDto.setProjectNumber(entity.getProjectNumber());
			shenBaoInfoDto.setProjectStage(entity.getProjectStage());
			shenBaoInfoDto.setProjectId(entity.getProjectId());
			shenBaoInfoDto.setProjectClassify(entity.getProjectClassify());
			shenBaoInfoDto.setUnitName(entity.getUnitName());
			shenBaoInfoDto.setPifuKXXYJBG_wenhao(entity.getPifuKXXYJBG_wenhao());
			shenBaoInfoDto.setItemOrder(entity.getItemOrder());
			shenBaoInfoDto.setCapitalSCZ_ggys(entity.getCapitalSCZ_ggys());
			shenBaoInfoDto.setEndDate(entity.getEndDate());
			shenBaoInfoDto.setBeginDate(entity.getBeginDate());
			shenBaoInfoDto.setProjectIndustry(entity.getProjectIndustry());
			shenBaoInfoDto.setPifuCBSJYGS_wenhao(entity.getPifuCBSJYGS_wenhao());
			shenBaoInfoDto.setProjectType(entity.getProjectType());
			shenBaoInfoDto.setCreatedDate(entity.getCreatedDate());
			shenBaoInfoDto.setCapitalOtherDescription(entity.getCapitalOtherDescription());
			shenBaoInfoDto.setId(entity.getId());
			shenBaoInfoDto.setPifuJYS_wenhao(entity.getPifuJYS_wenhao());
			shenBaoInfoDto.setProjectGuiMo(entity.getProjectGuiMo());
			shenBaoInfoDto.setPifuKXXYJBG_date(entity.getPifuKXXYJBG_date());


		}
		return  shenBaoInfoDto;
	}

	@Override
	public void buildEntity(ShenBaoInfoDto dto, ShenBaoInfo entity) {
		// TODO Auto-generated method stub
		
	}

	

}
