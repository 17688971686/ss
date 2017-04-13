package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 审计决算资金控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Auditaccountsfunds", path = "auditaccountsfunds")
public class AuditaccountsfundsController {
	private String ctrlName = "auditaccountsfunds";
		
		/**
		 * 审计决算资金页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("auditaccountsfunds#html/list#get")
		@RequestMapping(name = "AuditaccountsfundsList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
