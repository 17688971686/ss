package cs.service.interfaces;

import cs.domain.YearPlan;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;

public interface YearPlanService extends IService<YearPlanDto, YearPlan, String>{
	PageModelDto<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId,ODataObj odataObj);
	
	void addYearPlanCapitals(String planId,String[] ids);
	
	void addYearPlanCapital(String planId,String shenBaoId);
	
	void removeYearPlanCapital(String planId,String[] yearPlanCapitalId);
}