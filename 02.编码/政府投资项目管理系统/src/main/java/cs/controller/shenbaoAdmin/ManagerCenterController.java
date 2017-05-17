package cs.controller.shenbaoAdmin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @Description: 管理中心控制层 
 * @author: cx
 * @Date：2017年5月9日
 * @version：0.1
 */
@Controller
@RequestMapping(name = "管理中心", path = "managerCenter")
public class ManagerCenterController {
	private String ctrlName = "shenbaoAdmin/managerCenter";

	
	/**
	 * @Description：跳转到主页面（管理中心）
	 * @author： cx
	 * @Date： 2017年5月9日
	 * @version: 0.1
	 */
	@RequestMapping(name = "管理中心页面", path = "html/tmpl",method=RequestMethod.GET)
	public String managerCenter() {
		return this.ctrlName + "/tmpl";
	}
	
	
}
