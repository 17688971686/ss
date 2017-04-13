package cs.controller;

/**
 * 常用表格控制器
 */

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "Form", path = "form")
public class FormController {
	private String ctrlName = "form";
	
	
	// begin#html
	@RequiresPermissions("form#html/list#get")
	@RequestMapping(name = "formList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
	
}
