package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.YearPlanCapital;
import cs.model.DomainDto.YearPlanCapitalDto;

@Component
public class YearPlanCapitalMapper implements IMapper<YearPlanCapitalDto, YearPlanCapital> {

	@Autowired
	ICurrentUser currentUser;
	@Override
	public YearPlanCapitalDto toDto(YearPlanCapital entity) {
		YearPlanCapitalDto yearPlanCapitalDto =new YearPlanCapitalDto();
		yearPlanCapitalDto.setCapitalQCZ_ggys(entity.getCapitalQCZ_ggys());
		yearPlanCapitalDto.setCreatedBy(entity.getCreatedBy());
		yearPlanCapitalDto.setCapitalQCZ_gtzj(entity.getCapitalQCZ_gtzj());
		yearPlanCapitalDto.setCapitalSCZ_gtzj(entity.getCapitalSCZ_gtzj());
		yearPlanCapitalDto.setItemOrder(entity.getItemOrder());
		yearPlanCapitalDto.setCapitalSCZ_ggys(entity.getCapitalSCZ_ggys());
		yearPlanCapitalDto.setShenbaoInfoId(entity.getShenbaoInfoId());
		yearPlanCapitalDto.setModifiedDate(entity.getModifiedDate());
		yearPlanCapitalDto.setModifiedBy(entity.getModifiedBy());
		yearPlanCapitalDto.setCapitalSCZ_zxzj(entity.getCapitalSCZ_zxzj());
		yearPlanCapitalDto.setCapitalSHTZ(entity.getCapitalSHTZ());
		yearPlanCapitalDto.setCapitalOther(entity.getCapitalOther());
		yearPlanCapitalDto.setCreatedDate(entity.getCreatedDate());
		yearPlanCapitalDto.setId(entity.getId());


		return yearPlanCapitalDto;
	}

	@Override
	public void buildEntity(YearPlanCapitalDto dto, YearPlanCapital entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setCapitalQCZ_ggys(dto.getCapitalQCZ_ggys());
		entity.setCreatedBy(currentUser.getLoginName());
		entity.setCapitalQCZ_gtzj(dto.getCapitalQCZ_gtzj());
		entity.setCapitalSCZ_gtzj(dto.getCapitalSCZ_gtzj());
		entity.setItemOrder(dto.getItemOrder());
		entity.setCapitalSCZ_ggys(dto.getCapitalSCZ_ggys());
		entity.setShenbaoInfoId(dto.getShenbaoInfoId());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setCapitalSCZ_zxzj(dto.getCapitalSCZ_zxzj());
		entity.setCapitalSHTZ(dto.getCapitalSHTZ());
		entity.setCapitalOther(dto.getCapitalOther());
		entity.setCreatedDate(dto.getCreatedDate());
		
	}

}
