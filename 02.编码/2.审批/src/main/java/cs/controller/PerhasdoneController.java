package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 个人已办控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Perhasdone", path = "perhasdone")
public class PerhasdoneController {
	private String ctrlName = "perhasdone";
		
		/**
		 * 进入个人已办页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("perhasdone#html/list#get")
		@RequestMapping(name = "PerhasdoneList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}
