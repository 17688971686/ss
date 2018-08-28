package cs.activiti.service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.activiti.engine.identity.Group;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.framework.RoleDto;
import cs.model.framework.UserDto;
import cs.service.framework.RoleService;

/**
 * 流程测试类
 * @author qinshangzhi
 *
 */
@Controller
public class TestController {
	
	@Autowired 
	protected ActivitiService activitiService;
	@Autowired
	private RoleService roleService;
	/**
	 * 启动流程
	 * @param processDefinitionKey 流程定义ID（如：projectDeclaration）
	 */
	@RequestMapping(value = "/process-instance/{processDefinitionKey}/{startUserId}/{nextUserid}/start", method = RequestMethod.GET)
	@ResponseBody
	public void startProcess(@PathVariable("processDefinitionKey") String processDefinitionKey,
							@PathVariable("startUserId") String startUserId,@PathVariable("nextUserid") String nextUserid) {
		Map<String,Object> variables = new HashMap<String,Object>();
	    
	    
	    activitiService.setStartProcessUserId(startUserId);
	    
	    variables.put("users", nextUserid);
	    
		activitiService.startProcess(processDefinitionKey, variables);
	}
	
	/**
	 * 初始化已有的角色和人员，添加进角色组
	 * @param str
	 * @param request
	 * @throws ParseException
	 */
	@RequestMapping(value = "/process-instance/{initGroup}/init", method = RequestMethod.GET)
	@ResponseBody
	public void initGroup(@PathVariable("initGroup") String str,HttpServletRequest request) throws ParseException {
		List<RoleDto> roleDtos=roleService.Get();
		for (RoleDto role : roleDtos) {
			//创建候选组
			Group group = activitiService.createNewGroup(role.getId());
			group.setName(role.getRoleName());
			 activitiService.createGroup(group);
			
			 for (UserDto userDto : role.getUserDtos()) {
				 activitiService.createUserGroupMembership(userDto.getId(), group.getId());
			}
			
		}
				
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
	@RequestMapping(value = "/task/{taskId}/userId/{userId}/isPass/{isPass}/complele", method = RequestMethod.GET)
	@ResponseBody
	public void taskComplete(@PathVariable("taskId") String taskId
			,@PathVariable("isPass") String isPass,@PathVariable("userId") String userId) {
		Map<String,Object> variables = new HashMap<String,Object>();
		List<String> userIds = new ArrayList<>();
		userIds.addAll(Arrays.asList(userId.split(",")));
		
		 variables.put("shenpi", 8);
		 variables.put("isPass", isPass);
		 variables.put("userIds", userIds);
	    variables.put("nextUsers", userId);
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
