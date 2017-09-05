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
import cs.model.ExcelData;
import cs.model.ExcelReportView;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
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
	
//	@RequiresPermissions("common#exportExcel#get")
	@RequestMapping(name="导出Excel-印刷版",path="exportExcel",method=RequestMethod.GET)
	public ModelAndView getExcel(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		List<ShenBaoInfoDto> dtos=yearPlanService.getYearPlanShenBaoInfo(planId,odataObj);
        List<ExcelData> excelDataList = new ArrayList<ExcelData>();
        dtos.stream().forEach(x->{
        	ExcelData excelData=new ExcelData();
        	excelData.setConstructionUnit(x.getConstructionUnit());//建设单位
            excelData.setProjectName(x.getProjectName());//项目名称
            excelData.setProjectCode(x.getProjectNumber());//项目代码
            excelData.setProjectType(basicDataService.getDescriptionById(x.getProjectCategory()));//项目类别
            excelData.setConstructionScale(x.getProjectGuiMo());//项目规模
            excelData.setConstructionType(basicDataService.getDescriptionById(x.getProjectConstrChar()));//建设性质
            excelData.setConstructionDate(Util.formatDate(x.getBeginDate(),"yyyy-MM-dd")+"\n"+Util.formatDate(x.getEndDate(),"yyyy-MM-dd"));//建设起止日期
            excelData.setTotalInvest(String.valueOf(x.getProjectInvestSum()));//总投资
            excelData.setAccumulatedInvest(String.valueOf(x.getProjectInvestAccuSum()));//累计完成投资
            excelData.setArrangeInvest(String.valueOf(x.getApInvestSum()));//累计安排投资
            excelData.setInvest_GuoTu(String.valueOf(x.getCapitalSCZ_gtzj_TheYear()));//投资来源--区国土基金
            excelData.setInvest_GongGongYuSuan(String.valueOf(x.getCapitalSCZ_ggys_TheYear()));//投资来源--区公共预算
            excelData.setConstructionContent(x.getYearConstructionContent());//建设内容
            excelData.setRemark(x.getYearConstructionContentShenBao());
            excelDataList.add(excelData);
        });
        return new ModelAndView(new ExcelReportView(), "excelDataList", excelDataList);
    }
}
