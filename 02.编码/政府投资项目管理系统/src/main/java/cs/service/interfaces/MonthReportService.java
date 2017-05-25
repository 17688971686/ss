package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.MonthReportDto;
import cs.repository.odata.ODataObj;

public interface MonthReportService {
	PageModelDto<MonthReportDto> get(ODataObj odataObj);
	void saveMonthReport(MonthReportDto monthReportDto);
}
