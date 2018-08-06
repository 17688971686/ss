package cs.codingPlatform.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.codingPlatform.service.CodingPlatformService;
import cs.common.ICurrentUser;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;


@Controller
@RequestMapping(name = "赋码平台", path = "coding")
public class CodingPlatformController {
	
	@Autowired 
	protected CodingPlatformService codingPlatformService;
	@Autowired
	private ICurrentUser currentUser;
	
	@RequestMapping(value = "/getAccessToken", method = RequestMethod.GET)
	@ResponseBody
	public void getAccessToken(HttpServletRequest request) {
		codingPlatformService.getAccessToken(request);
	}
	
	@RequestMapping(value = "/getShenBaoInfo", method = RequestMethod.POST)
	@ResponseBody
	public PageModelDto<ShenBaoInfo> getShenBaoInfo(HttpServletRequest request,@RequestParam(required = true) String todaytime,@RequestParam(required = true) String pageIndex) {
		return codingPlatformService.getShenBaoInfo(request,todaytime,pageIndex);
	}
	
}
