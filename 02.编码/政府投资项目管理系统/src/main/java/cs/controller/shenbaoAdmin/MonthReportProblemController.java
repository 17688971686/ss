package cs.controller.shenbaoAdmin;


import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.management.MonthReportProblemDto;
import cs.repository.odata.ODataObj;
import cs.service.shenbaoAdmin.MonthReportProblemService;

/**
 * 月报问题控制层
 * @author cx
 * @Date 2017-05-03
 *
 */
@Controller
@RequestMapping(name = "月报问题", path = "monthReportProblem")
public class MonthReportProblemController {
	//依赖注入服务层
	@Autowired
	private MonthReportProblemService monthReportProblemService;
	
		
	//查询月报问题数据
	//@RequiresPermissions("projectMonthReport##get")	
	@RequestMapping(name = "获取月报问题数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<MonthReportProblemDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<MonthReportProblemDto> monthReportProblemDtos = monthReportProblemService.get(odataObj);		
		return monthReportProblemDtos;
	}
}
