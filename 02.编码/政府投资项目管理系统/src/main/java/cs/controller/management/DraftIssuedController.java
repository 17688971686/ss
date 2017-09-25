package cs.controller.management;

import java.text.ParseException;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import cs.common.ICurrentUser;
import cs.model.DomainDto.DraftIssuedDto;
import cs.service.interfaces.DraftIssuedService;

@Controller
@RequestMapping(name = "发文拟稿--审批流程", path = "management/draft")
public class DraftIssuedController {

	@Autowired
	DraftIssuedService draftIssuedService;
	@Autowired
	ICurrentUser currentUser;

	@RequiresPermissions("management/draft#id#get")
	@RequestMapping(name = "获取发文拟稿信息", path = "{id}",method=RequestMethod.GET)
	public @ResponseBody DraftIssuedDto getDraft(@PathVariable String id) throws ParseException {
		
		DraftIssuedDto draftIssuedDto = draftIssuedService.getDraftByTaskId(id);
		return draftIssuedDto;
	}	
	
	@RequiresPermissions("management/draft#id#post")
	@RequestMapping(name = "创建发文拟稿信息", path = "{id}",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody DraftIssuedDto draftIssuedDto,@PathVariable String id)  {		
		draftIssuedService.createDraft(draftIssuedDto,id);		
	}
	
}
