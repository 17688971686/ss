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
import cs.model.DomainDto.ApprovalDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ApprovalService;

@Controller
@RequestMapping(name = "后台管理--审批流程--评审报批", path = "management/approval")
public class ApprovalController {

	@Autowired
	ApprovalService approvalService;
	@Autowired
	ICurrentUser currentUser;

	@RequiresPermissions("management/approval##get")
	@RequestMapping(name = "获取评审报批信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ApprovalDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ApprovalDto> approvalDto = approvalService.get(odataObj);
		return approvalDto;
	}	
	
	@RequiresPermissions("management/approval##post")
	@RequestMapping(name = "保存评审报批信息", path = "",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody ApprovalDto approvalDto)  throws Exception{		
		try {
		approvalService.createDraft(approvalDto);	
		} catch (Exception e) {
			System.err.println("================="+e.getMessage());
		throw new IllegalArgumentException("评审金额填写错误:单位为：万元，最大到百亿。请核对后填写！");
	}
	
	}
}
