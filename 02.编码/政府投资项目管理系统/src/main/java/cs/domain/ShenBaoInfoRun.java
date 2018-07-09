package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Description: 申报信息表 视图
 * @author: tzg
 * @date: 2018/7/9 12:00
 */
@Entity
@Table(name = "csv_run_shenbaoinfo")
public class ShenBaoInfoRun extends BaseShenBaoInfo {

    @Column(name = "TASK_ID")
    private String taskId;
    @Column(name = "TASK_NAME")
    private String taskName;
    @Column(name = "TASK_DEF_KEY_")
    private String taskDefKey;
    @Column(name = "PROC_DEF_ID_")
    private String procDefId;
    @Column(name = "PROC_DEF_KEY_")
    private String procDefKey;
    @Column(name = "PROC_DEF_NAME_")
    private String procDefName;
    @Column(name = "GROUP_ID_")
    private String groupId;
    @Column(name = "USER_ID_")
    private String userId;
    @Column(name = "ASSIGNEE_")
    private String assignee;
    @Column(name = "TRANSACTOR")
    private String transactor;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskDefKey() {
        return taskDefKey;
    }

    public void setTaskDefKey(String taskDefKey) {
        this.taskDefKey = taskDefKey;
    }

    public String getProcDefId() {
        return procDefId;
    }

    public void setProcDefId(String procDefId) {
        this.procDefId = procDefId;
    }

    public String getProcDefKey() {
        return procDefKey;
    }

    public void setProcDefKey(String procDefKey) {
        this.procDefKey = procDefKey;
    }

    public String getProcDefName() {
        return procDefName;
    }

    public void setProcDefName(String procDefName) {
        this.procDefName = procDefName;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getTransactor() {
        return transactor;
    }

    public void setTransactor(String transactor) {
        this.transactor = transactor;
    }
}
