package cs.controller.framework;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.ICurrentUser;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObjNew;
import cs.service.interfaces.ProcessService;

@Controller
@RequestMapping(name = "后台管理--工作台管理", path = "framework/task")
public class FeedbackTaskController {
	@Autowired
	ProcessService processService;
	@Autowired
	TaskService taskService;
	@Autowired
	private ICurrentUser currentUser;
	
	private String ctrl = "framework/task";

	//@RequiresPermissions("framework/task#html/todo_feedback#get")
	@RequestMapping(name = "待办列表页", path = "html/todo_feedback", method = RequestMethod.GET)
	public String todo() {
		return ctrl + "/todo";
	}
	
	@RequestMapping(name = "已办列表页", path = "html/complete_feedback", method = RequestMethod.GET)
	public String complete() {
		return ctrl + "/complete";
	}
	
	@RequestMapping(name = "反馈填报界面", path = "html/handle_feedback", method = RequestMethod.GET)
	public String handle() {
		return ctrl + "/handle";
	}
	
	@RequestMapping(name = "获取反馈类个人待办数据", path = "todo_feedback", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getToDo_feedback(HttpServletRequest request) throws ParseException {
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getTodoTask_feedback(odataObj);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	
	@RequestMapping(name = "获取反馈类个人已办数据", path = "complete_feedback", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getComplete_feedback(HttpServletRequest request) throws ParseException {
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getComplete_feedback(odataObj);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	
	@RequestMapping(name = "反馈", path = "feedback",method=RequestMethod.POST)
	public @ResponseBody String taskFeedback(@RequestBody Map<String,Object> data,HttpServletRequest request){
		processService.handleFeedback(data);
		return "操作成功";
	}
	
	@RequestMapping(name = "获取当前任务key值", path = "getCurrentTaskKey",method=RequestMethod.GET)
	public @ResponseBody String getCurrentTaskKey(HttpServletRequest request){
		String processInstanceId = request.getParameter("processInstanceId");
		
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).taskCandidateUser(currentUser.getUserId()).active().list();
		List<Task> tasks2 = taskService.createTaskQuery().processInstanceId(processInstanceId).taskAssignee(currentUser.getUserId()).active().list();
		tasks.addAll(tasks2);
		
		String taskKey = tasks.get(0).getTaskDefinitionKey();
		
		return taskKey;
	}
	
}
