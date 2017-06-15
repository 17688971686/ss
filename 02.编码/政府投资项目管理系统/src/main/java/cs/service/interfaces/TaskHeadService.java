package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;

public interface TaskHeadService {
	PageModelDto<TaskHeadDto> get(ODataObj odataObj);	
	void create(TaskHeadDto dto);
	void update(TaskHeadDto dto);
	
	void handle(String taskId,TaskRecordDto dto);
}
