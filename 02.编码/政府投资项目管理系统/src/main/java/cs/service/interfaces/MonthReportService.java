package cs.service.interfaces;

import cs.domain.MonthReport;
import cs.model.DomainDto.MonthReportDto;

/**
 * @author Administrator
 * 月报服务层
 */
public interface MonthReportService extends IService<MonthReportDto, MonthReport, String> {	
	/**
	 * 保存月报
	 * @param monthReportDto
	 */
	void saveMonthReport(MonthReportDto monthReportDto);
	/**
	 * update monthReport
	 * @param monthReportDto dto
	 */
	void changeMonthReport(MonthReportDto monthReportDto);
}
