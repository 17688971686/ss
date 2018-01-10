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
import cs.model.DomainDto.ApprovalDto;
import cs.service.interfaces.ApprovalService;

@Controller
@RequestMapping(name = "后台管理--审批流程--评审报批", path = "management/approval")
public class ApprovalController {

	@Autowired
	ApprovalService approvalService;
	@Autowired
	ICurrentUser currentUser;

	@RequiresPermissions("management/approval#id#get")
	@RequestMapping(name = "获取评审报批信息", path = "{id}",method=RequestMethod.GET)
	public @ResponseBody ApprovalDto getDraft(@PathVariable String id) throws ParseException {
		
		ApprovalDto approvalDto = approvalService.getDraftByTaskId(id);
		return approvalDto;
	}	
	
	@RequiresPermissions("management/approval#id#post")
	@RequestMapping(name = "创建评审报批信息", path = "{id}",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody ApprovalDto approvalDto,@PathVariable String id)  {		
		approvalService.createDraft(approvalDto,id);		
	}
}
