package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 问题协调控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Problemcoordinition", path = "problemcoordinition")
public class ProblemcoordinitionController {
	private String ctrlName = "problemcoordinition";
		
		/**
		 * 进入问题协调页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("problemcoordinition#html/list#get")
		@RequestMapping(name = "ProblemcoordinitionList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
