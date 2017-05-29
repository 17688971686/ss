package cs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(name = "错误页面", path = "error")
public class ErrorController {
	private String ctrl = "framework/error";

	@RequestMapping(name = "404页面", path = "404")
	public String page404() {
		return ctrl + "/404";
	}
	
	@RequestMapping(name = "401页面", path = "401")
	public String page401() {
		return ctrl + "/401";
	}
	
	@RequestMapping(name = "500页面", path = "500")
	public String page500() {
		return ctrl + "/500";
	}
}
