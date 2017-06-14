package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.TaskHead;

public class TaskHeadDto extends TaskHead {
	
	private List<TaskRecordDto> taskRecordDtos=new ArrayList<>();

	public List<TaskRecordDto> getTaskRecordDtos() {
		return taskRecordDtos;
	}

	public void setTaskRecordDtos(List<TaskRecordDto> taskRecordDtos) {
		this.taskRecordDtos = taskRecordDtos;
	}

}
