package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.UnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UnitInfoService;

/**
 * @Description: 单位管理控制层
 * @author: cx
 * @Date：2017年5月17日
 * @version：0.1
 */
@Controller
@RequestMapping(name = "单位管理",path = "unitManagement")
public class UnitManagementController {
	private String ctrlName = "management/monthReport/unitManagement";	
	private static Logger logger = Logger.getLogger(UnitManagementController.class.getName());
	
	@Autowired
	private UnitInfoService unitInfoService;
	
	@RequestMapping(name = "获取单位信息", path = "",method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UnitInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<UnitInfoDto> unitInfoDtos = unitInfoService.get(odataObj);		
		return unitInfoDtos;
	}
	
	@RequestMapping(name = "删除单位信息", path = "",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			unitInfoService.deleteUnitInfos(ids);	
		}else{
			unitInfoService.deleteUnitInfo(id);	
		}		
		
	}
	
	@RequestMapping(name = "更新单位信息", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  update(@RequestBody UnitInfoDto unitInfoDto){
		unitInfoService.updateUnitInfo(unitInfoDto);		
	}
	
	@RequestMapping(name = "创建单位信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  create(@RequestBody UnitInfoDto unitInfoDto){		
		unitInfoService.createUnitInfo(unitInfoDto);		
	}
	
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequestMapping(name = "编辑页", path = "html/edit")
	public String edit() {
		return this.ctrlName + "/edit";
	}

}
