package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.TaskHead;
/**
 * @Description: 任务实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class TaskHeadDto extends TaskHead {
	
	private List<TaskRecordDto> taskRecordDtos=new ArrayList<>();

	public List<TaskRecordDto> getTaskRecordDtos() {
		return taskRecordDtos;
	}

	public void setTaskRecordDtos(List<TaskRecordDto> taskRecordDtos) {
		this.taskRecordDtos = taskRecordDtos;
	}

}
