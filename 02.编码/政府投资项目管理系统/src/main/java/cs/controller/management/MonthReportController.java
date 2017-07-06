package cs.controller.management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.DomainDto.MonthReportDto;
import cs.service.interfaces.MonthReportService;



@Controller
@RequestMapping(name = "项目进度管理", path = "management/monthReport")
public class MonthReportController {
	private String ctrlName = "management/monthReport";
	
	@Autowired
	private MonthReportService monthReportService;
	
	@RequestMapping(name = "保存月报信息",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  saveMonthReport(@RequestBody MonthReportDto monthReportDto){
		monthReportService.changeMonthReport(monthReportDto);
				
	}
	
	//@RequiresPermissions("management/monthReport#html/list#get")
	@RequestMapping(name = "列表页面", path = "html/list", method = RequestMethod.GET)	
	public String list() {

		return this.ctrlName + "/list";
	}
	//@RequiresPermissions("management/monthReport#html/details#get")
	@RequestMapping(name = "详情页面", path = "html/details", method = RequestMethod.GET)	
	public String details() {

		return this.ctrlName + "/details";
	}
	
	//@RequiresPermissions("management/monthReport#html/details#get")
		@RequestMapping(name = "修改页面", path = "html/changeDetails", method = RequestMethod.GET)	
		public String changeDetails() {

			return this.ctrlName + "/changeDetails";
		}
}