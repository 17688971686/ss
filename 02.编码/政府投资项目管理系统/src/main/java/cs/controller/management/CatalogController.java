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
import cs.model.DomainDto.AgencyServiceMattersDto;
import cs.model.DomainDto.InvestmentProjectDto;
import cs.model.DomainDto.PartApprovalMattersDto;
import cs.model.DomainDto.PolicyCatalogDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.AgencyServiceMattersService;
import cs.service.interfaces.InvestmentProjectService;
import cs.service.interfaces.PartApprovalMattersService;
import cs.service.interfaces.PolicyCatalogService;

/**
 * @author Administrator
 * @Description 目录管理控制层
 */
@Controller
@RequestMapping(name="后台管理--目录管理", path="management/catalog")
public class CatalogController {
	private String ctrl ="management/catalog";
	
	@Autowired
	private InvestmentProjectService investmentService;
	
	@Autowired
	private PolicyCatalogService policyCatalogService;
	
	@Autowired
	private PartApprovalMattersService partApprovalMattersService;
	
	@Autowired
	private AgencyServiceMattersService agencyServiceMattersService;
	
//	@RequiresPermissions("management/catalog##post")
	@RequestMapping(name="添加投资项目数据",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody InvestmentProjectDto dto){
		investmentService.create(dto);
	}
	
//	@RequiresPermissions("management/catalog##get")
	@RequestMapping(name="获取投资项目数据",path="",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<InvestmentProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<InvestmentProjectDto>  investmentProjectDtos= investmentService.get(odataObj);		
		return investmentProjectDtos;
	}
	
//	@RequiresPermissions("management/catalog#updateInvestment#post")
	@RequestMapping(name="更新投资项目数据",path="updateInvestment",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody InvestmentProjectDto dto){
		investmentService.update(dto,dto.getId());
	}
	
//	@RequiresPermissions("management/catalog#deleteInvestment#post")
	@RequestMapping(name = "批量删除项投资项目数据", path = "deleteInvestment",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deleteInvestmentCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			investmentService.deleteCatalogs(ids);	
		}else{
			investmentService.delete(id);	
		}		
	}
	
