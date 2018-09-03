package cs.service.interfaces;

import cs.domain.Workday;
import cs.model.DomainDto.WorkdayDto;
import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;

import java.util.Date;
import java.util.List;

public interface WorkdayService extends IService<WorkdayDto, Workday, String>{

	PageModelDto<WorkdayDto> getWorkday(ODataObj odataObj);

	String createWorkday(WorkdayDto workdayDto);

	/**
	 * 判断工作日期是否有重复
	 * @param dates
	 * @return
	 */
	Boolean isRepeat(Date dates);

	WorkdayDto getWorkdayById(String id);

	void updateWorkday(WorkdayDto workdayDto);

	void deleteWorkday(String id);

	List<Workday> selectSpecialDays(String status);

	/**
	 * 计算从当前日期开始，一年内的调休记录
	 * @return
	 */
	List<Workday> findWorkDayByNow();

	/**
	 * 通过时间段获取
	 * @param startDate
	 * @return
	 */
	List<Workday> getBetweenTimeDay(Date startDate, Date endDate);

	/**
	 * 判断当天是否是工作日
	 * @param date
	 * @return
	 */
	boolean isWorkDay(Date date);

}
