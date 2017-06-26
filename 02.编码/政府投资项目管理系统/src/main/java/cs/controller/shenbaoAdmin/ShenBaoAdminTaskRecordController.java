package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.ICurrentUser;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskRecordService;

@Controller
@RequestMapping(name="任务流程",path="shenbaoAdmin/taskRecord")
public class ShenBaoAdminTaskRecordController {
	private String ctrlName = "shenbaoAdmin/taskRecord";
	
	@Autowired TaskRecordService taskRecordService;
	@Autowired
	ICurrentUser currentUser;
	
	@RequestMapping(name = "获取任务流程", path = "")
	public @ResponseBody PageModelDto<TaskRecordDto> getToDo(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);		
		PageModelDto<TaskRecordDto> taskRecordDtos = taskRecordService.get(odataObj);
		return taskRecordDtos;
	}
			
	//begin#html
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
}
