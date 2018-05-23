package cs.rc8Util;

import java.util.List;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.huasisoft.h1.api.org.DepartmentManager;
import com.huasisoft.h1.api.org.GroupManager;
import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import cs.domain.framework.Role;
import cs.model.framework.RoleDto;
import cs.model.framework.UserDto;
import cs.service.framework.RoleService;
import cs.service.framework.UserService;
import net.risesoft.model.Person;
import net.risesoft.util.RisesoftUtil;
@Controller
@RequestMapping(name = "RC8账户管理", path = "risesoft")
public class Rc8utilController {
	@Autowired
	private UserService userService;
	@Autowired
	private RoleService roleService;
	
	private static String[] tzk_id_list = {"4853bb99c50b413f89658af304e18698","{261F89FE-F016-4ADA-A5A0-B43EA7D9FFF0}","{BFA7B3F4-FFFF-FFFF-B32B-A23800000002}","{BFA7B3F4-FFFF-FFFF-B32B-D0B500000003}","{AC18B3FB-FFFF-FFFF-FB69-97BD00000015}","{BFA7B3F4-FFFF-FFFF-B32E-58DB00000008}","{AC18B3FB-0000-0000-6629-02E600000002}"};
	
//	@RequiresPermissions("risesoft#tzkUsers#get")
	@RequestMapping(name = "查询RC8投资科人员", path = "tzkUsers", method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public void getTZKUser() throws Exception{
		PersonManager  dm = HuasisoftUtil.getPersonManager();
		List<RoleDto> roleList = roleService.Get();
		for (int i = 0; i < tzk_id_list.length; i++) {
			List<ORGPerson> person = dm.listByParentID(tzk_id_list[i]);
			for (ORGPerson person2 : person) {
				UserDto userDto = new UserDto();
				userDto.setDisplayName(person2.getDutyLevelName());
				System.out.println(person2.getDutyLevelName());
				userDto.setLoginName(person2.getLoginName());
				userDto.setPassword(person2.getPlainText());
				userDto.setEmail(person2.getEmail());
				userDto.setMobilePhone(person2.getMobile());
				for (RoleDto role : roleList) {
					if(role.getRoleName().equals("建设单位")){
						userDto.getRoles().add(role);
					}
				}
				userService.createSYSUser(userDto);
			}
		}
		
		
	}
	
}
