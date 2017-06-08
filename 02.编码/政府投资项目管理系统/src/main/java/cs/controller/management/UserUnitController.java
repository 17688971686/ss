package cs.controller.management;

import java.text.ParseException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="单位管理",path="management/userUnit")
public class UserUnitController {
	private String ctrlName = "management/userUnit";
	private static Logger logger = Logger.getLogger(UserUnitController.class.getName());
	
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	//@RequiresPermissions("management/userUnit##get")
	@RequestMapping(name = "获取单位信息", path = "",method=RequestMethod.GET)
	public @ResponseBody List<UserUnitInfoDto> getUserUnits(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<UserUnitInfoDto> userUnitInfoDtos = userUnitInfoService.get(odataObj);
		List<UserUnitInfoDto> userUnits = userUnitInfoDtos.getValue();
		return userUnits;
	}
}
