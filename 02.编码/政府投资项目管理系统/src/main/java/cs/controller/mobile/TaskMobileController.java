package cs.controller.mobile;

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
/**
 * @author Administrator
 * @Description APP任务流转信息管理控制层
 */
@Controller
@RequestMapping(name = "手机端--流转信息", path = "mobile/management/task")
public class TaskMobileController {
	@Autowired
	TaskHeadService taskHeadService;
	@Autowired
	UserService userService;
	@Autowired
	ICurrentUser currentUser;

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
	
	
	
}
