package cs.controller;

import java.io.File;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import cs.common.Util;
import cs.model.DomainDto.BasicDataDto;
import cs.service.common.BasicDataService;

@Controller
@RequestMapping(name = "common", path = "common")
public class CommonController {	
	private String ctrlName = "framework/common";
	
	@Autowired  
    private HttpServletRequest request;
	@Autowired
	private BasicDataService basicDataService;
	
	
	@RequestMapping(name="查询基础数据",path="basicData/{identity}",method=RequestMethod.GET)
	public @ResponseBody List<BasicDataDto> getBasicData(@PathVariable("identity") String identity){
		return basicDataService.getByIdentity(identity);
	}
	
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
	@RequestMapping(name = "删除上传文件", path = "remove", method = RequestMethod.POST)
	public @ResponseBody String remove(HttpServletRequest request){
		return "true";
	}
}
