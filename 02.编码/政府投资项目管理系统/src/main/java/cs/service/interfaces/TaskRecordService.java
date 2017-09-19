package cs.service.interfaces;

import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;

public interface TaskRecordService extends IService<TaskRecordDto, TaskRecord, String> {

	PageModelDto<TaskRecordDto> get_shenPi(ODataObj odataObj);
}
