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

@Controller
@RequestMapping(name = "监管管理界面", path = "adminSupervision")
public class AdminSupervisionController {
	private String ctrlName = "framework/adminSupervision";
	
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserService userService;
	

//	@RequiresPermissions("adminSupervision#index#get")
	@RequestMapping(name = "监管首页", path = "index",method = RequestMethod.GET)
	public String index(Model model) {

		model.addAttribute("user", currentUser.getLoginName());
		return ctrlName + "/index_supervision";
	}

//	@RequiresPermissions("adminSupervision#welcome_supervision#get")
	@RequestMapping(name = "在线监管欢迎页", path = "welcome_supervision",method = RequestMethod.GET)
	public String welcome(Model model) {
		User user=userService.findUserByName( currentUser.getLoginName());
		if(user!=null){
			model.addAttribute("user", user.getLoginName());
			model.addAttribute("lastLoginDate", Util.formatDate( user.getLastLoginDate()));
		}
		return ctrlName + "/welcome_supervision";
	}
}
