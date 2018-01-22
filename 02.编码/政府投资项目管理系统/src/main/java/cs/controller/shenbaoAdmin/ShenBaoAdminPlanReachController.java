 package cs.controller.shenbaoAdmin;

import java.text.ParseException;
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
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="申报端--计划下达",path="shenbaoAdmin/planReach")
public class ShenBaoAdminPlanReachController {
	private String ctrlName = "shenbaoAdmin/planReach";
	
	@Autowired
	private ProjectService projectService;
	@Autowired
	private ShenBaoInfoService shenbaoInfoService;
	@Autowired
	ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@RequiresPermissions("shenbaoAdmin/planReach#notInclud#get")
	@RequestMapping(name = "获取未纳入年度计划的项目", path = "notInclud",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getNotInclud(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件--查询登陆用户单位的项目信息
		UserUnitInfo unit= userUnitInfoService.getByUserName(currentUser.getUserId());
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("unitName");
		filterItem.setOperator("eq");
		filterItem.setValue(unit.getId());
		odataObj.getFilter().add(filterItem);
		
		PageModelDto<ProjectDto> ProjectDtos = projectService.get(odataObj);
		return ProjectDtos;
	}
	
	@RequiresPermissions("shenbaoAdmin/planReach#hasInclud#get")
	@RequestMapping(name = "获取已纳入年度计划的项目", path = "hasInclud",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getHasInclud(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件--查询登陆用户单位的项目信息
		UserUnitInfo unit= userUnitInfoService.getByUserName(currentUser.getUserId());
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("unitName");
		filterItem.setOperator("eq");
		filterItem.setValue(unit.getId());
		odataObj.getFilter().add(filterItem);
		
		PageModelDto<ShenBaoInfoDto> shenbaoInfoDtos = shenbaoInfoService.get(odataObj);
		return shenbaoInfoDtos;
	}
	
	@SuppressWarnings("rawtypes")
	@RequiresPermissions("shenbaoAdmin/planReach#comfirmPlanReach#post")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(name = "确定计划下达申请资金", path = "comfirmPlanReach",method=RequestMethod.POST)
	public void comfirmPlanReach(@RequestBody Map map){
		shenbaoInfoService.comfirmPlanReach(map);
	}
	
	@RequiresPermissions("shenbaoAdmin/planReach#html/list#get")
	@RequestMapping(name = "列表页", path = "html/list",method=RequestMethod.GET)
	public String list() {
		return this.ctrlName + "/list";
	}
}
