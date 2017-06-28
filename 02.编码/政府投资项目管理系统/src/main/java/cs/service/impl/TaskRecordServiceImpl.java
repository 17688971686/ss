package cs.service.impl;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskRecordService;

@Service
public class TaskRecordServiceImpl extends AbstractServiceImpl<TaskRecordDto, TaskRecord, String> implements TaskRecordService {
	private static Logger logger = Logger.getLogger(TaskRecordServiceImpl.class);
	
	@Override
	@Transactional
	public PageModelDto<TaskRecordDto> get(ODataObj odataObj) {
		logger.info("查询任务消息数据");
		return super.get(odataObj);	
	}
}
