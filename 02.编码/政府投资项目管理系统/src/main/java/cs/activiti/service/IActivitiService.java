package cs.activiti.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.User;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;

public interface IActivitiService {
	//卸载部署
	public void undeploymentById(String deploymentId);
	//启动工作流
	public ProcessInstance startProcess(String processDefinitionKey,Map<String, Object> variables);
	//获取已在运行的流程定义
	public ProcessDefinition getRuntimeProcessDefinition(String processDefinitionId);

	//添加任务候选人
	public void addCandidateUsers(String taskId,Collection<String> candidateUsers);
	//添加任务候选组
	public void addCandidateGroups(String taskId,Collection<String> candidateGroups);
	
	//认领任务
	public void claimTask(String taskId,String userId);
	//结束任务（可在variables中传入nextAssignee来指定下个签收人）
	public void taskComplete(String taskId,Map<String, Object> variables);
	//结束任务（不指定具体办理人，默认传递给设置好的候选组里的人）
	public void taskComplete(String taskId);
	
	//查询分配给候选人或候选人已签收的任务列表
	public List<Task> getPersonalTask(String assignee);
	//查询个人所属组任务列表
	public List<Task> getGroupTask(String candidateGroup);
	//查询正在执行的任务办理人列表 
	public List<Task> findRunPersonalTask();
	//查询指定给个人的任务
	public List<Task> getAssigneeTask(String assignee);
	
	//创建流程用户
	public void createUser(User user);
	//创建流程组
	public void createGroup(Group group);
	//创建流程用户与组关联关系
	public void createUserGroupMembership(String userId,String groupId);
	
	//获取流程进度图
	public void getProcessTraceChar(String executionId);
	//获取任务中变量
	public Object getTaskVariable(String taskId,String variableName);
	//获取任务中流程变量
	public Object getTaskProcessVariable(String taskId,String variableName);

	//根据流程ID查询任务
	public Task getTaskByExecutionId(String executionId);
	
	//创建新的候选组
	public Group createNewGroup(String groupId);
	
	//创建新的候选人
	public User createNewUser(String userId);
	
	//根据ID查询候选组
	public Group getGroup(String groupId);
	
	//根据ID查询候选人
	public User getUser(String userId);
	
	
	//删除候选组、候选人员关联
	public void deleteMembership(String userId, String groupId);
	
	//删除候选组
	public void deleteGroup(String groupId);
	
	//删除候选人员
	public void deleteUser(String groupId);
	
	//查询所有候选人
	public List<User> getAllUser();

	//查询所有角色组
	public List<Group> getAllGroup();
	
	//根据流程ID查询已完结的历史信息
	public List<HistoricTaskInstance> getHistoryInfo(String processId);
	
	public List<Task> getUserTask(String assignee);
	List<HistoricTaskInstance> getHistoryInfoByAssignee(String userId);
	void setTaskProcessVariable(String taskId, String variableName, String value);
	List<HistoricActivityInstance> getHistoryInfoByActivity(String processId);
	List<Comment> getTaskComment(String taskId);
	void setTaskComment(String taskId, String processInstanceId, String message);
	void setStartProcessUserId(String userId);
	
	//查询历史流程变量varinst表
	List<HistoricVariableInstance> findHisVariablesList(String processInstanceId);
	
	//查询历史流程实例procinst表
	List<HistoricProcessInstance> findHisProcessIntanceList(String processInstanceId);
	
	public List<HistoricProcessInstance> getHistoryInfoByProcess(String processId);
	void sendMail();
	List<Task> getCandidateGroupInTask(List<String> ids);
	
}
