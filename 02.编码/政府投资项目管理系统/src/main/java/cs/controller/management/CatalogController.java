package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@RequestMapping(name="添加投资项目数据",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody InvestmentProjectDto dto){
		investmentService.create(dto);
	}
	
	
	@RequestMapping(name="获取投资项目数据",path="",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<InvestmentProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<InvestmentProjectDto>  investmentProjectDtos= investmentService.get(odataObj);		
		return investmentProjectDtos;
	}
	
	@RequestMapping(name="更新投资项目数据",path="",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody InvestmentProjectDto dto){
		investmentService.update(dto,dto.getId());
	}
	
	@RequestMapping(name = "批量删除项投资项目数据", path = "",method=RequestMethod.DELETE)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deleteInvestmentCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			investmentService.deleteCatalogs(ids);	
		}else{
			investmentService.delete(id);	
		}		
	}
	
	@RequestMapping(name="获取政策类型条目",path="policyCatalog",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PolicyCatalogDto> getPolicyCatalog(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PolicyCatalogDto>  policyCatalogDtos= policyCatalogService.get(odataObj);		
		return policyCatalogDtos;
	}
	
	@RequestMapping(name="添加政策条目",path="policyCatalog",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addPolicyCatalog(@RequestBody PolicyCatalogDto dto){
		policyCatalogService.create(dto);
	}
	
	@RequestMapping(name = "批量删除政策条目", path = "deletePolicyCatalogs",method=RequestMethod.DELETE)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletePolicyCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			policyCatalogService.deletePolicyCatalogs(ids);	
		}else{
			policyCatalogService.delete(id);	
		}		
	}
	
	@RequestMapping(name="更新投资项目数据",path="updatePolicyCatalog",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updatePolicyCatalog(@RequestBody PolicyCatalogDto dto){
		policyCatalogService.update(dto,dto.getId());
	}
	
	@RequestMapping(name="获取部门审批事项",path="partApprovalMatters",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PartApprovalMattersDto> getPartApprovalMatters(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PartApprovalMattersDto>  partApprovalMattersDtos= partApprovalMattersService.get(odataObj);		
		return partApprovalMattersDtos;
	}
	
	@RequestMapping(name="添加部门审批事项",path="partApprovalMatters",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createPartApprovalMatters(@RequestBody PartApprovalMattersDto dto){
		partApprovalMattersService.create(dto);
	}
	
	@RequestMapping(name="更新部门审批事项",path="partApprovalMatters",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updatePartApprovalMatters(@RequestBody PartApprovalMattersDto dto){
		partApprovalMattersService.update(dto,dto.getId());
	}
	
	@RequestMapping(name = "批量删除部门审批事项", path = "deletePartApprovalMattersCatalogs",method=RequestMethod.DELETE)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deletePartApprovalMattersCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			partApprovalMattersService.deletePartApprovalMattersCatalogs(ids);	
		}else{
			partApprovalMattersService.delete(id);	
		}		
	}
	
	@RequestMapping(name="获取中介服务事项",path="agencyServiceMatters",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<AgencyServiceMattersDto> getAgencyServiceMatters(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<AgencyServiceMattersDto>  agencyServiceMattersDtos= agencyServiceMattersService.get(odataObj);		
		return agencyServiceMattersDtos;
	}
	
	@RequestMapping(name="添加中介服务事项",path="agencyServiceMatters",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createAgencyServiceMatters(@RequestBody AgencyServiceMattersDto dto){
		agencyServiceMattersService.create(dto);
	}
	
	@RequestMapping(name="更新中介服务事项",path="agencyServiceMatters",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateAgencyServiceMatters(@RequestBody AgencyServiceMattersDto dto){
		agencyServiceMattersService.update(dto,dto.getId());
	}
	
	@RequestMapping(name = "批量删除中介服务事项", path = "deleteAgencyServiceMattersCatalogs",method=RequestMethod.DELETE)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deleteAgencyServiceMattersCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			agencyServiceMattersService.deleteAgencyServiceMattersCatalogs(ids);	
		}else{
			agencyServiceMattersService.delete(id);	
		}		
	}
	
	
	@RequestMapping(name="投资项目列表页",path="html/investmentList",method=RequestMethod.GET)
	public String investmentList(){
		return ctrl+"/investmentList";
	}
	
	@RequestMapping(name="投资项目次级编辑页",path="html/investmentSecondList",method=RequestMethod.GET)
	public String investmentSecondList(){
		return ctrl+"/investmentSecondList";
	}
	
	@RequestMapping(name="投资项目列表页(默认显示项目行业)",path="html/investmentEdit",method=RequestMethod.GET)
	public String investmentEdit(){
		return ctrl+"/investmentEdit";
	}
	
	@RequestMapping(name="投资项目列表页(默认显示项目类型)",path="html/investmentProjectTypeList",method=RequestMethod.GET)
	public String investmentProjectTypeList(){
		return ctrl+"/investmentProjectTypeList";
	}
	
	@RequestMapping(name="投资项目列表页(默认显示建设类型)",path="html/investmentConstructionTypeList",method=RequestMethod.GET)
	public String investmentConstructionTypeList(){
		return ctrl+"/investmentConstructionTypeList";
	}
	
	@RequestMapping(name="政策目录列表页(默认显示鼓励类)",path="html/policyCatalogList",method=RequestMethod.GET)
	public String policyList(){
		return ctrl+"/policyCatalogList";
	}
	
	@RequestMapping(name="政策目录列表页(默认显示允许类)",path="html/policyCatalogAllowList",method=RequestMethod.GET)
	public String policyCatalogAllowList(){
		return ctrl+"/policyCatalogAllowList";
	}
	
	@RequestMapping(name="政策目录列表页(默认显示限制类)",path="html/policyCatalogLimitList",method=RequestMethod.GET)
	public String policyCatalogLimitList(){
		return ctrl+"/policyCatalogLimitList";
	}
	
	@RequestMapping(name="政策目录编辑页",path="html/policyCatalogEdit",method=RequestMethod.GET)
	public String policyCatalogEdit(){
		return ctrl+"/policyCatalogEdit";
	}
	
	@RequestMapping(name="政策目录编辑页",path="html/policyCatalogSecondList",method=RequestMethod.GET)
	public String policyCatalogSecondList(){
		return ctrl+"/policyCatalogSecondList";
	}
	
	@RequestMapping(name="部门审批事项列表页",path="html/partApprovalMattersList",method=RequestMethod.GET)
	public String partApprovalMattersList(){
		return ctrl+"/partApprovalMattersList";
	}
	
	@RequestMapping(name="部门审批事项编辑页或修改页",path="html/partApprovalMattersEdit",method=RequestMethod.GET)
	public String partApprovalMattersEdit(){
		return ctrl+"/partApprovalMattersEdit";
	}
	
	@RequestMapping(name="中介服务事项列表页",path="html/agencyServiceMattersList",method=RequestMethod.GET)
	public String agencyServiceMattersList(){
		return ctrl+"/agencyServiceMattersList";
	}
	
	@RequestMapping(name="中介服务事项编辑页或修改页",path="html/agencyServiceMattersEdit",method=RequestMethod.GET)
	public String agencyServiceMattersEdit(){
		return ctrl+"/agencyServiceMattersEdit";
	}
	
}
