package cs.controller;
/**
 * 政策法规控制器
 */


import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "Policy", path = "policy")
public class PolicyController {
	private String ctrlName = "policy";
	
	
	// begin#html
	@RequiresPermissions("policy#html/list#get")
	@RequestMapping(name = "policyList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
	
}
