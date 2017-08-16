package cs.controller.management;

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
@RequestMapping(name="后台管理--年度计划管理", path="management/yearPlan")
public class YearPlanController {
	private String ctrl ="management/yearPlan";
	@Autowired
	private YearPlanService yearPlanService;
	
	@RequiresPermissions("management/yearPlan##get")
	@RequestMapping(name = "获取年度计划列表数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<YearPlanDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<YearPlanDto>  yearPlanDtos= yearPlanService.get(odataObj);		
		return yearPlanDtos;
	}
	
	@RequiresPermissions("management/yearPlan#id/projectList#get")
	@RequestMapping(name = "获取年度计划项目列表数据", path = "{id}/projectList",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenBaoInfo(HttpServletRequest request,@PathVariable String id) throws ParseException {
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos=new PageModelDto<ShenBaoInfoDto>();
		shenBaoInfoDtos.setValue(yearPlanService.getYearPlanShenBaoInfo(id));
		return shenBaoInfoDtos;
	}
	
	@RequiresPermissions("management/yearPlan#addCapital#get")
	@RequestMapping(name="添加年度计划项目",path="addCapital",method=RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addCapital(@RequestParam String planId,@RequestParam String shenBaoId){		
		String[] ids=shenBaoId.split(",");
		if(ids.length>1){
			yearPlanService.addYearPlanCapitals(planId,ids);
		}else{
			yearPlanService.addYearPlanCapital(planId,shenBaoId);
		}
	}
	
	@RequiresPermissions("management/yearPlan#removeCapital#post")
	@RequestMapping(name="移除年度计划项目",path="removeCapital",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void removeCapital(@RequestParam String planId,@RequestParam String yearPlanCapitalId){		
		String[] ids=yearPlanCapitalId.split(",");
		yearPlanService.removeYearPlanCapital(planId, ids);
	}
	
	@RequiresPermissions("management/yearPlan##post")
	@RequestMapping(name="添加年度计划",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody YearPlanDto dto){
		yearPlanService.create(dto);
	}
	
	@RequiresPermissions("management/yearPlan##put")
	@RequestMapping(name="更新年度计划",path="",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody YearPlanDto dto){
		yearPlanService.update(dto,dto.getId());
	}
	
	//begin#html
	@RequiresPermissions("management/yearPlan#html/shenbaoInfoList#get")
	@RequestMapping(name="年度计划项目申报列表页",path="html/shenbaoInfoList",method=RequestMethod.GET)
	public String planList(){
		return ctrl+"/shenbaoInfoList";
	}
	
	@RequiresPermissions("management/yearPlan#html/shenbaoInfoEdit#get")
	@RequestMapping(name="年度计划项目申报编辑页",path="html/shenbaoInfoEdit",method=RequestMethod.GET)
	public String shenBaoInfoEdit(){
		return ctrl+"/shenbaoInfoEdit";
	}
	
	@RequiresPermissions("management/yearPlan#html/planList#get")
	@RequestMapping(name="年度计划列表页",path="html/planList",method=RequestMethod.GET)
	public String planBZList(){
		return ctrl+"/planList";
	}
	
	@RequiresPermissions("management/yearPlan#html/planEdit#get")
	@RequestMapping(name="年度计划编辑页",path="html/planEdit",method=RequestMethod.GET)
	public String planBZEdit(){
		return ctrl+"/planEdit";
	}
	
	@RequiresPermissions("management/yearPlan#html/planBZ#get")
	@RequestMapping(name="年度计划编制页",path="html/planBZ",method=RequestMethod.GET)
	public String planBZ(){
		return ctrl+"/planBZ";
	}
	@RequiresPermissions("management/yearPlan#html/edit#get")
	@RequestMapping(name="申报信息修改页",path="html/edit",method=RequestMethod.GET)
	public String edit(){
		return ctrl+"/edit";
	}
}
