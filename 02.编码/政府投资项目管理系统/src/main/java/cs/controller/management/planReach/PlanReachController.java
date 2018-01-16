package cs.controller.management.planReach;

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

import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
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

	@RequiresPermissions("management/planReachManage/planReach##get")
	@RequestMapping(name = "获取计划下达申请", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getPlanReach(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> shenbaoInfoDtos = shenbaoInfoService.get(odataObj);
		return shenbaoInfoDtos;
	}
	
	@SuppressWarnings("rawtypes")
	@RequiresPermissions("management/planReachManage/planReach#comfirmPlanReach#post")
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	@RequestMapping(name = "确定计划下达申请资金", path = "comfirmPlanReach",method=RequestMethod.POST)
	public void comfirmPlanReach(@RequestBody Map map){
		shenbaoInfoService.comfirmPlanReach(map);
	}
	
	@RequiresPermissions("management/planReachManage/planReach#html/list#get")
	@RequestMapping(name="计划下达列表页面",path="html/list",method=RequestMethod.GET)
	public String list(){
		return ctrl+"/list";
	}
}
