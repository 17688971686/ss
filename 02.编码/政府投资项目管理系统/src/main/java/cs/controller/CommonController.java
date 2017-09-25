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
import cs.common.ICurrentUser;
import cs.common.Util;
import cs.model.DomainDto.BasicDataDto;
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
	private RoleService roleService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private ICurrentUser currentUser;
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

	@RequiresPermissions("common#getUser#post")
	@RequestMapping(name="查询基础数据",path="getUser",method=RequestMethod.GET)
	public @ResponseBody StringBuffer getUser(){
		String user = currentUser.getLoginName();
		
		StringBuffer unicode = new StringBuffer();  
		   for (int i = 0; i < user.length(); i++) {  
		        // 取出每一个字符  
		       char c = user.charAt(i);  
		        // 转换为unicode  
		       unicode.append("\\u" + Integer.toHexString(c));  
		   } 
		return unicode;
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
		List<ExcelDataHYTJ> excelDataHYTJList = new ArrayList<>();
		List<ExcelDataYS> excelDataYSList = new ArrayList<>();
		List<ExcelDataYS> excelDataYSListZH = new ArrayList<>();
		//获取所有的数据--按行业排序
		excelDataYSList = yearPlanService.getYearPlanShenBaoInfoByYS(planId);
		//获取行业分类数据
		excelDataHYTJList = yearPlanService.getYearPlanShenBaoInfoByHYTJ(planId);
		
		//将两者拼接起来
		int i=1,j=1;
		for(ExcelDataHYTJ x:excelDataHYTJList){
			ExcelDataYS entity = new ExcelDataYS();
			entity.setNo(Util.no(i));
			entity.setConstructionUnit(x.getProjectIndustry());
			entity.setProjectName("");
			entity.setProjectCode("");
			entity.setConstructionScale("合计"+x.getProjectSum()+"个项目,其中A类项目"+x.getProjectCategory_ASum()+"个,B类项目"+
			x.getProjectCategory_BSum()+"个,C类项目"+x.getProjectCategory_CSum()+"个,D类项目"+x.getProjectCategory_DSum()+"个");
			entity.setTotalInvest(x.getInvestSum());
			entity.setApInvestSum(x.getApInvestSum());
			entity.setApplyYearInvest(x.getSqInvestSum());
			entity.setYearApSum(x.getYearApSum());
			entity.setCapitalAP_gtzj_TheYear(x.getYearAp_gtjjSum());
			entity.setCapitalAP_ggys_TheYear(x.getYearAp_ggysSum());
			entity.setHB(true);
			
			excelDataYSListZH.add(entity);
			
			for(ExcelDataYS y:excelDataYSList){
				if(basicDataService.getDescriptionById(y.getProjectIndustry()).equals(x.getProjectIndustry())){
					y.setNo(String.valueOf(j));
					y.setConstructionType(basicDataService.getDescriptionById(y.getConstructionType()));
					y.setConstructionDate(Util.formatDate(y.getBeginDate(),"yyyy-MM")+"~"+"\n"+Util.formatDate(y.getEndDate(),"yyyy-MM"));
					y.setHB(false);
					excelDataYSListZH.add(y);
					
					j++;
				}
			}
			i++;
		}
		int year = excelDataYSList.get(0).getPlanYear();
        return new ModelAndView(new ExcelReportYSView(year), "excelDataList", excelDataYSListZH);
    }
	
	@RequestMapping(name="导出Excel-项目类别统计",path="exportExcelForLB",method=RequestMethod.GET)
	public ModelAndView getExcelForLB(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		List<ExcelDataLBTJ> excelDataLBTJList = new ArrayList<ExcelDataLBTJ>();
		//数据的获取
		excelDataLBTJList=yearPlanService.getYearPlanShenBaoInfoByLBTJ(planId);
		int year = excelDataLBTJList.get(0).getPlanYear();
		return new ModelAndView(new ExcelReportLBTJView(year), "excelDataLBTJList", excelDataLBTJList);
	}
	
	@RequestMapping(name="导出Excel-项目行业统计",path="exportExcelForHY",method=RequestMethod.GET)
	public ModelAndView getExcelForHY(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		List<ExcelDataHYTJ> excelDataHYTJList = new ArrayList<ExcelDataHYTJ>();
		//数据的获取
		excelDataHYTJList = yearPlanService.getYearPlanShenBaoInfoByHYTJ(planId);
		int year = excelDataHYTJList.get(0).getPlanYear();
		return new ModelAndView(new ExcelReportHYTJView(year), "excelDataHYTJList", excelDataHYTJList);
	}
	
	@RequestMapping(name="导出Excel-建设单位统计",path="exportExcelForDW",method=RequestMethod.GET)
	public ModelAndView getExcelForDW(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		List<ExcelDataDWTJ> excelDataDWTJList = new ArrayList<ExcelDataDWTJ>();
		//数据的获取
		excelDataDWTJList = yearPlanService.getYearPlanShenBaoInfoByDWTJ(planId);
		int year = excelDataDWTJList.get(0).getPlanYear();
		return new ModelAndView(new ExcelReportDWTJView(year), "excelDataDWTJList", excelDataDWTJList);
	}
}
