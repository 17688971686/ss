package cs.controller.shenbao;


import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(name = "申报", path = "shenbao")
public class ShenBaoHomeController {
	private String ctrlName = "shenbao/home";
	private static Logger logger = Logger.getLogger(ShenBaoHomeController.class.getName());

	@RequestMapping(name = "首页", path = "/home")
	public String index() {

		return this.ctrlName + "/index";
	}
}
