package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

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
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskHeadService;

@Controller
@RequestMapping(name = "工作台管理", path = "management/task")
public class TaskController {
	private String ctrl = "management/task";
	@Autowired
	TaskHeadService taskHeadService;
	@Autowired
	ICurrentUser currentUser;

	@RequestMapping(name = "获取任务", path = "")
	public @ResponseBody PageModelDto<TaskHeadDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("nextUser");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.get(odataObj);
		return taskHeadDtos;
	}
	
	@RequestMapping(name = "个人已办", path = "complete")
	public @ResponseBody PageModelDto<TaskHeadDto> history(HttpServletRequest request) throws ParseException {
		//todo
		//从taskrecord 表里取数据
		return null;
	}
	
	@RequestMapping(name="处理",path="{taskId}",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody TaskRecordDto dto,@PathVariable String taskId){
		taskHeadService.handle(taskId, dto);
	}
	
	// begin#html
	@RequestMapping(name = "待办列表页", path = "html/todo", method = RequestMethod.GET)
	public String todo() {
		return ctrl + "/todo";
	}
	
	@RequestMapping(name = "已办列表页", path = "html/complete", method = RequestMethod.GET)
	public String complete() {
		return ctrl + "/complete";
	}
	
	@RequestMapping(name = "待办处理", path = "html/handle", method = RequestMethod.GET)
	public String handle() {
		return ctrl + "/handle";
	}

}
