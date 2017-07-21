package cs.controller.management;

import java.text.ParseException;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.ICurrentUser;
import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="单位管理",path="management/userUnit")
public class UserUnitController {
	private String ctrlName = "management/userUnit";
	
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	ICurrentUser currentUser;
	
	@RequiresPermissions("management/userUnit##get")
	@RequestMapping(name = "获取用户单位信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> getUserUnits(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<UserUnitInfoDto> userUnitInfoDtos = userUnitInfoService.get(odataObj);
		return userUnitInfoDtos;
	}
}
