package cs.controller.shenbaoAdmin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "管理中心", path = "managerCenter")
public class ManagerCenterController {
	private String ctrlName = "shenbaoAdmin/managerCenter";

	
	
	@RequestMapping(name = "管理中心页面", path = "html/tmpl",method=RequestMethod.GET)
	public String managerCenter() {
		return this.ctrlName + "/tmpl";
	}
	
	
}
