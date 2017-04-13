package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 项目月报控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Projectmonthreport", path = "projectmonthreport")
public class ProjectmonthreportController {
	private String ctrlName = "projectmonthreport";
		
		/**
		 * 进入项目月报页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("projectmonthreport#html/list#get")
		@RequestMapping(name = "ProjectmonthreportList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
