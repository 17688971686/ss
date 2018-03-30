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
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="申报端--项目管理",path="shenbaoAdmin/project")
public class ShenBaoAdminProjectController {
	private String ctrlName = "shenbaoAdmin/project";
	
	@Autowired
	private ProjectService ProjectService;
	@Autowired
	ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@RequiresPermissions("shenbaoAdmin/project##get")
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);
		return ProjectDtos;
	}
	
	@RequiresPermissions("shenbaoAdmin/project#unitProject#get")
	@RequestMapping(name = "获取单位项目信息(包含所有已纳入项目库的项目)", path = "unitProject",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getUnitProject(HttpServletRequest request) throws ParseException {
		//根据登陆名查找到单位信息
		UserUnitInfoDto userUnitInfoDto1 = null;
		List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
		for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
			if(!userUnitInfoDto.getUserDtos().isEmpty()){
				for (UserDto user : userUnitInfoDto.getUserDtos()) {
					if(user.getId().equals(currentUser.getUserId())){
						userUnitInfoDto1 =userUnitInfoDto;
					}
				} 
			}
			
				
		}
//		UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
		ODataObj odataObj = new ODataObj(request);
		//初始化设置过滤条件
		Boolean isFilters = false;//是否有额外的筛选条件
		Boolean hasUnitFilter = false;//是否有单位过滤
		Boolean isUnitFilter = false;//筛选条件是否包含有本单位
		if(odataObj.getFilter().size()>1){//默认的筛选条件为查询最新版本，如果有额外的条件
			isFilters = true;
			//判断筛选条件中是否包含单位筛选，且筛选单位为本单位
			for(int i=0;i<odataObj.getFilter().size();i++){
				if(odataObj.getFilter().get(i).getField().equals("unitName")){//如果过滤条件中有项目所属单位过滤
					hasUnitFilter = true;
					if(userUnitInfoDto1 != null){
						if(odataObj.getFilter().get(i).getValue().equals(userUnitInfoDto1.getId())){//如果查询的是本单位的话
							isUnitFilter =true;
							break;
						}
					}
					
				}
			}
		}
		if(!isFilters || !hasUnitFilter){//如果没有额外的筛选或者没有单位筛选条件，即为初始化条件：查询查询本单位未纳入项目库的项目
			ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
			filterItem.setField("unitName");
			filterItem.setOperator("eq");
			filterItem.setValue(userUnitInfoDto1.getId());
			odataObj.getFilter().add(filterItem);
		}
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.getUnitAndAll(odataObj,isFilters,hasUnitFilter,isUnitFilter);
		return ProjectDtos;
	}
	
	@RequiresPermissions("shenbaoAdmin/project#unitProject#post")
	@RequestMapping(name = "创建单位项目信息", path = "unitProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createUnitProject(@RequestBody ProjectDto ProjectDto){		
		ProjectService.create(ProjectDto);		
	}
	
	@RequiresPermissions("shenbaoAdmin/project#updateUnitProject#post")
	@RequestMapping(name = "更新单位项目信息", path = "updateUnitProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateUnitProject(@RequestBody ProjectDto ProjectDto){
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
	
	@RequiresPermissions("shenbaoAdmin/project#unitProject#delete")
	@RequestMapping(name = "删除单位项目信息", path = "unitProject",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void deleteUnitProject(@RequestBody String id){
		String[] ids = id.split(",");
		if(ids.length>1){
			for(String idstr:ids){
				ProjectService.delete(idstr);	
			}
		}else{
			ProjectService.delete(id);
		}
	}
	
	@RequiresPermissions("shenbaoAdmin/project#html/list#get")
	@RequestMapping(name = "列表页", path = "html/list",method=RequestMethod.GET)
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequiresPermissions("shenbaoAdmin/project#html/edit#get")
	@RequestMapping(name = "编辑页", path = "html/edit",method=RequestMethod.GET)
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	@RequiresPermissions("shenbaoAdmin/project#html/projectInfo#get")
	@RequestMapping(name = "详情页", path = "html/projectInfo",method=RequestMethod.GET)
	public String projectInfo() {
		return this.ctrlName + "/projectInfo";
	}
	
	
}
