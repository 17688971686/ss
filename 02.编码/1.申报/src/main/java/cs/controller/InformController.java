package cs.controller;



import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "Inform", path = "inform")
public class InformController {
	private String ctrlName = "inform";
	
	
	// begin#html
	@RequiresPermissions("inform#html/list#get")
	@RequestMapping(name = "InformList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
	
}
