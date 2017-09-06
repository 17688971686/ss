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

import cs.common.BasicDataConfig;
import cs.common.Util;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.exportExcel.ExcelData;
import cs.model.exportExcel.ExcelDataLBTJ;
import cs.model.exportExcel.ExcelReportLBTJView;
import cs.model.exportExcel.ExcelReportView;
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
	@RequestMapping(name="导出Excel-印刷版",path="exportExcelForYS",method=RequestMethod.GET)
	public ModelAndView getExcel(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		List<ShenBaoInfoDto> dtos=yearPlanService.getYearPlanShenBaoInfo(planId,odataObj).getValue();
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
	
//	@RequiresPermissions("common#exportExcel#get")
	@RequestMapping(name="导出Excel-类别统计版",path="exportExcelForTJ",method=RequestMethod.GET)
	public ModelAndView getExcelTJ(HttpServletRequest request,@RequestParam String planId) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		List<ShenBaoInfoDto> dtos=yearPlanService.getYearPlanShenBaoInfo(planId,odataObj).getValue();
        List<ExcelDataLBTJ> excelDataLBTJList = new ArrayList<ExcelDataLBTJ>();
        Integer projectSum_A = 0,projectSum_B=0,projectSum_C=0,projectSum_D=0;
        Double 	investSum_A=0.00,investSum_B=0.00,investSum_C=0.00,investSum_D=0.00;
        Double	investAccuSum_A=0.00,investAccuSum_B=0.00,investAccuSum_C=0.00,investAccuSum_D=0.00;
        Double	apInvestSum_A=0.000,apInvestSum_B=0.000,apInvestSum_C=0.000,apInvestSum_D=0.000;
        Double	yearInvestApprovalSum_A=0.00,yearInvestApprovalSum_B=0.00,yearInvestApprovalSum_C=0.00,yearInvestApprovalSum_D=0.00;
        
        for(ShenBaoInfoDto x:dtos){
        	if(x.getProjectCategory().equals(BasicDataConfig.projectCategory_A)){
        		projectSum_A++;
        		investSum_A += x.getProjectInvestSum();
        		investAccuSum_A += x.getProjectInvestAccuSum();
        		apInvestSum_A += x.getApInvestSum();
        		yearInvestApprovalSum_A += x.getYearInvestApproval();
        	}
        	if(x.getProjectCategory().equals(BasicDataConfig.projectCategory_B)){
        		projectSum_B++;
        		investSum_B += x.getProjectInvestSum();
        		investAccuSum_B += x.getProjectInvestAccuSum();
        		apInvestSum_B += x.getApInvestSum();
        		yearInvestApprovalSum_B += x.getYearInvestApproval();
        	}
        	if(x.getProjectCategory().equals(BasicDataConfig.projectCategory_C)){
        		projectSum_C++;
        		investSum_C += x.getProjectInvestSum();
        		investAccuSum_C += x.getProjectInvestAccuSum();
        		apInvestSum_C += x.getApInvestSum();
        		yearInvestApprovalSum_C += x.getYearInvestApproval();
        	}
        	if(x.getProjectCategory().equals(BasicDataConfig.projectCategory_D)){
        		projectSum_D++;
        		investSum_D += x.getProjectInvestSum();
        		investAccuSum_D += x.getProjectInvestAccuSum();
        		apInvestSum_D += x.getApInvestSum();
        		yearInvestApprovalSum_D += x.getYearInvestApproval();
        	}
        }
        ExcelDataLBTJ excelDataLBTJ_A= new ExcelDataLBTJ();
        excelDataLBTJ_A.setProjectCategory("A");
        excelDataLBTJ_A.setProjectSum(String.valueOf(projectSum_A));
        excelDataLBTJ_A.setInvestSum(String.valueOf(investSum_A));
        excelDataLBTJ_A.setInvestAccuSum(String.valueOf(investAccuSum_A));
        excelDataLBTJ_A.setApInvestSum(String.valueOf(apInvestSum_A));
        excelDataLBTJ_A.setYearInvestApprovalSum(String.valueOf(yearInvestApprovalSum_A));
        excelDataLBTJList.add(excelDataLBTJ_A);
        
        ExcelDataLBTJ excelDataLBTJ_B= new ExcelDataLBTJ();
        excelDataLBTJ_B.setProjectCategory("B");
        excelDataLBTJ_B.setProjectSum(String.valueOf(projectSum_B));
        excelDataLBTJ_B.setInvestSum(String.valueOf(investSum_B));
        excelDataLBTJ_B.setInvestAccuSum(String.valueOf(investAccuSum_B));
        excelDataLBTJ_B.setApInvestSum(String.valueOf(apInvestSum_B));
        excelDataLBTJ_B.setYearInvestApprovalSum(String.valueOf(yearInvestApprovalSum_B));
        excelDataLBTJList.add(excelDataLBTJ_B);
        
        ExcelDataLBTJ excelDataLBTJ_C= new ExcelDataLBTJ();
        excelDataLBTJ_C.setProjectCategory("C");
        excelDataLBTJ_C.setProjectSum(String.valueOf(projectSum_C));
        excelDataLBTJ_C.setInvestSum(String.valueOf(investSum_C));
        excelDataLBTJ_C.setInvestAccuSum(String.valueOf(investAccuSum_C));
        excelDataLBTJ_C.setApInvestSum(String.valueOf(apInvestSum_C));
        excelDataLBTJ_C.setYearInvestApprovalSum(String.valueOf(yearInvestApprovalSum_C));
        excelDataLBTJList.add(excelDataLBTJ_C);
        
        ExcelDataLBTJ excelDataLBTJ_D= new ExcelDataLBTJ();
        excelDataLBTJ_D.setProjectCategory("D");
        excelDataLBTJ_D.setProjectSum(String.valueOf(projectSum_D));
        excelDataLBTJ_D.setInvestSum(String.valueOf(investSum_D));
        excelDataLBTJ_D.setInvestAccuSum(String.valueOf(investAccuSum_D));
        excelDataLBTJ_D.setApInvestSum(String.valueOf(apInvestSum_D));
        excelDataLBTJ_D.setYearInvestApprovalSum(String.valueOf(yearInvestApprovalSum_D));
        excelDataLBTJList.add(excelDataLBTJ_D);
        
        return new ModelAndView(new ExcelReportLBTJView(), "excelDataLBTJList", excelDataLBTJList);
    }
}
