package cs.controller.management;

import java.text.ParseException;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import cs.common.ICurrentUser;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.IService;

@Controller
@RequestMapping(name = "后台管理--任务流程", path = "management/taskRecord")
public class TaskRecordController {
	private String ctrl = "management/taskRecord";
	@Autowired
	IService<TaskRecordDto, TaskRecord, String> taskRecordService;
	@Autowired
	ICurrentUser currentUser;

	@RequiresPermissions("management/taskRecord##get")
	@RequestMapping(name = "获取任务流程", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<TaskRecordDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("createdBy");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<TaskRecordDto> taskRecordDtos = taskRecordService.get(odataObj);
		return taskRecordDtos;
	}	
}
