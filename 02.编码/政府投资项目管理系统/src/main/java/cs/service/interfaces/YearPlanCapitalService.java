package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.repository.odata.ODataObj;

public interface YearPlanCapitalService {
	
	PageModelDto<YearPlanCapitalDto> get(ODataObj odataObj);
	
	void update(YearPlanCapitalDto dto);
	void createYearPlanCapitals(String[] ids);
	void createYearPlanCapital(String id);
}
