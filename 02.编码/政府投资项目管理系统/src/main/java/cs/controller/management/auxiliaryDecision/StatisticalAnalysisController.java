package cs.controller.management.auxiliaryDecision;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;

import cs.model.Statistics.ProjectStatisticsBean;
import cs.model.Statistics.sttisticsData;
import cs.model.Statistics.view.ApprovalStatisticsCustomView;
import cs.model.Statistics.view.ApprovalStatisticsView;
import cs.model.Statistics.view.PlanStatisticsCustomView;
import cs.model.Statistics.view.PlanStatisticsView;
import cs.model.Statistics.view.ProjectStatisticsCustomView;
import cs.model.Statistics.view.ProjectStatisticsView;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;
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
	private ShenBaoInfoService shenBaoInfoService;
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
	
	@RequestMapping(name="项目总库-项目分类统计",path="exportExcelForProject",method=RequestMethod.GET)
	public ModelAndView exportExcelForProject(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String isIncludLibrary) throws ParseException{
		List<ProjectStatisticsBean> data = ProjectService.getProjectStatistics(classDesc,isIncludLibrary);
		return new ModelAndView(new ProjectStatisticsView(classDesc,isIncludLibrary), "data", data);
	}
	
	@RequestMapping(name="审批类-分类统计",path="exportExcelForApproval",method=RequestMethod.GET)
	public ModelAndView exportExcelForApproval(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String approvalYear) throws ParseException{
		List<ProjectStatisticsBean> data = shenBaoInfoService.getApprovalStatistics(classDesc,Integer.parseInt(approvalYear));
		return new ModelAndView(new ApprovalStatisticsView(classDesc,Integer.parseInt(approvalYear)), "data", data);
	}
	
	@RequestMapping(name="计划类-分类统计",path="exportExcelForPlan",method=RequestMethod.GET)
	public ModelAndView exportExcelForPlan(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String planYear) throws ParseException{
		List<ProjectStatisticsBean> data = shenBaoInfoService.getPlanStatistics(classDesc,Integer.parseInt(planYear));
		return new ModelAndView(new PlanStatisticsView(classDesc,Integer.parseInt(planYear)), "data", data);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(name="审批类-自定义条件统计",path="exportExcelForApprovalByCustom",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public ModelAndView exportExcelForApprovalByCustom(HttpServletRequest request,HttpServletResponse response) throws Exception{
		// 读取请求内容  
       BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));  
       String line = null;  
       StringBuilder sb = new StringBuilder();  
       while((line = br.readLine())!=null){  
           sb.append(line);  
       }  
       // 将资料解码  
       String reqBody = sb.toString();  
	   JSONObject json=JSONObject.parseObject(reqBody);
	   //获取筛选条件
	   int pifuDateBegin = Integer.parseInt((String)json.get("pifuDateBegin"));
	   int pifuDateEnd = Integer.parseInt((String)json.get("pifuDateEnd"));
	   List<String> industrySelected = (List<String>) json.get("industry");
	   List<String> stageSelected = (List<String>) json.get("stage");
	   List<String> unitSelected = (List<String>) json.get("unit");
	   Double investSumBegin = Double.valueOf((String)json.get("projectInvestSumBegin"));
	   Double investSumEnd = Double.valueOf((String)json.get("projectInvestSumEnd"));
	   //查询获取数据
 	   List<ProjectStatisticsBean> data = shenBaoInfoService.getShenBaoInfoStatisticsByCustom(pifuDateBegin,pifuDateEnd,industrySelected,stageSelected,unitSelected,investSumBegin,investSumEnd);
 	   return new ModelAndView(new ApprovalStatisticsCustomView(), "data", data);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(name="计划类-自定义条件统计",path="exportExcelForPlanByCustom",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public ModelAndView exportExcelForPlanByCustom(HttpServletRequest request,HttpServletResponse response) throws Exception{
		// 读取请求内容  
       BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));  
       String line = null;  
       StringBuilder sb = new StringBuilder();  
       while((line = br.readLine())!=null){  
           sb.append(line);  
       }  
       // 将资料解码  
       String reqBody = sb.toString();  
	   JSONObject json=JSONObject.parseObject(reqBody);
	   //获取筛选条件
	   int planYearBegin = Integer.parseInt((String)json.get("planYearBegin"));
	   int planYearEnd = Integer.parseInt((String)json.get("planYearEnd"));
	   List<String> industrySelected = (List<String>) json.get("industry");
	   List<String> stageSelected = (List<String>) json.get("stage");
	   List<String> unitSelected = (List<String>) json.get("unit");
	   Double investSumBegin = Double.valueOf((String)json.get("projectInvestSumBegin"));
	   Double investSumEnd = Double.valueOf((String)json.get("projectInvestSumEnd"));
	   Double apPlanReachSumBegin = Double.valueOf((String)json.get("projectApPlanReachSumBegin"));
	   Double apPlanReachSumEnd = Double.valueOf((String)json.get("projectApPlanReachSumEnd"));
	   //查询获取数据
// 	   List<ProjectStatisticsBean> data = shenBaoInfoService.getPlanStatisticsByCustom(planYearBegin,planYearEnd,industrySelected,stageSelected,
// 			   unitSelected,investSumBegin,investSumEnd,apPlanReachSumBegin,apPlanReachSumEnd);
	   List<ProjectStatisticsBean> data = new ArrayList<>();
 	   return new ModelAndView(new PlanStatisticsCustomView(), "data", data);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(name="项目总库-自定义条件统计",path="exportExcelForProjectByCustom",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public ModelAndView exportExcelForProjectByCustom(HttpServletRequest request,HttpServletResponse response) throws Exception{
		// 读取请求内容  
       BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));  
       String line = null;  
       StringBuilder sb = new StringBuilder();  
       while((line = br.readLine())!=null){  
           sb.append(line);  
       }  
       // 将资料解码  
       String reqBody = sb.toString();  
	   JSONObject json=JSONObject.parseObject(reqBody);
	   //获取筛选条件
	   List<String> industrySelected = (List<String>) json.get("industry");
	   List<String> stageSelected = (List<String>) json.get("stage");
	   List<String> categorySelected = (List<String>) json.get("category");
	   List<String> unitSelected = (List<String>) json.get("unit");
	   Double investSumBegin = Double.valueOf((String)json.get("projectInvestSumBegin"));
	   Double investSumEnd = Double.valueOf((String)json.get("projectInvestSumEnd"));
	   //查询获取数据
 	   List<ProjectStatisticsBean> data = ProjectService.getProjectStatisticsByCustom(industrySelected,stageSelected,categorySelected,unitSelected,investSumBegin,investSumEnd);
 	   return new ModelAndView(new ProjectStatisticsCustomView(), "data", data);
	}
	
	@RequiresPermissions("management/auxDeci/statisticalAnalysis#html/index#get")
	@RequestMapping(name="统计分析主页",path="html/index",method=RequestMethod.GET)
	public String index(){
		return ctrl+"/index";
	}
	
	//@RequiresPermissions("management/auxDeci/statisticalAnalysis#html/edit#get")
	@RequestMapping(name="统计分析条件筛选页面",path="html/edit",method=RequestMethod.GET)
	public String edit(){
		return ctrl+"/edit";
	}
}
