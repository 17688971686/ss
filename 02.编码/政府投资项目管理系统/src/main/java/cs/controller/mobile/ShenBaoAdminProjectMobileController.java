 package cs.controller.mobile;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
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
import cs.domain.Project;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="手机端--项目管理",path="mobile/shenbaoAdmin/project")
public class ShenBaoAdminProjectMobileController {
	private static Logger logger = Logger.getLogger(ShenBaoAdminProjectMobileController.class);
	private String ctrlName = "shenbaoAdmin/project";
	@Autowired
	private ProjectService ProjectService;
	@Autowired
	ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);
		return ProjectDtos;
	}
	
	
	@RequestMapping(name = "获取单位项目信息(包含所有已纳入项目库的项目)", path = "unitProject",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getUnitProject(HttpServletRequest request) throws ParseException {
		String userId = request.getParameter("userId");
		//根据登陆名查找到单位信息
		UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(userId);
		ODataObj odataObj = new ODataObj(request);
		//初始化设置过滤条件
		Boolean isFilters = false;//是否有额外的筛选条件
		Boolean hasUnitFilter = false;//是否有单位过滤
		Boolean isUnitFilter = false;//筛选条件是否包含有本单位
		if(odataObj.getFilter().size()>1){//默认的筛选条件为查询最新版本，如果有额外的条件
			isFilters = true;
			//判断筛选条件中是否包含单位筛选，且筛选单位为本单位
			for(int i=0;i<odataObj.getFilter().size();i++){
				if(odataObj.getFilter().get(i).getField().equals("unitName")){//如果过滤条件中有单位过滤
					hasUnitFilter = true;
					if(odataObj.getFilter().get(i).getValue().equals(userUnitInfo.getId())){//如果查询的是本单位的话
						isUnitFilter =true;
						break;
					}
				}
			}
		}
		if(!isFilters || !hasUnitFilter){//如果没有额外的筛选或者没有单位筛选条件，即为初始化条件：查询查询本单位未纳入项目库的项目
			ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
			filterItem.setField("unitName");
			filterItem.setOperator("eq");
			filterItem.setValue(userUnitInfo.getId());
			odataObj.getFilter().add(filterItem);
		}
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.getUnitAndAll(odataObj,isFilters,hasUnitFilter,isUnitFilter);
		return ProjectDtos;
	}
	
	
	
}
