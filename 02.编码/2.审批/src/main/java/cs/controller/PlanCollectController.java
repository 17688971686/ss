/*package cs.controller;
*//**
 * 年度计划汇总控制器
 *//*
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
@RequestMapping(name = "PlanCollect", path = "planCollect")
public class PlanCollectController {

	private String ctrlName = "planCollect";
	
	// begin#html
		@RequiresPermissions("planCollect#html/list#get")
		@RequestMapping(name = "�û��б�ҳ��", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}
	 
		// end#html
}
*/