package cs.controller.management.planReach;

import java.text.ParseException;
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

import cs.model.PageModelDto;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApprovalService;
import cs.service.interfaces.ShenBaoInfoService;

/**
 * 
* @ClassName: PlanReachController 
* @Description: 计划下达管理控制器 
* @author cx
* @date 2018年1月11日 上午9:38:41 
*
 */
@Controller
@RequestMapping(name = "后台管理--计划下达管理--计划下达", path = "management/planReachManage/planReach")
public class PlanReachController {
	private String ctrl ="management/planReachManage/planReach";
	
	@Autowired
	private ShenBaoInfoService shenbaoInfoService;
	@Autowired
	private PlanReachApprovalService planReachApprovalService;

	//@RequiresPermissions("management/planReachManage/planReach##get")
	@RequestMapping(name = "获取计划下达申请", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getPlanReach(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> shenbaoInfoDtos = shenbaoInfoService.get(odataObj);
		return shenbaoInfoDtos;
	}
	
	//@RequiresPermissions("management/planReachManage/planReach#approval#get")
	@RequestMapping(name = "获取计划下达批复信息", path = "approval",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PlanReachApprovalDto> getPlanReachApproval(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PlanReachApprovalDto> planReachApprovalDtos = planReachApprovalService.get(odataObj);
		return planReachApprovalDtos;
	}
		
	//@RequiresPermissions("management/planReachManage/planReach##post")
	@RequestMapping(name = "创建计划下达批复信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void create(@RequestBody PlanReachApprovalDto dto) throws ParseException {
		planReachApprovalService.create(dto);
	}
	
	//@RequiresPermissions("management/planReachManage/planReach##put")
	@RequestMapping(name = "更新计划下达批复信息", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody PlanReachApprovalDto dto) throws ParseException {
		planReachApprovalService.update(dto,dto.getId());
	}
	
	//@RequiresPermissions("management/planReachManage/planReach##delete")
	@RequestMapping(name = "删除计划下达批复信息", path = "",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) throws ParseException {
		String[] ids = id.split(",");
		if(ids.length>1){
			for(String idstr:ids){
				planReachApprovalService.delete(idstr);	
			}
		}else{
			planReachApprovalService.delete(id);
		}
	}
	
	@SuppressWarnings("rawtypes")
	//@RequiresPermissions("management/planReachManage/planReach#comfirmPlanReach#post")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(name = "确定计划下达申请资金", path = "comfirmPlanReach",method=RequestMethod.POST)
	public void comfirmPlanReach(@RequestBody Map map){
		shenbaoInfoService.comfirmPlanReach(map,true);
	}
	
	
	//@RequiresPermissions("management/planReachManage/planReach#html/list#get")
	@RequestMapping(name="计划下达列表页面",path="html/list",method=RequestMethod.GET)
	public String list(){
		return ctrl+"/list";
	}
	
	//@RequiresPermissions("management/planReachManage/planReach#html/tabList#get")
	@RequestMapping(name="计划下达批复列表页面",path="html/tabList",method=RequestMethod.GET)
	public String tabList(){
		return ctrl+"/tabList";
	}
		
	//@RequiresPermissions("management/planReachManage/planReach#html/tabEdit#get")
	@RequestMapping(name="计划下达批复编辑页面",path="html/tabEdit",method=RequestMethod.GET)
	public String tabEdit(){
		return ctrl+"/tabEdit";
	}
	
	//@RequiresPermissions("management/planReachManage/planReach#html/print#get")
	@RequestMapping(name="计划下达批复打印页面",path="html/print",method=RequestMethod.GET)
	public String print(){
		return ctrl+"/print";
	}
}
