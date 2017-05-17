package cs.service.shenbaoAdmin;

import cs.model.PageModelDto;
import cs.model.management.MonthReportDto;
import cs.repository.odata.ODataObj;

public interface MonthReportService {
	PageModelDto<MonthReportDto> get(ODataObj odataObj);
	void saveMonthReport(MonthReportDto monthReportDto);
}
