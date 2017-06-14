package cs.service.interfaces;

import java.util.List;

import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;

public interface YearPlanService {
	PageModelDto<YearPlanDto> get(ODataObj odataObj);
	void create(YearPlanDto dto);
	void update(YearPlanDto dto);
	List<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId);
}
