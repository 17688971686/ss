package cs.controller.framework;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeSupervisionController {
	private String ctrlName = "framework/homeSupervision";

	@RequestMapping(name = "在线监管登录", path = "/adminLoginSupervision",method = RequestMethod.GET)
	public String login() {

		return this.ctrlName + "/login_supervision";
	}

}
