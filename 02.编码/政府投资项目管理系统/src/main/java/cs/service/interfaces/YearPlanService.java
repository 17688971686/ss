package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;

public interface YearPlanService {
	PageModelDto<YearPlanDto> get(ODataObj odataObj);
	void create(YearPlanDto dto);
	void update(YearPlanDto dto);
}
