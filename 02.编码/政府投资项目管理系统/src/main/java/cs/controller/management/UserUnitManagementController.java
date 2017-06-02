package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.UnitInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UnitInfoService;
import cs.service.interfaces.UserUnitInfoService;

/**
 * @Description: 用户单位管理控制层
 * @author: cx
 * @Date：2017年6月1日
 * @version：0.1
 */
@Controller
@RequestMapping(name = "用户单位管理",path = "userUnitManagement")
public class UserUnitManagementController {
	private String ctrlName = "management/monthReport/userUnitManagement";	
	private static Logger logger = Logger.getLogger(UserUnitManagementController.class.getName());
	
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@RequestMapping(name = "获取用户单位信息", path = "",method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<UserUnitInfoDto> userUnitInfoDtos = userUnitInfoService.get(odataObj);		
		return userUnitInfoDtos;
	}
	
	@RequestMapping(name = "删除用户单位信息", path = "",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			userUnitInfoService.deleteUserUnitInfos(ids);	
		}else{
			userUnitInfoService.deleteUserUnitInfo(id);	
		}		
		
	}
	
	@RequestMapping(name = "更新用户单位信息", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  update(@RequestBody UserUnitInfoDto userUnitInfoDto){
		userUnitInfoService.updateUserUnitInfo(userUnitInfoDto);		
	}
	
	@RequestMapping(name = "创建用户单位信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  create(@RequestBody UserUnitInfoDto userUnitInfoDto){		
		userUnitInfoService.createUserUnitInfo(userUnitInfoDto);		
	}
	
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequestMapping(name = "编辑页", path = "html/edit")
	public String edit() {
		return this.ctrlName + "/edit";
	}

}
