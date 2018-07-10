package cs.domain;

import org.hibernate.annotations.Immutable;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Description: 待办理任务 数据映射实体
 * Author: tzg
 * Date: 2017/8/7 14:48
 */
@Entity
@Table(name = "csv_wf_ru_task")
@Immutable
public class WorkflowRunTask implements Serializable {
    /**
     * 流程任务ID
     */
    @Id
    @Column(name = "id_")
    private String id;
    @Column(name = "rev_")
    private Long rev;
    /**
     * 流程执行实例ID
     */
    @Column(name = "execution_id_")
    private String executionId;
    /**
     * 流程实例ID
     */
    @Column(name = "proc_inst_id_")
    private String processInstanceId;
    /**
     * 流程定义ID
     */
    @Column(name = "proc_def_id_")
    private String processDefinitionId;
    /**
     * 任务名称
     */
    @Column(name = "name_")
    private String name;
    /**
     * 父任务ID
     */
    @Column(name = "parent_task_id_")
    private String parentTaskId;
    /**
     * 任务描述
     */
    @Column(name = "description_")
    private String description;
    /**
     * 任务定义值
     */
    @Column(name = "task_def_key_")
    private String taskDefinitionKey;
    /**
     * 任务所属人
     */
    @Column(name = "owner_")
    private String owner;
    /**
     * 任务代理用户账号
     */
    @Column(name = "assignee_")
    private String assignee;
    @Column(name = "delegation_")
    private String delegation;
    @Column(name = "priority_")
    private Long priority;
    /**
     * 任务创建时间（送达时间）
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_time_")
    private Date createTime;
    /**
     * 办理时限
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "due_date_")
    private Date dueDate;
    @Column(name = "category_")
    private String category;
    /**
     * 流程状态
     */
    @Column(name = "suspension_state_")
    private Long suspensionState;
    @Column(name = "tenant_id_")
    private String tenantId;
    /**
     * 表单值
     */
    @Column(name = "form_key_")
    private String formKey;
    /**
     * 候选用户ID
     */
    @Column(name = "USER_ID_")
    private String userId;
    /**
     * 候选用户组ID
     */
    @Column(name = "GROUP_ID_")
    private String groupId;
    /**
     * 办理人ID
     */
    @Column(name = "transactor")
    private String transactor;
    /**
     * 流程名称
     */
    @Column(name = "proc_def_name_")
    private String processDefinitionName;
    /**
     * 业务主键（流程任务）
     */
    @Column(name = "business_key_")
    private String businessKey;
    /**
     * 业务主键（流程实例）
     */
    @Column(name = "PROCESS_BUSINESS_KEY_")
    private String processBusinessKey;
    /**
     * 流程实例名
     */
    @Column(name = "PROC_INST_NAME_")
    private String processInstName;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getRev() {
        return rev;
    }

    public void setRev(Long rev) {
        this.rev = rev;
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public String getProcessDefinitionId() {
        return processDefinitionId;
    }

    public void setProcessDefinitionId(String processDefinitionId) {
        this.processDefinitionId = processDefinitionId;
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

    public String getTaskDefinitionKey() {
        return taskDefinitionKey;
    }

    public void setTaskDefinitionKey(String taskDefinitionKey) {
        this.taskDefinitionKey = taskDefinitionKey;
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

    public String getDelegation() {
        return delegation;
    }

    public void setDelegation(String delegation) {
        this.delegation = delegation;
    }

    public Long getPriority() {
        return priority;
    }

    public void setPriority(Long priority) {
        this.priority = priority;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getSuspensionState() {
        return suspensionState;
    }

    public void setSuspensionState(Long suspensionState) {
        this.suspensionState = suspensionState;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getFormKey() {
        return formKey;
    }

    public void setFormKey(String formKey) {
        this.formKey = formKey;
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
