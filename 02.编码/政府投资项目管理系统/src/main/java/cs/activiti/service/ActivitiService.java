package cs.activiti.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
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
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 * @author qinshangzhi
 * 流程核心服务类
 */
@Service
public class ActivitiService implements IActivitiService{
	
	private static Logger logger = Logger.getLogger(ActivitiService.class);
	
	@Autowired
    ProcessEngineFactoryBean processEngine;
    @Autowired
    ProcessEngineConfiguration processEngineConfiguration;
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private IdentityService identityService;
	@Autowired
	private HistoryService historyService;
	
	@Override
	public void undeploymentById(String deploymentId) {
		repositoryService.deleteDeployment(deploymentId, true);
		logger.debug("======>卸载deploymentId为 " + deploymentId + " 的流程!");
	}
	@Override
	public void sendMail(){
		processEngineConfiguration.setMailServerDefaultFrom("xmqlcglxt@longgang.gov.cn");
		processEngineConfiguration.setMailServerHost("mail.longgang.gov.cn");
		processEngineConfiguration.setMailServerPassword("lg2018");
		processEngineConfiguration.setMailServerPort(25);
		processEngineConfiguration.setMailServerUseSSL(true);
		processEngineConfiguration.setMailServerUsername("xmqlcglxt@longgang.gov.cn");
		
	}
	
	@Override
	public ProcessInstance startProcess(String processDefinitionKey,Map<String, Object> variables) {
		logger.debug("======>启动流程实例，processDefinitionKey："+processDefinitionKey);
		ProcessInstance  processInstance = runtimeService.startProcessInstanceByKey(processDefinitionKey, variables);
		return processInstance;
	}

	@Override
	public void setStartProcessUserId(String userId) {
		logger.debug("======>"+userId+"启动流程实例");
		identityService.setAuthenticatedUserId(userId);
	}
	
	@Override
	public ProcessDefinition getRuntimeProcessDefinition(String processDefinitionId) {
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
		.processDefinitionId(processDefinitionId)
		.singleResult();
		logger.debug("=====>已在运行的流程定义：" + processDefinition);
		return processDefinition;
	}


	@Override
	public void taskComplete(String taskId,Map<String, Object> variables) {
		String nextAssignee = (String) variables.get("nextAssignee");
		taskService.complete(taskId, variables);
		logger.debug("======>taskId为 " + taskId + " 的任务已经完结,下个办理人为：" + nextAssignee);
	}
	

	@Override
	public void taskComplete(String taskId) {
		taskService.complete(taskId);
		logger.debug("======>taskId为 " + taskId + " 的任务已经完结");
	}
	
	@Override
	public List<HistoricTaskInstance> getHistoryInfo(String processId) {
		List<HistoricTaskInstance> list = historyService.createHistoricTaskInstanceQuery().processInstanceId(processId).finished().list();
		logger.debug("======>查询历史");
		return list;
	}
	
	//流程经历的活动
	@Override
	public List<HistoricTaskInstance> getHistoryInfoByAssignee(String userId) {
		List<HistoricTaskInstance> list = historyService.createHistoricTaskInstanceQuery().taskAssignee(userId).finished().list();
		logger.debug("======>查询指定人的历史");
		return list;
	}
	
	//流程的步数
	@Override
	public List<HistoricActivityInstance> getHistoryInfoByActivity(String processId) {
		List<HistoricActivityInstance> list = historyService.createHistoricActivityInstanceQuery().processInstanceId(processId).finished().list();
		logger.debug("======>查询指定人的历史");
		return list;
	}
	
	//流程的历史
	@Override
	public List<HistoricProcessInstance> getHistoryInfoByProcess(String processId){
		List<HistoricProcessInstance> list=historyService.createHistoricProcessInstanceQuery().processInstanceId(processId).finished().list();
		logger.debug("======>查询流程的历史");
		return list;
	}
	
	@Override
	public List<Comment> getTaskComment(String taskId) {
		List<Comment> coms = taskService.getTaskComments(taskId);
		logger.debug("======>查询任务的意见");
		return coms;
	}
	
