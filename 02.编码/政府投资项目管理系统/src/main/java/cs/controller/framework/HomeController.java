package cs.controller.framework;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
