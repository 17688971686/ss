package cs.controller.management.auxiliaryDecision;

import java.net.URLDecoder;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cs.model.Statistics.view.newEdition.GenerateExcelForMoney;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.quartz.SimpleTrigger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import cs.common.Util;
import cs.model.Statistics.ProjectStatisticsBean;
import cs.model.Statistics.sttisticsData;
import cs.model.Statistics.view.ApprovalStatisticsView;
import cs.model.Statistics.view.PlanStatisticsView;
import cs.model.Statistics.view.ProjectStatisticsView;
import cs.model.Statistics.view.newEdition.GenerateExcelForApproval;
import cs.model.Statistics.view.newEdition.GenerateExcelForPlan;
import cs.model.Statistics.view.newEdition.GenerateExcelForProject;
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
	
	@RequestMapping(name="项目总库-项目分类统计数据获取",path="getExcelForProjectData",method=RequestMethod.GET)
	public @ResponseBody List<ProjectStatisticsBean> getExcelForProjectData(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String isIncludLibrary) throws ParseException{
		return ProjectService.getProjectStatistics(classDesc,isIncludLibrary);
	}

	@RequestMapping(name="资金类数据获取",path="getExcelForMoneyData",method=RequestMethod.POST)
	public @ResponseBody List<ProjectStatisticsBean> getExcelForMoneyData(@SuppressWarnings("rawtypes") @RequestBody Map map) throws Exception{
		//获取筛选条件
		String type = (String) map.get("type");
		String isIncludLibrary = (String)map.get("isIncludLibrary");
		String stageSelect = StringUtils.strip(map.get("stage").toString(),"[]");
		String unitSelect = StringUtils.strip(map.get("unit").toString(),"[]");
		String industrySelect = StringUtils.strip(map.get("industry").toString(),"[]");
		String categorySelect = StringUtils.strip(map.get("category").toString(),"[]");
        String projectStageSelect = StringUtils.strip(map.get("projectStage").toString(),"[]");

		String projectName = (String) map.get("projectName");

		//处理请求参数
		String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(",") : null;
		String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(",") : null;
		String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(",") : null;
		String[] categorySelected = Util.isNotNull(categorySelect)?categorySelect.split(",") : null;
        String[] projectStageSelected = Util.isNotNull(projectStageSelect)?projectStageSelect.split(",") : null;
		projectName = Util.isNotNull(projectName) ? projectName.toString() : null;

		List<ProjectStatisticsBean> list = ProjectService.getMoneyStatistics(isIncludLibrary,stageSelected,projectStageSelected,projectName,unitSelected,industrySelected,categorySelected);
		//数据处理
		Map<String,Integer[]>  shenbaoStageNumMaps = new HashMap<String,Integer[]>();
		int rowNum = 0;
		for (int i = 0;i<list.size();i++){
			ProjectStatisticsBean bean = list.get(i);
			String proName = bean.getProjectName();
			//申报类型个数处理
			Integer stageNum = shenbaoStageNumMaps.get(proName) != null ? shenbaoStageNumMaps.get(proName)[0]+1 : 1;
			//序号处理
			rowNum = shenbaoStageNumMaps.get(proName) != null ? shenbaoStageNumMaps.get(proName)[1] : rowNum+1;
			Integer[] list1 = {stageNum,rowNum};
			shenbaoStageNumMaps.put(proName,list1);
		}

		//处理数据展示编号及合并行
		if(!list.isEmpty()){
			list.stream().forEach(x -> {
                String proName = x.getProjectName();
				Integer[] val = shenbaoStageNumMaps.get(proName);
				if(val != null){
					x.setShenbaoStageNum(val[0]);
					x.setRowNum(val[1]);
					shenbaoStageNumMaps.remove(proName);
				}
			});
		}

		//查询获取数据
		return list;
	}

	@RequestMapping(name="资金类统计下载",path="exportExcelForMoney",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void exportExcelForMoney(HttpServletRequest request,HttpServletResponse response) throws Exception{
		//获取筛选条件
		String type = request.getParameter("type");
		String isIncludLibrary = request.getParameter("isIncludLibrary");
        String stageSelect = StringUtils.strip(request.getParameter("stage"),"[]");
        String unitSelect = StringUtils.strip(request.getParameter("unit"),"[]");
		String industrySelect = StringUtils.strip(request.getParameter("industry"),"[]");
		String categorySelect = StringUtils.strip(request.getParameter("category"),"[]");
        String projectStageSelect = StringUtils.strip(request.getParameter("projectStage"),"[]");
		String projectName = request.getParameter("projectName");

		//处理请求参数
		String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(",") :null;
		String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(",") :null;
		String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(",") : null;
		String[] categorySelected = Util.isNotNull(categorySelect)?categorySelect.split(",") : null;
        String[] projectStageSelected = Util.isNotNull(projectStageSelect)?projectStageSelect.split(",") : null;
		projectName = Util.isNotNull(projectName) ? new String(projectName.getBytes("iso-8859-1"),"utf-8") :null;

		//查询获取数据
		List<ProjectStatisticsBean> list = ProjectService.getMoneyStatistics(isIncludLibrary,stageSelected,projectStageSelected,projectName,unitSelected,industrySelected,categorySelected);

		//数据处理
		Map<String,Integer[]>  shenbaoStageNumMaps = new HashMap<String,Integer[]>();
		int rowNum = 0;
		for (int i = 0;i<list.size();i++){
			ProjectStatisticsBean bean = list.get(i);
			String proName = bean.getProjectName();
			//申报类型个数处理
			Integer stageNum = shenbaoStageNumMaps.get(proName) != null ? shenbaoStageNumMaps.get(proName)[0]+1 : 1;
			//序号处理
			rowNum = shenbaoStageNumMaps.get(proName) != null ? shenbaoStageNumMaps.get(proName)[1] : rowNum+1;
			Integer[] list1 = {stageNum,rowNum};
			shenbaoStageNumMaps.put(proName,list1);
		}

		//处理数据展示编号及合并行
		if(!list.isEmpty()){
			list.stream().forEach(x -> {
				String proName = x.getProjectName();
				Integer[] val = shenbaoStageNumMaps.get(proName);
				if(val != null){
					x.setShenbaoStageNum(val[0]);
					x.setRowNum(val[1]);
					shenbaoStageNumMaps.remove(proName);
				}
			});
		}

		try {
			String fileName = "光明新区政府投资"+"项目资金"+"汇总表.xls";
			String newexcelname = new String(fileName.getBytes("utf-8"),"ISO_8859_1");
			response.reset();
			response.setContentType("APPLICATION/OCTET-STREAM");
			response.setHeader("Content-disposition", "attachment; filename=\"" + newexcelname + "\""); // 实现下载
			HSSFWorkbook workbook = new GenerateExcelForMoney().getHSSFWorkBook(list,type,isIncludLibrary);//构建Excel
			workbook.write(response.getOutputStream());// 实现输出
			response.flushBuffer();
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(name="项目总库-分类统计下载",path="exportExcelForProject",method=RequestMethod.GET)
	public ModelAndView exportExcelForProject(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String isIncludLibrary) throws ParseException{
		List<ProjectStatisticsBean> data = ProjectService.getProjectStatistics(classDesc,isIncludLibrary);
		return new ModelAndView(new ProjectStatisticsView(classDesc,isIncludLibrary), "data", data);
	}
	
	@RequestMapping(name="审批类-分类统计数据获取",path="getExcelForApprovalData",method=RequestMethod.GET)
	public @ResponseBody List<ProjectStatisticsBean> getExcelForApprovalData(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String approvalYear) throws ParseException{
		return shenBaoInfoService.getApprovalStatistics(classDesc,Integer.parseInt(approvalYear));
	}
	
	@RequestMapping(name="审批类-分类统计下载",path="exportExcelForApproval",method=RequestMethod.GET)
	public ModelAndView exportExcelForApproval(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String approvalYear) throws ParseException{
		List<ProjectStatisticsBean> data = shenBaoInfoService.getApprovalStatistics(classDesc,Integer.parseInt(approvalYear));
		return new ModelAndView(new ApprovalStatisticsView(classDesc,Integer.parseInt(approvalYear)), "data", data);
	}
	
	@RequestMapping(name="计划类-分类统计数据获取",path="getExcelForPlanData",method=RequestMethod.GET)
	public @ResponseBody List<ProjectStatisticsBean> getExcelForPlanData(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String planYear) throws ParseException{
		return shenBaoInfoService.getPlanStatistics(classDesc,Integer.parseInt(planYear));
	}
	
	@RequestMapping(name="计划类-分类统计下载",path="exportExcelForPlan",method=RequestMethod.GET)
	public ModelAndView exportExcelForPlan(HttpServletRequest request,@RequestParam String classDesc,@RequestParam String planYear) throws ParseException{
		List<ProjectStatisticsBean> data = shenBaoInfoService.getPlanStatistics(classDesc,Integer.parseInt(planYear));
		return new ModelAndView(new PlanStatisticsView(classDesc,Integer.parseInt(planYear)), "data", data);
	}
	
	@RequestMapping(name="审批类-自定义条件统计数据获取",path="getApprovalCustomData",method=RequestMethod.POST)
	public @ResponseBody List<ProjectStatisticsBean> getApprovalCustomData(@SuppressWarnings("rawtypes") @RequestBody Map map) throws ParseException{
		//获取筛选条件
	   String pifuDateBeginStr=map.get("pifuDateBegin").toString();
	   String pifuDateEndStr=map.get("pifuDateEnd").toString();
	   String investSumBeginStr=map.get("projectInvestSumBegin").toString();
	   String investSumEndStr=map.get("projectInvestSumEnd").toString();
	   String industrySelect=StringUtils.strip(map.get("industry").toString(),"[]");
	   String stageSelect=StringUtils.strip(map.get("stage").toString(),"[]");
	   String unitSelect=StringUtils.strip(map.get("unit").toString(),"[]");
	   //处理请求参数
	   Integer pifuDateBegin=Util.isNotNull(pifuDateBeginStr)?Integer.parseInt(pifuDateBeginStr,10):null;
	   Integer pifuDateEnd=Util.isNotNull(pifuDateEndStr)?Integer.parseInt(pifuDateEndStr,10):null;
	   Double investSumBegin=Util.isNotNull(investSumBeginStr)?Double.valueOf(investSumBeginStr):null;
	   Double investSumEnd=Util.isNotNull(investSumEndStr)?Double.valueOf(investSumEndStr):null;
	   String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(","):null;
	   String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(","):null;
	   String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(","):null;
	   String projectName=Util.isNotNull(map.get("projectName").toString())?map.get("projectName").toString():null;
	   //查询获取数据
 	   return shenBaoInfoService.getApprovalStatisticsByCustom(pifuDateBegin,pifuDateEnd,industrySelected,stageSelected,unitSelected,investSumBegin,investSumEnd,projectName);
	}
	
	
	@RequestMapping(name="审批类-自定义条件统计下载",path="exportExcelForApprovalByCustom",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void exportExcelForApprovalByCustom(HttpServletRequest request,HttpServletResponse response) throws Exception{
	   //获取筛选条件
	   String pifuDateBeginStr=request.getParameter("pifuDateBegin");
	   String pifuDateEndStr=request.getParameter("pifuDateEnd");
	   String investSumBeginStr=request.getParameter("projectInvestSumBegin");
	   String investSumEndStr=request.getParameter("projectInvestSumEnd");
	   String industrySelect=request.getParameter("industry");
	   String stageSelect=request.getParameter("stage");
	   String unitSelect=request.getParameter("unit");
	   //处理请求参数
	   Integer pifuDateBegin=Util.isNotNull(pifuDateBeginStr)?Integer.parseInt(pifuDateBeginStr,10):null;
	   Integer pifuDateEnd=Util.isNotNull(pifuDateEndStr)?Integer.parseInt(pifuDateEndStr,10):null;
	   Double investSumBegin=Util.isNotNull(investSumBeginStr)?Double.valueOf(investSumBeginStr):null;
	   Double investSumEnd=Util.isNotNull(investSumEndStr)?Double.valueOf(investSumEndStr):null;
	   String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(","):null;
	   String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(","):null;
	   String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(","):null;
	   String projectName=Util.isNotNull(request.getParameter("projectName"))?new String(request.getParameter("projectName").getBytes("iso-8859-1"),"utf-8"):null;
	   //查询获取数据
 	   List<ProjectStatisticsBean> data = shenBaoInfoService.getApprovalStatisticsByCustom(pifuDateBegin,pifuDateEnd,industrySelected,stageSelected,unitSelected,investSumBegin,investSumEnd,projectName);
		
 	   try {
			String fileName="光明新区政府投资计划类统计表.xls";
			String newexcelname = new String(fileName.getBytes("utf-8"),"ISO_8859_1");
			response.reset();
			response.setContentType("APPLICATION/OCTET-STREAM");
			response.setHeader("Content-disposition", "attachment; filename=\"" + newexcelname + "\""); // 实现下载
			HSSFWorkbook workbook = new GenerateExcelForApproval().getHSSFWorkBook(data);//构建Excel
			workbook.write(response.getOutputStream());// 实现输出
		response.flushBuffer();
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(name="计划类-自定义条件统计数据获取",path="getPlanCustomData",method=RequestMethod.POST)
	public @ResponseBody List<ProjectStatisticsBean> getPlanCustomData(@SuppressWarnings("rawtypes") @RequestBody Map map) throws ParseException{
		//获取筛选条件
		String investSumBeginStr= map.get("projectInvestSumBegin").toString();
		String investSumEndStr= map.get("projectInvestSumEnd").toString();
		String apPlanReachSumBeginStr=map.get("projectApPlanReachSumBegin").toString();
		String apPlanReachSumEndStr=map.get("projectApPlanReachSumEnd").toString();
		String planYearBeginStr=map.get("planYearBegin").toString();
		String planYearEndStr=map.get("planYearEnd").toString();
		String industrySelect=StringUtils.strip(map.get("industry").toString(),"[]");
		String stageSelect=StringUtils.strip(map.get("stage").toString(),"[]");
		String unitSelect=StringUtils.strip(map.get("unit").toString(),"[]");
	   //处理请求参数
		Integer planYearBegin=Util.isNotNull(planYearBeginStr)?Integer.parseInt(planYearBeginStr,10):null;
		Integer planYearEnd=Util.isNotNull(planYearEndStr)?Integer.parseInt(planYearEndStr,10):null;
		Double investSumBegin = Util.isNotNull(investSumBeginStr)?Double.valueOf(investSumBeginStr):null;
		Double investSumEnd = Util.isNotNull(investSumEndStr)?Double.valueOf(investSumEndStr):null;
		Double apPlanReachSumBegin=Util.isNotNull(apPlanReachSumBeginStr)?Double.valueOf(apPlanReachSumBeginStr):null;
		Double apPlanReachSumEnd=Util.isNotNull(apPlanReachSumEndStr)?Double.valueOf(apPlanReachSumEndStr):null;
		String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(","):null;
		String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(","):null;
		String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(","):null;
		String projectName=Util.isNotNull(map.get("projectName").toString())?map.get("projectName").toString():null;
	   //查询获取数据
 	   return shenBaoInfoService.getPlanStatisticsByCustom(planYearBegin,planYearEnd,industrySelected,stageSelected,
 			   unitSelected,investSumBegin,investSumEnd,apPlanReachSumBegin,apPlanReachSumEnd,projectName);
	}

	@RequestMapping(name="计划类-自定义条件统计下载",path="exportExcelForPlanByCustom",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void exportExcelForPlanByCustom(HttpServletRequest request,HttpServletResponse response) throws Exception{
		// 读取请求参数
	   String investSumBeginStr= request.getParameter("projectInvestSumBegin");
	   String investSumEndStr= request.getParameter("projectInvestSumEnd");
	   String apPlanReachSumBeginStr=request.getParameter("projectApPlanReachSumBegin");
	   String apPlanReachSumEndStr=request.getParameter("projectApPlanReachSumEnd");
	   String planYearBeginStr=request.getParameter("planYearBegin");
	   String planYearEndStr=request.getParameter("planYearEnd");
	   String industrySelect=request.getParameter("industry");
	   String stageSelect=request.getParameter("stage");
	   String unitSelect=request.getParameter("unit");
	   //处理请求参数
	   Integer planYearBegin=Util.isNotNull(planYearBeginStr)?Integer.parseInt(planYearBeginStr,10):null;
	   Integer planYearEnd=Util.isNotNull(planYearEndStr)?Integer.parseInt(planYearEndStr,10):null;
	   Double investSumBegin = Util.isNotNull(investSumBeginStr)?Double.valueOf(investSumBeginStr):null;
	   Double investSumEnd = Util.isNotNull(investSumEndStr)?Double.valueOf(investSumEndStr):null;
	   Double apPlanReachSumBegin=Util.isNotNull(apPlanReachSumBeginStr)?Double.valueOf(apPlanReachSumBeginStr):null;
	   Double apPlanReachSumEnd=Util.isNotNull(apPlanReachSumEndStr)?Double.valueOf(apPlanReachSumEndStr):null;
	   String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(","):null;
	   String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(","):null;
	   String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(","):null;
	   String projectName=Util.isNotNull(request.getParameter("projectName"))?new String(request.getParameter("projectName").getBytes("iso-8859-1"),"utf-8"):null;

	   //查询获取数据
 	   List<ProjectStatisticsBean> data = shenBaoInfoService.getPlanStatisticsByCustom(planYearBegin,planYearEnd,industrySelected,stageSelected,
 			   unitSelected,investSumBegin,investSumEnd,apPlanReachSumBegin,apPlanReachSumEnd,projectName);
 	  
 	   try {
 		   String fileName="光明新区政府投资计划类统计表.xls";
 		   String newexcelname = new String(fileName.getBytes("utf-8"),"ISO_8859_1");
 		   response.reset();
 		   response.setContentType("APPLICATION/OCTET-STREAM");
	       response.setHeader("Content-disposition", "attachment; filename=\"" + newexcelname + "\""); // 实现下载
	       HSSFWorkbook workbook = new GenerateExcelForPlan().getHSSFWorkBook(data);//构建Excel
	       workbook.write(response.getOutputStream());// 实现输出
	       response.flushBuffer();
	  }catch (Exception e) {
		  e.printStackTrace();
	  }
	}
	
	@RequestMapping(name="项目总库-自定义条件统计数据获取",path="getProjectCustomData",method=RequestMethod.POST)
	public @ResponseBody List<ProjectStatisticsBean> getProjectCustomData(@SuppressWarnings("rawtypes") @RequestBody Map map) throws Exception{
		// 读取请求参数
	   String investSumBeginStr= map.get("projectInvestSumBegin").toString();
	   String investSumEndStr= map.get("projectInvestSumEnd").toString();
	   String industrySelect=StringUtils.strip(map.get("industry").toString(),"[]");
	   String stageSelect=StringUtils.strip(map.get("stage").toString(),"[]");
	   String categorySelect=StringUtils.strip(map.get("category").toString(),"[]");
	   String unitSelect=StringUtils.strip(map.get("unit").toString(),"[]");
	   //处理请求参数
	   Double investSumBegin = Util.isNotNull(investSumBeginStr)?Double.valueOf(investSumBeginStr):null;
	   Double investSumEnd = Util.isNotNull(investSumEndStr)?Double.valueOf(investSumEndStr):null;
	   String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(","):null;
	   String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(","):null;
	   String[] categorySelected = Util.isNotNull(categorySelect)?categorySelect.split(","):null;
	   String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(","):null;
	   String projectName=Util.isNotNull(map.get("projectName").toString())?map.get("projectName").toString():null;

	   //查询获取数据
 	   return ProjectService.getProjectStatisticsByCustom(industrySelected,stageSelected,categorySelected,unitSelected,investSumBegin,investSumEnd,projectName);
	}
	
	@RequestMapping(name="项目总库-自定义条件统计下载",path="exportExcelForProjectByCustom",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void exportExcelForProjectByCustom(HttpServletRequest request,HttpServletResponse response) throws Exception{
		// 读取请求参数
	   String investSumBeginStr= request.getParameter("projectInvestSumBegin");
	   String investSumEndStr= request.getParameter("projectInvestSumEnd");
	   String industrySelect=request.getParameter("industry");
	   String stageSelect=request.getParameter("stage");
	   String categorySelect=request.getParameter("category");
	   String unitSelect=request.getParameter("unit");
	   //处理请求参数
	   Double investSumBegin = Util.isNotNull(investSumBeginStr)?Double.valueOf(investSumBeginStr):null;
	   Double investSumEnd = Util.isNotNull(investSumEndStr)?Double.valueOf(investSumEndStr):null;
	   String[] industrySelected = Util.isNotNull(industrySelect)?industrySelect.split(","):null;
	   String[] stageSelected = Util.isNotNull(stageSelect)?stageSelect.split(","):null;
	   String[] categorySelected = Util.isNotNull(categorySelect)?categorySelect.split(","):null;
	   String[] unitSelected = Util.isNotNull(unitSelect)?unitSelect.split(","):null;
	   String projectName=Util.isNotNull(request.getParameter("projectName"))?new String(request.getParameter("projectName").getBytes("iso-8859-1"),"utf-8"):null;

	   //查询获取数据
 	   List<ProjectStatisticsBean> data = ProjectService.getProjectStatisticsByCustom(industrySelected,stageSelected,categorySelected,unitSelected,investSumBegin,investSumEnd,projectName);
 	  
 	   try {
 		   String fileName="光明新区政府投资项目总库统计表.xls";
 		   String newexcelname = new String(fileName.getBytes("utf-8"),"ISO_8859_1");
 		   response.reset();
 		   response.setContentType("APPLICATION/OCTET-STREAM");
	       response.setHeader("Content-disposition", "attachment; filename=\"" + newexcelname + "\""); // 实现下载
	       HSSFWorkbook workbook = new GenerateExcelForProject().getHSSFWorkBook(data);//构建Excel
	       workbook.write(response.getOutputStream());// 实现输出
	       response.flushBuffer();
	  }catch (Exception e) {
	  	e.printStackTrace();
	  }
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
	
	//@RequiresPermissions("management/auxDeci/statisticalAnalysis#html/show#get")
	@RequestMapping(name="统计分析数据展示页面",path="html/show",method=RequestMethod.GET)
	public String show(){
		return ctrl+"/show";
	}
}
