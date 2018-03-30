package cs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(name = "错误页面", path = "error")
public class ErrorController {
	private String ctrl = "framework/error";

	//@RequiresPermissions("error#404#get")
	@RequestMapping(name = "404页面", path = "404",method=RequestMethod.GET)
	public String page404() {
		return ctrl + "/404";
	}
	
	//@RequiresPermissions("error#401#get")
	@RequestMapping(name = "401页面", path = "401",method=RequestMethod.GET)
	public String page401() {
		return ctrl + "/401";
	}
	
	//@RequiresPermissions("error#500#get")
	@RequestMapping(name = "500页面", path = "500",method=RequestMethod.GET)
	public String page500() {
		return ctrl + "/500";
	}
}
