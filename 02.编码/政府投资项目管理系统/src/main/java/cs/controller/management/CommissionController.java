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
import cs.model.DomainDto.CommissionDto;
import cs.service.interfaces.CommissionService;


/**
 * @author Administrator
 * @Description 评审委托控制层
 */
@Controller
@RequestMapping(name = "后台管理--审批流程--评审委托", path = "management/proxy")
public class CommissionController {

	@Autowired
	CommissionService commissionService;
	@Autowired
	ICurrentUser currentUser;

	@RequiresPermissions("management/proxy#id#get")
	@RequestMapping(name = "获取评审委托信息", path = "{id}",method=RequestMethod.GET)
	public @ResponseBody CommissionDto getDraft(@PathVariable String id) throws ParseException {
		
		CommissionDto commissionDto = commissionService.getProxyByTaskId(id);
		return commissionDto;
	}	
	
	@RequiresPermissions("management/proxy#id#post")
	@RequestMapping(name = "创建评审委托信息", path = "{id}",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody CommissionDto commissionDto,@PathVariable String id)  {		
		commissionService.createProxy(commissionDto,id);		
	}

}
