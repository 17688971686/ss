/*package cs.controller;
*//**
 * 年度计划编制控制器
 *//*
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
@RequestMapping(name = "PlanFormation", path = "planFormation")
public class PlanFormationController {

	private String ctrlName = "planFormation";
	
	// begin#html
		@RequiresPermissions("planFormation#html/list#get")
		@RequestMapping(name = "�û��б�ҳ��", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}
	 
		// end#html
}
*/