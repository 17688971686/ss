package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 委托审计控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Commissionaudit", path = "commissionaudit")
public class CommissionauditController {
	private String ctrlName = "commissionaudit";
		
		/**
		 * 进入委托审计页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("commissionaudit#html/list#get")
		@RequestMapping(name = "CommissionauditList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
