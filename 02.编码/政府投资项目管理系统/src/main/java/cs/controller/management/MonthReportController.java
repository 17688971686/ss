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
import cs.model.DomainDto.MonthReportDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.MonthReportService;



/**
 * @author Administrator
 * @Description 月报管理控制层
 */
@Controller
@RequestMapping(name = "后台管理--项目进度管理", path = "management/monthReport")
public class MonthReportController {
	private String ctrlName = "management/monthReport";
	
	@Autowired
	private MonthReportService monthReportService;
	
	@RequiresPermissions("management/monthReport##get")
	@RequestMapping(name = "获取月报信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<MonthReportDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<MonthReportDto> monthReports = monthReportService.get(odataObj);
		return monthReports;
	}
	
	@RequiresPermissions("management/monthReport##post")
	@RequestMapping(name = "保存月报信息",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  saveMonthReport(@RequestBody MonthReportDto monthReportDto){
		monthReportService.changeMonthReport(monthReportDto);
				
	}
	
	@RequiresPermissions("management/monthReport#html/list#get")
	@RequestMapping(name = "政府投资项目列表页面", path = "html/list", method = RequestMethod.GET)	
	public String list() {

		return this.ctrlName + "/list";
	}
	
	@RequiresPermissions("management/monthReport#html/list_SH#get")
	@RequestMapping(name = "社会投资列表页面", path = "html/list_SH", method = RequestMethod.GET)	
	public String list_SH() {

		return this.ctrlName + "/list_SH";
	}
	
	@RequiresPermissions("management/monthReport#html/details#get")
	@RequestMapping(name = "详情页面", path = "html/details", method = RequestMethod.GET)	
	public String details() {
		return this.ctrlName + "/details";
	}
	
	@RequiresPermissions("management/monthReport#html/edit#get")
	@RequestMapping(name = "修改页面", path = "html/edit", method = RequestMethod.GET)	
	public String changeDetails() {
		return this.ctrlName + "/edit";
	}
	
	@RequiresPermissions("management/monthReport#html/summary#get")
	@RequestMapping(name = "汇总页面", path = "html/summary", method = RequestMethod.GET)	
	public String summary() {
		return this.ctrlName + "/summary";
	}
}