package cs.controller.shenbaoAdmin;

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
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name = "申报端--用户单位信息", path = "shenbaoAdmin/userUnitInfo")
public class ShenBaoAdminUserUnitInfoController {
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;

	@RequiresPermissions("shenbaoAdmin/userUnitInfo#userName#get")
	@RequestMapping(name = "获取用户的单位数据", path = "userName", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> getProjectUnit(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		return userUnitInfoService.get(odataObj);
	}
	
	@RequiresPermissions("shenbaoAdmin/userUnitInfo##get")	
	@RequestMapping(name = "获取当前登录用户的单位数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> getUserUnit(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("userName");
		filterItem.setOperator("eq");		
		filterItem.setValue(currentUser.getUserId());
		odataObj.getFilter().add(filterItem);
		return userUnitInfoService.get(odataObj);
	}
	
	@RequiresPermissions("shenbaoAdmin/userUnitInfo##post")	
	@RequestMapping(name = "保存当前用户的单位数据", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public @ResponseBody void post(@RequestBody UserUnitInfoDto userUnitInfoDto){
		 userUnitInfoService.save(userUnitInfoDto.getUnitName(),userUnitInfoDto);
	}
}
