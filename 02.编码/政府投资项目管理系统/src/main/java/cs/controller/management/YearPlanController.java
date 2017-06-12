package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenBaoInfoService;

@Controller
@RequestMapping(name="年度计划管理", path="management/yearPlan")
public class YearPlanController {
	private String ctrl ="management/yearPlan";
	@Autowired
	private ShenBaoInfoService shenbaoInfoService;
	
	@RequestMapping(name = "获取年度计划列表数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto>  shenbaoInfoDtos= shenbaoInfoService.get(odataObj);		
		return shenbaoInfoDtos;
	}
	
	//begin#html
	@RequestMapping(name="年度计划列表页",path="html/planList",method=RequestMethod.GET)
	public String planList(){
		return ctrl+"/planList";
	}
	@RequestMapping(name="年度计划编制列表页",path="html/planBZList",method=RequestMethod.GET)
	public String planBZList(){
		return ctrl+"/planBZList";
	}
	@RequestMapping(name="年度计划编制编辑页",path="html/planBZEdit",method=RequestMethod.GET)
	public String planBZEdit(){
		return ctrl+"/planBZEdit";
	}
}
