package cs.service.interfaces;

import cs.domain.TaskHead;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;

public interface TaskHeadService extends IService<TaskHeadDto, TaskHead, String> {	
	
	void handle(String taskId,TaskRecordDto dto);

	PageModelDto<TaskHeadDto> getTask(ODataObj odataObj);
}
