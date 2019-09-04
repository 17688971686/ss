package cs.controller.framework;

import java.text.ParseException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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
import cs.model.PageModelDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;


/**
 * @author Administrator
 *用户管理控制层
 */
@Controller
@RequestMapping(name = "用户管理", path = "user")
public class UserController {
	private String ctrlName = "framework/user";
	@Autowired
	private UserService userService;

//	@RequiresPermissions("user##get")
	@RequestMapping(name = "获取用户数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<UserDto> userDtos = userService.get(odataObj);

		return userDtos;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(name = "获取用户数据", path = "{userName}", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserDto> getUserByName(HttpServletRequest request,@PathVariable String userName) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		ODataFilterItem filter = new ODataFilterItem();
		filter.setField("loginName");
		filter.setOperator("eq");
		filter.setValue(userName);
		odataObj.getFilter().add(filter);
		PageModelDto<UserDto> userDtos = userService.get(odataObj);

		return userDtos;
	}
	
//	@RequiresPermissions("user##post")
	@RequestMapping(name = "创建用户", path = "",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody UserDto userDto)  {		
		userService.createUser(userDto);		
	}
	
//	@RequiresPermissions("user#deleteUser#post")
	@RequestMapping(name = "删除用户", path = "deleteUser",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			userService.deleteUsers(ids);	
		}else{
			userService.deleteUser(id);	
		}		
	}
	
	@SuppressWarnings("rawtypes")
//	@RequiresPermissions("user#initUser#post")
	@RequestMapping(name = "初始化用户相关数据", path = "initUser",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void initUser(@RequestBody Map map)  {		
		userService.initUser(map);	
	}
	
//	@RequiresPermissions("user#updateUser#post")
	@RequestMapping(name = "更新用户", path = "updateUser",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  put(@RequestBody UserDto userDto)  {		
		userService.updateUser(userDto);	
	}
	
	// begin#html
//	@RequiresPermissions("user#html/list#get")
	@RequestMapping(name = "用户列表页面", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
//	@RequiresPermissions("user#html/edit#get")
	@RequestMapping(name = "编辑用户页面", path = "html/edit", method = RequestMethod.GET)
	public String edit() {
		return ctrlName + "/edit";
	}
	
}
