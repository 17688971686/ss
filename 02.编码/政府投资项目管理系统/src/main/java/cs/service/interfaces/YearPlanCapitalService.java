package cs.service.interfaces;

import cs.domain.YearPlanCapital;
import cs.model.DomainDto.YearPlanCapitalDto;

public interface YearPlanCapitalService extends IService<YearPlanCapitalDto, YearPlanCapital, String>{
	void createYearPlanCapital(String id);
}
