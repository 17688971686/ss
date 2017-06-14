package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;

public interface TaskRecordService {
	PageModelDto<TaskRecordDto> get(ODataObj odataObj);	
	void create(TaskRecordDto dto);
	void update(TaskRecordDto dto);
}
