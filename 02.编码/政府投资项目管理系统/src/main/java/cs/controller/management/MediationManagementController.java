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
import cs.model.DomainDto.MediationUnitDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.MediationUnitService;


@Controller
@RequestMapping(name="中介单位管理",path="management/mediationManagement")
public class MediationManagementController {
	private String ctrlName = "management/mediationManagement";
	private static Logger logger = Logger.getLogger(MediationManagementController.class.getName());
	@Autowired
	private MediationUnitService mediationUnitService;
	
	@RequestMapping(name = "获取中介单位信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<MediationUnitDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<MediationUnitDto> ropertyDtos = mediationUnitService.get(odataObj);		
		return ropertyDtos;
	}
	@RequestMapping(name = "更新中介单位信息", path = "", method = RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody MediationUnitDto dto) {
		mediationUnitService.update(dto,dto.getId());
	}
	@RequestMapping(name = "创建中介单位信息", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody MediationUnitDto dto) {
		mediationUnitService.create(dto);
	}
	@RequestMapping(name = "删除中介单位信息", path = "", method = RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			mediationUnitService.deletes(ids);
		} else {
			mediationUnitService.delete(id);
		}
	} 
	@RequestMapping(name = "中介单位编辑页面", path = "html/mediationUnitDetails", method = RequestMethod.GET)	
	public String mediationUnitDetails() {
       
		return this.ctrlName + "/mediationUnitDetails";
	}
	@RequestMapping(name = "中介单位列表页面", path = "html/mediationUnitList", method = RequestMethod.GET)	
	public String mediationUnitList() {
		return this.ctrlName + "/mediationUnitList";
	}
	@RequestMapping(name = "中介单位编辑页面", path = "html/mediationUnitChangeDetails", method = RequestMethod.GET)	
	public String mediationUnitChangeDetails() {
       
		return this.ctrlName + "/mediationUnitEdit";
	}
}
