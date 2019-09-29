package cs.controller;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.net.FileNameMap;
import java.net.URLEncoder;
import java.nio.file.spi.FileTypeDetector;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONObject;
import com.sun.javafx.tk.FileChooserType;
import cs.model.exportExcel.*;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.common.Util;
import cs.model.PageModelDto;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.RoleDto;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.framework.RoleService;
import cs.service.interfaces.UserUnitInfoService;
import cs.service.interfaces.YearPlanService;

import static com.sn.framework.common.JacksonUtils.objectMapper;
/**
 * @author Administrator
 * @Description 基础数据管理控制层
 */
@Controller
@RequestMapping(name = "公共", path = "common")
public class CommonController {

	public static final String FILE_UPLOAD_TO = "contents/upload/";

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
	@Value("${diskPath}")
	private String diskPath;
	
//	@RequiresPermissions("common#basicData/identity#get")
	@RequestMapping(name="查询基础数据",path="basicData/{identity}",method=RequestMethod.GET)
	public @ResponseBody List<BasicDataDto> getBasicData(@PathVariable("identity") String identity){
		if(identity.equals("all")){
			return basicDataService.Get();
		}
		return basicDataService.getByIdentity(identity);
	}

//	@RequiresPermissions("common#getUser#get")
	@RequestMapping(name="查询当前登陆用户的名称",path="getUser",method=RequestMethod.GET)
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
	
