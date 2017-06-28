package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.TaskRecord;
import cs.model.DomainDto.TaskRecordDto;

@Component
public class TaskRecordMapper implements IMapper<TaskRecordDto, TaskRecord> {
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	public TaskRecordDto toDto(TaskRecord entity) {
		TaskRecordDto dto=new TaskRecordDto();
		dto.setProcessSuggestion(entity.getProcessSuggestion());
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

		return dto;
	}

	@Override
	public TaskRecord buildEntity(TaskRecordDto dto, TaskRecord entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setProcessSuggestion(dto.getProcessSuggestion());
		entity.setProcessState(dto.getProcessState());
		entity.setUserName(dto.getUserName());
		entity.setCreatedBy(currentUser.getLoginName());
		entity.setTaskType(dto.getTaskType());
		entity.setRelId(dto.getRelId());
		entity.setCreatedDate(dto.getCreatedDate());
		entity.setTitle(dto.getTitle());
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		
		return entity;

	}

}
