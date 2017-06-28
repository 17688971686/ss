package cs.model.DtoMapper;

import java.util.UUID;

import org.hibernate.loader.plan.exec.process.spi.ReturnReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.YearPlan;
import cs.domain.YearPlanCapital;
import cs.model.DomainDto.YearPlanDto;

@Component
public class YearPlanMapper implements IMapper<YearPlanDto, YearPlan> {

	@Autowired
	ICurrentUser currentUser;
	@Autowired
	YearPlanCapitalMapper yearPlanCapitalMapper;
	
	
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
		entity.getYearPlanCapitals().stream().forEach(x->{
			yearPlanDto.getYearPlanCapitalDtos().add(yearPlanCapitalMapper.toDto(x));				
		});

		return yearPlanDto;
	}

	@Override
	public YearPlan buildEntity(YearPlanDto dto, YearPlan entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setYear(dto.getYear());
		entity.setCreatedDate(dto.getCreatedDate());		
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setName(dto.getName());
		entity.setRemark(dto.getRemark());
				
		return entity;
	}

}
