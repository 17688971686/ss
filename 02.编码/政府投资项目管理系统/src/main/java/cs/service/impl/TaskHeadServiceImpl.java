package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DtoMapper.TaskHeadMapper;
import cs.repository.interfaces.TaskHeadRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskHeadService;

@Service
public class TaskHeadServiceImpl implements TaskHeadService {
	private static Logger logger = Logger.getLogger(TaskHeadServiceImpl.class);
	
	@Autowired
	TaskHeadMapper taskHeadMapper;
	@Autowired
	TaskHeadRepo taskHeadRepo;
	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> get(ODataObj odataObj) {
		List<TaskHeadDto> taskHeadDtos=new ArrayList<>();
		taskHeadRepo.findByOdata(odataObj).forEach(x->{
			
			TaskHeadDto taskHeadDto=taskHeadMapper.toDto(x);			
			taskHeadDtos.add(taskHeadDto);	
			
		});
		PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(taskHeadDtos);
		logger.info("查询工作台任务数据");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void create(TaskHeadDto dto) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void update(TaskHeadDto dto) {
		// TODO Auto-generated method stub
		
	}

}
