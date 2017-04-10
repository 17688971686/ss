package cs.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.Response;
import cs.common.sysResource.SysResourceDto;
import cs.service.SysService;

@Controller
@RequestMapping(name = "ϵͳ��Դ", path = "sys")
public class SysController {
	@Autowired
	private SysService sysService;

	@RequiresPermissions("sys#resource#get")
	@RequestMapping(name = "��ȡϵͳ��Դ����", path = "resource", method = RequestMethod.GET)
	public @ResponseBody List<SysResourceDto> get(HttpServletRequest request) {
		List<SysResourceDto> ZTreeList = sysService.get();
		return ZTreeList;
	}

	
	@RequestMapping(name = "ϵͳ��ʼ��", path = "init", method = RequestMethod.GET)
	public @ResponseBody String init(HttpServletRequest request) {
		Response response = sysService.SysInit();
		if(response.isSuccess()){
			return "Init system success";
		}else{
			return "Init system fail";
		}
		
		
	}
}
