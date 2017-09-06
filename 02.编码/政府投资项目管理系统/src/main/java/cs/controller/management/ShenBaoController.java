package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ShenBaoInfoService;

@Controller
@RequestMapping(name="后台管理--申报信息管理", path="management/shenbao")
public class ShenBaoController {
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	
	@RequiresPermissions("management/shenbao##get")
	@RequestMapping(name = "获取申报数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto>  shenbaoInfoDtos= shenBaoInfoService.get(odataObj);
		return shenbaoInfoDtos;
	}
	
	@RequiresPermissions("management/shenbao##post")
	@RequestMapping(name = "创建申报数据", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void create(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.createShenBaoInfo(dto,true);
	}
	
	@RequiresPermissions("management/shenbao##put")
	@RequestMapping(name = "更新申报数据", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.updateShenBaoInfo(dto);
	}
	
	@RequiresPermissions("management/shenbao#addProjectToLibrary#post")
	@RequestMapping(name = "项目纳入项目库", path = "addProjectToLibrary",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addProjectToLibrary(@RequestParam String shenbaoInfoId){
		shenBaoInfoService.addProjectToLibrary(shenbaoInfoId);
	}
	
	@RequiresPermissions("management/shenbao#updateProjectBasic#put")
	@RequestMapping(name = "更新项目基础信息", path = "updateProjectBasic",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateProjectBasic(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.updateProjectBasic(dto);
	}
	
	@RequiresPermissions("management/shenbao#updateState#post")
	@RequestMapping(name = "更新申报数据的审批状态（退文）", path = "updateState",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void updateState(@RequestBody TaskRecordDto taskRecordDto){
		shenBaoInfoService.updateShenBaoInfoState(taskRecordDto);
	}
	
}
