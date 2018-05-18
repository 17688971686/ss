package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.YearPlan;
/**
 * @Description: 年度计划实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class YearPlanDto extends YearPlan {
	List<YearPlanCapitalDto> yearPlanCapitalDtos=new ArrayList<>();
	
	List<PackPlanDto> packPlanDtos = new ArrayList<>();
	

	public List<YearPlanCapitalDto> getYearPlanCapitalDtos() {
		return yearPlanCapitalDtos;
	}

	public void setYearPlanCapitalDtos(List<YearPlanCapitalDto> yearPlanCapitalDtos) {
		this.yearPlanCapitalDtos = yearPlanCapitalDtos;
	}

	public List<PackPlanDto> getPackPlanDtos() {
		return packPlanDtos;
	}

	public void setPackPlanDtos(List<PackPlanDto> packPlanDtos) {
		this.packPlanDtos = packPlanDtos;
	}
}