	@Override
	public void setTaskComment(String taskId,String processInstanceId,String msg) {
		taskService.addComment(taskId, processInstanceId, msg);
		
		logger.debug("======>添加任务的意见");
	}
	
	@Override
	public List<Task> getPersonalTask(String assignee) {
		List<Task> tasks = taskService.createTaskQuery().taskAssignee(assignee).orderByTaskCreateTime().desc().list();
		List<Task> task1s = taskService.createTaskQuery().taskCandidateUser(assignee).orderByTaskCreateTime().desc().list();
		
		logger.debug("--------------------我的分配任务或签收任务-----------");
		tasks.addAll(task1s);
		for(Task task : tasks){
			logger.debug("======>id:"+task.getId()+",");
			logger.debug("======>name:"+task.getName()+",");
			logger.debug("======>createTime:"+task.getCreateTime()+",");
			logger.debug("======>assignee:"+task.getAssignee());

		}	
		logger.debug("------------------------------------------");	
		return tasks;
	}


	@Override
	public List<Task> getAssigneeTask(String assignee) {
		List<Task> tasks = taskService.createTaskQuery().taskAssignee(assignee).orderByTaskCreateTime().desc().list();
		logger.debug("--------------------已签收、指定给我的任务-----------");
		
		for(Task task : tasks){
			logger.debug("======>id:"+task.getId()+",");
			logger.debug("======>name:"+task.getName()+",");
			logger.debug("======>createTime:"+task.getCreateTime()+",");
			logger.debug("======>assignee:"+task.getAssignee());

		}	
		logger.debug("------------------------------------------");	
		return tasks;
	}
	
	
	
	@Override
	public List<Task> getUserTask(String assignee) {
		List<Task> tasks = taskService.createTaskQuery().taskCandidateUser(assignee).orderByTaskCreateTime().desc().list();
		logger.debug("-------------------候选人的任务-----------");
		
		for(Task task : tasks){
			logger.debug("======>id:"+task.getId()+",");
			logger.debug("======>name:"+task.getName()+",");
			logger.debug("======>createTime:"+task.getCreateTime()+",");
			logger.debug("======>assignee:"+task.getAssignee());

		}	
		logger.debug("------------------------------------------");	
		return tasks;
	}
	
	@Override
	public List<Task> getGroupTask(String candidateGroup) {
		logger.debug("--------------------候选组组任务----------------------");
		List<Task> tasks = taskService.createTaskQuery().taskCandidateGroup(candidateGroup).orderByTaskCreateTime().desc().list();
		for(Task task : tasks){
			
			logger.debug("======>id:"+task.getId()+",");
			logger.debug("======>name:"+task.getName()+",");
			logger.debug("======>createTime:"+task.getCreateTime()+",");
			logger.debug("======>assignee:"+task.getAssignee());

		}
		logger.debug("------------------------------------------");	
		return tasks;
	}

	@Override
	public void claimTask(String taskId, String userId) {
		taskService.claim(taskId, userId);
		logger.debug("======>taskId为 " + taskId + " 的任务已被userId为 " + userId + "认领!");
	}

	@Override
	public void addCandidateUsers(String taskId,Collection<String> candidateUsers) {
		for (String candidateUser : candidateUsers) {
			taskService.addCandidateUser(taskId, candidateUser);
			logger.debug("======>候选人 " + candidateUser + " 已添加到任务 " + taskId + " 中!");
		}
	}

	@Override
	public void addCandidateGroups(String taskId,Collection<String> candidateGroups) {
		for (String candidateGroup : candidateGroups) {
			taskService.addCandidateGroup(taskId, candidateGroup);
			logger.debug("======>候选组 " + candidateGroup + " 已添加到任务 " + taskId + " 中!");
		}
	}

	@Override
	public List<Task> findRunPersonalTask() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void createUser(User user) {
		identityService.saveUser(user);
		logger.debug("======>userId为 " + user.getId() + " 的用户已保存！");
	}

	@Override
	public void createGroup(Group group) {
		identityService.saveGroup(group);
		logger.debug("======>groupId为 " + group.getId() + " 的组已保存！");
	}

