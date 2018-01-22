package cs.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.impl.TaskRecordRepoImpl;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskRecordService;
/**
 * @Description: 任务流程记录信息服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class TaskRecordServiceImpl extends AbstractServiceImpl<TaskRecordDto, TaskRecord, String> implements TaskRecordService {
	private static Logger logger = Logger.getLogger(TaskRecordServiceImpl.class);
	@Autowired
	private TaskRecordRepoImpl taskRecordRepoImpl;
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public PageModelDto<TaskRecordDto> get(ODataObj odataObj) {
		logger.info("查询任务消息数据");
		return super.get(odataObj);	
	}

	@Override
	@Transactional
	public PageModelDto<TaskRecordDto> get_shenPi(ODataObj odataObj) {
		List<TaskRecordDto> dtos = taskRecordRepoImpl.findByOdata2(odataObj,currentUser.getUserId(),false).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());
		
		
		PageModelDto<TaskRecordDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);
		logger.info("查询审批类已办任务");
		return pageModelDto;
	}

	@Override
	@Transactional
	public PageModelDto<TaskRecordDto> getToDo_plan(ODataObj odataObj) {
		List<TaskRecordDto> dtos = taskRecordRepoImpl.findByOdata2(odataObj,currentUser.getUserId(),true).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());
		
		
		PageModelDto<TaskRecordDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);
		logger.info("查询计划类已办任务");
		return pageModelDto;
	}
	
	

}
