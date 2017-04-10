package cs.controller;

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

import cs.model.PageModelDto;
import cs.model.UserDto;
import cs.repository.odata.ODataObj;
import cs.service.UserService;

@Controller
@RequestMapping(name = "�û�", path = "user")
public class UserController {
	private String ctrlName = "user";
	@Autowired
	private UserService userService;

	
	@RequiresPermissions("user##get")	
	@RequestMapping(name = "��ȡ�û�����", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<UserDto> userDtos = userService.get(odataObj);

		return userDtos;
	}
	@RequiresPermissions("user##post")
	@RequestMapping(name = "�����û�", path = "",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody UserDto userDto)  {		
		userService.createUser(userDto);		
	}
	@RequiresPermissions("user##delete")
	@RequestMapping(name = "ɾ���û�", path = "",method=RequestMethod.DELETE)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			userService.deleteUsers(ids);	
		}else{
			userService.deleteUser(id);	
		}		
	}
	@RequiresPermissions("user##put")
	@RequestMapping(name = "�����û�", path = "",method=RequestMethod.PUT)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  put(@RequestBody UserDto userDto)  {		
		userService.updateUser(userDto);	
	}
	
	// begin#html
	@RequiresPermissions("user#html/list#get")
	@RequestMapping(name = "�û��б�ҳ��", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}
	@RequiresPermissions("user#html/edit#get")
	@RequestMapping(name = "�༭�û�ҳ��", path = "html/edit", method = RequestMethod.GET)
	public String edit() {
		return ctrlName + "/edit";
	}
	// end#html
}
