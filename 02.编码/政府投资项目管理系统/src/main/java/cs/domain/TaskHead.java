package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/**
 * @Description: 任务表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_taskHead")
public class TaskHead extends BaseEntity {
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '标题'")
	private String title;	
		
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务类型'")
	private String taskType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '处理意见'")
	private String processSuggestion;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '下一处理人'")
	private String nextUser;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '下一处理环节'")
	private String nextProcess;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '当前处理状态'")
	private String processState;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '审批角色'")
	private String processRole;
	
	@Column(columnDefinition="bit NULL COMMENT '是否完成'")
	private boolean isComplete;
	//begin#添加筛选字段
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目行业'")
	private String projectIndustry;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位名称'")
	private String unitName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '经办人'")
	private String operator;
	
	//begin#关联
	@OneToMany(cascade=CascadeType.ALL)
	private List<TaskRecord> taskRecords=new ArrayList<>();

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

	public String getNextUser() {
		return nextUser;
	}

	public void setNextUser(String nextUser) {
		this.nextUser = nextUser;
	}

	public String getProcessState() {
		return processState;
	}

	public void setProcessState(String processState) {
		this.processState = processState;
	}

	public List<TaskRecord> getTaskRecords() {
		return taskRecords;
	}

	public void setTaskRecords(List<TaskRecord> taskRecords) {
		this.taskRecords = taskRecords;
	}

	public boolean isComplete() {
		return isComplete;
	}

	public void setComplete(boolean isComplete) {
		this.isComplete = isComplete;
	}

	public String getProcessSuggestion() {
		return processSuggestion;
	}

	public void setProcessSuggestion(String processSuggestion) {
		this.processSuggestion = processSuggestion;
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

	public String getProcessRole() {
		return processRole;
	}

	public void setProcessRole(String processRole) {
		this.processRole = processRole;
	}

	public String getNextProcess() {
		return nextProcess;
	}

	public void setNextProcess(String nextProcess) {
		this.nextProcess = nextProcess;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

}
