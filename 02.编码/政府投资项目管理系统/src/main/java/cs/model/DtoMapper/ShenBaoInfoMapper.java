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
			shenBaoInfoDto.setCapitalQCZ_gtzj(entity.getCapitalQCZ_gtzj());
			shenBaoInfoDto.setProjectName(entity.getProjectName());
			shenBaoInfoDto.setCapitalSCZ_gtzj(entity.getCapitalSCZ_gtzj());
			shenBaoInfoDto.setPifuCBSJYGS_date(entity.getPifuCBSJYGS_date());
			shenBaoInfoDto.setModifiedDate(entity.getModifiedDate());
			shenBaoInfoDto.setModifiedBy(entity.getModifiedBy());
			shenBaoInfoDto.setCapitalSCZ_zxzj(entity.getCapitalSCZ_zxzj());
			shenBaoInfoDto.setCapitalSHTZ(entity.getCapitalSHTZ());
			shenBaoInfoDto.setRemark(entity.getRemark());
			shenBaoInfoDto.setCapitalOther(entity.getCapitalOther());
			shenBaoInfoDto.setProjectInvestSum(entity.getProjectInvestSum());
			shenBaoInfoDto.setProjectAddress(entity.getProjectAddress());
			shenBaoInfoDto.setPifuJYS_date(entity.getPifuJYS_date());
			shenBaoInfoDto.setCapitalQCZ_ggys(entity.getCapitalQCZ_ggys());
			shenBaoInfoDto.setProjectIntro(entity.getProjectIntro());
			shenBaoInfoDto.setCreatedBy(entity.getCreatedBy());
			shenBaoInfoDto.setProjectNumber(entity.getProjectNumber());
			shenBaoInfoDto.setProjectStage(entity.getProjectStage());
			shenBaoInfoDto.setProjectClassify(entity.getProjectClassify());
			shenBaoInfoDto.setPifuKXXYJBG_wenhao(entity.getPifuKXXYJBG_wenhao());
			shenBaoInfoDto.setUnitName(entity.getUnitName());
			shenBaoInfoDto.setItemOrder(entity.getItemOrder());
			shenBaoInfoDto.setCapitalSCZ_ggys(entity.getCapitalSCZ_ggys());
			shenBaoInfoDto.setEndDate(entity.getEndDate());
			shenBaoInfoDto.setBeginDate(entity.getBeginDate());
			shenBaoInfoDto.setProjectIndustry(entity.getProjectIndustry());
			shenBaoInfoDto.setPifuCBSJYGS_wenhao(entity.getPifuCBSJYGS_wenhao());
			shenBaoInfoDto.setProjectType(entity.getProjectType());
			shenBaoInfoDto.setCreatedDate(entity.getCreatedDate());
			shenBaoInfoDto.setCapitalOtherDescription(entity.getCapitalOtherDescription());
			shenBaoInfoDto.setPifuJYS_wenhao(entity.getPifuJYS_wenhao());
			shenBaoInfoDto.setPifuKXXYJBG_date(entity.getPifuKXXYJBG_date());
			shenBaoInfoDto.setProjectGuiMo(entity.getProjectGuiMo());

		}
		return  shenBaoInfoDto;
	}

	

}
