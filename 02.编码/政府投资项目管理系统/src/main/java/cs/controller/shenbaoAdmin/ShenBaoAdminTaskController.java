package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import cs.common.ICurrentUser;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskHeadService;

@Controller
@RequestMapping(name="任务流程",path="shenbaoAdmin/task")
public class ShenBaoAdminTaskController {
	private String ctrlName = "shenbaoAdmin/task";
	
	@Autowired 
	TaskHeadService taskHeadService;
	@Autowired
	ICurrentUser currentUser;
	
	@RequestMapping(name = "获取当前用户所有的任务流程", path = "")
	public @ResponseBody PageModelDto<TaskHeadDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件(仅查询当前用户)
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("createdBy");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<TaskHeadDto> taskHeadDtos = taskHeadService.get(odataObj);
		return taskHeadDtos;
	}
				
	//begin#html
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
}
