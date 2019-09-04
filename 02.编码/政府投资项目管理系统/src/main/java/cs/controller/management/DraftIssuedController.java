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
import cs.common.ICurrentUser;
import cs.model.PageModelDto;
import cs.model.DomainDto.DraftIssuedDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.DraftIssuedService;


/**
 * @author Administrator
 * @Description 发文拟稿控制层
 */
@Controller
@RequestMapping(name = "后台管理--审批流程--发文拟稿", path = "management/draft")
public class DraftIssuedController {

	@Autowired
	DraftIssuedService draftIssuedService;
	@Autowired
	ICurrentUser currentUser;

//	@RequiresPermissions("management/draft##get")
	@RequestMapping(name = "获取发文拟稿信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<DraftIssuedDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<DraftIssuedDto> draftDto = draftIssuedService.get(odataObj);
		return draftDto;
		
	}	
	
//	@RequiresPermissions("management/draft##post")
	@RequestMapping(name = "保存发文拟稿信息", path = "",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody DraftIssuedDto draftIssuedDto)  {		
		draftIssuedService.createDraft(draftIssuedDto);		
	}
	
}
