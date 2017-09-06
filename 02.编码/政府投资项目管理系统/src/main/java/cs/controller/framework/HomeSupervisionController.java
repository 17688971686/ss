package cs.controller.framework;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeSupervisionController {
	private String ctrlName = "framework/homeSupervision";
	private static Logger logger = Logger.getLogger(HomeSupervisionController.class.getName());

	@RequestMapping(name = "在线监管登录", path = "/adminLoginSupervision")
	public String login() {

		return this.ctrlName + "/login_supervision";
	}

}
