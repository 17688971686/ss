package cs.controller.mobile;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanService;

@Controller
@RequestMapping(name="手机端--年度计划管理", path="mobile/management/yearPlan")
public class YearPlanMobileController {
	private String ctrl ="management/yearPlan";
	@Autowired
	private YearPlanService yearPlanService;
	
	@RequestMapping(name = "获取年度计划列表数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<YearPlanDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<YearPlanDto>  yearPlanDtos= yearPlanService.get(odataObj);		
		return yearPlanDtos;
	}
	
	@RequestMapping(name = "获取年度计划项目列表数据", path = "{id}/projectList",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenBaoInfo(HttpServletRequest request,@PathVariable String id) throws ParseException {
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos=new PageModelDto<ShenBaoInfoDto>();
		shenBaoInfoDtos.setValue(yearPlanService.getYearPlanShenBaoInfo(id));
		return shenBaoInfoDtos;
	}
	
}
