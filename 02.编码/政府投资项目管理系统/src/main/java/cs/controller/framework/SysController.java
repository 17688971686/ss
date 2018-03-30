package cs.controller.framework;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.BasicDataConfig;
import cs.common.Response;
import cs.common.sysResource.SysResourceDto;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.SysConfigDto;
import cs.service.common.BasicDataService;
import cs.service.framework.SysService;

@Controller
@RequestMapping(name = "系统资源", path = "sys")
public class SysController {
	@Value("${env}")
	private String env;
	@Autowired
	private SysService sysService;
	@Autowired
	private BasicDataService basicDataService;
	
	private String ctrl="management/sysConfig";

	@RequiresPermissions("sys#resource#get")
	@RequestMapping(name = "获取系统资源数据", path = "resource", method = RequestMethod.GET)
	public @ResponseBody List<SysResourceDto> get(HttpServletRequest request) {
		List<SysResourceDto> ZTreeList = sysService.getSysResources();
		return ZTreeList;
	}
	
	@RequiresPermissions("sys#create#post")
	@RequestMapping(name = "设置task签收人", path = "create", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public  void create(@RequestBody List<SysConfigDto> sysConfigDtos) {		
		sysConfigDtos.forEach(x->{
			SysConfigDto sysConfigDto=new SysConfigDto();
			sysConfigDto.setId(UUID.randomUUID().toString());
			sysConfigDto.setConfigType(BasicDataConfig.taskType);
			sysConfigDto.setConfigName(x.getConfigName());
			sysConfigDto.setConfigValue(x.getConfigValue());
			sysConfigDto.setEnable(x.getEnable());
			sysService.createTaskUser(sysConfigDto);
		});
		
	}
	
	@RequiresPermissions("sys#getSysConfigs#get")
	@RequestMapping(name = "获取所有的系统配置信息", path = "getSysConfigs", method = RequestMethod.GET)
	public @ResponseBody List<SysConfigDto> initUser() {
		List<SysConfigDto> list = sysService.getSysConfigs();
		return list;
				
	}
	
	@RequiresPermissions("sys#getSysConfig#get")
	@RequestMapping(name = "获取单个系统配置信息", path = "getSysConfig", method = RequestMethod.GET)
	public @ResponseBody SysConfigDto getSysConfig(@RequestParam String configName) {
		SysConfigDto dto = sysService.getSysConfig(configName);
		return dto;
	}
	
	@RequestMapping(name = "系统初始化", path = "init", method = RequestMethod.GET)
	public @ResponseBody String init(HttpServletRequest request) {
		String description = null;
		List<BasicDataDto> initType = basicDataService.getByIdentity("initType");
		if(initType.size() >0){
			for (BasicDataDto basicDataDto : initType) {
				if(basicDataDto.getId().equals("initType")){
					description = basicDataDto.getDescription();
				}
			}
		}
		if(env.equals("debug") && !"1".equals(description)){
			Response response = sysService.SysInit();
			if(response.isSuccess()){
				return "Init system success";
			}else{
				return "Init system fail";
			}				
		}else{
			return "can not init sys！";
		}
	}
	
	@RequestMapping(name = "基础数据初始化", path = "initBasicData", method = RequestMethod.GET)
	public @ResponseBody String initBasicData(HttpServletRequest request) {
		String description = null;
		List<BasicDataDto> initType = basicDataService.getByIdentity("initType");
		if(initType.size() >0){
			for (BasicDataDto basicDataDto : initType) {
				if(basicDataDto.getId().equals("initType")){
					description = basicDataDto.getDescription();
				}
			}
		}
		
		if(env.equals("debug") && !"1".equals(description)){
			Response response = sysService.SysInitBasicData();
			if(response.isSuccess()){
				return "Init basicData success";
			}else{
				return "Init basicData fail";
			}	
		}else{
			return "can not init basicData！";
		}
	}
	//begin#html
	@RequiresPermissions("sys#html/index#get")
	@RequestMapping(name = "系统配置主页", path = "html/index", method = RequestMethod.GET)
	public String index(){
		return ctrl+"/index";
	}
}
