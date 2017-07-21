package cs.controller.shenbaoAdmin;

import java.util.Date;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import cs.common.ICurrentUser;
import cs.common.Util;

@Controller
@RequestMapping(name = "申报管理端", path = "shenbaoAdmin")
public class ShenBaoAdminController {
	@Autowired
	private ICurrentUser currentUser;
	
	private String ctrlName = "shenbaoAdmin/home";
	
	@RequestMapping(name = "首页", path = "")
	public String index(Model model) {				
		
		Date date=new Date();
		String dateStr=String.format("%s %s",Util.formatDate(date, "yyyy/MM/dd"),Util.getDay(date));
		model.addAttribute("userName", currentUser.getLoginName());
		model.addAttribute("date", dateStr);		
		return this.ctrlName + "/index";
	}
	
	@RequiresPermissions("shenbaoAdmin#html/welcome#get")
	@RequestMapping(name = "管理中心页面", path = "html/welcome",method=RequestMethod.GET)
	public String welcome(Model model) {
		String lastLoginDate="";
		if(currentUser!=null){
			lastLoginDate= Util.formatDate( currentUser.getLastLoginDate());
			model.addAttribute("lastLoginDate", lastLoginDate);
		}	
		
		return this.ctrlName + "/welcome";
	}
}