	@Override
	public void createUserGroupMembership(String userId, String groupId) {
		identityService.createMembership(userId, groupId);
		logger.debug("======>用户 " + userId + "与组" + groupId + "已关联!");
	}

	@Override
	public void getProcessTraceChar(String executionId) {
		
	}

	@Override
	public Object getTaskVariable(String taskId,String variableName) {
		Object obj = taskService.getVariableLocal(taskId, variableName);
		if(obj != null) {
			logger.debug("======>单个任务变量：" + obj.toString());
		}
		return obj;
	}

	@Override
	public Object getTaskProcessVariable(String taskId,String variableName) {
		Object obj = taskService.getVariable(taskId, variableName);
		if(obj != null) {
			logger.debug("======>单个流程变量：" + obj.toString());
		}
		return obj;
	}
	
	@Override
	public List<HistoricVariableInstance> findHisVariablesList(String processInstanceId){
		List<HistoricVariableInstance> list = historyService.createHistoricVariableInstanceQuery().processInstanceId(processInstanceId).list();
		if(list != null) {
			logger.debug("======>所有流程历史变量：" + processInstanceId);
		}
		return list;
	}
	
	//历史流程实例
	@Override
	public List<HistoricProcessInstance> findHisProcessIntanceList(String processInstanceId){
		List<HistoricProcessInstance> list = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).list();
		if(list != null) {
			logger.debug("======>查询流程历史实例：" + processInstanceId);
		}
		return list;
	}
	
	@Override
	public void setTaskProcessVariable(String taskId,String variableName,String value) {
		taskService.setVariableLocal(taskId, variableName, value);
		
	}

	@Override
	public Task getTaskByExecutionId(String id) {
		Task task = taskService.createTaskQuery().executionId(id).singleResult();
		if(task != null){
			logger.debug("=====>根据流程ID查询任务信息：" + task.toString());
		}
		
		return task;
	}
	

	@Override
	public Group createNewGroup(String groupId){
		Group group = identityService.newGroup(groupId);
		logger.debug("=====>新增候选组：" + groupId);
		return group;
	}

	@Override
	public User createNewUser(String userId){
		User user = identityService.newUser(userId);
		logger.debug("=====>新增候选人：" + userId);
		return user;
	}
	
	@Override
	public List<User> getAllUser(){
		List<User> users = identityService.createUserQuery().list();
		logger.debug("=====>查询所有候选人：" );
		return users;
	}
	
	@Override
	public Group getGroup(String groupId){
		Group group = identityService.createGroupQuery().groupId(groupId).singleResult();
		logger.debug("=====>根据groupId查询候选组：" + groupId);
		return group;
	}
	
	@Override
	public void deleteMembership(String userId,String groupId){
		identityService.deleteMembership(userId, groupId);
		logger.debug("=====>删除候选组、候选人员关联：" + groupId);
	}
	
	@Override
	public void deleteGroup(String groupId){
		identityService.deleteGroup(groupId);
		logger.debug("=====>删除候选组：" + groupId);
	}
	
	@Override
	public List<Group> getAllGroup(){
		List<Group> groups = identityService.createGroupQuery().list();
		logger.debug("=====>删除候选组：");
		
		return groups;
	}
	
	@Override
	public void deleteUser(String userId){
		identityService.deleteUser(userId);
		logger.debug("=====>删除候选人员：" + userId);
	}

	@Override
	public User getUser(String userId) {
		User user = identityService.createUserQuery().userId(userId).singleResult();
		logger.debug("=====>查询候选人员：" + userId);
		return user;
	}
	@Override
	public List<Task> getCandidateGroupInTask(List<String> ids) {
	List<Task> tasks = taskService.createTaskQuery().taskCandidateGroupIn(ids).orderByTaskCreateTime().desc().list();
		
		logger.debug("--------------------我的分配任务或签收任务-----------");
		
		for(Task task : tasks){
			logger.debug("======>id:"+task.getId()+",");
			logger.debug("======>name:"+task.getName()+",");
			logger.debug("======>createTime:"+task.getCreateTime()+",");
			logger.debug("======>assignee:"+task.getAssignee());

		}	
		logger.debug("------------------------------------------");	
		return tasks;
	}

}
