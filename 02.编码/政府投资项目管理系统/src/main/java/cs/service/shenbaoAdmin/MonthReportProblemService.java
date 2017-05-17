package cs.service.shenbaoAdmin;

import cs.model.PageModelDto;
import cs.model.management.MonthReportProblemDto;
import cs.repository.odata.ODataObj;

public interface MonthReportProblemService {
	PageModelDto<MonthReportProblemDto> get(ODataObj odataObj);
}
