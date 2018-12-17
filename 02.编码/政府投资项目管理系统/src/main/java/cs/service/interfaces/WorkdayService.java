package cs.service.interfaces;

import cs.domain.Workday;
import cs.model.DomainDto.WorkdayDto;
import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;

import java.util.Date;
import java.util.List;


/**
 * @author Administrator
 *工作日管理服务层
 */
public interface WorkdayService extends IService<WorkdayDto, Workday, String>{

	/**
	 * 查询工作日
	 * @param odataObj
	 * @return
	 */
	PageModelDto<WorkdayDto> getWorkday(ODataObj odataObj);
	/**
	 * 创建工作日
	 * @param workdayDto
	 * @return
	 */
	String createWorkday(WorkdayDto workdayDto);

	/**
	 * 判断工作日期是否有重复
	 * @param dates
	 * @return
	 */
	Boolean isRepeat(Date dates);

	/**
	 * 根据ID查询工作日
	 * @param id
	 * @return
	 */
	WorkdayDto getWorkdayById(String id);

	/**
	 * 更新工作日
	 */
	void updateWorkday(WorkdayDto workdayDto);

	/**
	 * 删除工作日
	 * @param id
	 */
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
