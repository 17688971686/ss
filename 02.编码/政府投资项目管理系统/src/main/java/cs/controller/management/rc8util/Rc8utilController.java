package cs.controller.management.rc8util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.huasisoft.h1.api.org.DepartmentManager;
import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGDepartment;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import cs.model.framework.UserDto;
import cs.service.framework.UserService;


@Controller
@RequestMapping(name = "RC8账户管理", path = "risesoft")
public class Rc8utilController {
	@Autowired
	private UserService userService;
	
//	private static String[] tzk_id_list = {"4853bb99c50b413f89658af304e18698","{261F89FE-F016-4ADA-A5A0-B43EA7D9FFF0}","{BFA7B3F4-FFFF-FFFF-B32B-A23800000002}","{BFA7B3F4-FFFF-FFFF-B32B-D0B500000003}","{AC18B3FB-FFFF-FFFF-FB69-97BD00000015}","{BFA7B3F4-FFFF-FFFF-B32E-58DB00000008}","{AC18B3FB-0000-0000-6629-02E600000002}"};
	
	private final static String PARENTID = "{00000000-0000-0000-0000-000000000000}";
	//每七天执行一次
//	@RequiresPermissions("risesoft#tzkUsers#get")
	@Scheduled(cron="0 0 0 1/7 * ? ")
	@RequestMapping(name = "查询RC8投资科人员", path = "tzkUsers", method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public void getTZKUser() throws Exception{
		PersonManager  pm = HuasisoftUtil.getPersonManager();
		DepartmentManager dm = HuasisoftUtil.getDepartmentManager();
		//区下所有部门对象
		List<ORGDepartment> orgDeptList = dm.listByParentID(PARENTID);
		
		if(!orgDeptList.isEmpty()){
			for (int i = 0; i < orgDeptList.size(); i++) {
				ORGDepartment orgDept = orgDeptList.get(i);
				
				if(orgDept != null){
					
					//部门对象下所有部门集合
					List<ORGDepartment> depts = dm.listAllDept(orgDept.getId());
					
					if(!depts.isEmpty()){
						for (int j = 0; j < depts.size(); j++) {
							//部门下面所有人员
							List<ORGPerson> person = pm.listByParentID(depts.get(j).getParentID());
							for (ORGPerson person2 : person) {
								UserDto userDto = new UserDto();
								userDto.setDisplayName(person2.getDutyLevelName());
								System.out.println(person2.getDutyLevelName());
								userDto.setLoginName(person2.getLoginName());
								userDto.setPassword(person2.getPlainText());
								userDto.setEmail(person2.getEmail());
								userDto.setMobilePhone(person2.getMobile());
							
								userService.createSYSUser(userDto);
							}
						}
					}
				}
			}
		}
		
	}
	
}
