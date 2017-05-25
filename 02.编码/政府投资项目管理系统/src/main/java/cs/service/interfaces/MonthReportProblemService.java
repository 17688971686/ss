package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.MonthReportProblemDto;
import cs.repository.odata.ODataObj;

public interface MonthReportProblemService {
	PageModelDto<MonthReportProblemDto> get(ODataObj odataObj);
}
