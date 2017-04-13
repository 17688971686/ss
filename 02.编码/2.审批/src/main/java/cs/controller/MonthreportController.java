package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 月报控制层
 * @author 常祥
 * @serialData 2017/4/10
 */
@Controller
@RequestMapping(name = "Monthreport", path = "monthreport")
public class MonthreportController {
	private String ctrlName = "monthreport";
		
		/**
		 * 进入月报页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("monthreport#html/list#get")
		@RequestMapping(name = "MonthreportList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
