package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 前期计划前期费控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Preplanprefee", path = "preplanprefee")
public class PreplanprefeeController {
	private String ctrlName = "preplanprefee";
	
	/**
	 * 进入前期计划前期费页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("preplanprefee#html/list#get")
	@RequestMapping(name = "PreplanprefeeList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

}
