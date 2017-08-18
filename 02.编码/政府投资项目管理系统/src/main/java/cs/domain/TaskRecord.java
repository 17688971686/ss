package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description: 任务处理流程表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
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
			
	@Column(columnDefinition="varchar(255) NULL COMMENT '下一处理人'")
	private String nextUser;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '处理状态'")
	private String processState;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '处理意见'")
	private String processSuggestion;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务Id'")
	private String taskId;
	
	//begin#添加筛选字段
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目行业'")
	private String projectIndustry;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位名称'")
	private String unitName;
	
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

	public String getProcessState() {
		return processState;
	}
	
	public void setProcessState(String processState) {
		this.processState = processState;
	}
	
	public String getNextUser() {
		return nextUser;
	}
	public void setNextUser(String nextUser) {
		this.nextUser = nextUser;
	}
	public String getProcessSuggestion() {
		return processSuggestion;
	}
	public void setProcessSuggestion(String processSuggestion) {
		this.processSuggestion = processSuggestion;
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	public String getProjectIndustry() {
		return projectIndustry;
	}
	public void setProjectIndustry(String projectIndustry) {
		this.projectIndustry = projectIndustry;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
}
