package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cs_taskRecord")
public class TaskRecord extends BaseEntity {
	@Id
	private String id;
	@Column(columnDefinition="varchar(255) NULL COMMENT '标题'")
	private String title;	
	
	
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务类型'")
	private String taskType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '所属用户名'")
	private String userName;
	@Column(columnDefinition="varchar(255) NULL COMMENT '处理状态'")
	private String processState;
	@Column(columnDefinition="varchar(500) NULL COMMENT '处理意见'")
	private String processSuggestion;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getTaskType() {
		return taskType;
	}
	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}
	public String getRelId() {
		return relId;
	}
	public void setRelId(String relId) {
		this.relId = relId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getProcessState() {
		return processState;
	}
	public void setProcessState(String processState) {
		this.processState = processState;
	}
	public String getProcessSuggestion() {
		return processSuggestion;
	}
	public void setProcessSuggestion(String processSuggestion) {
		this.processSuggestion = processSuggestion;
	}
}
