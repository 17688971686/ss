package cs.controller.mobile;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.service.common.BasicDataService;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name = "手机公共", path = "mobile/common")
public class MobileCommonController {
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@RequestMapping(name="查询基础数据",path="basicData/{identity}",method=RequestMethod.GET)
	public @ResponseBody List<BasicDataDto> getBasicData(@PathVariable("identity") String identity){
		if(identity.equals("all")){
			return basicDataService.Get();
		}
		return basicDataService.getByIdentity(identity);
	}
	
	@RequestMapping(name="查询用户单位数据",path="userUnit",method=RequestMethod.GET)
	public @ResponseBody List<UserUnitInfoDto> getUserUnit(){
		return userUnitInfoService.Get();
	}
}
