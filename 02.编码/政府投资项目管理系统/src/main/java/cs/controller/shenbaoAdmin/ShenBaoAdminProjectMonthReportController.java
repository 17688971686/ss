package cs.controller.shenbaoAdmin;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.ICurrentUser;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.MonthReportService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.UserUnitInfoService;


@Controller
@RequestMapping(name = "申报端--月报管理", path = "shenbaoAdmin/projectMonthReport")
public class ShenBaoAdminProjectMonthReportController {
	//依赖注入服务层
	@Autowired
	private MonthReportService monthReportService;
	@Autowired
	private ProjectService ProjectService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private ICurrentUser currentUser;
	
	private String ctrlName = "shenbaoAdmin/projectMonthReport";
	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport##get")
	@RequestMapping(name = "获取单位项目月报信息", path = "unitProject",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getUnitProject(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("unitName");
		filterItem.setOperator("eq");
		filterItem.setValue(userUnitInfo.getId());
		odataObj.getFilter().add(filterItem);
		PageModelDto<ProjectDto> projectDtos = ProjectService.get(odataObj);
		return projectDtos;
	}
	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport##get")
	@RequestMapping(name = "获取月报信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<MonthReportDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<MonthReportDto> monthReports = monthReportService.get(odataObj);
		return monthReports;
	}
	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport##post")
	@RequestMapping(name = "保存月报信息",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void saveMonthReport(@RequestBody MonthReportDto monthReportDto){
		monthReportService.saveMonthReport(monthReportDto);
	}
	
	//begin#html	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport#html/list#get")
	@RequestMapping(name = "项目列表页", path = "html/list",method=RequestMethod.GET)
	public String index() {
		return this.ctrlName + "/list";
	}
	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport#html/selectMonth#get")
	@RequestMapping(name = "月份选择页面", path = "html/selectMonth",method=RequestMethod.GET)
	public String fill(Model model) {
		List<String> years=new ArrayList<>();
		Integer currentYear=Integer.parseInt(new SimpleDateFormat("yyyy").format(new Date()));
		for (int i = 0; i < 5; i++) {
			years.add(Integer.toString(currentYear-i));
		}		
		model.addAttribute("years", years);
		model.addAttribute("currentYear", Integer.toString(currentYear));
		return this.ctrlName + "/selectMonth";
	}
	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport#html/fillInfo#get")
	@RequestMapping(name = "月报信息填写页面", path = "html/fillInfo",method=RequestMethod.GET)
	public String fillInfo()  {
		
		return this.ctrlName + "/fillInfo";
	}
	
//	@RequiresPermissions("shenbaoAdmin/projectMonthReport#html/projectInfo#get")
//	@RequestMapping(name = "项目信息页面", path = "html/projectInfo",method=RequestMethod.GET)
//	public String projectInfo()  {
//		
//		return this.ctrlName + "/projectInfo";
//	}
	
	@RequiresPermissions("shenbaoAdmin/projectMonthReport#html/details#get")
	@RequestMapping(name = "月报信息页面", path = "html/details",method=RequestMethod.GET)
	public String details()  {
		
		return this.ctrlName + "/details";
	}
}
