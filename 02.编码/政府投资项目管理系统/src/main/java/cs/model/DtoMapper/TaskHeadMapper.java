package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;

@Component
public class TaskHeadMapper implements IMapper<TaskHeadDto, TaskHead> {

	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	
	@Override
	public TaskHeadDto toDto(TaskHead entity) {
		TaskHeadDto dto=new TaskHeadDto();
		//任务信息
		dto.setId(entity.getId());
		dto.setTitle(entity.getTitle());
		dto.setProcessState(entity.getProcessState());
		dto.setProcessSuggestion(entity.getProcessSuggestion());
		dto.setTaskType(entity.getTaskType());
		dto.setRelId(entity.getRelId());
		dto.setComplete(entity.isComplete());
		dto.setNextUser(entity.getNextUser());
		//基础信息
		dto.setItemOrder(entity.getItemOrder());
		dto.setCreatedDate(entity.getCreatedDate());
		dto.setModifiedDate(entity.getModifiedDate());
		dto.setCreatedBy(entity.getCreatedBy());
		dto.setModifiedBy(entity.getModifiedBy());
				
		//begin#关联信息
		entity.getTaskRecords().forEach(x->{
			dto.getTaskRecordDtos().add(taskRecordMapper.toDto(x));
		});
		return dto;
	}

	@Override
	public TaskHead buildEntity(TaskHeadDto dto, TaskHead entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setTitle(dto.getTitle());
		entity.setProcessState(dto.getProcessState());
		entity.setProcessSuggestion(dto.getProcessSuggestion());
		entity.setTaskType(dto.getTaskType());
		entity.setRelId(dto.getRelId());
		entity.setComplete(dto.isComplete());
		entity.setNextUser(dto.getNextUser());
		//基础信息
		entity.setCreatedBy(dto.getCreatedBy());
		entity.setCreatedDate(dto.getCreatedDate());	
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setItemOrder(dto.getItemOrder());
				
		return entity;
	}

}
