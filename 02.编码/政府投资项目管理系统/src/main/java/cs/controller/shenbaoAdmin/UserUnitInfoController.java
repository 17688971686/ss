package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.ICurrentUser;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name = "用户单位信息", path = "shenbaoAdmin/userUnitInfo")
public class UserUnitInfoController {
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	//@RequiresPermissions("shenbaoAdmin/userUnitInfo##get")	
	@RequestMapping(name = "获取当前用户的单位数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> get(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("userName");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getLoginName());
		return userUnitInfoService.get(odataObj);
	}
	
	//@RequiresPermissions("shenbaoAdmin/userUnitInfo##post")	
	@RequestMapping(name = "保存当前用户的单位数据", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public @ResponseBody void post(@RequestBody UserUnitInfoDto userUnitInfoDto)  {
		
		 userUnitInfoService.save(currentUser.getLoginName(),userUnitInfoDto);
	}
}
