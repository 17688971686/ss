package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 部门项目查询控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Departmentalprojectquery", path = "departmentalprojectquery")
public class DepartmentalprojectqueryController {
	private String ctrlName = "departmentalprojectquery";
	
	/**
	 * 进入部门项目查询页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("departmentalprojectquery#html/list#get")
	@RequestMapping(name = "DepartmentalprojectqueryList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

}
