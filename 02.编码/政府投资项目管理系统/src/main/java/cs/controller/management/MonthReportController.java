package cs.controller.management;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;



@Controller
@RequestMapping(name = "项目进度管理", path = "management/monthReport")
public class MonthReportController {
	private String ctrlName = "management/monthReport";
	
	
	
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
}