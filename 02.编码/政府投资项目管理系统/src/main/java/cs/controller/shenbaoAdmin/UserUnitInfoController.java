package cs.controller.shenbaoAdmin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.ICurrentUser;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name = "用户单位信息", path = "shenbaoAdmin/userUnitInfo")
public class UserUnitInfoController {
	@Autowired
	ICurrentUser currentUser;
	@Autowired
	UserUnitInfoService userUnitInfoService;
	//@RequiresPermissions("shenbaoAdmin/userUnitInfo##get")	
	@RequestMapping(name = "获取当前用户的单位数据", path = "", method = RequestMethod.GET)
	public @ResponseBody UserUnitInfoDto get()  {
		
		return userUnitInfoService.getByUserName(currentUser.getLoginName());
	}
}
