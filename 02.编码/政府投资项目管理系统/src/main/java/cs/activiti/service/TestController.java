package cs.activiti.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 流程测试类
 * @author qinshangzhi
 *
 */
@Controller
public class TestController {
	
	@Autowired 
	protected ActivitiService activitiService;
	
	/**
	 * 启动流程
	 * @param processDefinitionKey 流程定义ID（如：projectDeclaration）
	 */
	@RequestMapping(value = "/process-instance/{processDefinitionKey}/start", method = RequestMethod.GET)
	@ResponseBody
	public void startProcess(@PathVariable("processDefinitionKey") String processDefinitionKey) {
		Map<String,Object> variables = new HashMap<String,Object>();
	    variables.put("nextAssignee", "qinshangzhi");
	    variables.put("roId", "00000000001");
		activitiService.startProcess(processDefinitionKey, variables);
	}
	
	/**
	 * 卸载已部署的流程
	 * @param deploymentId 流程部署ID
	 */
	@RequestMapping(value = "/process/undeployment/{deploymentId}", method = RequestMethod.GET)
	@ResponseBody
	public void undeploymentPocess(@PathVariable("deploymentId") String deploymentId) {
		activitiService.undeploymentById(deploymentId);
	}
	
	/**
	 * 签收、认领任务
	 * @param taskId    任务ID
	 * @param userId    用户ID
	 */
	@RequestMapping(value = "/task/{taskId}/userId/{userId}/claim", method = RequestMethod.GET)
	@ResponseBody
	public void taskClaim(@PathVariable("taskId") String taskId,@PathVariable("userId") String userId) {
		activitiService.claimTask(taskId, userId);
	}
	
	/**
	 * 完结、办理任务，并指定下个办理人
	 * @param taskId           任务ID
	 * @param nextAssigneeId   下个办理人ID
	 */
	@RequestMapping(value = "/task/{taskId}/userId/{nextAssigneeId}/complele", method = RequestMethod.GET)
	@ResponseBody
	public void taskComplete(@PathVariable("taskId") String taskId,@PathVariable("nextAssigneeId") String nextAssigneeId) {
		Map<String,Object> variables = new HashMap<String,Object>();
	    variables.put("nextAssignee", nextAssigneeId);
		activitiService.taskComplete(taskId, variables);
	}
	
	/**
	 * 完结、办理任务，不指定下个办理人
	 * @param taskId           任务ID
	 */
	@RequestMapping(value = "/task/{taskId}/complele", method = RequestMethod.GET)
	@ResponseBody
	public void taskComplete(@PathVariable("taskId") String taskId) {
		activitiService.taskComplete(taskId);
	}
	
	/**
	 * 查询当前用户代办任务
	 * @param userId  用户ID
	 */
	@RequestMapping(value = "/tasks/user/{userId}", method = RequestMethod.GET)
	@ResponseBody
	public void getPersonalTask(@PathVariable("userId") String userId) {
		activitiService.getPersonalTask(userId);
	}
	
	/**
	 * 查询指定人的所属任务
	 * @param userId
	 */
	@RequestMapping(value = "/tasks/assigneeUser/{userId}", method = RequestMethod.GET)
	@ResponseBody
	public List<Task> getAssigneeTask(@PathVariable("userId") String userId) {
		return activitiService.getAssigneeTask(userId);
	}
	
	/**
	 * 查询用户所属组的代办任务
	 * @param groupId
	 */
	@RequestMapping(value = "/tasks/group/{groupId}", method = RequestMethod.GET)
	@ResponseBody
	public void getGroupTask(@PathVariable("groupId") String groupId) {
		activitiService.getGroupTask(groupId);
	}
	
    /**
     * 指定任务的候选办理人
     * @param taskId    任务ID
     * @param userId    用户ID
     */
	@RequestMapping(value = "/task/{taskId}/candidateUsers/{userId}", method = RequestMethod.GET)
	@ResponseBody
	public void addCandidateUsers(@PathVariable("taskId") String taskId,@PathVariable("userId") String userId) {
		Collection<String> candidateUsers = new ArrayList<String>();
		candidateUsers.add(userId);
		activitiService.addCandidateUsers(taskId, candidateUsers);
	}
	
	/**
	 * 指定任务的候选办理组
	 * @param taskId    用户ID
	 * @param groupId   用户组ID
	 */
	@RequestMapping(value = "/task/{taskId}/candidateGroups/{groupId}", method = RequestMethod.GET)
	@ResponseBody
	public void addCandidateGroups(@PathVariable("taskId") String taskId,@PathVariable("groupId") String groupId) {
		Collection<String> candidateGroups = new ArrayList<String>();
		candidateGroups.add(groupId);
		activitiService.addCandidateGroups(taskId, candidateGroups);
	}
	
	/**
	 * 查询某个任务变量
	 * @param taskId        任务ID
	 * @param variableName  变量名
	 */
	@RequestMapping(value = "/task/{taskId}/taskVariable/{variableName}", method = RequestMethod.GET)
	@ResponseBody
	public void getTaskVariable(@PathVariable("taskId") String taskId,@PathVariable("variableName") String variableName) {
		activitiService.getTaskVariable(taskId, variableName);
	}
	
	/**
	 * 查询某个流程变量
	 * @param taskId        任务ID
	 * @param variableName  变量名
	 */
	@RequestMapping(value = "/task/{taskId}/processVariable/{variableName}", method = RequestMethod.GET)
	@ResponseBody
	public void getProcessVariable(@PathVariable("taskId") String taskId,@PathVariable("variableName") String variableName) {
		activitiService.getTaskProcessVariable(taskId, variableName);
	}
}
