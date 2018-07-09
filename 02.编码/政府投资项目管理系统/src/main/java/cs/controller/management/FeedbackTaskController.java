package cs.controller.management;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.sn.framework.common.StringUtil;

import cs.common.ICurrentUser;
import cs.domain.Attachment;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObjNew;
import cs.service.framework.UserService;
import cs.service.interfaces.ProcessService;
import cs.service.interfaces.ShenBaoInfoService;

@Controller
@RequestMapping(name = "后台管理--申报流程监控", path = "management/supervision/task")
public class FeedbackTaskController {
	@Autowired
	ProcessService processService;
	@Autowired
	TaskService taskService;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
    private ProcessEngine processEngine;
	@Autowired
    private UserService userService;
	@Autowired
    private ShenBaoInfoService shenBaoInfoService;
	
	private String ctrl = "management/supervision/task";

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
	
	@RequestMapping(name = "反馈详情界面", path = "html/handle_details_feedback", method = RequestMethod.GET)
	public String handleDetails() {
		return ctrl + "/handleDetails";
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
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void taskFeedback(@RequestBody Map<String,Object> data,HttpServletRequest request){
		processService.handleFeedback(data);
	}
	
	@RequestMapping(name = "上传申报附件", path = "subShenBaoAtts",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void subShenBaoAtts(@RequestBody Map<String,Object> data){
		processService.subShenBaoAtts(data);
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
	
	@SuppressWarnings("deprecation")
	@RequestMapping(name = "查询当前流程中反馈的所有记录", path = "getFeedbackComments", method = RequestMethod.GET)
	public @ResponseBody List<Object> getFeedbackComments(HttpServletRequest request) throws ParseException {
		Calendar calendar = Calendar.getInstance();
		String processInstanceId = request.getParameter("processInstanceId");
		List<Comment> comments = processEngine.getTaskService().getProcessInstanceComments(processInstanceId);
		List<Object> hisList = new ArrayList<>();
		
		for(Comment com : comments){
			HistoricTaskInstance task = processEngine.getHistoryService().createHistoricTaskInstanceQuery().taskId(com.getTaskId()).singleResult();
			Map<String, String> map = new HashMap<>();
			
			map.put("name", task.getName());
			
			map.put("endTime", com.getTime().toLocaleString());
			map.put("msg", com.getFullMessage());
			
			String userId2 = com.getUserId();
			if(StringUtil.isNotBlank(userId2)) {
				User user = userService.findById(userId2);
				
				map.put("id",user.getDisplayName());
			}else {
				map.put("id","");
			}

			calendar.set(com.getTime().getYear(),com.getTime().getMonth(),com.getTime().getDay(),com.getTime().getHours(),com.getTime().getMinutes(),com.getTime().getSeconds());
		    long millis = calendar.getTimeInMillis();
			map.put("itemOrder",String.valueOf(millis));
			hisList.add(map);
	  }
		
	  return hisList;
	}
	
	@RequestMapping(name = "获取当前申报记录信息", path = "getShenBaoAtts",method=RequestMethod.GET)
	public @ResponseBody ShenBaoInfoDto getShenBaoAtts(HttpServletRequest request) throws ParseException{
		String shenbaoInfoId = request.getParameter("shenbaoInfoId");
		
		ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoService.getShenBaoInfoDtoById(shenbaoInfoId);
		return shenBaoInfoDto;
		
	}
	
	@RequestMapping(name = "获取当前任务的所有附件", path = "getAllAtts",method=RequestMethod.GET)
	public @ResponseBody List<Attachment> getAllAtts(HttpServletRequest request){
		String shenBaoInfoId = request.getParameter("shenBaoInfoId");
		String taskId = request.getParameter("taskId");
		String taskKey = request.getParameter("taskKey");
		
		List<Attachment> list = new ArrayList<Attachment>();
		
		//获取当前任务的审批详情
		list = processService.getAllAtts(shenBaoInfoId,taskId,taskKey,list);
		
		return list;
		
	}
	
	@RequestMapping(name = "获取当前任务的所有审批记录", path = "getAllComments",method=RequestMethod.GET)
	public @ResponseBody List<Object> getAllComments(HttpServletRequest request){
		String shenBaoInfoId = request.getParameter("shenBaoInfoId");
		String taskId = request.getParameter("taskId");
		String taskKey = request.getParameter("taskKey");
		
		List<Object> list = new ArrayList<Object>();
		
		//获取当前任务的审批详情
		list = processService.getAllComments(shenBaoInfoId,taskId,taskKey,list);
		
		return list;
		
	}
	
}
