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
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanCapitalService;


@Controller
@RequestMapping(name="后台管理--年度计划资金管理", path="management/yearPlanCapital")
public class YearPlanCapitalController {
	@Autowired
	private YearPlanCapitalService yearPlanCapitalService;
	
	@RequiresPermissions("management/yearPlanCapital##get")
	@RequestMapping(name="获取年度计划编制信息",path="",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<YearPlanCapitalDto> get(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<YearPlanCapitalDto> yearPlanCapitalDtos= yearPlanCapitalService.get(odataObj);		
		return yearPlanCapitalDtos;
	}
	
	@RequiresPermissions("management/yearPlanCapital##put")
	@RequestMapping(name="更新年度计划编制信息",path="",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody YearPlanCapitalDto dto){
		yearPlanCapitalService.update(dto,dto.getId());
	}
	
	@RequiresPermissions("management/yearPlanCapital##post")
	@RequestMapping(name="添加年度计划编制资金",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			for(String obj:ids){
				yearPlanCapitalService.createYearPlanCapital(obj);
			}			
		}else{
			yearPlanCapitalService.createYearPlanCapital(id);
		}		
	}
}
