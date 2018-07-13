package cs.domain;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(WorkflowRunTask.class)
public abstract class WorkflowRunTask_ {

	public static volatile SingularAttribute<WorkflowRunTask, Long> suspensionState;
	public static volatile SingularAttribute<WorkflowRunTask, String> parentTaskId;
	public static volatile SingularAttribute<WorkflowRunTask, Date> dueDate;
	public static volatile SingularAttribute<WorkflowRunTask, String> groupId;
	public static volatile SingularAttribute<WorkflowRunTask, String> description;
	public static volatile SingularAttribute<WorkflowRunTask, String> processDefinitionName;
	public static volatile SingularAttribute<WorkflowRunTask, String> transactor;
	public static volatile SingularAttribute<WorkflowRunTask, String> id;
	public static volatile SingularAttribute<WorkflowRunTask, String> owner;
	public static volatile SingularAttribute<WorkflowRunTask, String> processInstanceId;
	public static volatile SingularAttribute<WorkflowRunTask, String> processDefinitionId;
	public static volatile SingularAttribute<WorkflowRunTask, Long> rev;
	public static volatile SingularAttribute<WorkflowRunTask, String> processInstName;
	public static volatile SingularAttribute<WorkflowRunTask, String> formKey;
	public static volatile SingularAttribute<WorkflowRunTask, Long> priority;
	public static volatile SingularAttribute<WorkflowRunTask, String> userId;
	public static volatile SingularAttribute<WorkflowRunTask, String> executionId;
	public static volatile SingularAttribute<WorkflowRunTask, String> taskDefinitionKey;
	public static volatile SingularAttribute<WorkflowRunTask, Date> createTime;
	public static volatile SingularAttribute<WorkflowRunTask, String> name;
	public static volatile SingularAttribute<WorkflowRunTask, String> tenantId;
	public static volatile SingularAttribute<WorkflowRunTask, String> businessKey;
	public static volatile SingularAttribute<WorkflowRunTask, String> assignee;
	public static volatile SingularAttribute<WorkflowRunTask, String> processBusinessKey;
	public static volatile SingularAttribute<WorkflowRunTask, String> delegation;
	public static volatile SingularAttribute<WorkflowRunTask, String> category;

}

