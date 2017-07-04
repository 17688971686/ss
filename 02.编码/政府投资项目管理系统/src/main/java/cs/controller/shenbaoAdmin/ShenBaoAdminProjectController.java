package cs.controller.shenbaoAdmin;

import java.text.ParseException;
import java.util.ArrayList;
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
		//设置过滤条件
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("unitName");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		odataObj.getFilter().add(filterItem);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);		
		return ProjectDtos;
	}
	
	//@RequiresPermissions("shenbaoAdmin/project/unitProject##post")
	@RequestMapping(name = "创建项目信息", path = "unitProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createUnitProject(@RequestBody ProjectDto ProjectDto){		
		ProjectService.create(ProjectDto);		
	}
	
	//@RequiresPermissions("shenbaoAdmin/project/unitProject##put")
	@RequestMapping(name = "更新项目信息", path = "unitProject",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateUserProject(@RequestBody ProjectDto ProjectDto){
		Project entity = ProjectService.findById(ProjectDto.getId());
		ODataObj odataObj = new ODataObj();	
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();		
		if(entity.getProjectStage().equals(ProjectDto.getProjectStage())){//项目阶段相同，number不变，状态不变
			ProjectService.update(ProjectDto,ProjectDto.getId());
		}else{//项目阶段发生变化
			//根据number查询
			filterItem.setField("projectNumber");
			filterItem.setOperator("eq");
			filterItem.setValue(ProjectDto.getProjectNumber());
			odataObj.getFilter().add(filterItem);
			PageModelDto<ProjectDto> ProjectDtosForNumber = ProjectService.get(odataObj);
			List list = new ArrayList<>();
			Map map = new HashMap<String,String>();
			ProjectDtosForNumber.getValue().forEach(x->{
				map.put(x.getId(), x.getProjectStage());
				list.add(x.getProjectStage());
			});
			int index = list.indexOf(ProjectDto.getProjectStage());
			if(index == -1){//项目阶段为新增
//				ProjectDto.setProjectStage(entity.getProjectStage());
				ProjectDto.setIsLatestVersion(false);//更新本条数据数据版本状态为false
				ProjectService.update(ProjectDto, ProjectDto.getId());//todo  每次更新，页面修改的数据也会被更新，原始数据无法保留
				ProjectDto.setIsLatestVersion(true);
				ProjectService.create(ProjectDto);//stage不存在，创建新的一条数据，stage改变，number不变，状态为1
				
			}else{//项目阶段为以前有的
				   Iterator<Map.Entry<String, String>> it = map.entrySet().iterator();
				            while (it.hasNext()) {
				                Map.Entry<String, String> entry = it.next();
				                if( ProjectDto.getProjectStage().equals(entry.getValue())){			                	
				                	ProjectService.update(ProjectDto,entry.getKey());
				                }/*else{				                	
				                	ProjectService.create(ProjectDto);
				                }*/
				                 
				           }
			}
		}
	}
	
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequestMapping(name = "编辑页", path = "html/edit")
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	@RequestMapping(name = "项目详情页", path = "html/projectInfo")
	public String projectInfo() {
		return this.ctrlName + "/projectInfo";
	}
	
	
}
