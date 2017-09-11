package cs.controller;

import java.io.File;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import cs.common.Util;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.exportExcel.ExcelDataYS;
import cs.model.exportExcel.ExcelDataDWTJ;
import cs.model.exportExcel.ExcelDataHYTJ;
import cs.model.exportExcel.ExcelDataLBTJ;
import cs.model.exportExcel.ExcelReportDWTJView;
import cs.model.exportExcel.ExcelReportHYTJView;
import cs.model.exportExcel.ExcelReportLBTJView;
import cs.model.exportExcel.ExcelReportYSView;
import cs.model.framework.RoleDto;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.framework.RoleService;
import cs.service.interfaces.UserUnitInfoService;
import cs.service.interfaces.YearPlanService;

@Controller
@RequestMapping(name = "公共", path = "common")
public class CommonController {
	
	@Autowired  
    private HttpServletRequest request;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private RoleService roleService;
	@Autowired
	private YearPlanService yearPlanService;
	
	@RequiresPermissions("common#basicData/identity#get")
	@RequestMapping(name="查询基础数据",path="basicData/{identity}",method=RequestMethod.GET)
	public @ResponseBody List<BasicDataDto> getBasicData(@PathVariable("identity") String identity){
		System.out.println(identity);
		if(identity.equals("all")){
			return basicDataService.Get();
		}
		return basicDataService.getByIdentity(identity);
	}
	
	@RequiresPermissions("common#save#post")
	@RequestMapping(name = "上传文件", path = "save", method = RequestMethod.POST,produces ="application/json;charset=UTF-8")
	public @ResponseBody String Save(@RequestParam("files") MultipartFile file){
		String randomName="";
		if (!file.isEmpty()) {  
            try { 
            	//文件名：
            	String fileName=file.getOriginalFilename();
            	//随机名
            	randomName=Util.generateFileName(fileName);
                // 文件保存路径  
                String filePath = request.getSession().getServletContext().getRealPath("/") + "contents/upload/"  
                        + randomName;  
                // 转存文件 
                file.transferTo(new File(filePath));  
            } catch (Exception e) {  
                e.printStackTrace();  
            }  
        }  
		return randomName;
	}
	
	@RequiresPermissions("common#remove#post")
	@RequestMapping(name = "删除上传文件", path = "remove", method = RequestMethod.POST)
	public @ResponseBody String remove(HttpServletRequest request){
		return "true";
	}
	
	@RequiresPermissions("common#userUnit#get")
	@RequestMapping(name="获取建设单位单位数据",path="userUnit",method=RequestMethod.GET)
	public @ResponseBody List<UserUnitInfoDto> getUserUnit(){
		return userUnitInfoService.Get();
	}
	
	@RequiresPermissions("common#roles#get")
	@RequestMapping(name="获取角色数据",path="roles",method=RequestMethod.GET)
	public @ResponseBody List<RoleDto> getRoles(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		return roleService.get(odataObj).getValue();
	}
	
//	@RequiresPermissions("common#exportExcelForYS#get")
	@RequestMapping(name="导出Excel-印刷版",path="exportExcelForYS",method=RequestMethod.GET)
	public ModelAndView getExcel(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		List<ExcelDataHYTJ> excelDataHYTJList = new ArrayList<>();
		List<ShenBaoInfoDto> shenBaoInfoDtoList = new ArrayList<>();
		
		//获取所有的数据--按行业排序
		shenBaoInfoDtoList = yearPlanService.getYearPlanShenBaoInfo(planId,odataObj).getValue();
		//获取行业分类数据
		excelDataHYTJList = yearPlanService.getYearPlanShenBaoInfoByHYTJ(planId);
		//获取按行业查询统计数据
		List<ExcelDataYS> excelDataYSList = new ArrayList<ExcelDataYS>();
		shenBaoInfoDtoList.stream().forEach(x->{
        	ExcelDataYS excelData=new ExcelDataYS();
        	excelData.setConstructionUnit(x.getConstructionUnit());//建设单位
            excelData.setProjectName(x.getProjectName());//项目名称
            excelData.setProjectCode(x.getProjectNumber());//项目代码
            excelData.setProjectType(basicDataService.getDescriptionById(x.getProjectCategory()));//项目类别
            excelData.setConstructionScale(x.getProjectGuiMo());//项目规模
            excelData.setConstructionType(basicDataService.getDescriptionById(x.getProjectConstrChar()));//建设性质
            excelData.setConstructionDate(Util.formatDate(x.getBeginDate(),"yyyy-MM")+"~"+"\n"+Util.formatDate(x.getEndDate(),"yyyy-MM"));//建设起止年月
            excelData.setTotalInvest(x.getProjectInvestSum());//总投资
            excelData.setApInvestSum(x.getApInvestSum());;//累计安排投资
            excelData.setApplyYearInvest(x.getApplyYearInvest());;//申请投资
            excelData.setCapitalAP_gtzj_TheYear(x.getCapitalAP_gtzj_TheYear());;//安排资金--区国土基金
            excelData.setCapitalAP_ggys_TheYear(x.getCapitalAP_ggys_TheYear());//安排资金--区公共预算
            excelData.setConstructionContent(x.getYearConstructionContent());//建设内容
            excelData.setRemark(x.getYearConstructionContentShenBao());
            excelDataYSList.add(excelData);
        });
        return new ModelAndView(new ExcelReportYSView(), "excelDataList", excelDataYSList);
    }
	
	@RequestMapping(name="导出Excel-项目类别统计",path="exportExcelForLB",method=RequestMethod.GET)
	public ModelAndView getExcelForLB(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		List<ExcelDataLBTJ> excelDataLBTJList = new ArrayList<ExcelDataLBTJ>();
		//数据的获取
		excelDataLBTJList=yearPlanService.getYearPlanShenBaoInfoByLBTJ(planId);
		return new ModelAndView(new ExcelReportLBTJView(), "excelDataLBTJList", excelDataLBTJList);
	}
	
	@RequestMapping(name="导出Excel-项目行业统计",path="exportExcelForHY",method=RequestMethod.GET)
	public ModelAndView getExcelForHY(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		List<ExcelDataHYTJ> excelDataHYTJList = new ArrayList<ExcelDataHYTJ>();
		//数据的获取
		excelDataHYTJList = yearPlanService.getYearPlanShenBaoInfoByHYTJ(planId);
		return new ModelAndView(new ExcelReportHYTJView(), "excelDataHYTJList", excelDataHYTJList);
	}
	
	@RequestMapping(name="导出Excel-建设单位统计",path="exportExcelForDW",method=RequestMethod.GET)
	public ModelAndView getExcelForDW(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		List<ExcelDataDWTJ> excelDataDWTJList = new ArrayList<ExcelDataDWTJ>();
		//数据的获取
		//excelDataDWTJList = yearPlanService.getYearPlanShenBaoInfoByDWTJ(planId);
		return new ModelAndView(new ExcelReportDWTJView(), "excelDataDWTJList", excelDataDWTJList);
	}
}
