package cs.controller.mobile;

import java.text.ParseException;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;
/**
 * @author Administrator
 * @Description APP用户单位管理控制层
 */
@Controller
@RequestMapping(name = "手机端--用户单位信息", path = "mobile/shenbaoAdmin/userUnitInfo")
public class ShenBaoAdminUserUnitInfoMobileController {

	@Autowired
	private UserUnitInfoService userUnitInfoService;

	@RequestMapping(name = "获取用户的单位数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> getProjectUnit(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		return userUnitInfoService.get(odataObj);
	}
	
	
}
