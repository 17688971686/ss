package cs.controller;

/**
 * 办事指南控制器
 */

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "WorkGuide", path = "workGuide")
public class WorkGuideController {
	private String ctrlName = "workGuide";
	
	
	// begin#html
	@RequiresPermissions("workGuide#html/list#get")
	@RequestMapping(name = "workGuideList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
	
}
