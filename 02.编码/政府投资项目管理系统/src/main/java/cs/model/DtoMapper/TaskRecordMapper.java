package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.domain.TaskRecord;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.TaskRecordDto;
/**
 * @Description: 任务流程记录信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class TaskRecordMapper implements IMapper<TaskRecordDto, TaskRecord> {
	
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	@Override
	public TaskRecordDto toDto(TaskRecord entity) {
		TaskRecordDto dto=new TaskRecordDto();
		if(entity !=null){
			//流程记录信息
			dto.setId(entity.getId());
			dto.setTaskId(entity.getTaskId());
			dto.setTitle(entity.getTitle());
			dto.setTaskType(entity.getTaskType());
			dto.setRelId(entity.getRelId());
			dto.setThisProcess(entity.getThisProcess());
			dto.setThisProcessState(entity.getThisProcessState());
			dto.setThisUser(entity.getThisUser());
			dto.setThisRole(entity.getThisRole());
			dto.setNextProcess(entity.getNextProcess());
			dto.setNextUser(entity.getNextUser());
			dto.setNextRole(entity.getNextRole());
			dto.setProcessSuggestion(entity.getProcessSuggestion());
			//筛选条件信息
			dto.setUnitName(entity.getUnitName());
			dto.setProjectIndustry(entity.getProjectIndustry());
			//基础信息
			dto.setCreatedDate(entity.getCreatedDate());		
			dto.setCreatedBy(entity.getCreatedBy());		
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setItemOrder(entity.getItemOrder());
			//关联关系
			entity.getAttachments().stream().forEach(x->{
				dto.getAttachmentDtos().add(attachmentMapper.toDto(x));
			});
		}
		return dto;
	}

	@Override
	public TaskRecord buildEntity(TaskRecordDto dto, TaskRecord entity) {
		if(dto !=null  && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setTaskId(dto.getTaskId());
			entity.setTitle(dto.getTitle());
			entity.setTaskType(dto.getTaskType());
			entity.setRelId(dto.getRelId());
			entity.setThisProcess(dto.getThisProcess());
			entity.setThisProcessState(dto.getThisProcessState());
			entity.setThisUser(dto.getThisUser());
			entity.setThisRole(dto.getThisRole());
			entity.setNextProcess(dto.getNextProcess());
			entity.setNextUser(dto.getNextUser());
			entity.setNextRole(dto.getNextRole());
			entity.setProcessSuggestion(dto.getProcessSuggestion());
			//筛选条件信息
			entity.setUnitName(dto.getUnitName());
			entity.setProjectIndustry(dto.getProjectIndustry());
			//基础信息
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
			//关联关系在外面根据需要进行转换
		}
		return entity;
	}
}
