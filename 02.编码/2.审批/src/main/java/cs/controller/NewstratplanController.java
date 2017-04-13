package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
/**
 * 新开工计划控制层
 * @author 常祥
 * @serialData 2017/4/10
 */
@Controller
@RequestMapping(name = "Newstartplan", path = "newstartplan")
public class NewstratplanController {
	private String ctrlName = "newstartplan";
	
	/**
	 * 进入新开工计划页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("newstartplan#html/list#get")
	@RequestMapping(name = "NewstartplanList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

}
