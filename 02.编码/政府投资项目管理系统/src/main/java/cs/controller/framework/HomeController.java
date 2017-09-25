package cs.controller.framework;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	private String ctrlName = "framework/home";

	@RequestMapping(name = "登录", path = "/adminLogin")
	public String login() {

		return this.ctrlName + "/login";
	}

}
