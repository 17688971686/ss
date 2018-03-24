package cs.controller.framework;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.Response;
import cs.domain.framework.User;
import cs.model.framework.UserDto;
import cs.service.framework.UserService;

@Controller
@RequestMapping(name = "账户管理", path = "account")
public class AccountController {
	private String ctrlName = "framework/account";

	@Autowired
	private UserService userService;
	
	@RequestMapping(name = "登录", path = "login", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public @ResponseBody Response post(@RequestBody UserDto userDto,@RequestParam String role){
		
		Response loginResult= userService.Login(userDto.getLoginName(), userDto.getPassword(), role);
		
		return loginResult;
	}
	
	
	@RequestMapping(name = "登录", path = "getSs", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public @ResponseBody Response getSs(HttpServletRequest request,@RequestParam String role){
		HttpSession session = ((HttpServletRequest)request).getSession();
		Response loginResult = null;
		User user = (User) session.getAttribute("riseUser");
		if(user != null){
			loginResult= userService.DandianLogin(user.getLoginName(), user.getPassword(), role);
		}
		return loginResult;
	}
	
	@RequestMapping(name = "退出", path = "logout/{sys}", method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public String logout(@PathVariable String sys,HttpServletRequest request) {
		HttpSession session = ((HttpServletRequest)request).getSession();
		session.setAttribute("riseUser","");
		userService.logout();
		String url="forward:/index";
		
		if(sys!=null&&sys.equals("sysAdmin")){
			url="forward:/adminLogin";
		}
		return url;
	}
	
	@RequestMapping(name = "修改密码", path = "password", method = RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.OK)
	public  @ResponseBody Response password(@RequestBody String password) {
		userService.changePwd(password);
		Response response=new Response();
		response.setSuccess(true);
		return response;
	}
	

	// begin#html
	@RequestMapping(name = "修改密码页面", path = "html/changePwd", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/changePwd";
	}
	
	@RequestMapping(name = "前端修改密码页面", path = "html/changePwdQ", method = RequestMethod.GET)
	public String changePwdQ() {
		return ctrlName + "/changePwdQ";
	}

	// end#html
}
