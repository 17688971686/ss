package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.YearPlan;


public class YearPlanDto extends YearPlan {
	List<YearPlanCapitalDto> yearPlanCapitalDtos=new ArrayList<>();

	public List<YearPlanCapitalDto> getYearPlanCapitalDtos() {
		return yearPlanCapitalDtos;
	}

	public void setYearPlanCapitalDtos(List<YearPlanCapitalDto> yearPlanCapitalDtos) {
		this.yearPlanCapitalDtos = yearPlanCapitalDtos;
	}
	
	
}
