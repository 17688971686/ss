package cs.controller.shenbaoAdmin;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import cs.common.ICurrentUser;
import cs.common.ValidationSQLUtil;
import cs.domain.UserUnitInfo;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;
import cs.service.interfaces.UserUnitInfoService;
/**
 * @author Administrator
 * @Description 申报端建设单位管理控制层
 */
@Controller
@RequestMapping(name = "申报端--用户单位信息", path = "shenbaoAdmin/userUnitInfo")
public class ShenBaoAdminUserUnitInfoController {
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private UserService userService;
//	@RequiresPermissions("shenbaoAdmin/userUnitInfo#id#get")
	
	@RequestMapping(name = "获取用户的单位数据", path = "id", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> getProjectUnit(HttpServletRequest request) throws ParseException{
		if(ValidationSQLUtil.BuildObj(request)){
			PageModelDto<UserUnitInfoDto> page = new PageModelDto<UserUnitInfoDto>();
			return page;
		};
		ODataObj odataObj = new ODataObj(request);
		return userUnitInfoService.get(odataObj);
	}
	
//	@RequiresPermissions("shenbaoAdmin/userUnitInfo##get")	
	@RequestMapping(name = "获取当前登录用户的单位数据", path = "", method = RequestMethod.GET)
	public @ResponseBody UserUnitInfoDto getUserUnit(HttpServletRequest request) throws ParseException{
		UserUnitInfoDto userUnitInfoDto1 = null;
		List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
		for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
			if(!userUnitInfoDto.getUserDtos().isEmpty()){
				for (UserDto user : userUnitInfoDto.getUserDtos()) {
					if(user.getId().equals(currentUser.getUserId())){
						userUnitInfoDto1 =userUnitInfoDto;
					}
				} 
			}
			
				
		}
	
		
		return userUnitInfoDto1;
	}
	
//	@RequiresPermissions("shenbaoAdmin/userUnitInfo##post")
	@RequestMapping(name = "保存当前用户的单位数据", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public @ResponseBody void post(@RequestBody UserUnitInfoDto userUnitInfoDto){
		 userUnitInfoService.save(userUnitInfoDto.getUnitName(),userUnitInfoDto);
	}
}
