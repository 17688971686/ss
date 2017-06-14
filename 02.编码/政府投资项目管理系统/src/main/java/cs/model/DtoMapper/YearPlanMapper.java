package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.YearPlan;
import cs.model.DomainDto.YearPlanDto;

@Component
public class YearPlanMapper implements IMapper<YearPlanDto, YearPlan> {

	@Autowired
	ICurrentUser currentUser;
	
	
	@Override
	public YearPlanDto toDto(YearPlan entity) {
		YearPlanDto yearPlanDto =new YearPlanDto();
		yearPlanDto.setCreatedBy(entity.getCreatedBy());
		yearPlanDto.setYear(entity.getYear());
		yearPlanDto.setCreatedDate(entity.getCreatedDate());		
		yearPlanDto.setId(entity.getId());
		yearPlanDto.setItemOrder(entity.getItemOrder());
		yearPlanDto.setModifiedDate(entity.getModifiedDate());
		yearPlanDto.setModifiedBy(entity.getModifiedBy());
		yearPlanDto.setName(entity.getName());
		yearPlanDto.setRemark(entity.getRemark());
		
		//begin#关联信息

		return yearPlanDto;
	}

	@Override
	public void buildEntity(YearPlanDto dto, YearPlan entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setCreatedBy(currentUser.getLoginName());
		entity.setYear(dto.getYear());
		entity.setCreatedDate(dto.getCreatedDate());		
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setName(dto.getName());
		entity.setRemark(dto.getRemark());
		
		//begin#关联信息
		

	}

}
