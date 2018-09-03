package cs.service.impl;

import cs.common.ICurrentUser;
import cs.common.utils.DateUtils;
import cs.common.utils.Validate;
import cs.domain.Workday;
import cs.model.DomainDto.WorkdayDto;
import cs.model.PageModelDto;
import cs.repository.interfaces.WorkdayRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.WorkdayService;
import org.apache.axis.utils.SessionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.*;

@Service
public class WorkdayServiceImpl extends AbstractServiceImpl<WorkdayDto, Workday, String> implements WorkdayService{

	@Autowired
	private WorkdayRepo workdayRepo;
	@Autowired
	private ICurrentUser currentUser;

	@Override
	@Transactional
	public PageModelDto<WorkdayDto> getWorkday(ODataObj odataObj) {

		PageModelDto<WorkdayDto> pageDtoList = new PageModelDto<>();
		List<Workday> workdayList = workdayRepo.findByOdata(odataObj);
		List<WorkdayDto> workdayDtoList = new ArrayList<>();
		if (workdayList != null && workdayList.size() > 0) {
			for (Workday workday : workdayList) {
				WorkdayDto workdayDto = new WorkdayDto();
				BeanUtils.copyProperties(workday, workdayDto);
				workdayDtoList.add(workdayDto);
			}
		}
		pageDtoList.setValue(workdayDtoList);
		pageDtoList.setCount(odataObj.getCount());
		return pageDtoList;
	}

	@Override
	@Transactional
	public  Boolean isRepeat(Date dates){
		return workdayRepo.isExist(dates);
	}

	@Override
	@Transactional
	public String createWorkday(WorkdayDto workdayDto) {
		String result = "添加成功!";
		Workday workday = new Workday();
		BeanUtils.copyProperties(workdayDto, workday);
		workday.setId(UUID.randomUUID().toString());
		workday.setCreatedBy(currentUser.getLoginName());
		workday.setCreatedDate(new Date());
		workday.setModifiedBy(currentUser.getLoginName());
		workday.setModifiedDate(new Date());
		try {
			workdayRepo.save(workday);
		}catch (Exception e){
			result = "添加失败!操作出现异常!";
		}
		return result;
	}

	@Override
	@Transactional
	public WorkdayDto getWorkdayById(String id) {
		Workday workday = workdayRepo.findById(id);
		WorkdayDto workdayDto = new WorkdayDto();
		//BeanCopierUtils.copyProperties(workday, workdayDto);
		return workdayDto;
	}

	@Override
	@Transactional
	public void updateWorkday(WorkdayDto workdayDto) {
		Workday workday = workdayRepo.findById(workdayDto.getId());
		//BeanCopierUtils.copyProperties(workdayDto, workday);
		//workday.setModifiedBy(SessionUtil.getLoginName());
		workday.setModifiedDate(new Date());
		workdayRepo.save(workday);
	}

	@Override
	@Transactional
	public void deleteWorkday(String id) {
		String[] ids = id.split(",");
		if (ids.length > 0) {
			for (String workdayId : ids) {
				Workday workday = workdayRepo.findById(workdayId);
				workdayRepo.delete(workday);
			}
		}
	}

	@Override
	@Transactional
	public List<Workday> selectSpecialDays(String status) {
		//HqlBuilder hqlBuilder = HqlBuilder.create();
		//hqlBuilder.append("select t from " + Workday.class.getSimpleName() + " t where t." + Workday_.status.getName() + "=:status");
		//hqlBuilder.setParam("status", status);
		List<Workday> datesList = null;
		//workdayRepo.findByHql(hqlBuilder);
		return datesList;
	}

	/**
	 * 计算从当前日期开始，一年内的调休记录
	 * @return
	 */
	@Override
	public List<Workday> findWorkDayByNow() {
		Date endDate = new Date();
		Date beginDate = DateUtils.addDay(endDate,-365);
		return workdayRepo.findWorkDay(DateUtils.converToString(beginDate,DateUtils.DATE_PATTERN),DateUtils.converToString(endDate,DateUtils.DATE_PATTERN));
	}

	/**
	 * 通过时间段获取
	 * @param startDate
	 * @return
	 */
	@Override
	public List<Workday> getBetweenTimeDay(Date startDate, Date endDate) {
		return workdayRepo.getBetweenTimeDay(startDate , endDate);
	}

	/**
	 * 判断当天是否是工作日
	 * @param date
	 * @return
	 */
	@Override
	public boolean isWorkDay(Date date) {
		boolean isWorkDay = true;
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		if (cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY || cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
			isWorkDay = false;
		}
		Date startDate = DateUtils.addDay(date,-1);
		Date endDate = DateUtils.addDay(date,1);
		List<Workday> workdayList = getBetweenTimeDay(startDate,endDate);
		if(Validate.isList(workdayList)){
			for(Workday workday : workdayList){
				if(DateUtils.converToString(date,DateUtils.DATE_PATTERN).equals(DateUtils.converToString(workday.getDates(),DateUtils.DATE_PATTERN))){
					//是周末，但是已经调整为工作日
					if(!isWorkDay && "2".equals(workday.getStatus())){
						isWorkDay = true;
						//是工作日，但是已经将工作日改为休息日
					}else if(isWorkDay && "1".equals(workday.getStatus())){
						isWorkDay = false;
					}
				}
			}
		}
		return isWorkDay;
	}

	@Override
	public List<WorkdayDto> findByDto(ODataObj odataObj) {
		return null;
	}
}
