package cs.domain;

import org.hibernate.annotations.Immutable;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;


/**
 * Description: 已办理（历史）任务 数据映射实体
 * Author: tzg
 * Date: 2017/8/7 14:48
 */
@Entity
@Table(name = "csv_wf_hi_task")
@Immutable
public class WorkflowHistoryTask implements Serializable {

  @Id
  @Column(name = "id_")
  private String id;
  @Column(name = "proc_def_id_")
  private String processDefinitionId;
  @Column(name = "task_def_key_")
  private String taskDefinitionKey;
  @Column(name = "proc_inst_id_")
  private String processInstanceId;
  @Column(name = "execution_id_")
  private String executionId;
  /**
   * 任务名称
   */
  @Column(name = "name_")
  private String name;
  @Column(name = "parent_task_id_")
  private String parentTaskId;
  @Column(name = "description_")
  private String description;
  @Column(name = "owner_")
  private String owner;
  /**
   * 实际操作人账号
   */
  @Column(name = "assignee_")
  private String assignee;
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "start_time_")
  private Date startTime;       // 任务开始时间
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "claim_time_")
  private Date claimTime;       // 任务提醒时间
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "end_time_")
  private Date endTime;         // 任务结束时间
  @Column(name = "duration_")
  private Long duration;        // 耗时
  @Column(name = "delete_reason_")
  private String deleteReason;  // 删除原因
  @Column(name = "priority_")
  private Long priority;        // 优先级别
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "due_date_")
  private Date dueDate;         // 过期时间
  @Column(name = "form_key_")
  private String formKey;
  @Column(name = "category_")
  private String category;
  @Column(name = "tenant_id_")
  private String tenantId;
  @Column(name = "USER_ID_")
  private String userId;        // 候选用户账号
  @Column(name = "GROUP_ID_")
  private String groupId;       // 候选用户组ID
  @Column(name = "transactor")
  private String transactor;
  @Column(name = "proc_def_name_")
  private String processDefinitionName;
  @Column(name = "business_key_")
  private String businessKey;
  @Column(name = "PROCESS_BUSINESS_KEY_")
  private String processBusinessKey;
  @Column(name = "PROC_INST_NAME_")
  private String processInstName;         // 流程实例名


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getProcessDefinitionId() {
    return processDefinitionId;
  }

  public void setProcessDefinitionId(String processDefinitionId) {
    this.processDefinitionId = processDefinitionId;
  }

  public String getTaskDefinitionKey() {
    return taskDefinitionKey;
  }

  public void setTaskDefinitionKey(String taskDefinitionKey) {
    this.taskDefinitionKey = taskDefinitionKey;
  }

  public String getProcessInstanceId() {
    return processInstanceId;
  }

  public void setProcessInstanceId(String processInstanceId) {
    this.processInstanceId = processInstanceId;
  }

  public String getExecutionId() {
    return executionId;
  }

  public void setExecutionId(String executionId) {
    this.executionId = executionId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getParentTaskId() {
    return parentTaskId;
  }

  public void setParentTaskId(String parentTaskId) {
    this.parentTaskId = parentTaskId;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getOwner() {
    return owner;
  }

  public void setOwner(String owner) {
    this.owner = owner;
  }

  public String getAssignee() {
    return assignee;
  }

  public void setAssignee(String assignee) {
    this.assignee = assignee;
  }

  public Date getStartTime() {
    return startTime;
  }

  public void setStartTime(Date startTime) {
    this.startTime = startTime;
  }

  public Date getClaimTime() {
    return claimTime;
  }

  public void setClaimTime(Date claimTime) {
    this.claimTime = claimTime;
  }

  public Date getEndTime() {
    return endTime;
  }

  public void setEndTime(Date endTime) {
    this.endTime = endTime;
  }

  public Long getDuration() {
    return duration;
  }

  public void setDuration(Long duration) {
    this.duration = duration;
  }

  public String getDeleteReason() {
    return deleteReason;
  }

  public void setDeleteReason(String deleteReason) {
    this.deleteReason = deleteReason;
  }

  public Long getPriority() {
    return priority;
  }

  public void setPriority(Long priority) {
    this.priority = priority;
  }

  public Date getDueDate() {
    return dueDate;
  }

  public void setDueDate(Date dueDate) {
    this.dueDate = dueDate;
  }

  public String getFormKey() {
    return formKey;
  }

  public void setFormKey(String formKey) {
    this.formKey = formKey;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getGroupId() {
    return groupId;
  }

  public void setGroupId(String groupId) {
    this.groupId = groupId;
  }

  public String getTransactor() {
    return transactor;
  }

  public void setTransactor(String transactor) {
    this.transactor = transactor;
  }

  public String getProcessDefinitionName() {
    return processDefinitionName;
  }

  public void setProcessDefinitionName(String processDefinitionName) {
    this.processDefinitionName = processDefinitionName;
  }

  public String getBusinessKey() {
    return businessKey;
  }

  public void setBusinessKey(String businessKey) {
    this.businessKey = businessKey;
  }

  public String getProcessBusinessKey() {
    return processBusinessKey;
  }

  public void setProcessBusinessKey(String processBusinessKey) {
    this.processBusinessKey = processBusinessKey;
  }

  public String getProcessInstName() {
    return processInstName;
  }

  public void setProcessInstName(String processInstName) {
    this.processInstName = processInstName;
  }
}
