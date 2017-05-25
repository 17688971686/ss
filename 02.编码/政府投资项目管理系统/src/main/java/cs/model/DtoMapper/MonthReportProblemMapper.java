package cs.model.DtoMapper;

import cs.domain.MonthReportProblem;
import cs.model.DomainDto.MonthReportProblemDto;

public class MonthReportProblemMapper {
	public static MonthReportProblemDto toDto(MonthReportProblem monthReportProblem){
		MonthReportProblemDto monthReportProblemDto = new MonthReportProblemDto();
		if(monthReportProblem != null){
			monthReportProblemDto.setId(monthReportProblem.getId());
			monthReportProblemDto.setProblemIntroduction(monthReportProblem.getProblemIntroduction());
			monthReportProblemDto.setSolutionsAndSuggest(monthReportProblem.getSolutionsAndSuggest());
			monthReportProblemDto.setCreatedBy(monthReportProblem.getCreatedBy());
			monthReportProblemDto.setCreatedDate(monthReportProblem.getCreatedDate());
			monthReportProblemDto.setModifiedBy(monthReportProblem.getModifiedBy());
			monthReportProblemDto.setModifiedDate(monthReportProblem.getModifiedDate());
			monthReportProblemDto.setRemark(monthReportProblem.getRemark());
		}
		return monthReportProblemDto;
	}
}
