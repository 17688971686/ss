package cs.controller.management.auxiliaryDecision;

import java.util.List;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.Statistics.sttisticsData;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.YearPlanService;

/**
 * 
* @ClassName: StatisticalAnalysisController 
* @Description: 统计分析控制器 
* @author cx
* @date 2018年1月4日 下午3:41:41 
*
 */
@Controller
@RequestMapping(name = "后台管理--辅助决策--统计分析", path = "management/auxDeci/statisticalAnalysis")
public class StatisticalAnalysisController {
	private String ctrl ="management/auxDeci/statisticalAnalysis";
	
	@Autowired
	private ProjectService ProjectService;
	@Autowired
	private YearPlanService yearPlanService;
	
	@RequiresPermissions("management/auxDeci/statisticalAnalysis#getprojectByHY#get")
	@RequestMapping(name = "获取项目库中项目投资行业分布数据", path = "getprojectByHY",method=RequestMethod.GET)
	public @ResponseBody List<sttisticsData> getprojectByHYData(){
		return ProjectService.getprojectByHYData();
	}
	
	@RequiresPermissions("management/auxDeci/statisticalAnalysis#getprojectInvestSource#get")
	@RequestMapping(name = "获取项目库中项目投资来源分布数据", path = "getprojectInvestSource",method=RequestMethod.GET)
	public @ResponseBody List<sttisticsData> getprojectInvestSource(){
		return ProjectService.getprojectInvestSourceData();
	}
	
	@RequiresPermissions("management/auxDeci/statisticalAnalysis#getyearPlanByHY#get")
	@RequestMapping(name = "获取年度计划中项目投资行业分布数据", path = "getyearPlanByHY",method=RequestMethod.GET)
	public @ResponseBody List<sttisticsData> getyearPlanByHYData(){
		return yearPlanService.getyearPlanByHYData();
	}
	
	@RequiresPermissions("management/auxDeci/statisticalAnalysis#getyearPlanInvestSource#get")
	@RequestMapping(name = "获取年度计划中项目投资来源数据", path = "getyearPlanInvestSource",method=RequestMethod.GET)
	public @ResponseBody List<sttisticsData> getyearPlanInvestSourceData(){
		return yearPlanService.getyearPlanInvestSourceData();
	}
	
	@RequiresPermissions("management/auxDeci/statisticalAnalysis#html/index#get")
	@RequestMapping(name="年度计划编制页",path="html/index",method=RequestMethod.GET)
	public String planBZ(){
		return ctrl+"/index";
	}
}
