package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;
import cs.domain.TaskRecord;
import cs.model.DomainDto.TaskRecordDto;
/**
 * @Description: 任务流程记录信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class TaskRecordMapper implements IMapper<TaskRecordDto, TaskRecord> {
	
	@Override
	public TaskRecordDto toDto(TaskRecord entity) {
		TaskRecordDto dto=new TaskRecordDto();
		if(entity !=null){
			//流程记录信息
			dto.setId(entity.getId());
			dto.setTitle(entity.getTitle());
			dto.setProcessSuggestion(entity.getProcessSuggestion());
			dto.setProcessState(entity.getProcessState());	
			dto.setTaskType(entity.getTaskType());
			dto.setRelId(entity.getRelId());
			dto.setTaskId(entity.getTaskId());
			dto.setNextUser(entity.getNextUser());
			dto.setProcessRole(entity.getProcessRole());
			//筛选条件信息
			dto.setUnitName(entity.getUnitName());
			dto.setProjectIndustry(entity.getProjectIndustry());
			//基础信息
			dto.setCreatedDate(entity.getCreatedDate());		
			dto.setCreatedBy(entity.getCreatedBy());		
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setItemOrder(entity.getItemOrder());
		}
		return dto;
	}

	@Override
	public TaskRecord buildEntity(TaskRecordDto dto, TaskRecord entity) {
		if(dto !=null  && entity !=null){
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
			entity.setProcessRole(dto.getProcessRole());
			//筛选条件信息
			entity.setUnitName(dto.getUnitName());
			entity.setProjectIndustry(dto.getProjectIndustry());
			//基础信息
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}
}
