package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;

@Controller
@RequestMapping(name="项目管理",path="shenbaoAdmin/project")
public class ShenBaoAdminProjectController {
	private String ctrlName = "shenbaoAdmin/project";
	private static Logger logger = Logger.getLogger(ShenBaoAdminProjectController.class.getName());
	
	@Autowired
	private ProjectService ProjectService;
	
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);		
		return ProjectDtos;
	}
	
	//@RequiresPermissions("shenbaoAdmin/project/unitProject##get")
	@RequestMapping(name = "获取单位项目信息", path = "unitProject",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getUnitProject(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.getUnitProject(odataObj);		
		return ProjectDtos;
	}
	
	//@RequiresPermissions("shenbaoAdmin/project/unitProject##post")
	@RequestMapping(name = "创建项目信息", path = "unitProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  createUnitProject(@RequestBody ProjectDto ProjectDto){		
		ProjectService.createUnitProject(ProjectDto);		
	}
	
	//@RequiresPermissions("shenbaoAdmin/project/unitProject##put")
	@RequestMapping(name = "更新项目信息", path = "unitProject",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateUserProject(@RequestBody ProjectDto ProjectDto){		
		ProjectService.updateUnitProject(ProjectDto);		
	}
	
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequestMapping(name = "编辑页", path = "html/edit")
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	
}
