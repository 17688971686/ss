package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.TaskRecordService;

@Service
public class TaskRecordServiceImpl implements TaskRecordService {
	private static Logger logger = Logger.getLogger(TaskRecordServiceImpl.class);
	@Autowired
	IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	
	@Autowired
	BasicDataService basicDataService;
	
	@Autowired
	IRepository<TaskRecord, String> taskRecordRepo;

	@Override
	@Transactional
	public PageModelDto<TaskRecordDto> get(ODataObj odataObj) {
		List<TaskRecordDto> taskRecordDtos=new ArrayList<>();
		taskRecordRepo.findByOdata(odataObj).forEach(x->{
			
			TaskRecordDto taskRecordDto=taskRecordMapper.toDto(x);	
			//设置相关名称
			taskRecordDto.setTaskTypeDesc(basicDataService.getDescriptionById(x.getTaskType()));
			taskRecordDto.setProcessStateDesc(basicDataService.getDescriptionById(x.getProcessState()));
			taskRecordDtos.add(taskRecordDto);			
		});
		PageModelDto<TaskRecordDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(taskRecordDtos);
		logger.info("查询任务消息数据");
		return pageModelDto;
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
