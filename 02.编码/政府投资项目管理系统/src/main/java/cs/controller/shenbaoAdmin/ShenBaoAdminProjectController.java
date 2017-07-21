   package cs.controller.shenbaoAdmin;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.ICurrentUser;
import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;

@Controller
@RequestMapping(name="项目管理",path="shenbaoAdmin/project")
public class ShenBaoAdminProjectController {
	private String ctrlName = "shenbaoAdmin/project";
	
	@Autowired
	private ProjectService ProjectService;
	@Autowired
	ICurrentUser currentUser;
	
	@RequiresPermissions("shenbaoAdmin/project##get")
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);		
		return ProjectDtos;
	}
	
	@RequiresPermissions("shenbaoAdmin/project/#unitProject#get")
	@RequestMapping(name = "获取单位项目信息", path = "unitProject",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getUnitProject(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);	
		//设置过滤条件
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("unitName");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);		
		return ProjectDtos;
	}
	
	@RequiresPermissions("shenbaoAdmin/project/#unitProject#post")
	@RequestMapping(name = "创建项目信息", path = "unitProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createUnitProject(@RequestBody ProjectDto ProjectDto){		
		ProjectService.create(ProjectDto);		
	}
	
	@RequiresPermissions("shenbaoAdmin/project/#unitProject#put")
	@RequestMapping(name = "更新项目信息", path = "unitProject",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateUserProject(@RequestBody ProjectDto ProjectDto){
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
	
	@RequiresPermissions("shenbaoAdmin/project/#html/list#get")
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequiresPermissions("shenbaoAdmin/project/#html/edit#get")
	@RequestMapping(name = "编辑页", path = "html/edit")
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	@RequiresPermissions("shenbaoAdmin/project/#html/projectInfo#get")
	@RequestMapping(name = "项目详情页", path = "html/projectInfo")
	public String projectInfo() {
		return this.ctrlName + "/projectInfo";
	}
	
	
}
