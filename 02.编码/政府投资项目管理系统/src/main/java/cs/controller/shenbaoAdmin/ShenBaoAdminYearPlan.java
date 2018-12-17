package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.ICurrentUser;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.YearPlanDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;
import cs.service.interfaces.YearPlanService;
/**
 * @author Administrator
 * @Description 申报端年度计划管理控制层
 */
@Controller
@RequestMapping(name="申报端--年度计划",path="shenbaoAdmin/yearPlan")
public class ShenBaoAdminYearPlan {
	
	@Autowired
	private YearPlanService yearPlanService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@Autowired
	private ICurrentUser currentUser;
	
	@RequestMapping(name = "获取年度计划列表数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<YearPlanDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
		String unitId = userUnitInfo.getId();
		PageModelDto<YearPlanDto>  yearPlanDtos= yearPlanService.getYearPlanAllocationCapital(unitId, odataObj);		
		return yearPlanDtos;
	}

}
