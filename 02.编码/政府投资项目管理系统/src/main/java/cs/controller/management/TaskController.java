package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.CurrentUser;
import cs.common.ICurrentUser;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
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
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("userName");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.get(odataObj);
		return taskHeadDtos;
	}

	// begin#html
	@RequestMapping(name = "代办列表页", path = "html/todo", method = RequestMethod.GET)
	public String todo() {
		return ctrl + "/todo";
	}
	@RequestMapping(name = "代办处理", path = "html/handle", method = RequestMethod.GET)
	public String handle() {
		return ctrl + "/handle";
	}
}
