package cs.controller.management;

import java.text.ParseException;
import java.util.Map;

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
import cs.service.interfaces.ShenBaoInfoService;


/**
 * @author Administrator
 * @Description 申报信息管理控制层
 */
@Controller
@RequestMapping(name="后台管理--申报信息管理", path="management/shenbao")
public class ShenBaoController {
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	
//	@RequiresPermissions("management/shenbao##get")
	@RequestMapping(name = "获取申报数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto>  shenbaoInfoDtos= shenBaoInfoService.get(odataObj);
		return shenbaoInfoDtos;
	}

	@RequestMapping(name = "获取计划下达数据", path = "/getPlanList",method=RequestMethod.POST)
	@ResponseBody
	@ResponseStatus(value = HttpStatus.CREATED)
	public Map getPlanList(@RequestBody Map map) throws ParseException {
		Map reMap = shenBaoInfoService.getPlanList(map);
		return reMap;
	}
	
//	@RequiresPermissions("management/shenbao##post")
	@RequestMapping(name = "创建申报数据", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void create(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.createShenBaoInfo(dto,true);
	}
	
//	@RequiresPermissions("management/shenbao#updateShenbao#post")
	@RequestMapping(name = "申报端更新申报数据", path = "updateShenbao",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateShenBaoInfo(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.updateShenBaoInfo(dto,false);
	}
	
//	@RequiresPermissions("management/shenbao#update#post")
	@RequestMapping(name = "管理端更新申报数据", path = "update",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.updateShenBaoInfo(dto,true);
	}
	
//	@RequiresPermissions("management/shenbao#addProjectToLibrary#post")
	@RequestMapping(name = "项目纳入项目库", path = "addProjectToLibrary",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void addProjectToLibrary(@RequestParam String shenbaoInfoId){
		shenBaoInfoService.addProjectToLibrary(shenbaoInfoId);
	}

//	@RequiresPermissions("management/shenbao#outProjectToLibrary#post")
	@RequestMapping(name = "项目纳出项目库", path = "outProjectToLibrary", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void outProjectToLibrary(@RequestBody String shenbaoInfoId){
		shenBaoInfoService.outProjectToLibrary(shenbaoInfoId);
	}
	
//	@RequiresPermissions("management/shenbao#updateProjectBasic#post")
	@RequestMapping(name = "更新项目基础信息", path = "updateProjectBasic",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateProjectBasic(@RequestBody ShenBaoInfoDto dto){
		shenBaoInfoService.updateProjectBasic(dto);
	}
	
//	@RequiresPermissions("management/shenbao#updateState#post")
	@RequestMapping(name = "更新申报数据的审批状态（退文）", path = "updateState",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void updateState(@RequestBody ShenBaoInfoDto shenBaoInfoDto){
		shenBaoInfoService.updateShenBaoInfoState(shenBaoInfoDto);
	}
	
}
