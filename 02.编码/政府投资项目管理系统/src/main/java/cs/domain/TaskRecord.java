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
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '任务类型'")
	private String taskType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
			
	@Column(columnDefinition="varchar(255) NULL COMMENT '下一处理人'")
	private String nextUser;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '审批角色'")
	private String processRole;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '处理状态'")
	private String processState;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '下一处理状态'")
	private String nextProcess;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '处理意见'")
	private String processSuggestion;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '任务Id'")
	private String taskId;
	
	//begin#添加筛选字段
	@Column(columnDefinition="varchar(125) NULL COMMENT '项目行业'")
	private String projectIndustry;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位名称'")
	private String unitName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '经办人'")
	private String operator;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '退文申报材料不符合要求'")
	private String tuiwen_data;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '退文项目立项依据不充分'")
	private String tuiwen_accord;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '退文建设内容不明确'")
	private String tuiwen_content;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '退文投资概算及资金来源不合理'")
	private String tuiwen_capital;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '退文其他'")
	private String tuiwen_other;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '退文标识'")
	private Boolean tuiwen;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '发文标识'")
	private Boolean fawen;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '是否填写评审报批单'")
	private Boolean approval;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '是否填写评审委托书'")
	private Boolean proxy;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '是否填写评审结果'")
	private Boolean reviewResult;
	
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
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
	public String getTuiwen_data() {
		return tuiwen_data;
	}
	public void setTuiwen_data(String tuiwen_data) {
		this.tuiwen_data = tuiwen_data;
	}
	public String getTuiwen_accord() {
		return tuiwen_accord;
	}
	public void setTuiwen_accord(String tuiwen_accord) {
		this.tuiwen_accord = tuiwen_accord;
	}
	public String getTuiwen_content() {
		return tuiwen_content;
	}
	public void setTuiwen_content(String tuiwen_content) {
		this.tuiwen_content = tuiwen_content;
	}
	public String getTuiwen_capital() {
		return tuiwen_capital;
	}
	public void setTuiwen_capital(String tuiwen_capital) {
		this.tuiwen_capital = tuiwen_capital;
	}
	public String getTuiwen_other() {
		return tuiwen_other;
	}
	public void setTuiwen_other(String tuiwen_other) {
		this.tuiwen_other = tuiwen_other;
	}
	public Boolean getTuiwen() {
		return tuiwen;
	}
	public void setTuiwen(Boolean tuiwen) {
		this.tuiwen = tuiwen;
	}
	public Boolean getFawen() {
		return fawen;
	}
	public void setFawen(Boolean fawen) {
		this.fawen = fawen;
	}
	public Boolean getApproval() {
		return approval;
	}
	public void setApproval(Boolean approval) {
		this.approval = approval;
	}
	public Boolean getProxy() {
		return proxy;
	}
	public void setProxy(Boolean proxy) {
		this.proxy = proxy;
	}
	public Boolean getReviewResult() {
		return reviewResult;
	}
	public void setReviewResult(Boolean reviewResult) {
		this.reviewResult = reviewResult;
	}

}
