package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
/**
 * 项目全流程控制层
 * @author 常祥
 * @serialData 2017/4/10
 */
@Controller
@RequestMapping(name = "Projectprocess", path = "projectprocess")
public class ProjectprocessController {
	private String ctrlName = "projectprocess";
	
	/**
	 * 进入项目全流程页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("projectprocess#html/list#get")
	@RequestMapping(name = "ProjectprocessList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

}
