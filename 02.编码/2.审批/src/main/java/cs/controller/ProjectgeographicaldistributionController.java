package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 项目地理分布控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Projectgeographicaldistribution", path = "projectgeographicaldistribution")
public class ProjectgeographicaldistributionController {
	private String ctrlName = "projectgeographicaldistribution";
	/**
	 * 进入 项目地理分布页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("projectgeographicaldistribution#html/list#get")
	@RequestMapping(name = "ProjectgeographicaldistributionList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
}
