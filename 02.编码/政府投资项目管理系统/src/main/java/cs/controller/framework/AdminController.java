package cs.controller.framework;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.framework.User;
import cs.service.framework.UserService;

/**
 * @author Administrator
 *管理页控制器
 */
@Controller
@RequestMapping(name = "管理界面", path = "admin")
public class AdminController {
	private String ctrlName = "framework/admin";
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserService userService;
	

	@RequiresPermissions("admin#index#get")
	@RequestMapping(name = "首页", path = "index",method = RequestMethod.GET)
	public String index(Model model) {

		model.addAttribute("user", currentUser.getLoginName());
		model.addAttribute("userId", currentUser.getUserId());
		return ctrlName + "/index";
	}

	@RequiresPermissions("admin#welcome#get")
	@RequestMapping(name = "欢迎页", path = "welcome",method = RequestMethod.GET)
	public String welcome(Model model) {
		User user=userService.findUserByName( currentUser.getLoginName());
		if(user!=null){
			model.addAttribute("user", user.getLoginName());
			model.addAttribute("lastLoginDate", Util.formatDate( user.getLastLoginDate()));
		}
		return ctrlName + "/welcome";
	}
}
