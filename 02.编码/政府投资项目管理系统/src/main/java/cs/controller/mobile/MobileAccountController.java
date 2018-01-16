package cs.controller.mobile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.MobileResponse;
import cs.model.framework.UserDto;
import cs.controller.mobile.MobileUserService;

@Controller
@RequestMapping(name = "手机账户", path = "mobile/account")
public class MobileAccountController {

	@Autowired
	private MobileUserService userService;
	
	@RequestMapping(name = "手机登录", path = "login", method = RequestMethod.POST)
	public @ResponseBody MobileResponse post(@RequestBody UserDto userDto) {
		String roleName = "建设单位";
		/*if("manage".equals(role)){
			roleName = "管理员";
		}else if("unit".equals(role)){
			roleName = "建设单位";
		}*/
		MobileResponse loginResult= userService.Login(userDto.getLoginName(), userDto.getPassword(), roleName);
		
		return loginResult;
	}
	
	/*@RequestMapping(name = "手机退出", path = "logout/{sys}", method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public   String logout(@PathVariable String sys) {
		userService.logout();
		String url="forward:/";
		
		if(sys!=null&&sys.equals("sysAdmin")){
			url="forward:/adminLogin";
		}
		return url;
	}*/
}
