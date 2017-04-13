package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
/**
 * 温馨提示控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Tips", path = "tips")
public class TipsController {
	private String ctrlName = "tips";
	
	/**
	 * 进入温馨提示页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("tips#html/list#get")
	@RequestMapping(name = "TipsList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

}
