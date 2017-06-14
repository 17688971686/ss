package cs.service.impl;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskRecordService;

@Service
public class TaskRecordServiceImpl implements TaskRecordService {

	@Override
	@Transactional
	public PageModelDto<TaskRecordDto> get(ODataObj odataObj) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public void create(TaskRecordDto dto) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void update(TaskRecordDto dto) {
		// TODO Auto-generated method stub
		
	}

}
