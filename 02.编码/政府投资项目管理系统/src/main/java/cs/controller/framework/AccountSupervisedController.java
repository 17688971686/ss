package cs.controller.framework;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.service.framework.UserService;

@Controller
@RequestMapping(name = "在线监管账户", path = "verifyNumSupervision")
public class AccountSupervisedController {

	@Autowired
	private UserService userService;
	
	@RequestMapping(name = "监管账户退出", path = "logout/{sys}", method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public   String logout(@PathVariable String sys) {
		userService.logout();
		String url="forward:/";
		
		if(sys!=null&&sys.equals("sysAdmin")){
			url="forward:/adminLoginSupervision";
		}
		return url;
	}
	
}
