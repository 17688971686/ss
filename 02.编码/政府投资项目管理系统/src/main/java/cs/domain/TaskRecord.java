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
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务Id'")
	private String taskId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '标题'")
	private String title;	
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '任务类型'")
	private String taskType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务当前所处阶段'")
	private String thisProcess;
	
	@Column(columnDefinition="int(1) DEFAULT 0 COMMENT '任务当前处理状态：0：未开始，1：进行中，2：通过，3：转办，4：不通过'")
	private Integer thisProcessState;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '任务当前处理人员'")
	private String thisUser;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '任务当前处理角色'")
	private String thisRole;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务下一所处阶段'")
	private String nextProcess;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务下一处理人员'")
	private String nextUser;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务下一处理角色'")
	private String nextRole;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '处理意见'")
	private String processSuggestion;
	
	//begin#添加筛选字段
	@Column(columnDefinition="varchar(125) NULL COMMENT '项目行业'")
	private String projectIndustry;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位名称'")
	private String unitName;
	
	//begin#关联附件
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
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

	public String getThisProcess() {
		return thisProcess;
	}

	public void setThisProcess(String thisProcess) {
		this.thisProcess = thisProcess;
	}

	public Integer getThisProcessState() {
		return thisProcessState;
	}

	public void setThisProcessState(Integer thisProcessState) {
		this.thisProcessState = thisProcessState;
	}

	public String getThisUser() {
		return thisUser;
	}

	public void setThisUser(String thisUser) {
		this.thisUser = thisUser;
	}

	public String getThisRole() {
		return thisRole;
	}

	public void setThisRole(String thisRole) {
		this.thisRole = thisRole;
	}

	public String getNextProcess() {
		return nextProcess;
	}

	public void setNextProcess(String nextProcess) {
		this.nextProcess = nextProcess;
	}

	public String getNextUser() {
		return nextUser;
	}

	public void setNextUser(String nextUser) {
		this.nextUser = nextUser;
	}

	public String getNextRole() {
		return nextRole;
	}

	public void setNextRole(String nextRole) {
		this.nextRole = nextRole;
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

	public List<Attachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}
}
