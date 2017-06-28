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
		dto.setProcessState(entity.getProcessState());
		dto.setUserName(entity.getUserName());
		dto.setCreatedBy(entity.getCreatedBy());
		dto.setTaskType(entity.getTaskType());
		dto.setRelId(entity.getRelId());
		dto.setCreatedDate(entity.getCreatedDate());
		dto.setTitle(entity.getTitle());
		dto.setId(entity.getId());
		dto.setItemOrder(entity.getItemOrder());
		dto.setModifiedDate(entity.getModifiedDate());
		dto.setModifiedBy(entity.getModifiedBy());
		dto.setComplete(entity.isComplete());
		
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
		entity.setProcessState(dto.getProcessState());
		entity.setUserName(dto.getUserName());
		entity.setCreatedBy(dto.getCreatedBy());
		entity.setTaskType(dto.getTaskType());
		entity.setRelId(dto.getRelId());
		entity.setCreatedDate(dto.getCreatedDate());
		entity.setTitle(dto.getTitle());	
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setComplete(dto.isComplete());
				
		return entity;
	}

}
