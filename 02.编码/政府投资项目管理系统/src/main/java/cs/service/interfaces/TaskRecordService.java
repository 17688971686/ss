package cs.service.interfaces;

import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;

/**
 * 任务流转表 -- 已弃置
 * @author Administrator
 *
 */
public interface TaskRecordService extends IService<TaskRecordDto, TaskRecord, String> {

	PageModelDto<TaskRecordDto> get_shenPi(ODataObj odataObj);

	PageModelDto<TaskRecordDto> getToDo_plan(ODataObj odataObj);
}
