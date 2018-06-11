package cs.controller.management;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.activiti.engine.history.HistoricActivityInstance;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.framework.UserService;
import cs.service.interfaces.ProcessService;
import cs.service.interfaces.TaskHeadService;

@Controller
@RequestMapping(name = "后台管理--工作台管理", path = "management/task")
public class TaskController {
	private String ctrl = "management/task";
	@Autowired
	TaskHeadService taskHeadService;
	@Autowired
	ProcessService processService;
	@Autowired
	UserService userService;
	@Autowired
	ICurrentUser currentUser;

	//@RequiresPermissions("management/task##get")
	@RequestMapping(name = "获取任务信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.get(odataObj);
		
		return shenBaoInfoDtos;
	}
	
	//@RequiresPermissions("management/task#audit#get")
	@RequestMapping(name = "获取审批类个人待办数据", path = "audit", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getToDo_Audit(HttpServletRequest request,@RequestParam(required = false) String leixin) throws ParseException {
		String str = "audit";
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getTask_user(odataObj,str,leixin);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	//@RequiresPermissions("management/task#audit#get")
		@RequestMapping(name = "获取年度计划类个人待办数据", path = "yearPlan", method = RequestMethod.GET)
		public @ResponseBody PageModelDto<ShenBaoInfoDto> getToDo_yearPlan(HttpServletRequest request) throws ParseException {
			String str = "yearPlan";
			ODataObjNew odataObj = new ODataObjNew(request);	
			PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getTask_user(odataObj,str);
			//关于流程记录根据创建用户id查找到名称用于显示
			return shenBaoInfoDtos;
		}
	@RequestMapping(name = "获取计划类个人待办数据", path = "plan", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getToDo_Plan(HttpServletRequest request,@RequestParam(required = false) String leixin) throws ParseException {
		String str = "plan";
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getTask_user(odataObj,str,leixin);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	@RequestMapping(name = "获取所有个人待办数据", path = "all", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getToDo_all(HttpServletRequest request) throws ParseException {
		String str = "all";
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getTask_user(odataObj,str);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	
	//@RequiresPermissions("management/task#audit#get")
	@RequestMapping(name = "获取审批类个人已办数据", path = "complete", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getAudit_complete(HttpServletRequest request) throws ParseException {
		String str = "audit";
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getAudit_complete(odataObj,str);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	
	//@RequiresPermissions("management/task#audit#get")
	@RequestMapping(name = "获取计划类个人已办数据", path = "completePlan", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getAudit_completePlan(HttpServletRequest request) throws ParseException {
		String str = "plan";
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getAudit_complete(odataObj,str);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
		
	//@RequiresPermissions("management/task#audit#get")
	@RequestMapping(name = "获取下一年度计划类个人已办数据", path = "completeYearPlan", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getAudit_completeYearPlan(HttpServletRequest request) throws ParseException {
		String str = "yearPlan";
		ODataObjNew odataObj = new ODataObjNew(request);	
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = processService.getAudit_complete(odataObj,str);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	
	//@RequiresPermissions("management/task#audit#get")
	@RequestMapping(name = "获取未进行的活动", path = "unfinished/{processId}", method = RequestMethod.GET)
	public @ResponseBody List<HistoricActivityInstance> getUnfinished(@PathVariable String processId) throws ParseException {
		List<HistoricActivityInstance> shenBaoInfoDtos = processService.getUnfinished(processId);
		//关于流程记录根据创建用户id查找到名称用于显示
		return shenBaoInfoDtos;
	}
	
	
	@RequestMapping(name = "处理任务--审批类", path = "process",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  taskComplete(@RequestBody Map data,HttpServletRequest request) throws ParseException{
		processService.taskComplete(data);
	}

	@RequestMapping(name = "处理任务--计划类", path = "process_plan",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  taskComplete_plan(@RequestBody Map data,HttpServletRequest request) throws ParseException{
		processService.taskComplete_plan(data);
	}
	
	@RequestMapping(name = "处理年度计划", path = "yearPaln",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  yearPlanComplete(@RequestBody Map data,HttpServletRequest request) throws ParseException{
		processService.yearPlanComplete(data);
	}
	
	@RequestMapping(name = "历史信息", path = "his/{id}",method=RequestMethod.GET)
	public @ResponseBody List<Object>  getHistoryInfo(@PathVariable String id) throws ParseException{
		return processService.getHistoryInfo(id);
	}
	
	@RequestMapping(name = "检查登录人员能否办理审批", path = "isAssignee/{processId}",method=RequestMethod.GET)
	public @ResponseBody Response  getAssigneeByUserId(@PathVariable String processId) throws ParseException{
		return processService.getAssigneeByUserId(processId);
	}
	
	@RequestMapping(name = "检查登录人员能否办理计划", path = "isAssignee_plan/{processId}",method=RequestMethod.GET)
	public @ResponseBody Response  getAssigneeByUserId_plan(@PathVariable String processId) throws ParseException{
		return processService.getAssigneeByUserId_plan(processId);
	}
	
	@RequestMapping(name = "评论", path = "pinglun",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  taskPinglun(@RequestBody Map data,HttpServletRequest request) throws ParseException{
		processService.taskPinglun(data);
	}
//	//@RequiresPermissions("management/task#plan#get")
//	@RequestMapping(name = "获取计划类个人待办数据", path = "plan", method = RequestMethod.GET)
//	public @ResponseBody PageModelDto<TaskHeadDto> getToDo_Plan(HttpServletRequest request) throws ParseException {
//		ODataObj odataObj = new ODataObj(request);	
//		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.getToDo_Plan(odataObj);
//		//关于流程记录根据创建用户id查找到名称用于显示
//		List<TaskHeadDto> taskHeadDtols = taskHeadDtos.getValue();
//		if(taskHeadDtols !=null && taskHeadDtols.size()>0){
//			taskHeadDtols.forEach(x->{
//				if(x.getTaskRecordDtos() !=null && x.getTaskRecordDtos().size()>0){
//					x.getTaskRecordDtos().forEach(y->{
//						User user = userService.findById(y.getThisUser());
//						if(user !=null){
//							String name = user.getDisplayName()!=null&&!user.getDisplayName().equals("")?user.getDisplayName():user.getLoginName();
//							y.setThisUser(name);
//						}
//					});
//				}
//			});
//			taskHeadDtos.setValue(taskHeadDtols);
//		}
//		return taskHeadDtos;
//	}
	
//	@RequiresPermissions("management/task#taskId#post")
//	@RequestMapping(name="处理任务",path="{taskId}",method=RequestMethod.POST)
//	@ResponseStatus(value = HttpStatus.CREATED)
//	public void put(@RequestBody TaskRecordDto dto,@PathVariable String taskId){
//		taskHeadService.handle(taskId, dto);
//	}
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
	
	@RequiresPermissions("management/task#html/todo_audit_other#get")
	@RequestMapping(name = "科室列表页--审批类", path = "html/todo_audit_other", method = RequestMethod.GET)
	public String todo_audit_other() {
		return ctrl + "/audit/todo_audit_other";
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
	
	@RequiresPermissions("management/task#html/todo_plan_other#get")
	@RequestMapping(name = "科室列表页--计划类", path = "html/todo_plan_other", method = RequestMethod.GET)
	public String todo_plan_other() {
		return ctrl + "/plan/todo_plan_other";
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
