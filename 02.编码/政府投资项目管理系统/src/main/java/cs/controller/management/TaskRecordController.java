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

import cs.common.CurrentUser;
import cs.common.ICurrentUser;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.IService;
import cs.service.interfaces.TaskRecordService;

@Controller
@RequestMapping(name = "任务流程", path = "management/taskRecord")
public class TaskRecordController {
	private String ctrl = "management/taskRecord";
	@Autowired
	IService<TaskRecordDto, TaskRecord, String> taskRecordService;
	@Autowired
	ICurrentUser currentUser;

	@RequestMapping(name = "获取任务流程", path = "")
	public @ResponseBody PageModelDto<TaskRecordDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("userName");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<TaskRecordDto> taskRecordDtos = taskRecordService.get(odataObj);
		return taskRecordDtos;
	}	
}
