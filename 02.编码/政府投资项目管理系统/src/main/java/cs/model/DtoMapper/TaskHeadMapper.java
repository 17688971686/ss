package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
/**
 * @Description: 任务信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class TaskHeadMapper implements IMapper<TaskHeadDto, TaskHead> {

	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	
	@Override
	public TaskHeadDto toDto(TaskHead entity) {
		TaskHeadDto dto=new TaskHeadDto();
		if(entity !=null){
			//任务信息
			dto.setId(entity.getId());
			dto.setTitle(entity.getTitle());
			dto.setTaskType(entity.getTaskType());
			dto.setRelId(entity.getRelId());
			dto.setThisProcess(entity.getThisProcess());
			dto.setThisProcessState(entity.getThisProcessState());
			dto.setThisUser(entity.getThisUser());
			dto.setThisRole(entity.getThisRole());
			dto.setLastProcess(entity.getLastProcess());
			dto.setLastProcessState(entity.getLastProcessState());
			dto.setLastUser(entity.getLastUser());
			dto.setLastRole(entity.getLastRole());
			dto.setProcessSuggestion(entity.getProcessSuggestion());
			dto.setIsComplete(entity.getIsComplete());
			//筛选信息
			dto.setProjectIndustry(entity.getProjectIndustry());
			dto.setUnitName(entity.getUnitName());
			//基础信息
			dto.setItemOrder(entity.getItemOrder());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setModifiedBy(entity.getModifiedBy());					
			//begin#关联信息
			entity.getTaskRecords().stream().forEach(x->{
				dto.getTaskRecordDtos().add(taskRecordMapper.toDto(x));
			});
		}
		return dto;
	}

	@Override
	public TaskHead buildEntity(TaskHeadDto dto, TaskHead entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			//任务信息
			entity.setTitle(dto.getTitle());
			entity.setTaskType(dto.getTaskType());
			entity.setRelId(dto.getRelId());
			entity.setThisProcess(dto.getThisProcess());
			entity.setThisProcessState(dto.getThisProcessState());
			entity.setThisUser(dto.getThisUser());
			entity.setThisRole(dto.getThisRole());
			entity.setLastProcess(dto.getLastProcess());
			entity.setLastProcessState(dto.getLastProcessState());
			entity.setLastUser(dto.getLastUser());
			entity.setLastRole(dto.getLastRole());
			entity.setProcessSuggestion(dto.getProcessSuggestion());
			entity.setIsComplete(dto.getIsComplete());
			//筛选信息
			entity.setProjectIndustry(dto.getProjectIndustry());
			entity.setUnitName(dto.getUnitName());
			//基础信息
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());	
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
			//begin#关联信息：外部根据需要自己创建
		}
		return entity;
	}

}
