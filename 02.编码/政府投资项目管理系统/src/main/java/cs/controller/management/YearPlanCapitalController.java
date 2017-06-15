package cs.controller.management;

import java.text.ParseException;
import java.util.List;

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
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanCapitalService;
import cs.service.interfaces.YearPlanService;

@Controller
@RequestMapping(name="年度计划资金管理", path="management/yearPlanCapital")
public class YearPlanCapitalController {
	private String ctrl ="management/yearPlanCapital";
	@Autowired
	private YearPlanCapitalService yearPlanCapitalService;
	
	@RequestMapping(name="获取年度计划编制信息",path="",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<YearPlanCapitalDto> get(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<YearPlanCapitalDto> yearPlanCapitalDtos= yearPlanCapitalService.get(odataObj);		
		return yearPlanCapitalDtos;
	}
	
	@RequestMapping(name="更新年度计划编制信息",path="",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody YearPlanCapitalDto dto){
		yearPlanCapitalService.update(dto);
	}
	
	@RequestMapping(name="添加年度计划编制资金",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			yearPlanCapitalService.createYearPlanCapitals(ids);
		}else{
			yearPlanCapitalService.createYearPlanCapital(id);
		}		
	}
}
