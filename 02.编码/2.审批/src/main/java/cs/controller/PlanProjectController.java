/*package cs.controller;
*//**
 * 年度计划项目库项目库
 *//*
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
@RequestMapping(name = "PlanProject", path = "planProject")
public class PlanProjectController {

	private String ctrlName = "planProject";
	
	// begin#html
		@RequiresPermissions("planProject#html/list#get")
		@RequestMapping(name = "�û��б�ҳ��", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}
	 
		// end#html
}
*/