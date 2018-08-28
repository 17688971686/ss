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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.OpinionDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.OpinionService;

@Controller
@RequestMapping(name = "配置管理--工作日管理", path = "work")
public class WorkdayController {

	@Autowired
	private OpinionService opinionService;

	@RequiresPermissions("week#deleteWork#post")
	@RequestMapping(name = "删除意见", path = "deleteWeek",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deleteOpin(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			opinionService.deleteOpins(ids);	
		}else{
			opinionService.deleteOpin(id);	
		}		
	}
	
	@RequiresPermissions("opin#editOpin#post")
	@RequestMapping(name = "编辑意见", path = "editOpin",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateOpin(@RequestBody OpinionDto opinDto)  {	
		opinionService.editOpin(opinDto);	
	}
	
	@RequiresPermissions("opin##get")	
	@RequestMapping(name = "获取常用意见", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<OpinionDto> getOpin(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<OpinionDto> opinionDtos = opinionService.getOpin(odataObj);
		return opinionDtos;
	}
	
	@RequiresPermissions("opin##post")
	@RequestMapping(name = "保存意见", path = "",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  saveOpin(@RequestBody OpinionDto opinionDto)  {		
		opinionService.saveUserOpin(opinionDto);	
	}
}
