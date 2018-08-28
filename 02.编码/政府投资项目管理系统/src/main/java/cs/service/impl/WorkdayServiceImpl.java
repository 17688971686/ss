package cs.service.impl;

import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.Workday;
import cs.model.PageModelDto;
import cs.model.DomainDto.WorkdayDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.impl.WorkdayRepoImpl;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.WorkdayService;

@Service
public class WorkdayServiceImpl extends AbstractServiceImpl<WorkdayDto, Workday, String> implements WorkdayService{

	private static Logger logger = Logger.getLogger(WorkdayServiceImpl.class);
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private IMapper<WorkdayDto, Workday> WorkdayMapper;
	@Autowired
	private WorkdayRepoImpl workdayRepoImpl;
	@Override
	@Transactional
	public void saveWorkday(WorkdayDto WorkdayDto) {
		// TODO Auto-generated method stub
		
		Workday opin = new Workday();
		
		WorkdayMapper.buildEntity(WorkdayDto, opin);
		
		opin.setCreatedBy(currentUser.getUserId());
		
		workdayRepoImpl.save(opin);
		logger.info(String.format("保存用户意见,用户名:%s", currentUser.getLoginName()));
	}


	@Override
	@Transactional
	public void deleteWorkdays(String[] ids) {
		for (String id : ids) {
			this.deleteWorkday(id);
		}
		logger.info("批量删除意见");
		
	}


	@Override
	@Transactional
	public void deleteWorkday(String id) {
		Workday opin = workdayRepoImpl.findById(id);
		workdayRepoImpl.delete(opin);
		logger.info(String.format("删除意见,用户名:%s", currentUser.getLoginName()));
		
	}


	@Override
	@Transactional
	public void editWorkday(WorkdayDto opinDto) {
		Workday opin = workdayRepoImpl.findById(opinDto.getId());
		
		opin.setModifiedBy(currentUser.getUserId());
		opin.setModifiedDate(new Date());
		workdayRepoImpl.save(opin);
		
		logger.info(String.format("修改意见,用户名:%s", currentUser.getLoginName()));
		
	}


	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	@Transactional
	public PageModelDto<WorkdayDto> getWorkday(ODataObj odataObj) {	
		ODataFilterItem filter = new ODataFilterItem();
		filter.setField("relId");
		filter.setOperator("eq");
		filter.setValue(currentUser.getUserId());
		
		odataObj.getFilter().add(filter);
		
		return super.get(odataObj);
	}

	@Override
	public List<WorkdayDto> findByDto(ODataObj odataObj) {
		return null;
	}
}