	/**
     * 根据base64，保存文件
     *
     * @param sysFileId
     * @param base64String
     * @return
     */
    @RequiresAuthentication
    @RequestMapping(name = "保存文件", path = "saveByFileBase64", method = RequestMethod.POST)
    @ResponseBody
    public Response saveByFileBase64(@RequestParam(required = true) String sysFileId, @RequestParam(required = true) String base64String) {
    	Response resultMsg = null;
        String errorMsg = "";
//        try {
//            SysFile sysFile = sysFileRepo.findById(sysFileId);
//            String fileUrl = sysFile.getFileUrl();
//            String removeRelativeUrl = fileUrl.substring(0, fileUrl.lastIndexOf(File.separator));
//            String uploadFileName = fileUrl.substring(fileUrl.lastIndexOf(File.separator) + 1, fileUrl.length());
//            //上传到ftp,
//            Ftp f = sysFile.getFtp();
//            FtpUtils ftpUtils = new FtpUtils();
//            FtpClientConfig k = ConfigProvider.getUploadConfig(f);
//            Base64 decoder = new Base64();
//            boolean uploadResult = ftpUtils.putFile(k, removeRelativeUrl, uploadFileName, new ByteArrayInputStream(decoder.decode(base64String)));
//            if (uploadResult) {
//                //保存数据库记录
//                sysFile.setModifiedBy(SessionUtil.getDisplayName());
//                sysFile.setModifiedDate(new Date());
//                sysFileService.update(sysFile);
//                resultMsg = new ResultMsg(true, Constant.MsgCode.OK.getValue(), "文件保存成功！修改的文件名是【" + sysFile.getShowName() + "】");
//            } else {
//                resultMsg = new ResultMsg(false, MsgCode.ERROR.getValue(), "文件保存失败！修改的文件名是【" + sysFile.getShowName() + "】");
//            }
//        } catch (Exception e) {
//            errorMsg += e.getMessage();
//            resultMsg = new ResultMsg(false, MsgCode.ERROR.getValue(), "文件保存异常！");
//        }
//        //添加日记记录
//        Log log = new Log();
//        log.setCreatedDate(new Date());
//        log.setUserName(SessionUtil.getDisplayName());
//        log.setLogCode(resultMsg.getReCode());
//        log.setBuninessId(sysFileId);
//        log.setMessage(resultMsg.getReMsg() + errorMsg);
//        log.setModule(Constant.LOG_MODULE.FILEUPDATE.getValue());
//        log.setResult(resultMsg.isFlag() ? Constant.EnumState.YES.getValue() : Constant.EnumState.NO.getValue());
//        log.setLogger(this.getClass().getName() + ".saveByFileBase64");
//        log.setLogLevel(Constant.EnumState.PROCESS.getValue());
//        logService.save(log);
        return resultMsg;
    }
	
//	@RequiresPermissions("common#save#post")
	@RequestMapping(name = "上传文件", path = "save", method = RequestMethod.POST)
	public void Save(@RequestParam("files") MultipartFile file, HttpServletResponse res) throws IOException {

    	Response response = new Response();

		if (!file.isEmpty()) {
            try {
            	//文件名：
            	String fileName=file.getOriginalFilename();
				String fileName1  = file.getContentType();
				String extensionName = FilenameUtils.getExtension(fileName);
				System.out.println(extensionName);
            	//随机名
				String randomName = Util.generateFileName(fileName);
				if(extensionName.equals("jpg")&&fileName.endsWith(".jpg") || extensionName.equals("png")&&fileName.endsWith(".png")){
					File f =null;
					if(extensionName.equals("jpg")){
						f = new File(diskPath+"/test.jpg");
					}else{
						f = new File(diskPath+"/test.png");
					}


					FileUtils.copyInputStreamToFile(file.getInputStream(), f);
//					获取图片宽高属性，如果没有则不是图片
					if(Util.isImage(f)){
						try {
//							给图片添加一个透明的水印
							Util.markImageByText("光明政府投资管理系统",f.getPath(),diskPath+"/"+randomName,45,new Color(0,0,0),"JPG");
						}catch (Exception e){
							e.printStackTrace();
							res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
							response.setMessage("文件上传失败，请再次尝试！");
						}
					}else{
						res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
						response.setMessage("文件上传失败，请再次尝试！");
					}

				}else if(!(extensionName.equals("pdf") || extensionName.equals("tif") || extensionName.equals("docx") ||
						extensionName.equals("xlsx") || extensionName.equals("dwg") || extensionName.equals("doc")
						|| extensionName.equals("zip")|| extensionName.equals("rar"))){
					res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					response.setMessage("文件上传失败，请再次尝试！");
				}else{
					// 转存文件
					file.transferTo(new File(diskPath+"/"+randomName));
				}

				Map<String, String> map = new HashMap<>();
				map.put("originalFilename", fileName);
				map.put("randomName", randomName);
				response.addData(map);

            } catch (Exception e) {
            	e.printStackTrace();
            	res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.setMessage("文件上传失败，请再次尝试！");
            }
        } else {
			res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setMessage("请选择要上传的文件！");
		}

		objectMapper.writeValue(res.getOutputStream(), response);
	}
	
//	@RequiresPermissions("common#remove#post")
	@RequestMapping(name = "删除上传文件", path = "remove", method = RequestMethod.POST)
	public @ResponseBody String remove(HttpServletRequest request){
		return "true";
	}
	
//	@RequiresPermissions("common#userUnit#get")
	@RequestMapping(name="获取建设单位单位数据",path="userUnit",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<UserUnitInfoDto> getUserUnit(){
		ODataObj odataObj = new ODataObj();
		return userUnitInfoService.get(odataObj);
	}
	
//	@RequiresPermissions("common#roles#get")
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
//			entity.setApplyYearInvest(x.getYapInvestSum());
			entity.setYearApSum(x.getYapInvestSum());
			entity.setCapitalAP_gtzj_TheYear(x.getYearAp_gtjjSum());
			entity.setCapitalAP_ggys_TheYear(x.getYearAp_ggysSum());
			entity.setHB(true);
			
			excelDataYSListZH.add(entity);
			
			for(ExcelDataYS y:excelDataYSList){
				if(y.getProjectIndustry().equals(x.getProjectIndustry())){
					y.setNo(String.valueOf(j));
					y.setConstructionDate(y.getBeginDate()+"~"+"\n"+y.getEndDate());
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

	@RequestMapping(name="导出Excel-项目统计报表",path="exportPlanStatistics",method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void getExcelForPlanStatistics(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ExcelReportPlanStatistics excelReportPlanStatistics = new ExcelReportPlanStatistics();
		excelReportPlanStatistics.buildExcelDocument(request, response);
	}

	@RequestMapping(name="导出Excel-分类统计报表",path="exportCategoryStatistics",method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void getExcelForCategoryStatistics(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ExcelReportCategoryStatistics excelReportCategoryStatistics = new ExcelReportCategoryStatistics();
		excelReportCategoryStatistics.buildExcelDocument(request, response);
	}
}
