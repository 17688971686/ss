package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskHeadService;

@Service
public class TaskHeadServiceImpl implements TaskHeadService {
	private static Logger logger = Logger.getLogger(TaskHeadServiceImpl.class);
	
	@Autowired
	IMapper<TaskHeadDto, TaskHead> taskHeadMapper;
	
	@Autowired
	IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	
	@Autowired
	IRepository<TaskHead, String> taskHeadRepo;
	
	@Autowired
	ICurrentUser currentUser;
	
	
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
		TaskHead taskHead = new TaskHead();
		taskHeadMapper.buildEntity(dto, taskHead);
		taskHeadRepo.save(taskHead);
		logger.info(String.format("创建任务信息,任务标题 %s",dto.getTitle()));		
	}

	@Override
	@Transactional
	public void update(TaskHeadDto dto) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void handle(String taskId, TaskRecordDto dto) {
		TaskHead taskHead=taskHeadRepo.findById(taskId); 
		if(taskHead!=null){
			TaskRecord entity=new TaskRecord();
			dto.setRelId(taskHead.getRelId());
			dto.setTaskType(taskHead.getTaskType());
			dto.setTitle(taskHead.getTitle());
			dto.setUserName(currentUser.getLoginName());								
			taskRecordMapper.buildEntity(dto, entity);
			entity.setModifiedBy(currentUser.getLoginName());
			taskHead.getTaskRecords().add(entity);
			
			//设置完成
			String processState=dto.getProcessState();
			setComplete(taskHead,processState);
			taskHeadRepo.save(taskHead);
		}
	}
	private void setComplete(TaskHead taskHead,String processState){
		if(BasicDataConfig.processState_qianShou.equals(processState)||
				BasicDataConfig.processState_tuiWen.equals(processState)||
				BasicDataConfig.processState_banJie.equals(processState)
				){//签收
			taskHead.setComplete(true);
			taskHead.setProcessState(processState);
			
		}
	}
	
	

}
