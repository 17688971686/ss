package cs.controller.management;

import java.text.ParseException;

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

import cs.model.PageModelDto;
import cs.model.DomainDto.CreditBlackListDto;
import cs.model.DomainDto.CreditIllegalNameDto;
import cs.model.DomainDto.CreditProjectAnomalyDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.CreditBlackListService;
import cs.service.interfaces.CreditIllegalNameService;
import cs.service.interfaces.CreditProjectAnomalyService;

@Controller
@RequestMapping(name="后台管理--信用信息管理", path="management/creditInfo")
public class CreditInfoController {
	private String ctrl = "management/creditInfo";
	
	@Autowired
	private CreditIllegalNameService illegalNameService;
	
	@Autowired
	private CreditBlackListService blackListService;
	
	@Autowired
	private CreditProjectAnomalyService projectAnomalyService;
	
	@RequiresPermissions("management/creditInfo##post")
	@RequestMapping(name="添加项目异常名录",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody CreditIllegalNameDto dto){
		illegalNameService.create(dto);
	}
	
	@RequiresPermissions("management/creditInfo##get")
	@RequestMapping(name = "获取项目异常名录数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<CreditIllegalNameDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<CreditIllegalNameDto>  illegalNameDtos= illegalNameService.get(odataObj);		
		return illegalNameDtos;
	}
	
	@RequiresPermissions("management/creditInfo#updateIllegalName#post")
	@RequestMapping(name="更新项目异常名录",path="updateIllegalName",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody CreditIllegalNameDto dto){
		illegalNameService.update(dto,dto.getId());
	}
	
	@RequiresPermissions("management/creditInfo#deleteIllegalName#post")
	@RequestMapping(name="删除项目异常名录",path="deleteIllegalName",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id){
		illegalNameService.delete(id);
	}
	
	@RequiresPermissions("management/creditInfo#blackList#post")
	@RequestMapping(name="添加黑名单数据",path="blackList",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addBlackList(@RequestBody CreditBlackListDto dto){
		blackListService.create(dto);
	}
	
	@RequiresPermissions("management/creditInfo#blackList#get")
	@RequestMapping(name="获取黑名单数据", path = "blackList",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<CreditBlackListDto> getBlackList(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<CreditBlackListDto>  blackListDtos= blackListService.get(odataObj);		
		return blackListDtos;
	}
	
	@RequiresPermissions("management/creditInfo#updateBlackList#post")
	@RequestMapping(name="更新黑名单数据",path="updateBlackList",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateBlackList(@RequestBody CreditBlackListDto dto){
		blackListService.update(dto,dto.getId());
	}
	
	@RequiresPermissions("management/creditInfo#blackList/delete#post")
	@RequestMapping(name="删除黑名单数据",path="blackList/delete",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void deleteBlackList(@RequestBody String id){
		blackListService.delete(id);
	}
	
	@RequiresPermissions("management/creditInfo#projectAnomaly#get")
	@RequestMapping(name="获取项目异常名录数据", path = "projectAnomaly",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<CreditProjectAnomalyDto> getProjectAnomaly(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<CreditProjectAnomalyDto>  projectAnomalyDtos= projectAnomalyService.get(odataObj);		
		return projectAnomalyDtos;
	}
	
	@RequiresPermissions("management/creditInfo#projectAnomaly#post")
	@RequestMapping(name="添加项目异常数据",path="projectAnomaly",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createProjectAnomaly(@RequestBody CreditProjectAnomalyDto dto){
		projectAnomalyService.create(dto);
	}
	
	@RequiresPermissions("management/creditInfo#updateProjectAnomaly#post")
	@RequestMapping(name="更新项目异常信息",path="updateProjectAnomaly",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody CreditProjectAnomalyDto dto){
		projectAnomalyService.update(dto,dto.getId());
	}
	
	@RequiresPermissions("management/creditInfo#projectAnomaly/delete#post")
	@RequestMapping(name="删除项目异常数据",path="projectAnomaly/delete",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void deleteProjectAnomaly(@RequestBody String id){
		projectAnomalyService.delete(id);
	}
	
	@RequiresPermissions("management/creditInfo#html/illegalNameList#get")
	@RequestMapping(name="信用异常项目申报单位列表页",path="html/illegalNameList",method=RequestMethod.GET)
	public String list_illegalName(){
		return ctrl+"/illegalNameList";
	}
	
	@RequiresPermissions("management/creditInfo#html/illegalNameEdit#get")
	@RequestMapping(name="项目异常名录信息录入页",path="html/illegalNameEdit",method=RequestMethod.GET)
	public String illegalNameInfo(){
		return ctrl+"/illegalNameEdit";
	}
	
	@RequiresPermissions("management/creditInfo#html/illegalNameDetails#get")
	@RequestMapping(name="项目异常名录信息详情页",path="html/illegalNameDetails",method=RequestMethod.GET)
	public String illegalNameDetails(){
		return ctrl+"/illegalNameDetails";
	}
	
	@RequiresPermissions("management/creditInfo#html/blackList#get")
	@RequestMapping(name="信息黑名单列表页",path="html/blackList",method=RequestMethod.GET)
	public String blackList(){
		return ctrl+"/blackList";
	}
	
	@RequiresPermissions("management/creditInfo#html/blackListEdit#get")
	@RequestMapping(name="信息黑名单录入页",path="html/blackListEdit",method=RequestMethod.GET)
	public String blackListEdit(){
		return ctrl+"/blackListEdit";
	}
	
	@RequiresPermissions("management/creditInfo#html/blackListDetails#get")
	@RequestMapping(name="信息黑名单信息详情页",path="html/blackListDetails",method=RequestMethod.GET)
	public String blackListDetails(){
		return ctrl+"/blackListDetails";
	}
	
	@RequiresPermissions("management/creditInfo#html/blackListUpdate#get")
	@RequestMapping(name="信息黑名单录入页",path="html/blackListUpdate",method=RequestMethod.GET)
	public String blackListUpdate(){
		return ctrl+"/blackListUpdate";
	}
	
	@RequiresPermissions("management/creditInfo#html/projectAnomaly#get")
	@RequestMapping(name="项目异常列表页",path="html/projectAnomaly",method=RequestMethod.GET)
	public String anomalyProjectList(){
		return ctrl+"/projectAnomalyList";
	}
	
	@RequiresPermissions("management/creditInfo#html/projectAnomalyEdit#get")
	@RequestMapping(name="项目异常录入页",path="html/projectAnomalyEdit",method=RequestMethod.GET)
	public String anomalyProjectEdit(){
		return ctrl+"/projectAnomalyEdit";
	}
	
	@RequiresPermissions("management/creditInfo#html/projectAnomalyDetails#get")
	@RequestMapping(name="项目异常信息详情页",path="html/projectAnomalyDetails",method=RequestMethod.GET)
	public String projectAnomalyDetails(){
		return ctrl+"/projectAnomalyDetails";
	}
	
	@RequiresPermissions("management/creditInfo#html/projectAnomalyUpdate#get")
	@RequestMapping(name="项目异常信息修改页",path="html/projectAnomalyUpdate",method=RequestMethod.GET)
	public String projectAnomalyUpdate(){
		return ctrl+"/projectAnomalyUpdate";
	}
	

}
