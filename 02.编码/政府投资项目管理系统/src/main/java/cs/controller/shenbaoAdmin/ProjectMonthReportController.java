package cs.controller.shenbaoAdmin;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.classmate.Filter;

import cs.domain.ProjectInfo;
import cs.model.PageModelDto;
import cs.model.management.MonthReportDto;
import cs.model.management.ProjectInfoDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.shenbaoAdmin.MonthReportService;
import cs.service.shenbaoAdmin.ProjectInfoService;

/**
 * 月报控制层
 * @author cx
 * @Date 2017-05-03
 *
 */
@Controller
@RequestMapping(name = "月报管理", path = "shenbaoAdmin/projectMonthReport")
public class ProjectMonthReportController {
	//依赖注入服务层
	@Autowired
	private MonthReportService monthReportService;
	
	@Autowired
	private ProjectInfoService proejctInfoService;
	
	private String ctrlName = "shenbaoAdmin/projectMonthReport";
	
	//查询月报数据
	//@RequiresPermissions("projectMonthReport##get")	
	@RequestMapping(name = "获取月报数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<MonthReportDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<MonthReportDto> monthReportDtos = monthReportService.get(odataObj);		
		return monthReportDtos;
	}
	@RequestMapping(name = "获取项目建设阶段", path = "/projectBuildStage/{projectId}", method = RequestMethod.GET)
	public @ResponseBody String getProjectBuildStage(@PathVariable("projectId") String projectId){
		
		ODataObj odataObj = new ODataObj();
		ODataFilterItem<String> filter=new ODataFilterItem<>();
		filter.setField("id");
		filter.setOperator("eq");
		filter.setValue(projectId);
		odataObj.getFilter().add(filter);
		
		PageModelDto<ProjectInfoDto> projectInfo = proejctInfoService.get(odataObj);
		if(!projectInfo.getValue().isEmpty()){
			String projectBuildStage=projectInfo.getValue().get(0).getProjectBuildStage();
			if(projectBuildStage==null){
				projectBuildStage="";
			}
			return projectBuildStage;
		}
		return "";
	}
	
	/**
	 * @deprecated 填写的月报信息进行保存
	 * @author cx
	 * @Date 2017-05-09  
	 */
	@RequestMapping(name = "保存月报信息", path = "save",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  saveMonthReport(@RequestBody MonthReportDto monthReportDto){
		monthReportService.saveMonthReport(monthReportDto);
				
	}
		
	/**
	 * @Description：跳转到月报列表页面
	 * @author： cx
	 * @Date： 2017年5月13日
	 * @version: 0.1
	 */
	//@RequiresPermissions("projectMonthReport#html/list#get")
	@RequestMapping(name = "项目列表页", path = "html/list",method=RequestMethod.GET)
	public String index() {
		return this.ctrlName + "/list";
	}
	
	/**
	 * @deprecated 跳转到月报填报月份选择页面
	 * @author cx
	 * @Date 2017-05-08 
	 */
	@RequestMapping(name = "月份选择页面", path = "html/selectMonth",method=RequestMethod.GET)
	public String fill(Model model) {
		model.addAttribute("year", new SimpleDateFormat("yyyy").format(new Date()));
		return this.ctrlName + "/selectMonth";
	}
	
	/**
	 * @deprecated 跳转到月报填报信息页面	
	 * @author cx
	 * @throws ParseException 
	 * @Date 2017-05-08 
	 */
	@RequestMapping(name = "月报信息填写页面", path = "html/fillInfo",method=RequestMethod.GET)
	public String fillInfo()  {
		
		return this.ctrlName + "/fillInfo";
	}
	
}
