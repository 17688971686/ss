package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.TaskRecord;
import cs.model.DomainDto.TaskRecordDto;

@Component
public class TaskRecordMapper implements IMapper<TaskRecordDto, TaskRecord> {
	
	@Override
	public TaskRecordDto toDto(TaskRecord entity) {
		TaskRecordDto dto=new TaskRecordDto();
		//流程记录信息
		dto.setId(entity.getId());
		dto.setTitle(entity.getTitle());
		dto.setProcessSuggestion(entity.getProcessSuggestion());
		dto.setProcessState(entity.getProcessState());	
		dto.setTaskType(entity.getTaskType());
		dto.setRelId(entity.getRelId());
		dto.setTaskId(entity.getTaskId());
		dto.setNextUser(entity.getNextUser());
		//基础信息
		dto.setCreatedDate(entity.getCreatedDate());		
		dto.setCreatedBy(entity.getCreatedBy());		
		dto.setModifiedDate(entity.getModifiedDate());
		dto.setModifiedBy(entity.getModifiedBy());
		dto.setItemOrder(entity.getItemOrder());

		return dto;
	}

	@Override
	public TaskRecord buildEntity(TaskRecordDto dto, TaskRecord entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setTitle(dto.getTitle());
		entity.setProcessSuggestion(dto.getProcessSuggestion());
		entity.setProcessState(dto.getProcessState());
		entity.setTaskType(dto.getTaskType());
		entity.setRelId(dto.getRelId());
		entity.setTaskId(dto.getTaskId());
		entity.setNextUser(dto.getNextUser());
		//基础信息
		entity.setCreatedDate(dto.getCreatedDate());
		entity.setCreatedBy(dto.getCreatedBy());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setItemOrder(dto.getItemOrder());
		
		return entity;

	}

}
