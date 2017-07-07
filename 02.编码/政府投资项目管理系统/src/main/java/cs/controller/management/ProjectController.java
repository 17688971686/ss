package cs.controller.management;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;

@Controller
@RequestMapping(name="项目管理",path="management/project")
public class ProjectController {
	private String ctrlName = "management/project";
	
	@Autowired
	private ProjectService ProjectService;
	
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);
		return ProjectDtos;
	}
	
	@RequestMapping(name = "删除项目信息", path = "",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			ProjectService.deletes(ids);	
		}else{
			ProjectService.delete(id);	
		}		
		
	}
	
	@RequestMapping(name = "更新项目信息", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  update(@RequestBody ProjectDto ProjectDto){		
		Project entity = ProjectService.findById(ProjectDto.getId());	
		if(entity.getProjectStage().equals(ProjectDto.getProjectStage())){//项目阶段没有发生变化
			ProjectService.update(ProjectDto,ProjectDto.getId());
		}else{//项目阶段发生变化
			//根据number查询
			List<ProjectDto> ProjectDtosForNumber = ProjectService.getProjectByNumber(ProjectDto.getProjectNumber());			
			Map<String,ProjectDto> map = new HashMap<String,ProjectDto>();
			ProjectDtosForNumber.stream().forEach(x->{
				map.put(x.getProjectStage(),x);				
			});
			//遍历map
			Boolean hasProject = false;
			Iterator<Map.Entry<String, ProjectDto>> it = map.entrySet().iterator();
			while(it.hasNext()){
				Map.Entry<String, ProjectDto> entry = it.next();  
	            if(ProjectDto.getProjectStage().equals(entry.getKey())){//如果之前就存在更改后的阶段
	            	hasProject = true;
	            	ProjectDto.setIsLatestVersion(entry.getValue().getIsLatestVersion());
	            	ProjectDto.setIsMonthReport(entry.getValue().getIsMonthReport());
	            	ProjectService.update(ProjectDto, entry.getValue().getId());//更新之前的数据
	            }
			}
			//如果之前不存在更改后的阶段
			if(!hasProject){
				//默认新增的项目为不填写月报
				ProjectDto.setIsMonthReport(false);
				ProjectService.create(ProjectDto);//创建一条新数据
            	ProjectService.updateVersion(ProjectDto.getId(), false);//更新本条数据的版本            	
			}
		}		
	}
	
	@RequestMapping(name = "更新项目是否填报状态", path = "isMonthReport",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateByIsMonthReport(@RequestBody ProjectDto ProjectDto){		
		ProjectService.updateProjectByIsMonthReport(ProjectDto);	
	}
	
	@RequestMapping(name = "创建项目信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  create(@RequestBody ProjectDto ProjectDto){		
		ProjectService.create(ProjectDto);		
	}
	
	//begin#html
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequestMapping(name = "编辑页", path = "html/edit")
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	@RequestMapping(name = "详情页", path = "html/details")
	public String details() {
		return this.ctrlName + "/details";
	}
	
}
