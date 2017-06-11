package cs.controller.shenbaoAdmin;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.DomainDto.MonthReportDto;
import cs.service.interfaces.MonthReportService;


@Controller
@RequestMapping(name = "月报管理", path = "shenbaoAdmin/projectMonthReport")
public class ProjectMonthReportController {
	//依赖注入服务层
	@Autowired
	private MonthReportService monthReportService;
	
	private String ctrlName = "shenbaoAdmin/projectMonthReport";
	
	
	
	@RequestMapping(name = "保存月报信息",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  saveMonthReport(@RequestBody MonthReportDto monthReportDto){
		monthReportService.saveMonthReport(monthReportDto);
				
	}
	
	//begin#html
	
	//@RequiresPermissions("projectMonthReport#html/list#get")
	@RequestMapping(name = "项目列表页", path = "html/list",method=RequestMethod.GET)
	public String index() {
		return this.ctrlName + "/list";
	}
	
	
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
	
	@RequestMapping(name = "月报信息填写页面", path = "html/fillInfo",method=RequestMethod.GET)
	public String fillInfo()  {
		
		return this.ctrlName + "/fillInfo";
	}
	
	@RequestMapping(name = "项目信息", path = "html/projectInfo",method=RequestMethod.GET)
	public String projectInfo()  {
		
		return this.ctrlName + "/projectInfo";
	}
}