//	@RequiresPermissions("management/catalog#policyCatalog#get")
	@RequestMapping(name="获取政策类型条目",path="policyCatalog",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PolicyCatalogDto> getPolicyCatalog(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PolicyCatalogDto>  policyCatalogDtos= policyCatalogService.get(odataObj);		
		return policyCatalogDtos;
	}
	
//	@RequiresPermissions("management/catalog#policyCatalog#post")
	@RequestMapping(name="添加政策条目",path="policyCatalog",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addPolicyCatalog(@RequestBody PolicyCatalogDto dto){
		policyCatalogService.create(dto);
	}
	
//	@RequiresPermissions("management/catalog#deletePolicyCatalogs#post")
	@RequestMapping(name = "批量删除政策条目", path = "deletePolicyCatalogs",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletePolicyCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			policyCatalogService.deletePolicyCatalogs(ids);	
		}else{
			policyCatalogService.delete(id);	
		}		
	}
	
//	@RequiresPermissions("management/catalog#updatePolicyCatalog#post")
	@RequestMapping(name="更新政策条目数据",path="updatePolicyCatalog",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updatePolicyCatalog(@RequestBody PolicyCatalogDto dto){
		policyCatalogService.update(dto,dto.getId());
	}
	
//	@RequiresPermissions("management/catalog#partApprovalMatters#get")
	@RequestMapping(name="获取部门审批事项",path="partApprovalMatters",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PartApprovalMattersDto> getPartApprovalMatters(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PartApprovalMattersDto>  partApprovalMattersDtos= partApprovalMattersService.get(odataObj);		
		return partApprovalMattersDtos;
	}
	
//	@RequiresPermissions("management/catalog#partApprovalMatters#post")
	@RequestMapping(name="添加部门审批事项",path="partApprovalMatters",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createPartApprovalMatters(@RequestBody PartApprovalMattersDto dto){
		partApprovalMattersService.create(dto);
	}
	
//	@RequiresPermissions("management/catalog#updatePartApprovalMatters#post")
	@RequestMapping(name="更新部门审批事项",path="updatePartApprovalMatters",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updatePartApprovalMatters(@RequestBody PartApprovalMattersDto dto){
		partApprovalMattersService.update(dto,dto.getId());
	}
	
//	@RequiresPermissions("management/catalog#deletePartApprovalMattersCatalogs#post")
	@RequestMapping(name = "批量删除部门审批事项", path = "deletePartApprovalMattersCatalogs",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletePartApprovalMattersCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			partApprovalMattersService.deletePartApprovalMattersCatalogs(ids);	
		}else{
			partApprovalMattersService.delete(id);	
		}		
	}
	
//	@RequiresPermissions("management/catalog#agencyServiceMatters#get")
	@RequestMapping(name="获取中介服务事项",path="agencyServiceMatters",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<AgencyServiceMattersDto> getAgencyServiceMatters(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<AgencyServiceMattersDto>  agencyServiceMattersDtos= agencyServiceMattersService.get(odataObj);		
		return agencyServiceMattersDtos;
	}
	
//	@RequiresPermissions("management/catalog#agencyServiceMatters#post")
	@RequestMapping(name="添加中介服务事项",path="agencyServiceMatters",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createAgencyServiceMatters(@RequestBody AgencyServiceMattersDto dto){
		agencyServiceMattersService.create(dto);
	}
	
//	@RequiresPermissions("management/catalog#updateAgencyServiceMatters#post")
	@RequestMapping(name="更新中介服务事项",path="updateAgencyServiceMatters",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateAgencyServiceMatters(@RequestBody AgencyServiceMattersDto dto){
		agencyServiceMattersService.update(dto,dto.getId());
	}
	
//	@RequiresPermissions("management/catalog#deleteAgencyServiceMattersCatalogs#post")
	@RequestMapping(name = "批量删除中介服务事项", path = "deleteAgencyServiceMattersCatalogs",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deleteAgencyServiceMattersCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			agencyServiceMattersService.deleteAgencyServiceMattersCatalogs(ids);	
		}else{
			agencyServiceMattersService.delete(id);	
		}		
	}
	
//	@RequiresPermissions("management/catalog#html/investmentList#get")
	@RequestMapping(name="投资项目列表页",path="html/investmentList",method=RequestMethod.GET)
	public String investmentList(){
		return ctrl+"/investmentList";
	}
	
//	@RequiresPermissions("management/catalog#html/investmentSecondList#get")
	@RequestMapping(name="投资项目次级编辑页",path="html/investmentSecondList",method=RequestMethod.GET)
	public String investmentSecondList(){
		return ctrl+"/investmentSecondList";
	}
	
//	@RequiresPermissions("management/catalog#html/investmentEdit#get")
	@RequestMapping(name="投资项目列表页(默认显示项目行业)",path="html/investmentEdit",method=RequestMethod.GET)
	public String investmentEdit(){
		return ctrl+"/investmentEdit";
	}
	
//	@RequiresPermissions("management/catalog#html/investmentProjectTypeList#get")
	@RequestMapping(name="投资项目列表页(默认显示项目类型)",path="html/investmentProjectTypeList",method=RequestMethod.GET)
	public String investmentProjectTypeList(){
		return ctrl+"/investmentProjectTypeList";
	}
	
//	@RequiresPermissions("management/catalog#html/investmentConstructionTypeList#get")
	@RequestMapping(name="投资项目列表页(默认显示建设类型)",path="html/investmentConstructionTypeList",method=RequestMethod.GET)
	public String investmentConstructionTypeList(){
		return ctrl+"/investmentConstructionTypeList";
	}
	
//	@RequiresPermissions("management/catalog#html/policyCatalogList#get")
	@RequestMapping(name="政策目录列表页(默认显示鼓励类)",path="html/policyCatalogList",method=RequestMethod.GET)
	public String policyList(){
		return ctrl+"/policyCatalogList";
	}
	
//	@RequiresPermissions("management/catalog#html/policyCatalogAllowList#get")
	@RequestMapping(name="政策目录列表页(默认显示允许类)",path="html/policyCatalogAllowList",method=RequestMethod.GET)
	public String policyCatalogAllowList(){
		return ctrl+"/policyCatalogAllowList";
	}
	
//	@RequiresPermissions("management/catalog#html/policyCatalogLimitList#get")
	@RequestMapping(name="政策目录列表页(默认显示限制类)",path="html/policyCatalogLimitList",method=RequestMethod.GET)
	public String policyCatalogLimitList(){
		return ctrl+"/policyCatalogLimitList";
	}
	
//	@RequiresPermissions("management/catalog#html/policyCatalogEdit#get")
	@RequestMapping(name="政策目录编辑页",path="html/policyCatalogEdit",method=RequestMethod.GET)
	public String policyCatalogEdit(){
		return ctrl+"/policyCatalogEdit";
	}
	
//	@RequiresPermissions("management/catalog#html/policyCatalogSecondList#get")
//	@RequestMapping(name="政策目录编辑页",path="html/policyCatalogSecondList",method=RequestMethod.GET)
//	public String policyCatalogSecondList(){
//		return ctrl+"/policyCatalogSecondList";
//	}
	
//	@RequiresPermissions("management/catalog#html/partApprovalMattersList#get")
	@RequestMapping(name="部门审批事项列表页",path="html/partApprovalMattersList",method=RequestMethod.GET)
	public String partApprovalMattersList(){
		return ctrl+"/partApprovalMattersList";
	}
	
//	@RequiresPermissions("management/catalog#html/partApprovalMattersEdit#get")
	@RequestMapping(name="部门审批事项编辑页或修改页",path="html/partApprovalMattersEdit",method=RequestMethod.GET)
	public String partApprovalMattersEdit(){
		return ctrl+"/partApprovalMattersEdit";
	}
	
//	@RequiresPermissions("management/catalog#html/agencyServiceMattersList#get")
	@RequestMapping(name="中介服务事项列表页",path="html/agencyServiceMattersList",method=RequestMethod.GET)
	public String agencyServiceMattersList(){
		return ctrl+"/agencyServiceMattersList";
	}
	
//	@RequiresPermissions("management/catalog#html/agencyServiceMattersEdit#get")
	@RequestMapping(name="中介服务事项编辑页或修改页",path="html/agencyServiceMattersEdit",method=RequestMethod.GET)
	public String agencyServiceMattersEdit(){
		return ctrl+"/agencyServiceMattersEdit";
	}
	
}
