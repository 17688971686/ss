 package cs.controller.shenbaoAdmin;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

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
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApplicationService;
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
	@Autowired
	private PlanReachApplicationService planReachApplicationService;
	
	//获取本单位计划下达申请列表数据
	//@RequiresPermissions("shenbaoAdmin/planReach##get")
	@RequestMapping(name = "获取计划下达申请信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PlanReachApplicationDto> get(HttpServletRequest request) throws ParseException {
		//根据登陆名查找到单位信息addShenBaoInfo
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
		ODataObj odataObj = new ODataObj(request);
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("applicationUnit");
		filterItem.setOperator("eq");
		filterItem.setValue(userUnitInfoDto1.getId());
		odataObj.getFilter().add(filterItem);
		PageModelDto<PlanReachApplicationDto> planReachApplications = planReachApplicationService.get(odataObj);
		return planReachApplications;
	}
	
	//@RequiresPermissions("shenbaoAdmin/planReach##post")
	@RequestMapping(name = "创建计划下达申请信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void create(@RequestBody PlanReachApplicationDto dto) throws ParseException {
		planReachApplicationService.create(dto);
	}
	
	//@RequiresPermissions("shenbaoAdmin/planReach#updatePlanReach#post")
	@RequestMapping(name = "更新计划下达申请信息", path = "updatePlanReach",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody PlanReachApplicationDto dto) throws ParseException {
		planReachApplicationService.update(dto,dto.getId());
	}
	
	//@RequiresPermissions("shenbaoAdmin/planReach#deletePlanReach#post")
	@RequestMapping(name = "删除计划下达申请信息", path = "deletePlanReach",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) throws ParseException {
		String[] ids = id.split(",");
		if(ids.length>1){
			for(String idstr:ids){
				planReachApplicationService.delete(idstr);	
			}
		}else{
			planReachApplicationService.delete(id);
		}
	}
	
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
		shenbaoInfoService.comfirmPlanReach(map,false);
	}
	
	@RequestMapping(name = "获取计划下达中申报项目列表数据", path = "{id}/shenBaoInfoList",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenBaoInfo(HttpServletRequest request,@PathVariable String id) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = planReachApplicationService.getShenBaoInfo(id,odataObj);
		return shenBaoInfoDtos;
	}
	
	@RequestMapping(name = "获取计划下达中打包类中添加的申报数据", path = "{id}/shenBaoInfoFromPack",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenBaoInfoFromPackPlan(HttpServletRequest request,@PathVariable String id) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = planReachApplicationService.getShenBaoInfoFromPackPlan(id,odataObj);
		return shenBaoInfoDtos;
	}
	
	@RequestMapping(name="计划下达申请中添加申报项目",path="addShenBaoInfo/{planReachId}",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addShenBaoInfoToPlanReach(@RequestBody String projectId,@PathVariable String planReachId){		
		String[] ids=projectId.split(",");
		planReachApplicationService.addShenBaoInfos(planReachId, ids);
	}
	
	@RequestMapping(name = "获取计划下达中打包列表数据", path = "{id}/packPlanList",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PackPlanDto> getPackPkan(HttpServletRequest request,@PathVariable String id) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PackPlanDto> packPlanDtos = planReachApplicationService.getPackPlan(id,odataObj);
		return packPlanDtos;
	}
	
	@RequestMapping(name="计划下达申请中添加打包信息",path="addPackPlan/{planReachId}",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addPackPlanToPlanReach(@RequestBody String packPlanId,@PathVariable String planReachId){		
		String[] ids=packPlanId.split(",");
		if(ids.length>1){
			planReachApplicationService.addPackPlans(planReachId, ids);
		}else{
			planReachApplicationService.addPackPlan(planReachId,packPlanId);
		}
	}
	
	
	@RequiresPermissions("shenbaoAdmin/planReach#html/list#get")
	@RequestMapping(name = "列表页", path = "html/list",method=RequestMethod.GET)
	public String list() {
		return this.ctrlName + "/list";
	}
	
	//@RequiresPermissions("shenbaoAdmin/planReach#html/edit#get")
	@RequestMapping(name = "编辑页", path = "html/edit",method=RequestMethod.GET)
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	//@RequiresPermissions("shenbaoAdmin/planReach#html/print#get")
	@RequestMapping(name = "打印页", path = "html/print",method=RequestMethod.GET)
	public String print() {
		return this.ctrlName + "/print";
	}
	
	@RequestMapping(name = "打包计划编制", path = "html/packPlan",method=RequestMethod.GET)
	public String packPlan() {
		return this.ctrlName + "/packPlan";
	}
}
