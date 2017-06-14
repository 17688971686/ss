package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskHeadService;

@Controller
@RequestMapping(name="工作台管理",path="management/task")
public class TaskController {
	private String ctrl ="management/task";
	@Autowired
	TaskHeadService taskHeadService;
	
	@RequestMapping(name="获取任务",path="")
	public @ResponseBody PageModelDto<TaskHeadDto> getToDo(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<TaskHeadDto>  taskHeadDtos= taskHeadService.get(odataObj);		
		return taskHeadDtos;
	}
}
