package cs.service.interfaces;

import cs.domain.TaskHead;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;

public interface TaskHeadService extends IService<TaskHeadDto, TaskHead, String> {	
	
	void handle(String taskId,TaskRecordDto dto);
}
