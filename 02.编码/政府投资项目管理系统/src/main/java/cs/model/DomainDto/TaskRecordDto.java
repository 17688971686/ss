package cs.model.DomainDto;

import cs.domain.TaskRecord;

public class TaskRecordDto extends TaskRecord {
	private String taskTypeDesc;
	private String processStateDesc;
	public String getTaskTypeDesc() {
		return taskTypeDesc;
	}
	public void setTaskTypeDesc(String taskTypeDesc) {
		this.taskTypeDesc = taskTypeDesc;
	}
	public String getProcessStateDesc() {
		return processStateDesc;
	}
	public void setProcessStateDesc(String processStateDesc) {
		this.processStateDesc = processStateDesc;
	}
	
	
}
