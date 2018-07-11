package cs.domain;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(WorkflowHistoryTask.class)
public abstract class WorkflowHistoryTask_ {

	public static volatile SingularAttribute<WorkflowHistoryTask, String> parentTaskId;
	public static volatile SingularAttribute<WorkflowHistoryTask, Date> dueDate;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> groupId;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> description;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> processDefinitionName;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> transactor;
	public static volatile SingularAttribute<WorkflowHistoryTask, Long> duration;
	public static volatile SingularAttribute<WorkflowHistoryTask, Date> startTime;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> id;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> owner;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> processDefinitionId;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> processInstanceId;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> processInstName;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> formKey;
	public static volatile SingularAttribute<WorkflowHistoryTask, Long> priority;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> deleteReason;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> userId;
	public static volatile SingularAttribute<WorkflowHistoryTask, Date> claimTime;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> taskDefinitionKey;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> executionId;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> name;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> tenantId;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> businessKey;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> assignee;
	public static volatile SingularAttribute<WorkflowHistoryTask, Date> endTime;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> processBusinessKey;
	public static volatile SingularAttribute<WorkflowHistoryTask, String> category;

}

