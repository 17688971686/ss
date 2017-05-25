package cs.controller.management;

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
import cs.model.DomainDto.ProjectInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectInfoService;

@Controller
@RequestMapping(name="项目管理",path="projectManagement")
public class ProjectManagementController {
	private String ctrlName = "management/monthReport/projectManagement";
	private static Logger logger = Logger.getLogger(ProjectManagementController.class.getName());
	
	@Autowired
	private ProjectInfoService projectInfoService;
	
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectInfoDto> projectInfoDtos = projectInfoService.get(odataObj);		
		return projectInfoDtos;
	}
	
	@RequestMapping(name = "删除项目信息", path = "",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			projectInfoService.deleteProjectInfos(ids);	
		}else{
			projectInfoService.deleteProjectInfo(id);	
		}		
		
	}
	
	@RequestMapping(name = "更新项目信息", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  update(@RequestBody ProjectInfoDto projectInfoDto){		
		projectInfoService.updateProjectInfo(projectInfoDto);		
	}
	
	@RequestMapping(name = "创建项目信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  create(@RequestBody ProjectInfoDto projectInfoDto){
		System.out.println("创建项目信息");
		projectInfoService.createProjectInfo(projectInfoDto);		
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
