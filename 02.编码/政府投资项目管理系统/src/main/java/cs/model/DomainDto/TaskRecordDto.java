package cs.model.DomainDto;

import cs.domain.TaskRecord;
/**
 * @Description: 任务处理流程实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
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
