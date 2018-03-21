package cs.controller.framework;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "修改密码", path = "changePassword")
public class ChangePassword {
	
	private String ctrlName = "framework/home";
	
	@RequestMapping(name = "后台管理端修改密码", path = "background",method = RequestMethod.GET)
	public String background(Model model) {
		return ctrlName + "/changePwd";
	}
	
	@RequestMapping(name = "建设申报端修改密码", path = "frontDesk",method = RequestMethod.GET)
	public String frontDesk(Model model) {
		return ctrlName + "/changePwdQ";
	}
	

}
