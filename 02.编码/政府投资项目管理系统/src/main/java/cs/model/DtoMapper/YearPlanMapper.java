package cs.model.DtoMapper;

import org.springframework.stereotype.Component;

import cs.domain.YearPlan;
import cs.model.DomainDto.YearPlanDto;

@Component
public class YearPlanMapper implements IMapper<YearPlanDto, YearPlan> {

	@Override
	public YearPlanDto toDto(YearPlan entity) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void buildEntity(YearPlanDto dto, YearPlan entity) {
		// TODO Auto-generated method stub
		
	}

}
