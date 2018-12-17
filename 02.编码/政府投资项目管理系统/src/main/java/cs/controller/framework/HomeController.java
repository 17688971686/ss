package cs.controller.framework;

import java.util.Date;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import cs.common.Util;
import cs.domain.framework.User;


/**
 * @author Administrator
 *登录控制器
 */
@Controller
public class HomeController {
	private String ctrlName = "framework/home";

	@RequestMapping(name = "登录", path = "/adminLogin",method = RequestMethod.GET)
	public String login() {
		return this.ctrlName + "/login";
	}

	@RequestMapping(name = "登录", path = "/adminLoginIndex",method = RequestMethod.GET)
	public String loginIndex() {

		return this.ctrlName + "/indexLogin";
	}
}
