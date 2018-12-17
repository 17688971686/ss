package cs.service.interfaces;

import cs.domain.YearPlanCapital;
import cs.model.DomainDto.YearPlanCapitalDto;

/**
 * @author Administrator
 *年度计划编制管理服务层
 */
public interface YearPlanCapitalService extends IService<YearPlanCapitalDto, YearPlanCapital, String>{
	/**
	 * 创建年度计划编制
	 * @param id
	 */
	void createYearPlanCapital(String id);
}
