package cs.controller.management;

import java.text.ParseException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import cs.common.ICurrentUser;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;
import cs.service.interfaces.TaskHeadService;

@Controller
@RequestMapping(name = "后台管理--工作台管理", path = "management/task")
public class TaskController {
	private String ctrl = "management/task";
	@Autowired
	TaskHeadService taskHeadService;
	@Autowired
	UserService userService;
	@Autowired
	ICurrentUser currentUser;

	//@RequiresPermissions("management/task##get")
	@RequestMapping(name = "获取所有任务", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<TaskHeadDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);	
//		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.get(odataObj);
		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.getTask_yearPlan(odataObj);
		
		//关于流程记录根据创建用户id查找到名称用于显示
		List<TaskHeadDto> taskHeadDtols = taskHeadDtos.getValue();
		if(taskHeadDtols !=null && taskHeadDtols.size()>0){
			taskHeadDtols.forEach(x->{
				if(x.getTaskRecordDtos() !=null && x.getTaskRecordDtos().size()>0){
					x.getTaskRecordDtos().forEach(y->{
						User user = userService.findById(y.getCreatedBy());
						if(user !=null){
							y.setCreatedBy(user.getLoginName());
						}
					});
				}
			});
			taskHeadDtos.setValue(taskHeadDtols);
		}
		return taskHeadDtos;
	}
	
	//@RequiresPermissions("management/task#audit#get")
	@RequestMapping(name = "获取审批类个人待办数据", path = "audit", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<TaskHeadDto> getToDo_Audit(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);	
		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.getTask_audit(odataObj);
		//关于流程记录根据创建用户id查找到名称用于显示
		List<TaskHeadDto> taskHeadDtols = taskHeadDtos.getValue();
		if(taskHeadDtols !=null && taskHeadDtols.size()>0){
			taskHeadDtols.forEach(x->{
				if(x.getTaskRecordDtos() !=null && x.getTaskRecordDtos().size()>0){
					x.getTaskRecordDtos().forEach(y->{
						User user = userService.findById(y.getCreatedBy());
						if(user !=null){
							y.setCreatedBy(user.getLoginName());
						}
					});
				}
			});
			taskHeadDtos.setValue(taskHeadDtols);
		}
		return taskHeadDtos;
	}
		
		
		
		/****下面为计划类操作****/
		//@RequiresPermissions("management/task#plan#get")
		@RequestMapping(name = "获取计划类个人待办数据", path = "plan", method = RequestMethod.GET)
		public @ResponseBody PageModelDto<TaskHeadDto> getToDo_Plan(HttpServletRequest request) throws ParseException {
			ODataObj odataObj = new ODataObj(request);	
			PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.getToDo_Plan(odataObj);
			//关于流程记录根据创建用户id查找到名称用于显示
			List<TaskHeadDto> taskHeadDtols = taskHeadDtos.getValue();
			if(taskHeadDtols !=null && taskHeadDtols.size()>0){
				taskHeadDtols.forEach(x->{
					if(x.getTaskRecordDtos() !=null && x.getTaskRecordDtos().size()>0){
						x.getTaskRecordDtos().forEach(y->{
							User user = userService.findById(y.getCreatedBy());
							if(user !=null){
								y.setCreatedBy(user.getLoginName());
							}
						});
					}
				});
				taskHeadDtos.setValue(taskHeadDtols);
			}
			return taskHeadDtos;
		}
	
	@RequiresPermissions("management/task#complete#get")
	@RequestMapping(name = "个人已办", path = "complete",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<TaskHeadDto> history(HttpServletRequest request) throws ParseException {
		//todo
		//从taskrecord 表里取数据
		return null;
	}
	
	@RequiresPermissions("management/task#taskId#put")
	@RequestMapping(name="处理任务",path="{taskId}",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody TaskRecordDto dto,@PathVariable String taskId){
		taskHeadService.handle(taskId, dto);
	}
/****************申报阶段：下一年度计划******************/		
	// begin#html
	@RequiresPermissions("management/task#html/todo#get")
	@RequestMapping(name = "待办列表页--下一年度计划", path = "html/todo", method = RequestMethod.GET)
	public String todo() {
		return ctrl + "/yearPlan/todo";
	}
	
	@RequiresPermissions("management/task#html/complete#get")
	@RequestMapping(name = "已办列表页--下一年度计划", path = "html/complete", method = RequestMethod.GET)
	public String complete() {
		return ctrl + "/yearPlan/complete";
	}
	
	@RequiresPermissions("management/task#html/handle#get")
	@RequestMapping(name = "待办处理页面--下一年度计划", path = "html/handle", method = RequestMethod.GET)
	public String handle() {
		return ctrl + "/yearPlan/handle";
	}
/****************申报阶段：审批类******************/
	@RequiresPermissions("management/task#html/todo_audit#get")
	@RequestMapping(name = "待办列表页--审批类", path = "html/todo_audit", method = RequestMethod.GET)
	public String todo_audit() {
		return ctrl + "/audit/todo";
	}
	
	@RequiresPermissions("management/task#html/todo_audit#get")
	@RequestMapping(name = "待办处理页--审批类", path = "html/handle_audit", method = RequestMethod.GET)
	public String handle_audit() {
		return ctrl + "/audit/handle_audit";
	}
	
	@RequiresPermissions("management/task#html/complete_shenPi#get")
	@RequestMapping(name = "已办列表页--审批类", path = "html/complete_shenPi", method = RequestMethod.GET)
	public String complete_shenPi() {
		return ctrl + "/audit/complete_shenPi";
	}
	
	@RequiresPermissions("management/task#html/shenPiDetails#get")
	@RequestMapping(name = "已办流程--审批类展示信息", path = "html/shenPiDetails", method = RequestMethod.GET)
	public String shenPiDetails() {
		return ctrl + "/audit/shenPiDetails";
	}
	
/****************申报阶段：计划类******************/
	@RequiresPermissions("management/task#html/todo_plan#get")
	@RequestMapping(name = "待办列表页--计划类", path = "html/todo_plan", method = RequestMethod.GET)
	public String todo_plan() {
		return ctrl + "/plan/todo";
	}
	
	@RequiresPermissions("management/task#html/handle_plan#get")
	@RequestMapping(name = "待办处理页--计划类", path = "html/handle_plan", method = RequestMethod.GET)
	public String handle_plan() {
		return ctrl + "/plan/handle_plan";
	}
	
	@RequiresPermissions("management/task#html/complete_plan#get")
	@RequestMapping(name = "已办列表页--计划类", path = "html/complete_plan", method = RequestMethod.GET)
	public String complete_plan() {
		return ctrl + "/plan/complete_plan";
	}
	
	@RequiresPermissions("management/task#html/planDetails#get")
	@RequestMapping(name = "已办列表页--计划类展示信息", path = "html/planDetails", method = RequestMethod.GET)
	public String planDetails() {
		return ctrl + "/plan/planDetails";
	}	
}
