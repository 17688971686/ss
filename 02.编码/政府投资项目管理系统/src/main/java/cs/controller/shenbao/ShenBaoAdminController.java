package cs.controller.shenbao;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(name = "申报管理端", path = "shenbaoAdmin")
public class ShenBaoAdminController {
	private String ctrlName = "shenbaoAdmin/home";
	private static Logger logger = Logger.getLogger(ShenBaoAdminController.class.getName());

	@RequestMapping(name = "首页", path = "/home")
	public String index() {

		return this.ctrlName + "/index";
	}
}
