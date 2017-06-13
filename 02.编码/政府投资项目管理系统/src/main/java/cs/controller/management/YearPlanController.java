package cs.controller.management;

import java.text.ParseException;

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
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanService;

@Controller
@RequestMapping(name="年度计划管理", path="management/yearPlan")
public class YearPlanController {
	private String ctrl ="management/yearPlan";
	@Autowired
	private YearPlanService yearPlanService;
	
	@RequestMapping(name = "获取年度计划列表数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<YearPlanDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<YearPlanDto>  yearPlanDtos= yearPlanService.get(odataObj);		
		return yearPlanDtos;
	}
	@RequestMapping(name="添加年度计划",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody YearPlanDto dto){
		yearPlanService.create(dto);
	}
	@RequestMapping(name="更新年度计划",path="",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody YearPlanDto dto){
		yearPlanService.update(dto);
	}
	//begin#html
	@RequestMapping(name="年度计划项目申报列表页",path="html/shenbaoInfoList",method=RequestMethod.GET)
	public String planList(){
		return ctrl+"/shenbaoInfoList";
	}
	@RequestMapping(name="年度计划列表页",path="html/planList",method=RequestMethod.GET)
	public String planBZList(){
		return ctrl+"/planList";
	}
	@RequestMapping(name="年度计划编辑页",path="html/planEdit",method=RequestMethod.GET)
	public String planBZEdit(){
		return ctrl+"/planEdit";
	}
	@RequestMapping(name="年度计划编制页",path="html/planBZ",method=RequestMethod.GET)
	public String planBZ(){
		return ctrl+"/planBZ";
	}
}
