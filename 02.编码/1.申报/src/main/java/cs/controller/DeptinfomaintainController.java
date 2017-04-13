package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 部门信息管理控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Deptinfomaintain", path = "deptinfomaintain")
public class DeptinfomaintainController {
	private String ctrlName = "deptinfomaintain";
		
		/**
		 * 进入部门信息管理页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("deptinfomaintain#html/list#get")
		@RequestMapping(name = "DeptinfomaintainList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
